import { test, expect } from "bun:test"
import { MatchNetlistToTemplateSolver } from "lib/solvers/MatchNetlistToTemplateSolver"
import { ScoreNetlistTemplatePairSolver } from "lib/solvers/ScoreNetlistTemplatePairSolver"
import template9 from "templates/template9"
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
              "L6R6,R1,B1T1,B1T1",
              "R1",
              "R1",
              "R1",
              "R1",
              "B1T1,R1",
              "L6R6,R1,B1T1,B1T1",
              "L6R6,R1,B1T1,B1T1",
              "R1",
              "R1",
              "R1",
              "B1T1,R1",
            ],
            "side": "left",
            "targetBoxIndex": 0,
            "targetPinNumber": 1,
            "targetPinShapeSignature": "L2R6,R1,B1T1,B1T1",
            "type": "matched_box_missing_pin_shape_on_side",
          },
          {
            "candidateBoxIndex": 0,
            "candidateShapeSignatures": [
              "L6R6,R1,B1T1,B1T1",
              "R1",
              "R1",
              "R1",
              "R1",
              "L6R6,R1,B1T1,B1T1",
              "L6R6,R1,B1T1,B1T1",
              "R1",
              "R1",
              "R1",
              "B1T1,R1",
            ],
            "side": "right",
            "targetBoxIndex": 0,
            "targetPinNumber": 3,
            "targetPinShapeSignature": "L2R6,R1,B1T1,B1T1",
            "type": "matched_box_missing_pin_shape_on_side",
          },
          {
            "candidateBoxIndex": 0,
            "candidateShapeSignatures": [
              "L6R6,R1,B1T1,B1T1",
              "R1",
              "R1",
              "R1",
              "R1",
              "L6R6,R1,B1T1,B1T1",
              "L6R6,R1,B1T1,B1T1",
              "R1",
              "R1",
              "R1",
              "B1T1,R1",
            ],
            "side": "right",
            "targetBoxIndex": 0,
            "targetPinNumber": 4,
            "targetPinShapeSignature": "L2R6,R1,B1T1,B1T1",
            "type": "matched_box_missing_pin_shape_on_side",
          },
        ],
        "score": 4,
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
              "L6R6,R1",
              "L6R6,R1,B1T1",
            ],
            "side": "bottom",
            "targetBoxIndex": 1,
            "targetPinNumber": 1,
            "targetPinShapeSignature": "L2R6,R1",
            "type": "matched_box_missing_pin_shape_on_side",
          },
          {
            "candidateBoxIndex": 1,
            "candidateShapeSignatures": [
              "L6R6,R1",
              "L6R6,R1,B1T1",
            ],
            "side": "top",
            "targetBoxIndex": 1,
            "targetPinNumber": 2,
            "targetPinShapeSignature": "L2R6,R1,B1T1",
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
              "L6R6,R1",
              "L6R6,R1,B1T1",
            ],
            "side": "bottom",
            "targetBoxIndex": 2,
            "targetPinNumber": 1,
            "targetPinShapeSignature": "L2R6,R1",
            "type": "matched_box_missing_pin_shape_on_side",
          },
          {
            "candidateBoxIndex": 2,
            "candidateShapeSignatures": [
              "L6R6,R1",
              "L6R6,R1,B1T1",
            ],
            "side": "top",
            "targetBoxIndex": 2,
            "targetPinNumber": 2,
            "targetPinShapeSignature": "L2R6,R1,B1T1",
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
      "totalIssues": 9,
    }
  `)

  // Test pin margin functionality - check that pin 2 has appropriate margins
  const adaptedTemplate =
    solver.adaptPhaseSolver!.outputAdaptedTemplates[0]!.template
  const adaptedChip = adaptedTemplate.chips.find((c) => c.chipId === "U3")

  expect({
    adaptedPinCounts: adaptedChip
      ? {
          left: adaptedChip.leftPinCount,
          right: adaptedChip.rightPinCount,
          total: adaptedChip.totalPinCount,
        }
      : null,
    pin2Margin: adaptedChip?.pinMargins[2],
    pin2Position: adaptedChip ? adaptedChip.getPinLocation(2) : null,
  }).toMatchInlineSnapshot(`
    {
      "adaptedPinCounts": {
        "left": 2,
        "right": 6,
        "total": 8,
      },
      "pin2Margin": {
        "marginLeft": 0.2,
        "marginTop": 1,
      },
      "pin2Position": {
        "x": 0,
        "y": 0.20000000000000007,
      },
    }
  `)

  const layoutJson = adaptedTemplate.getLayoutJson()

  // Check that no lines connect from/to the same object
  const lines = layoutJson.paths || []
  const sameObjectLines = lines.filter(
    (line: any) =>
      (line.from?.boxId &&
        line.from?.boxId === line.to?.boxId &&
        line.from?.pinNumber === line.to?.pinNumber) ||
      (line.from?.junctionId &&
        line.to?.junctionId &&
        line.from?.junctionId === line.to?.junctionId),
  )
  expect(sameObjectLines).toEqual([])

  expect(layoutJson.paths).toMatchInlineSnapshot(`
    [
      {
        "from": {
          "junctionId": "XX1",
        },
        "points": [
          {
            "x": -1,
            "y": 1.2000000000000002,
          },
          {
            "x": -1,
            "y": 1.1990000000000003,
          },
        ],
        "to": {
          "boxId": "C20",
          "pinNumber": 2,
        },
      },
      {
        "from": {
          "junctionId": "XX2",
        },
        "points": [
          {
            "x": -1,
            "y": 0.1980000000000003,
          },
          {
            "x": -1,
            "y": -0.0019999999999997242,
          },
        ],
        "to": {
          "netId": "GND",
          "netLabelId": "NL1",
        },
      },
      {
        "from": {
          "junctionId": "XX1",
        },
        "points": [
          {
            "x": -1,
            "y": 1.2000000000000002,
          },
          {
            "x": -1,
            "y": 1.4000000000000001,
          },
        ],
        "to": {
          "netId": "V3_3",
          "netLabelId": "NL2",
        },
      },
      {
        "from": {
          "boxId": "U3",
          "pinNumber": 2,
        },
        "points": [
          {
            "x": 0,
            "y": 0.20000000000000007,
          },
          {
            "x": -1,
            "y": 0.20000000000000007,
          },
          {
            "x": -1,
            "y": 0.20000000000000007,
          },
          {
            "x": -1,
            "y": 0.1980000000000003,
          },
        ],
        "to": {
          "junctionId": "XX2",
        },
      },
      {
        "from": {
          "junctionId": "XX3",
        },
        "points": [
          {
            "x": 4.8,
            "y": 0.4000000000000001,
          },
          {
            "x": 4.8,
            "y": 2.4,
          },
        ],
        "to": {
          "netId": "V3_3",
          "netLabelId": "NL3",
        },
      },
      {
        "from": {
          "boxId": "U3",
          "pinNumber": 4,
        },
        "points": [
          {
            "x": 2.8,
            "y": 0.4,
          },
          {
            "x": 4.8,
            "y": 0.4,
          },
          {
            "x": 4.8,
            "y": 0.4,
          },
          {
            "x": 4.8,
            "y": 0.4000000000000001,
          },
        ],
        "to": {
          "junctionId": "XX3",
        },
      },
      {
        "from": {
          "boxId": "U3",
          "pinNumber": 5,
        },
        "points": [
          {
            "x": 2.8,
            "y": 0.6,
          },
          {
            "x": 5.8,
            "y": 0.6,
          },
        ],
        "to": {
          "netId": "A",
          "netLabelId": "NL4",
        },
      },
      {
        "from": {
          "boxId": "U3",
          "pinNumber": 6,
        },
        "points": [
          {
            "x": 2.8,
            "y": 0.8000000000000002,
          },
          {
            "x": 5.8,
            "y": 0.8000000000000002,
          },
        ],
        "to": {
          "netId": "B",
          "netLabelId": "NL5",
        },
      },
      {
        "from": {
          "boxId": "U3",
          "pinNumber": 7,
        },
        "points": [
          {
            "x": 2.8,
            "y": 1,
          },
          {
            "x": 5.8,
            "y": 1,
          },
        ],
        "to": {
          "netId": "C",
          "netLabelId": "NL6",
        },
      },
      {
        "from": {
          "junctionId": "XX4",
        },
        "points": [
          {
            "x": 3.8,
            "y": 1.2000000000000002,
          },
          {
            "x": 5.8,
            "y": 1.2000000000000002,
          },
        ],
        "to": {
          "netId": "D",
          "netLabelId": "NL7",
        },
      },
      {
        "from": {
          "junctionId": "XX4",
        },
        "points": [
          {
            "x": 3.8,
            "y": 1.2000000000000002,
          },
          {
            "x": 3.8,
            "y": 1.4000000000000001,
          },
        ],
        "to": {
          "boxId": "R11",
          "pinNumber": 1,
        },
      },
      {
        "from": {
          "boxId": "R11",
          "pinNumber": 2,
        },
        "points": [
          {
            "x": 3.8,
            "y": 2.4000000000000004,
          },
          {
            "x": 3.8,
            "y": 2.6000000000000005,
          },
        ],
        "to": {
          "netId": "V3_3",
          "netLabelId": "NL8",
        },
      },
    ]
  `)
})
