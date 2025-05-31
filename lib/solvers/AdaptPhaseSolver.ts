import type { InputNetlist } from "lib/input-types"
import type { CircuitBuilder } from "lib/builder"
import { BaseSolver } from "./BaseSolver"
import type { EditOperation } from "lib/adapt/EditOperation"
import { AdaptTemplateToNetlistSolver } from "./AdaptTemplateToNetlistSolver"

/**
 * Adapts matched templates to fit their target netlists by applying edit operations.
 */
export class AdaptPhaseSolver extends BaseSolver {
  matchedTemplates: Array<{
    template: CircuitBuilder
    netlist: InputNetlist
  }>

  adaptationSolvers: Array<AdaptTemplateToNetlistSolver> = []
  currentAdaptationIndex = 0

  outputAdaptedTemplates: Array<{
    template: CircuitBuilder
    netlist: InputNetlist
    appliedOperations: EditOperation[]
  }> = []

  constructor(opts: {
    matchedTemplates: Array<{
      template: CircuitBuilder
      netlist: InputNetlist
    }>
  }) {
    super()
    this.matchedTemplates = opts.matchedTemplates

    // Create adaptation solvers for each matched template
    this.adaptationSolvers = this.matchedTemplates.map(
      (match) =>
        new AdaptTemplateToNetlistSolver({
          inputTemplate: match.template,
          targetNetlist: match.netlist,
        }),
    )
    this.setActiveSubSolver(
      this.adaptationSolvers[this.currentAdaptationIndex]!,
    )
  }

  getConstructorParams() {
    return {
      matchedTemplates: this.matchedTemplates,
    }
  }

  computeProgress() {
    if (this.adaptationSolvers.length === 0) return 1
    return this.currentAdaptationIndex / this.adaptationSolvers.length
  }

  _step() {
    // If we haven't finished adapting all templates, continue adapting
    if (this.currentAdaptationIndex < this.adaptationSolvers.length) {
      const currentSolver = this.adaptationSolvers[this.currentAdaptationIndex]!

      if (!currentSolver.solved && !currentSolver.failed) {
        currentSolver.step()
        return
      }

      // Current solver is done, collect results and move to next
      this.clearActiveSubSolver()

      if (currentSolver.solved && currentSolver.outputAdaptedTemplate) {
        this.outputAdaptedTemplates.push({
          template: currentSolver.outputAdaptedTemplate,
          netlist: this.matchedTemplates[this.currentAdaptationIndex]!.netlist,
          appliedOperations: currentSolver.outputAppliedOperations,
        })
      }

      this.currentAdaptationIndex++
      this.setActiveSubSolver(
        this.adaptationSolvers[this.currentAdaptationIndex]!,
      )
      return
    }

    // All adaptations are complete
    this.solved = true
  }
}
