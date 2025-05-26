import type { InputNetlist } from "lib/input-types"
import { BaseSolver } from "./BaseSolver"
import type { CircuitBuilder } from "lib/builder"
import { TEMPLATE_FNS, TEMPLATE_FN_MAP } from "templates/index"
import { ScoreNetlistTemplatePairSolver } from "./ScoreNetlistTemplatePairSolver"
import type { MatchingIssue } from "lib/matching/types"

/**
 * Find the best match template for a netlist by scoring all templates
 */
export class MatchNetlistToTemplateSolver extends BaseSolver {
  inputNetlist: InputNetlist

  templates: Array<CircuitBuilder>
  scoringSolvers: Array<ScoreNetlistTemplatePairSolver> = []
  currentScoringIndex: number = 0

  outputBestMatchTemplate: CircuitBuilder | null = null

  templateMatchResults: Array<{
    template: CircuitBuilder
    issues: Array<MatchingIssue>
    similarityDistance: number
  }> = []

  constructor(opts: {
    inputNetlist: InputNetlist
  }) {
    super()
    this.inputNetlist = opts.inputNetlist
    this.templates = TEMPLATE_FNS.map((fn) => fn())
    
    // Create scoring solvers for each template
    this.scoringSolvers = this.templates.map(template => 
      new ScoreNetlistTemplatePairSolver({
        inputNetlist: this.inputNetlist,
        template
      })
    )
  }

  getConstructorParams() {
    return {
      inputNetlist: this.inputNetlist,
    }
  }

  computeProgress() {
    if (this.scoringSolvers.length === 0) return 1
    return this.currentScoringIndex / this.scoringSolvers.length
  }

  _step() {
    // If we haven't finished scoring all templates, continue scoring
    if (this.currentScoringIndex < this.scoringSolvers.length) {
      const currentSolver = this.scoringSolvers[this.currentScoringIndex]!
      
      if (!currentSolver.solved && !currentSolver.failed) {
        this.setActiveSubSolver(currentSolver)
        currentSolver.step()
        return
      }
      
      // Current solver is done, move to next
      this.clearActiveSubSolver()
      this.currentScoringIndex++
      return
    }

    // All scoring is complete, find the best match
    this.templateMatchResults = this.scoringSolvers.map(solver => ({
      template: solver.template,
      issues: solver.outputIssues,
      similarityDistance: solver.outputSimilarityDistance
    }))

    if (this.templateMatchResults.length === 0) {
      this.outputBestMatchTemplate = null
      this.solved = true
      return
    }

    // Find the template with the lowest similarity distance
    let bestMatch = this.templateMatchResults[0]!
    for (let i = 1; i < this.templateMatchResults.length; i++) {
      if (this.templateMatchResults[i]!.similarityDistance < bestMatch.similarityDistance) {
        bestMatch = this.templateMatchResults[i]!
      }
    }

    // If all similarity distances are Infinity, no suitable match was found
    if (bestMatch.similarityDistance === Infinity) {
      this.outputBestMatchTemplate = null
    } else {
      this.outputBestMatchTemplate = bestMatch.template
    }

    this.solved = true
  }
}
