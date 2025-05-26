import type { CircuitBuilder } from "lib/builder"
import type { InputNetlist } from "lib/input-types"
import { BaseSolver } from "./BaseSolver"
import { getMatchingIssues } from "lib/matching/getMatchingIssues"
import { computeSimilarityDistanceFromIssues } from "lib/matching/computeSimilarityDistanceFromIssues"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"
import type { MatchingIssue } from "lib/matching/types"
import { getReadableNetlist } from "lib/netlist/getReadableNetlist"
import { getMatchedBoxes } from "lib/matching/getMatchedBoxes"
import type { Box } from "lib/input-types"
import { transformTargetForPassiveCompatibility } from "lib/adapt/transformTargetForPassiveCompatibility"

/**
 * Scores a single netlist-template pair, computing issues and similarity distance
 */
export class ScoreNetlistTemplatePairSolver extends BaseSolver {
  inputNetlist: InputNetlist
  template: CircuitBuilder

  inputNetlistPassiveCompatible: InputNetlist | null = null

  outputIssues: Array<MatchingIssue> = []
  outputSimilarityDistance: number = Infinity
  candidateTransform: any = null
  targetTransform: any = null
  matchedBoxes: any[] = []

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
    return `${this.stats.similarityDistance.toFixed(1)} SD ・ ${this.stats.issueCount} issues`
  }

  _step() {
    const templateNetlist = this.template.getNetlist()

    const inputNetlist = transformTargetForPassiveCompatibility(
      this.template,
      structuredClone(this.inputNetlist),
    )
    this.inputNetlistPassiveCompatible = inputNetlist

    // Normalize both netlists for comparison
    const candidateResult = normalizeNetlist(templateNetlist)
    const targetResult = normalizeNetlist(inputNetlist)

    const candidateNetlist = candidateResult.normalizedNetlist
    const targetNetlist = targetResult.normalizedNetlist

    // Store transform data for visualization
    this.candidateTransform = candidateResult.transform
    this.targetTransform = targetResult.transform

    // Find matching issues between the candidate and target
    this.outputIssues = getMatchingIssues({
      candidateNetlist,
      targetNetlist,
    })

    // Compute similarity distance from the issues
    this.outputSimilarityDistance = computeSimilarityDistanceFromIssues(
      this.outputIssues,
    )

    // Get matched boxes for visualization
    this.matchedBoxes = getMatchedBoxes({
      candidateNetlist,
      targetNetlist,
    })

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

  private getAsciiForNetlistBox(
    boxIndex: number,
    isTemplate: boolean,
    maxWidth = 45,
  ): string[] {
    const netlist = isTemplate
      ? this.template.getNetlist()
      : this.inputNetlistPassiveCompatible!
    const transform = isTemplate
      ? this.candidateTransform
      : this.targetTransform

    if (!transform) return [`Box ${boxIndex} (no transform)`]

    // Find the boxId that maps to this boxIndex
    const boxId = Object.keys(transform.boxIdToBoxIndex).find(
      (id) => transform.boxIdToBoxIndex[id] === boxIndex,
    )

    if (!boxId) return [`Box ${boxIndex} (not found)`]

    const box = netlist.boxes.find((b) => b.boxId === boxId)
    if (!box) return [`Box ${boxId} (not found)`]

    // Simplified ASCII box generation based on getReadableNetlist
    const output: string[] = []
    const { leftPinCount, rightPinCount, topPinCount, bottomPinCount } = box

    const BOX_INNER_WIDTH = Math.min(maxWidth - 4, 16) // Account for borders
    const SIDE_PADDING_WIDTH = 2 // Left and right pin padding
    const bodyHeight = Math.max(leftPinCount, rightPinCount, 1)

    let displayBoxId = boxId
    if (boxId.length > BOX_INNER_WIDTH - 2) {
      displayBoxId = `${boxId.substring(0, BOX_INNER_WIDTH - 3)}…`
    }

    // Top pins (properly aligned with box)
    if (topPinCount > 0) {
      let pinsRow = ""
      for (let i = 0; i < topPinCount; i++) {
        const pinNum = leftPinCount + bottomPinCount + rightPinCount + i + 1
        pinsRow += pinNum.toString().padStart(2)
      }
      // Align with the box borders including side padding
      output.push(
        `${" ".repeat(SIDE_PADDING_WIDTH + 1)}${pinsRow.substring(0, BOX_INNER_WIDTH)}`,
      )
    }

    // Box top border (aligned with side padding)
    output.push(
      `${" ".repeat(SIDE_PADDING_WIDTH)}┌${"─".repeat(BOX_INNER_WIDTH)}┐`,
    )

    // Box body with side pins
    for (let i = 0; i < bodyHeight; i++) {
      const leftPin = i < leftPinCount ? (i + 1).toString() : ""
      const rightPin =
        i < rightPinCount
          ? (
              leftPinCount +
              bottomPinCount +
              (rightPinCount - 1 - i) +
              1
            ).toString()
          : ""

      let lineContent = ""
      if (i === Math.floor((bodyHeight - 1) / 2)) {
        const paddingLeft = Math.floor(
          (BOX_INNER_WIDTH - displayBoxId.length) / 2,
        )
        const paddingRight = BOX_INNER_WIDTH - displayBoxId.length - paddingLeft
        lineContent =
          " ".repeat(paddingLeft) + displayBoxId + " ".repeat(paddingRight)
      } else {
        lineContent = " ".repeat(BOX_INNER_WIDTH)
      }

      output.push(
        `${leftPin.padStart(SIDE_PADDING_WIDTH)}│${lineContent}│${rightPin.padEnd(SIDE_PADDING_WIDTH)}`,
      )
    }

    // Box bottom border (aligned with side padding)
    output.push(
      `${" ".repeat(SIDE_PADDING_WIDTH)}└${"─".repeat(BOX_INNER_WIDTH)}┘`,
    )

    // Bottom pins (properly aligned with box)
    if (bottomPinCount > 0) {
      let pinsRow = ""
      for (let i = 0; i < bottomPinCount; i++) {
        const pinNum = leftPinCount + i + 1
        pinsRow += pinNum.toString().padStart(2)
      }
      // Align with the box borders including side padding
      output.push(
        `${" ".repeat(SIDE_PADDING_WIDTH + 1)}${pinsRow.substring(0, BOX_INNER_WIDTH)}`,
      )
    }

    return output
  }

  private generateMatchedBoxesVisualization(): string {
    if (this.matchedBoxes.length === 0) {
      return "No matched boxes found"
    }

    const output: string[] = []

    for (const match of this.matchedBoxes) {
      const targetBoxAscii = this.getAsciiForNetlistBox(
        match.targetBoxIndex,
        false,
        48,
      )
      const candidateBoxAscii = this.getAsciiForNetlistBox(
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
          candidate_box:
            "candidateBoxIndex" in issue
              ? this.getBoxNameFromIndex(issue.candidateBoxIndex, true)
              : "N/A",
          target_box:
            "targetBoxIndex" in issue
              ? this.getBoxNameFromIndex(issue.targetBoxIndex, false)
              : "N/A",
        })),
      },
      {
        title: "matchedBoxes",
        ascii: this.generateMatchedBoxesVisualization(),
      },
      {
        title: "inputTemplateReadableNetlist",
        ascii: this.template.getReadableNetlist(),
      },
      {
        title: "inputTargetReadableNetlist",
        ascii: getReadableNetlist(this.inputNetlist),
      },
      this.inputNetlistPassiveCompatible && {
        title: "inputTargetReadableNetlistPassiveCompatible",
        ascii: getReadableNetlist(this.inputNetlistPassiveCompatible!),
      },
    ].filter(Boolean)
  }
}
