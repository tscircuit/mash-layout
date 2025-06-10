import type { InputNetlist } from "lib/input-types"
import type { CircuitBuilder } from "lib/builder"
import { BaseSolver } from "./BaseSolver"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"
import { getMatchedBoxes } from "lib/matching/getMatchedBoxes"

/**
 * Clones matched templates and rewrites chip IDs to use the IDs from the
 * matched target boxes. This ensures subsequent adaptation stages operate on
 * chip IDs that resemble the user's input.
 */
export class RenameMatchedTemplateBoxIdsSolver extends BaseSolver {
  matchedTemplates: Array<{ template: CircuitBuilder; netlist: InputNetlist }>

  outputRenamedTemplates: Array<{
    template: CircuitBuilder
    netlist: InputNetlist
  }> = []

  constructor(opts: {
    matchedTemplates: Array<{ template: CircuitBuilder; netlist: InputNetlist }>
  }) {
    super()
    this.matchedTemplates = opts.matchedTemplates
  }

  getConstructorParams() {
    return { matchedTemplates: this.matchedTemplates }
  }

  /** Compute mapping from candidate chip ids to target ids */
  private getChipIdMap(
    template: CircuitBuilder,
    target: InputNetlist,
  ): Record<string, string> {
    const templateResult = normalizeNetlist(template.getNetlist())
    const targetResult = normalizeNetlist(target)
    const matched = getMatchedBoxes({
      candidateNetlist: templateResult.normalizedNetlist,
      targetNetlist: targetResult.normalizedNetlist,
    })

    const map: Record<string, string> = {}
    for (const m of matched) {
      const candidateId = Object.entries(
        templateResult.transform.boxIdToBoxIndex,
      ).find(([, idx]) => idx === m.candidateBoxIndex)?.[0]
      const targetId = Object.entries(
        targetResult.transform.boxIdToBoxIndex,
      ).find(([, idx]) => idx === m.targetBoxIndex)?.[0]
      if (candidateId && targetId) {
        map[candidateId] = targetId
      }
    }
    return map
  }

  private cloneAndRename(
    template: CircuitBuilder,
    idMap: Record<string, string>,
  ): CircuitBuilder {
    const clone = template.clone()

    // Rename chips
    for (const chip of clone.chips) {
      const newId = idMap[chip.chipId]
      if (newId) {
        ;(chip as any).chipId = newId
      }
    }

    const remapRef = (ref: any) => {
      if (ref && "boxId" in ref && idMap[ref.boxId]) {
        ref.boxId = idMap[ref.boxId]
      }
    }

    // Update lines
    for (const line of clone.lines) {
      remapRef(line.start.ref)
      remapRef(line.end.ref)
    }

    // Update net labels
    for (const nl of clone.netLabels) {
      remapRef(nl.fromRef)
    }

    // Update connection points
    for (const cp of clone.connectionPoints) {
      remapRef(cp.pinRef)
    }

    return clone
  }

  _step() {
    for (const match of this.matchedTemplates) {
      const idMap = this.getChipIdMap(match.template, match.netlist)
      const cloned = this.cloneAndRename(match.template, idMap)
      this.outputRenamedTemplates.push({
        template: cloned,
        netlist: match.netlist,
      })
    }
    this.solved = true
  }
}
