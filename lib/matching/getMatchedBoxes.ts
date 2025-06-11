import type { NormalizedNetlist } from "lib/scoring/types"
import type { MatchingIssue } from "./types"
import { computeSimilarityDistanceFromIssues } from "./computeSimilarityDistanceFromIssues"
import { getIssuesForMatchedBoxes } from "./getIssuesForMatchedBoxes"
import { findAllMissingConnectionBetweenBoxes } from "./matched-box-issue-finders/findAllMissingConnectionBetweenBoxes"
import { getNetlistVariationWithPassiveRotation } from "./getNetlistVariationWithPassiveRotation"
import { NormalizationTransform } from "lib/scoring/normalizeNetlist"

export interface MatchedBox {
  targetBoxIndex: number
  candidateBoxIndex: number
  _targetBoxId?: string
  _candidateBoxId?: string
  issues: MatchingIssue[]
  targetBoxRotationCcw: 0 | 90 | 180 | 270
  score: number
}

export function getMatchedBoxes(params: {
  candidateNetlist: NormalizedNetlist
  targetNetlist: NormalizedNetlist
  candidateNormalizationTransform?: NormalizationTransform
  targetNormalizationTransform?: NormalizationTransform
}): MatchedBox[] {
  const {
    candidateNetlist,
    targetNetlist,
    candidateNormalizationTransform,
    targetNormalizationTransform,
  } = params
  const matchedBoxes: MatchedBox[] = []

  const usedCandidateBoxes = new Set<number>()

  // Normalized boxes are sorted by size, so we're starting with the largest box
  // and working our way down to the smallest box.
  for (
    let targetBoxIndex = 0;
    targetBoxIndex < targetNetlist.boxes.length;
    targetBoxIndex++
  ) {
    const pairingResult: Map<
      { targetBoxIndex: number; candidateBoxIndex: number },
      {
        issues: MatchingIssue[]
        similarityDistance: number
        rotation: 0 | 90 | 180 | 270
      }
    > = new Map()

    for (
      let candidateBoxIndex = 0;
      candidateBoxIndex < candidateNetlist.boxes.length;
      candidateBoxIndex++
    ) {
      if (usedCandidateBoxes.has(candidateBoxIndex)) {
        continue
      }

      // Get variations for passive rotation
      const targetNetlistVariations = getNetlistVariationWithPassiveRotation({
        targetNetlist,
        candidateNetlist,
        targetBoxIndex,
        candidateBoxIndex,
      })

      let bestVariationIssues: MatchingIssue[] = []
      let bestVariationScore = Infinity
      let bestRotation: 0 | 90 | 180 | 270 = 0

      // Test each variation (including no rotation)
      for (const {
        netlist: variationNetlist,
        rotation,
      } of targetNetlistVariations) {
        const issues = getIssuesForMatchedBoxes({
          candidateNetlist,
          targetNetlist: variationNetlist,
          candidateBoxIndex,
          targetBoxIndex,
          alreadyMatchedBoxes: matchedBoxes,
        })

        const score = computeSimilarityDistanceFromIssues(issues)

        if (score < bestVariationScore) {
          bestVariationScore = score
          bestVariationIssues = issues
          bestRotation = rotation
        }
      }

      pairingResult.set(
        { targetBoxIndex, candidateBoxIndex },
        {
          issues: bestVariationIssues,
          similarityDistance: bestVariationScore,
          rotation: bestRotation,
        },
      )
    }

    // Find the best pairing (lowest score)
    let bestPairing: {
      targetBoxIndex: number
      candidateBoxIndex: number
    } | null = null
    let bestScore = Infinity

    for (const [
      pairing,
      { similarityDistance: score },
    ] of pairingResult.entries()) {
      if (score < bestScore) {
        bestScore = score
        bestPairing = pairing
      }
    }

    // If we found a valid pairing, mark the candidate box as used and add to matched boxes
    if (bestPairing) {
      const { candidateBoxIndex } = bestPairing
      const {
        issues,
        similarityDistance: score,
        rotation,
      } = pairingResult.get(bestPairing)!

      // Mark the candidate box as used
      usedCandidateBoxes.add(candidateBoxIndex)

      // Add the matched box to the list
      matchedBoxes.push({
        targetBoxIndex,
        candidateBoxIndex,
        issues,
        score,
        targetBoxRotationCcw: rotation,
      })
    }
  }

  if (candidateNormalizationTransform && targetNormalizationTransform) {
    for (const matchedBox of matchedBoxes) {
      matchedBox._targetBoxId =
        targetNormalizationTransform.boxIndexToBoxId[matchedBox.targetBoxIndex]
      matchedBox._candidateBoxId =
        candidateNormalizationTransform.boxIndexToBoxId[
          matchedBox.candidateBoxIndex
        ]
    }
  }

  return matchedBoxes
}
