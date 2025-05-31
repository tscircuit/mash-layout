import type { InputNetlist } from "lib/input-types"
import { BaseSolver } from "./BaseSolver"
import { MatchNetlistToTemplateSolver } from "./MatchNetlistToTemplateSolver"
import type { CircuitBuilder } from "lib/builder"
import type { CircuitTemplateFn } from "templates/index"

/**
 * For each input netlist, find the best match template.
 */
export class MatchPhaseSolver extends BaseSolver {
  inputNetlists: InputNetlist[]
  currentInputNetlistIndex = 0

  templateFns?: CircuitTemplateFn[]

  outputMatchedTemplates: Array<{
    template: CircuitBuilder
    netlist: InputNetlist
  }> = []

  get activeSubSolver() {
    return this._activeSubSolver as MatchNetlistToTemplateSolver | null
  }

  constructor(opts: {
    inputNetlists: InputNetlist[]
    templateFns?: CircuitTemplateFn[]
  }) {
    super()
    this.inputNetlists = opts.inputNetlists
    this.templateFns = opts.templateFns
  }

  _step() {
    if (this.activeSubSolver) {
      this.activeSubSolver.step()
      if (this.activeSubSolver.solved) {
        this.outputMatchedTemplates.push({
          template: this.activeSubSolver.outputBestMatchTemplate!,
          netlist: this.inputNetlists[this.currentInputNetlistIndex]!,
        })

        this.currentInputNetlistIndex++
        this.clearActiveSubSolver()
        return
      } else {
        return
      }
    }

    if (this.currentInputNetlistIndex >= this.inputNetlists.length) {
      this.solved = true
      return
    }

    this.setActiveSubSolver(
      new MatchNetlistToTemplateSolver({
        inputNetlist: this.inputNetlists[this.currentInputNetlistIndex]!,
        templateFns: this.templateFns,
      }),
    )
  }
}
