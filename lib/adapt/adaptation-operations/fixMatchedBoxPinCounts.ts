import { SIDES_CCW, type CircuitBuilder } from "lib/builder"
import type { MatchedBoxWithChipIds } from "./removeUnmatchedChips"
import { applyEditOperation } from "../applyEditOperation"
import type { AddPinToSideOp } from "../EditOperation"
import type { EditOperation } from "../EditOperation"
import type { InputNetlist } from "lib/input-types"

export function fixMatchedBoxPinCounts(params: {
  template: CircuitBuilder
  target: InputNetlist
  matchedBoxes: MatchedBoxWithChipIds[]
}): {
  appliedOperations: EditOperation[]
} {
  const { template, target, matchedBoxes } = params
  const appliedOperations: EditOperation[] = []

  const targetBoxes = target.boxes
  // Make every box have the right number of pins per side
  for (const { candidateChipId, targetChipId } of matchedBoxes) {
    const chip = template.chips.find((c) => c.chipId === candidateChipId)
    const targetBox = targetBoxes.find((b) => b.boxId === targetChipId)
    if (!targetBox || !chip) continue

    // Skip passive components - their connections should be handled semantically
    if (chip.isPassive) continue

    for (const side of SIDES_CCW) {
      const targetSideCount = targetBox[
        `${side}PinCount` as keyof typeof targetBox
      ] as number

      while (
        (chip[`${side}PinCount` as keyof typeof chip] as number) <
        targetSideCount
      ) {
        let afterPin: number
        if (side === "left") {
          // Add to the start (top-most) of the left side.
          afterPin = 0
        } else if (side === "bottom") {
          // Add to the end (left-most) of the bottom side.
          afterPin = chip.leftPinCount + chip.bottomPinCount
        } else if (side === "right") {
          // Add to the end (top-most) of the right side.
          afterPin =
            chip.leftPinCount + chip.bottomPinCount + chip.rightPinCount
        } else {
          // side === "top"
          // Add to the end (right-most) of the top side.
          afterPin = chip.totalPinCount
        }

        const op: AddPinToSideOp = {
          type: "add_pin_to_side",
          chipId: chip.chipId,
          side,
          betweenPinNumbers: [afterPin, afterPin + 1],
        }
        applyEditOperation(template, op)
        appliedOperations.push(op)
      }

      // Remove excess pins
      while (
        (chip[`${side}PinCount` as keyof typeof chip] as number) >
        targetSideCount
      ) {
        const op: EditOperation = {
          type: "remove_pin_from_side",
          chipId: chip.chipId,
          side,
          pinNumber:
            side === "left"
              ? chip.leftPinCount
              : side === "bottom"
                ? chip.leftPinCount + chip.bottomPinCount
                : side === "right"
                  ? chip.leftPinCount + chip.bottomPinCount + chip.rightPinCount
                  : chip.totalPinCount,
        }
        applyEditOperation(template, op)
        appliedOperations.push(op)
      }
    }
  }

  return { appliedOperations }
}
