import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { ScoreNetlistTemplatePairSolver } from "lib/solvers/ScoreNetlistTemplatePairSolver"
import type { InputNetlist } from "lib/input-types"

test("ScoreNetlistTemplatePairSolver handles multiple passive orientations", () => {
  // Create a template with mixed passive orientations
  const template = new CircuitBuilder()
  template.chip("R1").leftpins(1).rightpins(1)
  template.chip("R2").toppins(1).bottompins(1)

  // Create input netlist with opposite orientations
  const inputNetlist: InputNetlist = {
    boxes: [
      {
        boxId: "R1",
        leftPinCount: 0,
        rightPinCount: 0,
        topPinCount: 1,
        bottomPinCount: 1,
      },
      {
        boxId: "R2",
        leftPinCount: 1,
        rightPinCount: 1,
        topPinCount: 0,
        bottomPinCount: 0,
      },
    ],
    connections: [],
    nets: [],
  }

  const solver = new ScoreNetlistTemplatePairSolver({
    inputNetlist,
    template,
  })

  solver.solve()

  expect(solver.solved).toBe(true)
  expect(solver.matchedBoxes).toHaveLength(2)

  // The algorithm should successfully match boxes even with different orientations
  // It may achieve this through passive rotation logic (even if rotation degree is 0)

  // For this test, the key validation is that mismatched orientations are handled
  // and the final score is good (low similarity distance)

  // The solver should handle multiple rotations and achieve a reasonable score
  expect(solver.outputSimilarityDistance).toBeLessThan(20)

  // Snapshot the results
  expect({
    matchedBoxes: solver.matchedBoxes.map((mb) => ({
      targetBoxIndex: mb.targetBoxIndex,
      candidateBoxIndex: mb.candidateBoxIndex,
      targetBoxRotationCcw: mb.targetBoxRotationCcw,
      score: mb.score,
    })),
    finalScore: solver.outputSimilarityDistance,
    rotatedBoxes: solver.inputNetlistWithRotations?.boxes.map((box) => ({
      boxId: box.boxId,
      leftPinCount: box.leftPinCount,
      rightPinCount: box.rightPinCount,
      topPinCount: box.topPinCount,
      bottomPinCount: box.bottomPinCount,
    })),
  }).toMatchInlineSnapshot(`
    {
      "finalScore": 0,
      "matchedBoxes": [
        {
          "candidateBoxIndex": 0,
          "score": 0,
          "targetBoxIndex": 0,
          "targetBoxRotationCcw": 90,
        },
        {
          "candidateBoxIndex": 1,
          "score": 0,
          "targetBoxIndex": 1,
          "targetBoxRotationCcw": 90,
        },
      ],
      "rotatedBoxes": [
        {
          "bottomPinCount": 0,
          "boxId": "R1",
          "leftPinCount": 1,
          "rightPinCount": 1,
          "topPinCount": 0,
        },
        {
          "bottomPinCount": 1,
          "boxId": "R2",
          "leftPinCount": 0,
          "rightPinCount": 0,
          "topPinCount": 1,
        },
      ],
    }
  `)
})
