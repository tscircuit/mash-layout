import { test, expect } from "bun:test"
import { MatchNetlistToTemplateSolver } from "lib/solvers/MatchNetlistToTemplateSolver"
import { ScoreNetlistTemplatePairSolver } from "lib/solvers/ScoreNetlistTemplatePairSolver"
import template9 from "templates/template9"
import { getMatchedBoxString } from "tests/matching/getMatchedBoxString"
import { testTscircuitCodeForLayout } from "tests/tscircuit/testTscircuitCodeForLayout"
import { pipeline06Code } from "website/pages/pipeline/pipeline06.page"

test("pipeline06", async () => {
  const { solver } = await testTscircuitCodeForLayout(pipeline06Code, {
    templateFns: [template9],
  })

  // Capture the matching issues for analysis
  const matchSolver: MatchNetlistToTemplateSolver =
    solver.matchPhaseSolver!.usedSubSolvers!.find(
      (s: any) => s.constructor.name === "MatchNetlistToTemplateSolver",
    ) as any

  const netlistScorer: ScoreNetlistTemplatePairSolver = matchSolver
    .usedSubSolvers[0] as any

  const matchingIssues = matchSolver?.templateMatchResults?.[0]?.issues || []
  const pinShapeIssues = matchingIssues.filter(
    (issue: any) => issue.type === "matched_box_missing_pin_shape_on_side",
  )

  expect(netlistScorer.matchedBoxes).toMatchInlineSnapshot(`
    [
      {
        "_candidateBoxId": "U3",
        "_targetBoxId": "U3",
        "candidateBoxIndex": 0,
        "issues": [
          {
            "candidateBoxIndex": 0,
            "targetBoxIndex": 0,
            "type": "matched_box_side_has_wrong_pin_count",
          },
          {
            "candidateBoxIndex": 0,
            "candidateShapeSignatures": [
              "6R6,0R1,0B1T1,0B1T1",
              "0R1",
              "0R1",
              "0R1",
              "0R1",
              "6R6,0R1,0B1T1,0B1T1",
              "6R6,0R1,0B1T1,0B1T1",
              "0R1",
              "0R1",
              "0R1",
              "0B1T1,0R1",
            ],
            "side": "left",
            "targetBoxIndex": 0,
            "targetPinNumber": 2,
            "targetPinShapeSignature": "2R6,0R1,0B1T1,0B1T1",
            "type": "matched_box_missing_pin_shape_on_side",
          },
          {
            "candidateBoxIndex": 0,
            "candidateShapeSignatures": [
              "6R6,0R1,0B1T1,0B1T1",
              "0R1",
              "0R1",
              "0R1",
              "0R1",
              "6R6,0R1,0B1T1,0B1T1",
              "6R6,0R1,0B1T1,0B1T1",
              "0R1",
              "0R1",
              "0R1",
              "0B1T1,0R1",
            ],
            "side": "right",
            "targetBoxIndex": 0,
            "targetPinNumber": 3,
            "targetPinShapeSignature": "2R6,0R1,0B1T1,0B1T1",
            "type": "matched_box_missing_pin_shape_on_side",
          },
        ],
        "score": 3,
        "targetBoxIndex": 0,
        "targetBoxRotationCcw": 0,
      },
      {
        "_candidateBoxId": "C20",
        "_targetBoxId": "C20",
        "candidateBoxIndex": 1,
        "issues": [
          {
            "candidateBoxIndex": 1,
            "candidateShapeSignatures": [
              "6R6,0R1",
              "6R6,0R1,0B1T1",
            ],
            "side": "bottom",
            "targetBoxIndex": 1,
            "targetPinNumber": 1,
            "targetPinShapeSignature": "2R6,0R1",
            "type": "matched_box_missing_pin_shape_on_side",
          },
          {
            "candidateBoxIndex": 1,
            "candidateShapeSignatures": [
              "6R6,0R1",
              "6R6,0R1,0B1T1",
            ],
            "side": "top",
            "targetBoxIndex": 1,
            "targetPinNumber": 2,
            "targetPinShapeSignature": "2R6,0R1,0B1T1",
            "type": "matched_box_missing_pin_shape_on_side",
          },
        ],
        "score": 2,
        "targetBoxIndex": 1,
        "targetBoxRotationCcw": 0,
      },
      {
        "_candidateBoxId": "R11",
        "_targetBoxId": "R11",
        "candidateBoxIndex": 2,
        "issues": [
          {
            "candidateBoxIndex": 2,
            "candidateShapeSignatures": [
              "6R6,0R1",
              "6R6,0R1,0B1T1",
            ],
            "side": "bottom",
            "targetBoxIndex": 2,
            "targetPinNumber": 1,
            "targetPinShapeSignature": "2R6,0R1",
            "type": "matched_box_missing_pin_shape_on_side",
          },
          {
            "candidateBoxIndex": 2,
            "candidateShapeSignatures": [
              "6R6,0R1",
              "6R6,0R1,0B1T1",
            ],
            "side": "top",
            "targetBoxIndex": 2,
            "targetPinNumber": 2,
            "targetPinShapeSignature": "2R6,0R1,0B1T1",
            "type": "matched_box_missing_pin_shape_on_side",
          },
        ],
        "score": 2,
        "targetBoxIndex": 2,
        "targetBoxRotationCcw": 0,
      },
    ]
  `)

  // Snapshot the pin shape issues to analyze why they shouldn't be present
  expect({
    totalIssues: matchingIssues.length,
  }).toMatchInlineSnapshot(`
    {
      "totalIssues": 8,
    }
  `)
})
