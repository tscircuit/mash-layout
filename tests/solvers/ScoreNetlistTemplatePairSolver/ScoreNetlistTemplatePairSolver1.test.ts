import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { ScoreNetlistTemplatePairSolver } from "lib/solvers/ScoreNetlistTemplatePairSolver"
import type { InputNetlist } from "lib/input-types"

test("ScoreNetlistTemplatePairSolver correctly handles passive rotation", () => {
  // Create a template with a horizontal passive (resistor with left/right pins)
  const template = new CircuitBuilder()
  template.chip("R1").leftpins(1).rightpins(1)

  // Create an input netlist with a vertical passive (resistor with top/bottom pins)
  // This should match the template but require a 90-degree rotation
  const inputNetlist: InputNetlist = {
    boxes: [
      {
        boxId: "R1",
        leftPinCount: 0,
        rightPinCount: 0,
        topPinCount: 1,
        bottomPinCount: 1,
      },
    ],
    connections: [],
    nets: [],
  }

  // Create solver and run it
  const solver = new ScoreNetlistTemplatePairSolver({
    inputNetlist,
    template,
  })

  solver.solve()

  // The solver should complete successfully
  expect(solver.solved).toBe(true)

  // Check that the matched boxes include rotation metadata
  expect(solver.matchedBoxes).toHaveLength(1)
  const matchedBox = solver.matchedBoxes[0]!

  // The target box should have a rotation applied (likely 180 degrees for passive flip)
  expect(matchedBox.targetBoxRotationCcw).toBeOneOf([0, 90, 180, 270])
  expect(matchedBox.targetBoxIndex).toBe(0)
  expect(matchedBox.candidateBoxIndex).toBe(0)

  // The input netlist should be transformed to be passive compatible
  expect(solver.inputNetlistWithRotations).not.toBeNull()
  const compatibleNetlist = solver.inputNetlistWithRotations!

  // If rotation was applied, the passive should now be horizontally oriented to match template
  const rotatedBox = compatibleNetlist.boxes[0]!
  if (matchedBox.targetBoxRotationCcw === 180) {
    // 180-degree rotation: top/bottom becomes bottom/top
    expect(rotatedBox.topPinCount).toBe(1)
    expect(rotatedBox.bottomPinCount).toBe(1)
    expect(rotatedBox.leftPinCount).toBe(0)
    expect(rotatedBox.rightPinCount).toBe(0)
  } else if (matchedBox.targetBoxRotationCcw === 90) {
    // 90-degree CCW rotation: top/bottom becomes left/right
    expect(rotatedBox.leftPinCount).toBe(1) // was bottom
    expect(rotatedBox.rightPinCount).toBe(1) // was top
    expect(rotatedBox.topPinCount).toBe(0)
    expect(rotatedBox.bottomPinCount).toBe(0)
  } else if (matchedBox.targetBoxRotationCcw === 270) {
    // 270-degree CCW rotation: top/bottom becomes right/left
    expect(rotatedBox.leftPinCount).toBe(1) // was top
    expect(rotatedBox.rightPinCount).toBe(1) // was bottom
    expect(rotatedBox.topPinCount).toBe(0)
    expect(rotatedBox.bottomPinCount).toBe(0)
  }

  // The solver should achieve a good score (low similarity distance) due to proper rotation
  expect(solver.outputSimilarityDistance).toBeLessThan(10) // Should be a reasonable match

  // Take a snapshot to verify the behavior
  expect({
    matchedBoxes: solver.matchedBoxes.map((mb) => ({
      targetBoxIndex: mb.targetBoxIndex,
      candidateBoxIndex: mb.candidateBoxIndex,
      targetBoxRotationCcw: mb.targetBoxRotationCcw,
      score: mb.score,
      issueCount: mb.issues.length,
    })),
    finalScore: solver.outputSimilarityDistance,
    issueCount: solver.outputIssues.length,
    originalInput: inputNetlist.boxes[0],
    rotatedInput: solver.inputNetlistWithRotations?.boxes[0],
  }).toMatchInlineSnapshot(`
    {
      "finalScore": 0,
      "issueCount": 0,
      "matchedBoxes": [
        {
          "candidateBoxIndex": 0,
          "issueCount": 0,
          "score": 0,
          "targetBoxIndex": 0,
          "targetBoxRotationCcw": 90,
        },
      ],
      "originalInput": {
        "bottomPinCount": 1,
        "boxId": "R1",
        "leftPinCount": 0,
        "rightPinCount": 0,
        "topPinCount": 1,
      },
      "rotatedInput": {
        "bottomPinCount": 0,
        "boxId": "R1",
        "leftPinCount": 1,
        "rightPinCount": 1,
        "topPinCount": 0,
      },
    }
  `)
})
