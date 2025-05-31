import { test, expect } from "bun:test"
import { MatchNetlistToTemplateSolver } from "lib/solvers/MatchNetlistToTemplateSolver"
import { ScoreNetlistTemplatePairSolver } from "lib/solvers/ScoreNetlistTemplatePairSolver"
import template2 from "templates/template2"
import { testTscircuitCodeForLayout } from "tests/tscircuit/testTscircuitCodeForLayout"
const pipeline03Code = `
import { sel } from "tscircuit"

export default () => (
  <board routingDisabled>
    <chip
      footprint="pinrow7"
      name="J1"
      pinLabels={{
        pin7: "VBUS",
        pin6: "DP",
        pin5: "DM",
        pin4: "CC1",
        pin3: "CC2",
        pin2: "SHLD",
        pin1: "GND",
      }}
      schPinArrangement={{
        rightSide: {
          direction: "bottom-to-top",
          pins: ["VBUS", "DP", "DM", "CC1", "CC2", "SHLD", "GND"],
        },
      }}
      connections={{
        GND: sel.net.GND,
        SHLD: sel.net.GND,
        VBUS: sel.net.VUSB
      }}
    />
    <resistor
      resistance="22"
      name="R10"
      schX={3.4}
      schY={0.2}
      connections={{
        pin1: sel.J1.DM,
        pin2: sel.net.DM
      }}
    />
    <resistor
      resistance="5.1k"
      name="R1"
      schX={2}
      schY={-2}
      schRotation="270deg"
      connections={{ pin2: sel.net.GND, pin1: sel.J1.CC2 }}
    />
    <resistor
      resistance="5.1k"
      name="R2"
      footprint="0402"
      schX={3}
      schY={-2}
      schRotation="270deg"
      connections={{
        pin1: sel.J1.CC1,
        pin2: sel.net.GND,
      }}
    />
  </board>
)
`

test("pipeline03", async () => {
  const { solver } = await testTscircuitCodeForLayout(pipeline03Code, {
    templateFns: [template2],
  })

  // Capture the matching issues for analysis
  const matchSolver: MatchNetlistToTemplateSolver =
    solver.matchPhaseSolver!.usedSubSolvers!.find(
      (s: any) => s.constructor.name === "MatchNetlistToTemplateSolver",
    ) as any

  const netlistScorer: ScoreNetlistTemplatePairSolver = matchSolver
    .usedSubSolvers[0] as any

  const matchingIssues = matchSolver?.templateMatchResults?.[0]?.issues || []

  // Analyze the issue types
  const issuesByType = matchingIssues.reduce((acc: any, issue: any) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1
    return acc
  }, {})

  console.log("Issue counts by type:")
  Object.entries(issuesByType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`)
  })

  // Look specifically for box count issues
  const boxCountIssues = matchingIssues.filter(
    (issue: any) =>
      issue.type === "matched_box_missing_pin_shape_box_count_on_side",
  )

  if (boxCountIssues.length > 0) {
    console.log(
      "\n=== BOX COUNT ISSUES (shouldn't exist for perfect match) ===",
    )
    boxCountIssues.forEach((issue: any, i: number) => {
      console.log(
        `${i + 1}. Candidate box ${issue.candidateBoxIndex}, Target box ${issue.targetBoxIndex}`,
      )
      console.log(`   Pin ${issue.targetPinNumber} on ${issue.side} side`)
      console.log(`   Expected: ${issue.targetBoxCountSignature}`)
      console.log(
        `   Available: [${issue.candidateBoxCountSignatures.join(", ")}]`,
      )
    })
  }

  expect(netlistScorer.matchedBoxes).toMatchInlineSnapshot(`
    [
      {
        "_candidateBoxId": "J1",
        "_targetBoxId": "J1",
        "candidateBoxIndex": 0,
        "issues": [],
        "score": 0,
        "targetBoxIndex": 0,
        "targetBoxRotationCcw": 0,
      },
      {
        "_candidateBoxId": "R1",
        "_targetBoxId": "R1",
        "candidateBoxIndex": 1,
        "issues": [],
        "score": 0,
        "targetBoxIndex": 1,
        "targetBoxRotationCcw": 0,
      },
      {
        "_candidateBoxId": "R2",
        "_targetBoxId": "R2",
        "candidateBoxIndex": 2,
        "issues": [],
        "score": 0,
        "targetBoxIndex": 2,
        "targetBoxRotationCcw": 0,
      },
      {
        "_candidateBoxId": "R0",
        "_targetBoxId": "R10",
        "candidateBoxIndex": 3,
        "issues": [],
        "score": 0,
        "targetBoxIndex": 3,
        "targetBoxRotationCcw": 0,
      },
    ]
  `)

  // For a perfect match, there should be no issues
  expect({
    totalIssues: matchingIssues.length,
    boxCountIssues: boxCountIssues.length,
  }).toMatchInlineSnapshot(`
    {
      "boxCountIssues": 0,
      "totalIssues": 0,
    }
  `)
})
