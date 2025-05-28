import type { InputNetlist } from "lib/input-types"
import { BaseSolver } from "./BaseSolver"
import type { CircuitBuilder } from "lib/builder"
import type { EditOperation } from "lib/adapt/EditOperation"
import { adaptTemplateToTarget } from "lib/adapt/adaptTemplateToTarget"
import { getReadableNetlist } from "lib/netlist/getReadableNetlist"

/**
 * Adapts a template to match a target netlist by applying edit operations
 */
export class AdaptTemplateToNetlistSolver extends BaseSolver {
  inputTemplate: CircuitBuilder
  targetNetlist: InputNetlist

  outputAdaptedTemplate: CircuitBuilder | null = null
  outputAppliedOperations: EditOperation[] = []

  constructor(opts: {
    inputTemplate: CircuitBuilder
    targetNetlist: InputNetlist
  }) {
    super()
    this.inputTemplate = opts.inputTemplate
    this.targetNetlist = opts.targetNetlist
  }

  getConstructorParams() {
    return {
      inputTemplate: this.inputTemplate,
      targetNetlist: this.targetNetlist,
    }
  }

  getStatsSummary() {
    return `${this.outputAppliedOperations.length} operations applied`
  }

  _step() {
    // Clone the template to avoid mutating the original
    const templateClone = this.inputTemplate.clone()

    // Apply the adaptation
    const result = adaptTemplateToTarget({
      template: templateClone,
      target: this.targetNetlist,
    })

    this.outputAdaptedTemplate = templateClone
    this.outputAppliedOperations = result.appliedOperations

    // Store stats
    this.stats = {
      operationCount: this.outputAppliedOperations.length,
      templateBoxCount: templateClone.getNetlist().boxes?.length || 0,
      targetBoxCount: this.targetNetlist.boxes?.length || 0,
    }

    this.solved = true
  }

  visualize() {
    return [
      {
        title: "inputTemplate",
        ascii: this.inputTemplate.toString(),
      },
      {
        title: "targetNetlist",
        ascii: getReadableNetlist(this.targetNetlist),
      },
      {
        title: "adaptedTemplate",
        ascii: this.outputAdaptedTemplate?.toString() || "No adapted template",
      },
      {
        title: "appliedOperations",
        table: this.outputAppliedOperations.map((op, index) => ({
          operation_index: index,
          type: op.type,
          details: op,
        })),
      },
      {
        title: "inputTemplateReadableNetlist",
        ascii: this.inputTemplate.getReadableNetlist(),
      },
      {
        title: "adaptedTemplateReadableNetlist",
        ascii:
          this.outputAdaptedTemplate?.getReadableNetlist() ||
          "No adapted template",
      },
    ]
  }
}
