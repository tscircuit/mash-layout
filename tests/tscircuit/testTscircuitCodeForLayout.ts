import { runTscircuitCode } from "@tscircuit/eval"
import { cju } from "@tscircuit/circuit-json-util"
import { convertCircuitJsonToInputNetlist } from "lib/circuit-json/convertCircuitJsonToInputNetlist"
import { getReadableNetlist } from "lib/netlist/getReadableNetlist"
import { CircuitBuilder } from "lib/builder"
import { applyCircuitLayoutToCircuitJson } from "lib/circuit-json/applyCircuitLayoutToCircuitJson"
import { convertCircuitJsonToSchematicSvg } from "circuit-to-svg"
import { SchematicLayoutPipelineSolver } from "lib/solvers/SchematicLayoutPipelineSolver"
import { CircuitTemplateFn } from "templates/index"
import { reorderChipPinsToCcw } from "lib/circuit-json/reorderChipPinsToCcw"

export const testTscircuitCodeForLayout = async (
  code: string,
  opts: {
    templateFns?: CircuitTemplateFn[]
  } = {},
): Promise<{
  originalCircuitJson: any
  ccwOrderedCircuitJson: any
  laidOutCircuitJson: any
  readableNetlist: string
  matchedTemplate: CircuitBuilder
  adaptedTemplate: CircuitBuilder
  originalSchematicSvg: string
  laidOutSchematicSvg: string
  solver: SchematicLayoutPipelineSolver
}> => {
  const circuitJson: any[] = await runTscircuitCode(code)

  // HACK: Add schematic_net_label_id since core doesn't add it currently
  let schLabelIdCounter = 0
  for (const schLabel of cju(circuitJson).schematic_net_label.list()) {
    // @ts-expect-error until circuit-json adds schematic_net_label_id
    schLabel.schematic_net_label_id ??= `schematic_net_label_${schLabelIdCounter++}`
  }

  const ccwOrderedCircuitJson = reorderChipPinsToCcw(circuitJson)

  const inputNetlist = convertCircuitJsonToInputNetlist(circuitJson)
  const readableNetlist = getReadableNetlist(inputNetlist)

  const solver = new SchematicLayoutPipelineSolver({
    inputNetlist: inputNetlist,
    templateFns: opts.templateFns,
  })
  await solver.solve()

  const matchedTemplate =
    solver.matchPhaseSolver!.outputMatchedTemplates[0]!.template

  const adaptedTemplate =
    solver.adaptPhaseSolver!.outputAdaptedTemplates[0]!.template

  const laidOutCircuitJson = applyCircuitLayoutToCircuitJson(
    ccwOrderedCircuitJson,
    convertCircuitJsonToInputNetlist(ccwOrderedCircuitJson),
    adaptedTemplate,
  )

  const originalSchematicSvg = convertCircuitJsonToSchematicSvg(circuitJson, {
    grid: {
      cellSize: 1,
      labelCells: true,
    },
  })

  const laidOutSchematicSvg = convertCircuitJsonToSchematicSvg(
    laidOutCircuitJson,
    {
      grid: {
        cellSize: 1,
        labelCells: true,
      },
    },
  )

  return {
    originalCircuitJson: circuitJson,
    ccwOrderedCircuitJson,
    laidOutCircuitJson,
    readableNetlist,
    matchedTemplate,
    adaptedTemplate,
    originalSchematicSvg,
    laidOutSchematicSvg,
    solver,
  }
}
