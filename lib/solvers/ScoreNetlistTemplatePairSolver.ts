import type { CircuitBuilder } from "lib/builder"
import type { InputNetlist } from "lib/input-types"
import { BaseSolver } from "./BaseSolver"
import { getMatchingIssues } from "lib/matching/getMatchingIssues"
import { computeSimilarityDistanceFromIssues } from "lib/matching/computeSimilarityDistanceFromIssues"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"
import type { MatchingIssue } from "lib/matching/types"

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
    const candidateNetlist = normalizeNetlist(this.template.getNetlist()).normalizedNetlist
    const targetNetlist = normalizeNetlist(this.inputNetlist).normalizedNetlist

    // Find matching issues between the candidate and target
    this.outputIssues = getMatchingIssues({
      candidateNetlist,
      targetNetlist,
    })

    // Compute similarity distance from the issues
    this.outputSimilarityDistance = computeSimilarityDistanceFromIssues(this.outputIssues)

    this.solved = true
  }

  visualize() {
    // Get template netlist for basic stats
    const templateNetlist = this.template.getNetlist()
    
    // Create a simple ASCII representation of the template
    const ascii = `Template Netlist: ${templateNetlist.boxes?.length || 0} boxes, ${templateNetlist.connections?.length || 0} connections`

    return [
      {
        title: "inputTemplate",
        ascii,
        table: this.outputIssues.map((issue, index) => ({
          issue_index: index,
          type: issue.type,
          candidate_box: 'candidateBoxIndex' in issue ? issue.candidateBoxIndex : 'N/A',
          target_box: 'targetBoxIndex' in issue ? issue.targetBoxIndex : 'N/A',
          similarity_distance: this.outputSimilarityDistance,
        }))
      }
    ]
  }
}