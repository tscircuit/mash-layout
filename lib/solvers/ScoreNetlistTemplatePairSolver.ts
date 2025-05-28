import { applyMatchedBoxRotationsToInputNetlist } from "lib/matching/matching-utils/applyMatchedBoxRotationsToInputNetlist"
import { getAsciiForNetlistBox } from "lib/matching/matching-utils/getAsciiForNetlistBox"
import type { CircuitBuilder } from "lib/builder"
import type { InputNetlist } from "lib/input-types"
import { BaseSolver } from "./BaseSolver"
import { getMatchingIssues } from "lib/matching/getMatchingIssues"
import { computeSimilarityDistanceFromIssues } from "lib/matching/computeSimilarityDistanceFromIssues"
import {
  type NormalizationTransform,
  normalizeNetlist,
} from "lib/scoring/normalizeNetlist"
import type { MatchedBox, MatchingIssue } from "lib/matching/types"
import { getReadableNetlist } from "lib/netlist/getReadableNetlist"
import { getMatchedBoxes } from "lib/matching/getMatchedBoxes"
import { getAllPinShapeSignatures } from "lib/matching/matching-utils/getAllPinShapeSignatures"
import { getPairwisePinShapeSignatures } from "lib/matching/matching-utils/getPairwisePinShapeSignatures"

/**
 * Scores a single netlist-template pair, computing issues and similarity distance
 */
export class ScoreNetlistTemplatePairSolver extends BaseSolver {
  inputNetlist: InputNetlist
  template: CircuitBuilder

  inputNetlistWithRotations: InputNetlist | null = null

  outputIssues: Array<MatchingIssue> = []
  outputSimilarityDistance: number = Infinity
  candidateTransform: NormalizationTransform | null = null
  targetTransform: NormalizationTransform | null = null
  matchedBoxes: MatchedBox[] = []

  constructor(opts: {
    inputNetlist: InputNetlist
    template: CircuitBuilder
  }) {
    super()
    this.inputNetlist = opts.inputNetlist
    this.template = opts.template
  }

  getConstructorParams() {
    return {
      inputNetlist: this.inputNetlist,
      template: this.template,
    }
  }

  getStatsSummary() {
    return `${this.stats.similarityDistance.toFixed(1)} SD ・ ${this.stats.issueCount} issues ・ ${this.template.name}`
  }

  _step() {
    const templateNetlist = this.template.getNetlist()

    // First, normalize both netlists to get initial matching
    const candidateResult = normalizeNetlist(templateNetlist)
    const initialTargetResult = normalizeNetlist(
      structuredClone(this.inputNetlist),
    )

    const candidateNetlist = candidateResult.normalizedNetlist
    const initialTargetNetlist = initialTargetResult.normalizedNetlist

    // Get matched boxes with rotation metadata
    this.matchedBoxes = getMatchedBoxes({
      candidateNetlist,
      targetNetlist: initialTargetNetlist,
    })

    // Note: We apply rotations directly to the input netlist instead of using the normalized version

    // Convert the rotated normalized netlist back to InputNetlist format
    // We need to reconstruct the InputNetlist with proper rotations applied
    const inputNetlistWithRotations = applyMatchedBoxRotationsToInputNetlist({
      inputNetlist: structuredClone(this.inputNetlist),
      matchedBoxes: this.matchedBoxes,
    })

    this.inputNetlistWithRotations = inputNetlistWithRotations

    // Re-normalize the rotated target netlist for final scoring
    const finalTargetResult = normalizeNetlist(inputNetlistWithRotations)
    const finalTargetNetlist = finalTargetResult.normalizedNetlist

    // Store transform data for visualization
    this.candidateTransform = candidateResult.transform
    this.targetTransform = finalTargetResult.transform

    // Find matching issues between the candidate and final rotated target
    this.outputIssues = getMatchingIssues({
      candidateNetlist,
      targetNetlist: finalTargetNetlist,
    })

    // Compute similarity distance from the issues
    this.outputSimilarityDistance = computeSimilarityDistanceFromIssues(
      this.outputIssues,
    )

    // Store stats
    this.stats = {
      similarityDistance: this.outputSimilarityDistance,
      issueCount: this.outputIssues.length,
      templateBoxCount: candidateNetlist.boxes?.length || 0,
      templateConnectionCount: candidateNetlist.connections?.length || 0,
      matchedBoxCount: this.matchedBoxes.length,
    }

    this.solved = true
  }

  private getBoxNameFromIndex(boxIndex: number, isTemplate: boolean): string {
    const transform = isTemplate
      ? this.candidateTransform
      : this.targetTransform

    if (!transform) return boxIndex.toString()

    // Find the boxId that maps to this boxIndex
    const boxId = Object.keys(transform.boxIdToBoxIndex).find(
      (id) => transform.boxIdToBoxIndex[id] === boxIndex,
    )

    return boxId ? `${boxIndex} (${boxId})` : boxIndex.toString()
  }

