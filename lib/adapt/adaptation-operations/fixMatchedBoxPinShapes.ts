import type { InputNetlist } from "lib/input-types"
import type { MatchedBoxWithChipIds } from "./removeUnmatchedChips"
import type { CircuitBuilder } from "lib/builder"
import type { EditOperation } from "../EditOperation"
import { computeEditOperationsToFixPinSubsetNetlist } from "../computeEditOperationsToFixPinSubsetNetlist"
import { applyEditOperation } from "../applyEditOperation"

export function fixMatchedBoxPinShapes(params: {
  template: CircuitBuilder
  target: InputNetlist
  matchedBoxes: MatchedBoxWithChipIds[]
}): {
  appliedOperations: EditOperation[]
} {
  const { template, target, matchedBoxes } = params
  const appliedOperations: EditOperation[] = []

  // Check if we have a perfect match (all boxes matched with score 0 and no issues)
  const isPerfectMatch = matchedBoxes.every(
    (match) =>
      match.score === 0 && (!match.issues || match.issues.length === 0),
  )

  if (isPerfectMatch) {
    // Skip pin shape fixes when we have a perfect structural match
    return { appliedOperations }
  }

  // Go through each pin and make sure it has the right shape by
  // comparing the target pin subset to the current pin subset.
  // Only process chips that exist in the target (skip chips that will be removed)
  for (const { candidateChipId, targetChipId } of matchedBoxes) {
    const chip = template.chips.find((c) => c.chipId === candidateChipId)
    const targetBox = target.boxes.find((b) => b.boxId === targetChipId)
    if (!targetBox || !chip) continue // Skip chips that don't exist in target

    for (let pinNumber = 1; pinNumber <= chip.totalPinCount; pinNumber++) {
      const currentNetlistForPin = template.getNetlist()
      const operationsForPin = computeEditOperationsToFixPinSubsetNetlist({
        currentNetlist: currentNetlistForPin,
        targetNetlist: target,
        chipId: chip.chipId,
        pinNumber: pinNumber,
      })

      for (const op of operationsForPin) {
        applyEditOperation(template, op)
        appliedOperations.push(op)
      }
    }
  }

  return { appliedOperations }
}
