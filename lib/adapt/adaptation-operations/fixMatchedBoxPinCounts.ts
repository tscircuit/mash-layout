import { SIDES_CCW, type CircuitBuilder } from "lib/builder"
import type { MatchedBoxWithChipIds } from "./removeUnmatchedChips"
import type { AddPinToSideOp } from "../EditOperation"
import type { EditOperation } from "../EditOperation"
import type { InputNetlist } from "lib/input-types"
import { applyEditOperation } from "../applyEditOperation"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"
import { getMatchedBoxes } from "lib/matching/getMatchedBoxes"
import { computeSimilarityDistanceFromIssues } from "lib/matching/computeSimilarityDistanceFromIssues"

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
  // Make every box have the right number of pins per side (one operation at a time)
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

      // Add pins if needed (one at a time)
      if (
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
        return { appliedOperations } // Return after first operation
      }

      // Remove excess pins (one at a time) - choose the best pin to remove
      if (
        (chip[`${side}PinCount` as keyof typeof chip] as number) >
        targetSideCount
      ) {
        const bestPinToRemove = findBestPinToRemove({
          template,
          target,
          chipId: chip.chipId,
          side,
        })

        const op: EditOperation = {
          type: "remove_pin_from_side",
          chipId: chip.chipId,
          side,
          pinNumber: bestPinToRemove,
        }
        applyEditOperation(template, op)
        appliedOperations.push(op)
        return { appliedOperations } // Return after first operation
      }
    }
  }

  return { appliedOperations }
}

function findBestPinToRemove(params: {
  template: CircuitBuilder
  target: InputNetlist
  chipId: string
  side: string
}): number {
  const { template, target, chipId, side } = params

  const chip = template.chips.find((c) => c.chipId === chipId)
  if (!chip) throw new Error(`Chip ${chipId} not found`)

  // Get all pins on this side
  const sidePinsMap = {
    left: chip.leftPins,
    right: chip.rightPins,
    top: chip.topPins,
    bottom: chip.bottomPins,
  }

  const sidePins = sidePinsMap[side as keyof typeof sidePinsMap]
  if (sidePins.length === 0) {
    throw new Error(`No pins found on side ${side} of chip ${chipId}`)
  }

  let bestPinNumber = sidePins[sidePins.length - 1]!.pinNumber // Default to last pin
  let bestDistance = Number.POSITIVE_INFINITY

  // Try removing each pin and compute the resulting similarity distance
  for (const pin of sidePins) {
    try {
      // Clone template for testing
      const testTemplate = template.clone()

      // Apply the test removal
      const testOp: EditOperation = {
        type: "remove_pin_from_side",
        chipId,
        side: side as any,
        pinNumber: pin.pinNumber,
      }
      applyEditOperation(testTemplate, testOp)

      // Compute similarity distance after this removal
      const distance = computeSimilarityDistanceAfterRemoval(
        testTemplate,
        target,
      )

      if (distance < bestDistance) {
        bestDistance = distance
        bestPinNumber = pin.pinNumber
      }
    } catch (error) {
      // If removal fails, skip this pin
      continue
    }
  }

  return bestPinNumber
}

function computeSimilarityDistanceAfterRemoval(
  template: CircuitBuilder,
  target: InputNetlist,
): number {
  try {
    // Normalize both netlists
    const normalizedTemplate = normalizeNetlist(template.getNetlist())
    const normalizedTarget = normalizeNetlist(target)

    // Get matched boxes and their issues
    const matchedBoxes = getMatchedBoxes({
      candidateNetlist: normalizedTemplate.normalizedNetlist,
      targetNetlist: normalizedTarget.normalizedNetlist,
    })

    // Collect all issues from all matched boxes
    const allIssues = matchedBoxes.flatMap((match) => match.issues || [])

    // Compute similarity distance from issues
    return computeSimilarityDistanceFromIssues(allIssues)
  } catch (error) {
    // If computation fails, return a high penalty
    return Number.POSITIVE_INFINITY
  }
}
