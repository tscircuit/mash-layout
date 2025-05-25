import type { NormalizedNetlist } from "lib/scoring/types"
import type { MatchingIssue } from "./types"
import { findAllMatchedBoxMissingPinShape } from "lib/matching/matched-box-issue-finders/findAllMatchedBoxMissingPinShape"
import { findAllSideHasWrongPinCount } from "lib/matching/matched-box-issue-finders/findAllSideHasWrongPinCount"
import { findAllMatchedBoxPinShapeInWrongPosition } from "lib/matching/matched-box-issue-finders/findAllMatchedBoxPinShapeInWrongPosition"

const MATCHED_BOX_ISSUE_FINDERS = [
  findAllSideHasWrongPinCount,
  findAllMatchedBoxMissingPinShape,
  // findAllMatchedBoxPinShapeInWrongPosition,
] as const

export function getIssuesForMatchedBoxes(params: {
  candidateNetlist: NormalizedNetlist
  targetNetlist: NormalizedNetlist
  candidateBoxIndex: number
  targetBoxIndex: number
}): MatchingIssue[] {
  const issues: MatchingIssue[] = []
  for (const finder of MATCHED_BOX_ISSUE_FINDERS) {
    issues.push(...finder(params))
  }
  return issues
}
