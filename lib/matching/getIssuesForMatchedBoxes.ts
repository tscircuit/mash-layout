import type { NormalizedNetlist } from "lib/scoring/types"
import type { MatchedBox, MatchingIssue } from "./types"
import { findAllSideHasWrongPinCount } from "lib/matching/matched-box-issue-finders/findAllSideHasWrongPinCount"
import { findAllMatchedBoxPinShapeInWrongPosition } from "lib/matching/matched-box-issue-finders/findAllMatchedBoxPinShapeInWrongPosition"
import { findAllMatchedBoxMissingPinShapeOnSide } from "./matched-box-issue-finders/findAllMatchedBoxMissingPinShapeOnSide"
import { findAllMissingConnectionBetweenBoxes } from "./matched-box-issue-finders/findAllMissingConnectionBetweenBoxes"

const MATCHED_BOX_ISSUE_FINDERS = [
  findAllSideHasWrongPinCount,
  findAllMatchedBoxMissingPinShapeOnSide,
  // findAllMissingConnectionBetweenBoxes,
  // findAllMatchedBoxPinShapeInWrongPosition,
] as const

export function getIssuesForMatchedBoxes(params: {
  candidateNetlist: NormalizedNetlist
  targetNetlist: NormalizedNetlist
  candidateBoxIndex: number
  targetBoxIndex: number
  alreadyMatchedBoxes: MatchedBox[]
}): MatchingIssue[] {
  const issues: MatchingIssue[] = []
  for (const finder of MATCHED_BOX_ISSUE_FINDERS) {
    issues.push(...finder(params))
  }
  return issues
}
