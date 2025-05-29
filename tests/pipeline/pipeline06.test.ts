import { test, expect } from "bun:test"
import template9 from "templates/template9"
import { testTscircuitCodeForLayout } from "tests/tscircuit/testTscircuitCodeForLayout"
import { pipeline06Code } from "website/pages/pipeline/pipeline06.page"

test("pipeline06", async () => {
  const { solver } = await testTscircuitCodeForLayout(pipeline06Code, {
    templateFns: [template9],
  })

  expect(
    solver.matchPhaseSolver!.outputMatchedTemplates,
  ).toMatchInlineSnapshot()
})
