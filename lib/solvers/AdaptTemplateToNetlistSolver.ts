import type { InputNetlist } from "lib/input-types"
import { BaseSolver } from "./BaseSolver"
import type { CircuitBuilder } from "lib/builder"
import type { EditOperation } from "lib/adapt/EditOperation"
import { getReadableNetlist } from "lib/netlist/getReadableNetlist"
import { transformTargetForPassiveCompatibility } from "lib/adapt/transformTargetForPassiveCompatibility"
import { removeUnmatchedChips } from "lib/adapt/adaptation-operations/removeUnmatchedChips"
import { fixMatchedBoxPinCounts } from "lib/adapt/adaptation-operations/fixMatchedBoxPinCounts"
import { fixMatchedBoxPinShapes } from "lib/adapt/adaptation-operations/fixMatchedBoxPinShapes"
import { applyEditOperation } from "lib/adapt/applyEditOperation"
import type { MatchedBoxWithChipIds } from "lib/adapt/adaptation-operations/removeUnmatchedChips"

type AdaptationPhase =
  | "transform-target"
  | "remove-unmatched-chips-1"
  | "fix-matched-box-pin-counts"
  | "fix-matched-box-pin-shapes"
  | "remove-unmatched-chips-2"
  | "complete"

/**
 * Adapts a template to match a target netlist by applying edit operations step-by-step
 */
export class AdaptTemplateToNetlistSolver extends BaseSolver {
  inputTemplate: CircuitBuilder
  targetNetlist: InputNetlist
  transformedTarget: InputNetlist | null = null

  outputAdaptedTemplate: CircuitBuilder | null = null
  outputAppliedOperations: EditOperation[] = []

  phase: AdaptationPhase = "transform-target"
  matchedBoxes: MatchedBoxWithChipIds[] = []
  stepCount = 0
  maxSteps = 100

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
    return `Phase: ${this.phase}, ${this.outputAppliedOperations.length} operations applied`
  }

  _step() {
    this.stepCount++
    if (this.stepCount > this.maxSteps) {
      console.warn(
        `AdaptTemplateToNetlistSolver exceeded max steps (${this.maxSteps}), stopping`,
      )
      this.solved = true
      return
    }

    // Initialize template clone on first step
    if (!this.outputAdaptedTemplate) {
      this.outputAdaptedTemplate = this.inputTemplate.clone()
    }

    switch (this.phase) {
      case "transform-target":
        this.transformedTarget = transformTargetForPassiveCompatibility(
          this.outputAdaptedTemplate,
          this.targetNetlist,
        )
        this.phase = "remove-unmatched-chips-1"
        break

      case "remove-unmatched-chips-1":
        const removal1Result = removeUnmatchedChips({
          template: this.outputAdaptedTemplate,
          target: this.transformedTarget!,
        })
        this.matchedBoxes = removal1Result.matchedBoxes

        if (removal1Result.appliedOperations.length > 0) {
          // Operation was already applied by the function, just track it
          const operation = removal1Result.appliedOperations[0]!
          this.outputAppliedOperations.push(operation)
        } else {
          // No more operations needed, move to next phase
          this.phase = "fix-matched-box-pin-counts"
        }
        break

      case "fix-matched-box-pin-counts":
        // Recalculate matched boxes to account for template changes
        const pinCountsRemovalResult = removeUnmatchedChips({
          template: this.outputAdaptedTemplate,
          target: this.transformedTarget!,
        })

        // Recalculate operations each time to account for changes
        const fixPinCountsResult = fixMatchedBoxPinCounts({
          template: this.outputAdaptedTemplate,
          target: this.transformedTarget!,
          matchedBoxes: pinCountsRemovalResult.matchedBoxes,
        })

        if (fixPinCountsResult.appliedOperations.length > 0) {
          // Operation was already applied by the function, just track it
          const operation = fixPinCountsResult.appliedOperations[0]!
          this.outputAppliedOperations.push(operation)
        } else {
          // No more operations needed, move to next phase
          this.phase = "fix-matched-box-pin-shapes"
        }
        break

      case "fix-matched-box-pin-shapes":
        // Recalculate matched boxes to account for template changes
        const currentRemovalResult = removeUnmatchedChips({
          template: this.outputAdaptedTemplate,
          target: this.transformedTarget!,
        })

        // Recalculate operations each time to account for changes
        const fixPinShapesResult = fixMatchedBoxPinShapes({
          template: this.outputAdaptedTemplate,
          target: this.transformedTarget!,
          matchedBoxes: currentRemovalResult.matchedBoxes,
        })

        if (fixPinShapesResult.appliedOperations.length > 0) {
          // Operation was already applied by the function, just track it
          const operation = fixPinShapesResult.appliedOperations[0]!
          this.outputAppliedOperations.push(operation)
        } else {
          // No more operations needed, move to next phase
          this.phase = "remove-unmatched-chips-2"
        }
        break

      case "remove-unmatched-chips-2":
        // Recalculate operations each time to account for changes
        const removal2Result = removeUnmatchedChips({
          template: this.outputAdaptedTemplate,
          target: this.transformedTarget!,
        })

        if (removal2Result.appliedOperations.length > 0) {
          // Operation was already applied by the function, just track it
          const operation = removal2Result.appliedOperations[0]!
          this.outputAppliedOperations.push(operation)
        } else {
          // No more operations needed, move to complete
          this.phase = "complete"
        }
        break

      case "complete":
        // Store stats
        this.stats = {
          operationCount: this.outputAppliedOperations.length,
          templateBoxCount:
            this.outputAdaptedTemplate.getNetlist().boxes?.length || 0,
          targetBoxCount: this.targetNetlist.boxes?.length || 0,
        }
        this.solved = true
        break
    }
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
