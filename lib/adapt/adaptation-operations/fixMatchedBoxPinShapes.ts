import type { InputNetlist, Side } from "lib/input-types"
import type { MatchedBoxWithChipIds } from "./removeUnmatchedChips"
import type { CircuitBuilder } from "lib/builder"
import type { EditOperation } from "../EditOperation"
import { applyEditOperation } from "../applyEditOperation"
import type { PinBuilder } from "lib/builder"
import { detectPassiveOrientation } from "../detectPassiveOrientation"

export function fixMatchedBoxPinShapes(params: {
  template: CircuitBuilder
  target: InputNetlist
  matchedBoxes: MatchedBoxWithChipIds[]
}): {
  appliedOperations: EditOperation[]
} {
  const { template, target, matchedBoxes } = params
  const appliedOperations: EditOperation[] = []

  // For each matched box, check if pin counts match and remove excess pins if needed
  for (const { candidateChipId, targetChipId } of matchedBoxes) {
    const chip = template.chips.find((c) => c.chipId === candidateChipId)
    const targetBox = target.boxes.find((b) => b.boxId === targetChipId)
    if (!targetBox || !chip) continue

    // Special handling for passives: if orientation differs, rotate the passive
    if (chip.isPassive) {
      const templateOrientation = detectPassiveOrientation(chip)
      const targetOrientation =
        targetBox.leftPinCount > 0 || targetBox.rightPinCount > 0
          ? "horizontal"
          : "vertical"

      if (templateOrientation !== targetOrientation) {
        const op: EditOperation = {
          type: "change_passive_orientation",
          chipId: chip.chipId,
          fromOrientation: templateOrientation,
          toOrientation: targetOrientation,
        }
        applyEditOperation(template, op)
        appliedOperations.push(op)
        return { appliedOperations }
      }
    }

    // Check each side for pin count mismatches
    const sides: Side[] = ["left", "right", "top", "bottom"]
    for (const side of sides) {
      const templatePinCount = chip[`${side}PinCount`] as number
      const targetPinCount = (targetBox as any)[`${side}PinCount`] || 0

      // If template has more pins than target, we need to remove excess pins
      if (templatePinCount > targetPinCount) {
        const excessPins = templatePinCount - targetPinCount

        // Try removing different combinations of pins and pick the best option
        const bestRemovalOps = findBestPinRemovalStrategy({
          template,
          chipId: candidateChipId!,
          side,
          pinsToRemove: excessPins,
        })

        // Apply just the first operation
        if (bestRemovalOps.length > 0) {
          const op = bestRemovalOps[0]!
          applyEditOperation(template, op)
          appliedOperations.push(op)
          return { appliedOperations } // Return after first operation
        }
      }
    }
  }

  return { appliedOperations }
}

function findBestPinRemovalStrategy(params: {
  template: CircuitBuilder
  chipId: string
  side: Side
  pinsToRemove: number
}): EditOperation[] {
  const { template, chipId, side, pinsToRemove } = params

  const chip = template.chips.find((c) => c.chipId === chipId)
  if (!chip) return []

  const sidePinsMap: Record<Side, PinBuilder[]> = {
    left: chip.leftPins,
    right: chip.rightPins,
    top: chip.topPins,
    bottom: chip.bottomPins,
  }

  const sidePins = sidePinsMap[side]
  if (sidePins.length <= pinsToRemove) {
    // Remove all pins from this side
    return sidePins.map((pin: PinBuilder) => ({
      type: "remove_pin_from_side" as const,
      chipId,
      side,
      pinNumber: pin.pinNumber,
    }))
  }

  // Only remove one pin at a time - the highest numbered pin
  // This ensures we can recalculate after each removal
  const highestPin = sidePins[sidePins.length - 1]

  return [
    {
      type: "remove_pin_from_side" as const,
      chipId,
      side,
      pinNumber: highestPin!.pinNumber,
    },
  ]
}
