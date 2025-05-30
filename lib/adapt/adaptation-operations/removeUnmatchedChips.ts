import type { InputNetlist } from "lib/input-types"
import type { CircuitBuilder } from "lib/builder"
import type { EditOperation } from "lib/adapt/EditOperation"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"
import { getMatchedBoxes } from "lib/matching/getMatchedBoxes"
import { applyEditOperation } from "lib/adapt/applyEditOperation"
import type { MatchingIssue } from "lib/matching/types"

export interface MatchedBoxWithChipIds {
  candidateChipId: string | undefined
  targetChipId: string | undefined
  targetBoxIndex: number
  candidateBoxIndex: number
  issues: MatchingIssue[]
  score: number
}

export function removeUnmatchedChips(params: {
  template: CircuitBuilder
  target: InputNetlist
}): {
  appliedOperations: EditOperation[]
  matchedBoxes: MatchedBoxWithChipIds[]
} {
  const appliedOperations: EditOperation[] = []
  const { template, target } = params

  // Remove unmatched components using box matching
  const currentNetlist = template.getNetlist()
  const normalizedTemplateResult = normalizeNetlist(currentNetlist)
  const normalizedTargetResult = normalizeNetlist(target)
  const normalizedTemplate = normalizedTemplateResult.normalizedNetlist
  const normalizedTarget = normalizedTargetResult.normalizedNetlist

  const matchedBoxes = getMatchedBoxes({
    candidateNetlist: normalizedTemplate,
    targetNetlist: normalizedTarget,
  }).map((match) => ({
    ...match,
    candidateChipId: Object.entries(
      normalizedTemplateResult.transform.boxIdToBoxIndex,
    ).find(([_, boxIndex]) => boxIndex === match.candidateBoxIndex)?.[0],
    targetChipId: Object.entries(
      normalizedTargetResult.transform.boxIdToBoxIndex,
    ).find(([_, boxIndex]) => boxIndex === match.targetBoxIndex)?.[0],
  }))

  // Remove chips that exist in template but not in target (one at a time)
  for (const chip of template.chips) {
    const wasMatched = matchedBoxes.some(
      (match) => match.candidateChipId === chip.chipId,
    )
    if (wasMatched) continue
    const op: EditOperation = {
      type: "remove_chip",
      chipId: chip.chipId,
    }
    applyEditOperation(template, op)
    appliedOperations.push(op)
    break // Only remove one chip at a time
  }

  return { appliedOperations, matchedBoxes }
}
