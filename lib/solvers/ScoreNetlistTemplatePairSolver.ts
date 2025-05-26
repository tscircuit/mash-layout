import type { CircuitBuilder } from "lib/builder"
import type { InputNetlist } from "lib/input-types"
import { BaseSolver } from "./BaseSolver"
import { getMatchingIssues } from "lib/matching/getMatchingIssues"
import { computeSimilarityDistanceFromIssues } from "lib/matching/computeSimilarityDistanceFromIssues"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"
import type { MatchingIssue } from "lib/matching/types"
import { getReadableNetlist } from "lib/netlist/getReadableNetlist"

/**
 * Scores a single netlist-template pair, computing issues and similarity distance
 */
export class ScoreNetlistTemplatePairSolver extends BaseSolver {
  inputNetlist: InputNetlist
  template: CircuitBuilder

  outputIssues: Array<MatchingIssue> = []
  outputSimilarityDistance: number = Infinity

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

  _step() {
    // Normalize both netlists for comparison
    const candidateNetlist = normalizeNetlist(
      this.template.getNetlist(),
    ).normalizedNetlist
    const targetNetlist = normalizeNetlist(this.inputNetlist).normalizedNetlist

    // Find matching issues between the candidate and target
    this.outputIssues = getMatchingIssues({
      candidateNetlist,
      targetNetlist,
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
    }

    this.solved = true
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
            "candidateBoxIndex" in issue ? issue.candidateBoxIndex : "N/A",
          target_box: "targetBoxIndex" in issue ? issue.targetBoxIndex : "N/A",
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
    ]
  }
}
