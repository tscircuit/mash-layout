import { test, expect } from "bun:test"
import template9 from "templates/template9"
import { testTscircuitCodeForLayout } from "tests/tscircuit/testTscircuitCodeForLayout"
import { pipeline06Code } from "website/pages/pipeline/pipeline06.page"

test("pipeline06", async () => {
  const { solver } = await testTscircuitCodeForLayout(pipeline06Code, {
    templateFns: [template9],
  })

  // Capture the matching issues for analysis
  const matchSolver = solver.matchPhaseSolver!.usedSubSolvers!.find(
    (s: any) => s.constructor.name === "MatchNetlistToTemplateSolver",
  ) as any

  const matchingIssues = matchSolver?.templateMatchResults?.[0]?.issues || []
  const pinShapeIssues = matchingIssues.filter(
    (issue: any) => issue.type === "matched_box_missing_pin_shape_on_side",
  )

  // Snapshot the pin shape issues to analyze why they shouldn't be present
  expect({
    totalIssues: matchingIssues.length,
  }).toMatchInlineSnapshot(`
    {
      "totalIssues": 7,
    }
  `)
})
