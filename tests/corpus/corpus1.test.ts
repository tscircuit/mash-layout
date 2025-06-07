import { test, expect } from "bun:test"
import corpus1CircuitJson from "./assets/corpus1.circuit.json"
import corpus from "lib/corpus-vfs"
import { circuitBuilderFromLayoutJson } from "lib/utils/circuitBuilderFromLayoutJson"
import { convertCircuitJsonToInputNetlist } from "lib/circuit-json/convertCircuitJsonToInputNetlist"
import { SchematicLayoutPipelineSolver } from "lib/solvers/SchematicLayoutPipelineSolver"

const corpusLayout = corpus["corpus2025-05-03-abcd1234.json"] as any
const corpusTemplateFn = () => circuitBuilderFromLayoutJson(corpusLayout)

const expectedTemplate = corpusTemplateFn()

test("corpus1 matches and adapts with corpus template", () => {
  const inputNetlist = convertCircuitJsonToInputNetlist(corpus1CircuitJson as any)

  const solver = new SchematicLayoutPipelineSolver({
    inputNetlist,
    templateFns: [corpusTemplateFn],
  })
  solver.solve()

  const matchedTemplate = solver.matchPhaseSolver!.outputMatchedTemplates[0]!.template
  const adaptedTemplate = solver.adaptPhaseSolver!.outputAdaptedTemplates[0]!.template
  const appliedOperations = solver.adaptPhaseSolver!.outputAdaptedTemplates[0]!.appliedOperations

  expect(matchedTemplate.toString()).toBe(expectedTemplate.toString())
  expect(adaptedTemplate.toString()).not.toBe(expectedTemplate.toString())
  expect(appliedOperations).toEqual([
    { type: "remove_pin_from_side", chipId: "P1", side: "top", pinNumber: 2 },
    { type: "remove_pin_from_side", chipId: "P1", side: "bottom", pinNumber: 1 },
  ])
})
