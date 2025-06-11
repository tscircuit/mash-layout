import { test, expect } from "bun:test"
import corpus from "lib/corpus-vfs"
import { CORPUS_TEMPLATE_FNS } from "lib/corpus"
import { circuitBuilderFromLayoutJson } from "lib/utils/circuitBuilderFromLayoutJson"
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
  expect(`\n${matchedTemplate.toString()}\n`).toMatchInlineSnapshot(`
    "
           0.0        
     1.4   U1
     1.2   ┌─────┐
     1.0 ┌─┤1   4├─N
     0.8 │ ┤2   3├
     0.6 │ └─────┘
     0.4 │
     0.2 ┴
     0.0
    -0.2
    -0.4 P1
    -0.6
    -0.8 ┬
    -1.0 │
    -1.2 N
    "
  `)
})
