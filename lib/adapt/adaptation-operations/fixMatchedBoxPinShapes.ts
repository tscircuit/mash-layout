import type { InputNetlist } from "lib/input-types"
import type { MatchedBoxWithChipIds } from "./removeUnmatchedChips"
import type { CircuitBuilder, SIDE } from "lib/builder"
import type { EditOperation } from "../EditOperation"
import { applyEditOperation } from "../applyEditOperation"
import { computeSimilarityDistanceFromIssues } from "lib/matching/computeSimilarityDistanceFromIssues"
import { getMatchedBoxes } from "lib/matching/getMatchedBoxes"

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

    // Check each side for pin count mismatches
    const sides: SIDE[] = ["left", "right", "top", "bottom"]
    for (const side of sides) {
      const templatePinCount = chip[`${side}PinCount`] as number
      const targetPinCount = (targetBox as any)[`${side}PinCount`] || 0

      // If template has more pins than target, we need to remove excess pins
      if (templatePinCount > targetPinCount) {
        const excessPins = templatePinCount - targetPinCount

        // Try removing different combinations of pins and pick the best option
        const bestRemovalOps = findBestPinRemovalStrategy({
          template,
          target,
          chipId: candidateChipId,
          side,
          pinsToRemove: excessPins,
        })

        for (const op of bestRemovalOps) {
          applyEditOperation(template, op)
          appliedOperations.push(op)
        }
      }
    }
  }

  return { appliedOperations }
}

function findBestPinRemovalStrategy(params: {
  template: CircuitBuilder
  target: InputNetlist
  chipId: string
  side: SIDE
  pinsToRemove: number
}): EditOperation[] {
  const { template, target, chipId, side, pinsToRemove } = params

  const chip = template.chips.find((c) => c.chipId === chipId)
  if (!chip) return []

  const sidePins = chip[`${side}Pins`] as any[]
  if (sidePins.length <= pinsToRemove) {
    // Remove all pins from this side
    return sidePins.map((pin) => ({
      type: "remove_pin_from_side" as const,
      chipId,
      side,
      pinNumber: pin.pinNumber,
    }))
  }

  // For now, remove pins from the end (simple strategy)
  // TODO: Implement optimal pin removal based on similarity distance
  const pinsToRemoveList = sidePins.slice(-pinsToRemove)

  return pinsToRemoveList.map((pin) => ({
    type: "remove_pin_from_side" as const,
    chipId,
    side,
    pinNumber: pin.pinNumber,
  }))
}