  private getAsciiForNetlistBoxHelper(
    boxIndex: number,
    isTemplate: boolean,
    maxWidth = 45,
  ): string[] {
    const netlist = isTemplate
      ? this.template.getNetlist()
      : this.inputNetlistWithRotations!
    const transform = isTemplate
      ? this.candidateTransform
      : this.targetTransform

    if (!transform) return [`Box ${boxIndex} (no transform)`]

    return getAsciiForNetlistBox(boxIndex, netlist, transform, maxWidth)
  }

  private generateMatchedBoxesVisualization(): string {
    if (this.matchedBoxes.length === 0) {
      return "No matched boxes found"
    }

    const output: string[] = []

    for (const match of this.matchedBoxes) {
      const targetBoxAscii = this.getAsciiForNetlistBoxHelper(
        match.targetBoxIndex,
        false,
        48,
      )
      const candidateBoxAscii = this.getAsciiForNetlistBoxHelper(
        match.candidateBoxIndex,
        true,
        48,
      )

      // Ensure both boxes have the same height by padding the shorter one
      const maxHeight = Math.max(
        targetBoxAscii.length,
        candidateBoxAscii.length,
      )
      while (targetBoxAscii.length < maxHeight) {
        targetBoxAscii.push(" ".repeat(48))
      }
      while (candidateBoxAscii.length < maxHeight) {
        candidateBoxAscii.push(" ".repeat(48))
      }

      // Add header
      const targetHeader =
        `Target ${this.getBoxNameFromIndex(match.targetBoxIndex, false)}`.padEnd(
          48,
        )
      const candidateHeader =
        `Template ${this.getBoxNameFromIndex(match.candidateBoxIndex, true)}`.padEnd(
          48,
        )
      output.push(`${targetHeader}  →  ${candidateHeader}`)
      output.push(`${"─".repeat(48)}  →  ${"─".repeat(48)}`)

      // Combine side by side with arrow
      for (let i = 0; i < maxHeight; i++) {
        const leftLine = targetBoxAscii[i] || ""
        const rightLine = candidateBoxAscii[i] || ""
        const arrow = i === Math.floor(maxHeight / 2) ? " → " : "   "
        output.push(`${leftLine.padEnd(48)}${arrow}${rightLine.padEnd(48)}`)
      }

      output.push("") // Empty line between matches
    }

    return output.join("\n")
  }

  visualize() {
    return [
      {
        title: "inputTemplate",
        ascii: this.template.toString(),
        table: this.outputIssues.map((issue, index) => ({
          issue_index: index,
          type: issue.type,
          target_box:
            "targetBoxIndex" in issue
              ? this.getBoxNameFromIndex(issue.targetBoxIndex, false)
              : "N/A",
          candidate_box:
            "candidateBoxIndex" in issue
              ? this.getBoxNameFromIndex(issue.candidateBoxIndex, true)
              : "N/A",
          details: issue,
        })),
      },
      {
        title: "pairwisePinShapeSignatures",
        table: getPairwisePinShapeSignatures({
          targetNetlist: this.inputNetlistWithRotations!,
          candidateNetlist: this.template.getNetlist(),
          matchedBoxes: this.matchedBoxes,
          targetTransform: this.targetTransform!,
          candidateTransform: this.candidateTransform!,
        }),
      },
      {
        title: "matchedBoxes",
        ascii: this.generateMatchedBoxesVisualization(),
        table: this.matchedBoxes.map((match) => ({
          target_box: this.getBoxNameFromIndex(match.targetBoxIndex, false),
          candidate_box: this.getBoxNameFromIndex(
            match.candidateBoxIndex,
            true,
          ),
          rotation: match.targetBoxRotationCcw,
          issueCount: match.issues.length,
          details: match,
        })),
      },
      {
        title: "inputTemplateReadableNetlist",
        ascii: this.template.getReadableNetlist(),
      },
      {
        title: "inputTargetReadableNetlist",
        ascii: getReadableNetlist(this.inputNetlist),
      },
      this.inputNetlistWithRotations! && {
        title: "targetReadableNetlistWithRotations",
        ascii: getReadableNetlist(this.inputNetlistWithRotations!),
      },
      // {
      //   title: "pinShapeSignatures",
      //   table: [
      //     ...getAllPinShapeSignatures(this.inputNetlistWithRotations!).map(
      //       (a) => ({
      //         netlist: "target",
      //         ...a,
      //       }),
      //     ),
      //     ...getAllPinShapeSignatures(this.template.getNetlist()).map((a) => ({
      //       netlist: "template",
      //       ...a,
      //     })),
      //   ],
      // },
    ].filter(Boolean)
  }
}
