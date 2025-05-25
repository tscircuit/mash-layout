import { SIDES_CCW, type CircuitBuilder } from "lib/builder"
import type { InputNetlist } from "lib/input-types"
import { applyEditOperation } from "./applyEditOperation"
import type { AddPinToSideOp, EditOperation } from "./EditOperation"
import { computeEditOperationsToFixPinSubsetNetlist } from "./computeEditOperationsToFixPinSubsetNetlist"
import { transformTargetForPassiveCompatibility } from "./transformTargetForPassiveCompatibility"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"
import { getMatchedBoxes } from "lib/matching/getMatchedBoxes"
import { removeUnmatchedChips } from "./adaptation-operations/removeUnmatchedChips"
import { fixMatchedBoxPinCounts } from "./adaptation-operations/fixMatchedBoxPinCounts"
import { fixMatchedBoxPinShapes } from "./adaptation-operations/fixMatchedBoxPinShapes"

/**
 * Mutates template until it has the same normalized netlist as the target.
 *
 * It does this by examining the sizes of chips,then each pin subset. Each time
 * it sees a difference, it creates and applies an edit operation to correct
 * the template.
 *
 * We record all the operations so that we can "playback" the changes to the
 * template.
 *
 * TODO perform box matching (see getMatchedBoxes) to correctly adapt the right boxes
 * to eachother, don't use chipId/boxId to do the matching
 */
export function adaptTemplateToTarget(params: {
  template: CircuitBuilder
  target: InputNetlist
}): {
  appliedOperations: EditOperation[]
} {
  const { template, target: originalTarget } = params
  const appliedOperations: EditOperation[] = []

  // Transform the target to be compatible with template passive structures
  const target = transformTargetForPassiveCompatibility(
    template,
    originalTarget,
  )
  const targetBoxes = target.boxes

  const removal1Result = removeUnmatchedChips({
    template,
    target,
  })
  appliedOperations.push(...removal1Result.appliedOperations)

  const fixMatchedBoxPinCountsResult = fixMatchedBoxPinCounts({
    template,
    target,
    matchedBoxes: removal1Result.matchedBoxes,
  })
  appliedOperations.push(...fixMatchedBoxPinCountsResult.appliedOperations)

  const fixMatchedBoxPinShapesResult = fixMatchedBoxPinShapes({
    template,
    target,
    matchedBoxes: removal1Result.matchedBoxes,
  })
  appliedOperations.push(...fixMatchedBoxPinShapesResult.appliedOperations)

  const removal2Result = removeUnmatchedChips({
    template,
    target,
  })
  appliedOperations.push(...removal2Result.appliedOperations)

  return {
    appliedOperations,
  }
}
