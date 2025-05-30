import type { InputNetlist } from "lib/input-types"
import { BaseSolver } from "./BaseSolver"
import { AdaptPhaseSolver } from "./AdaptPhaseSolver"
import { MatchPhaseSolver } from "./MatchPhaseSolver"
import { CircuitBuilder } from "lib/builder"
import { CircuitTemplateFn } from "templates/index"

type PipelineStep<T extends new (...args: any[]) => BaseSolver> = {
  solverName: string
  solverClass: T
  getConstructorParams: (
    instance: SchematicLayoutPipelineSolver,
  ) => ConstructorParameters<T>
  onSolved?: (instance: SchematicLayoutPipelineSolver) => void
}

function definePipelineStep<
  T extends new (
    ...args: any[]
  ) => BaseSolver,
  const P extends ConstructorParameters<T>,
>(
  solverName: keyof SchematicLayoutPipelineSolver,
  solverClass: T,
  getConstructorParams: (instance: SchematicLayoutPipelineSolver) => P,
  opts: {
    onSolved?: (instance: SchematicLayoutPipelineSolver) => void
  } = {},
): PipelineStep<T> {
  return {
    solverName,
    solverClass,
    getConstructorParams,
    onSolved: opts.onSolved,
  }
}

export class SchematicLayoutPipelineSolver extends BaseSolver {
  inputNetlist: InputNetlist

  templateFnsOverride?: CircuitTemplateFn[]

  matchPhaseSolver?: MatchPhaseSolver
  adaptPhaseSolver?: AdaptPhaseSolver

  startTimeOfPhase: Record<string, number> = {}
  endTimeOfPhase: Record<string, number> = {}
  timeSpentOnPhase: Record<string, number> = {}

  pipelineDef = [
    // TODO partition
    definePipelineStep("matchPhaseSolver", MatchPhaseSolver, () => [
      {
        inputNetlists: [this.inputNetlist] as InputNetlist[],
        templateFns: this.templateFnsOverride,
      },
    ]),
    definePipelineStep("adaptPhaseSolver", AdaptPhaseSolver, () => [
      {
        matchedTemplates: this.matchPhaseSolver?.outputMatchedTemplates!,
      },
    ]),
    // TODO refine
    // TODO stitch
  ]

  constructor(opts: {
    inputNetlist: InputNetlist
    templateFns?: CircuitTemplateFn[]
  }) {
    super()
    this.inputNetlist = opts.inputNetlist
    this.templateFnsOverride = opts.templateFns
  }

  currentPipelineStepIndex = 0
  _step() {
    const pipelineStepDef = this.pipelineDef[this.currentPipelineStepIndex]
    if (!pipelineStepDef) {
      this.solved = true
      return
    }

    if (this.activeSubSolver) {
      console.log(
        "stepping active subsolver",
        this.activeSubSolver.constructor.name,
      )
      this.activeSubSolver.step()
      if (this.activeSubSolver.solved) {
        this.endTimeOfPhase[pipelineStepDef.solverName] = performance.now()
        this.timeSpentOnPhase[pipelineStepDef.solverName] =
          this.endTimeOfPhase[pipelineStepDef.solverName]! -
          this.startTimeOfPhase[pipelineStepDef.solverName]!
        pipelineStepDef.onSolved?.(this)
        this.clearActiveSubSolver()
        this.currentPipelineStepIndex++
        return
      }
      if (this.activeSubSolver.failed) {
        this.error = this.activeSubSolver?.error
        this.failed = true
        this.clearActiveSubSolver()
        return
      }
      return
    }

    const constructorParams = pipelineStepDef.getConstructorParams(this)
    // @ts-ignore
    this.setActiveSubSolver(
      // @ts-ignore
      new pipelineStepDef.solverClass(...constructorParams),
    )
    ;(this as any)[pipelineStepDef.solverName] = this.activeSubSolver
    this.timeSpentOnPhase[pipelineStepDef.solverName] = 0
    this.startTimeOfPhase[pipelineStepDef.solverName] = performance.now()
  }
}
