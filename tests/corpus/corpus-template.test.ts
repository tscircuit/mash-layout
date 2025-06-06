import { test, expect } from "bun:test"
import corpus from "lib/corpus-vfs"
import { circuitBuilderFromLayoutJson, CORPUS_TEMPLATE_FNS } from "lib/corpus"
import { SchematicLayoutPipelineSolver } from "lib/solvers/SchematicLayoutPipelineSolver"

const layout = corpus["corpus2025-05-03-abcd1234.json"] as any

test("corpus template is used by solver", () => {
  const builder = circuitBuilderFromLayoutJson(layout)
  const expectedTemplate = CORPUS_TEMPLATE_FNS[0]!()
  const solver = new SchematicLayoutPipelineSolver({
    inputNetlist: builder.getNetlist(),
    templateFns: CORPUS_TEMPLATE_FNS,
  })
  solver.solve()
  const matchedTemplate =
    solver.matchPhaseSolver!.outputMatchedTemplates[0]!.template
  expect(matchedTemplate.toString()).toBe(expectedTemplate.toString())
})
