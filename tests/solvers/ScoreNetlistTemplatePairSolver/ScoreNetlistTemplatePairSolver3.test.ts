import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { ScoreNetlistTemplatePairSolver } from "lib/solvers/ScoreNetlistTemplatePairSolver"
import type { InputNetlist } from "lib/input-types"

test("ScoreNetlistTemplatePairSolver handles non-passive components without rotation", () => {
  // Create a template with a non-passive component (more than 2 pins)
  const template = new CircuitBuilder()
  template.chip("U1").leftpins(2).rightpins(2).toppins(1).bottompins(1)

  // Create matching input netlist
  const inputNetlist: InputNetlist = {
    boxes: [
      {
        boxId: "U1",
        leftPinCount: 2,
        rightPinCount: 2,
        topPinCount: 1,
        bottomPinCount: 1,
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
  expect(solver.matchedBoxes).toHaveLength(1)

  // Non-passive components should not be rotated
  const matchedBox = solver.matchedBoxes[0]
  expect(matchedBox.targetBoxRotationCcw).toBe(0)

  // The input should remain unchanged
  const originalBox = inputNetlist.boxes[0]
  const rotatedBox = solver.inputNetlistWithRotations?.boxes[0]
  expect(rotatedBox).toBeDefined()
  expect(rotatedBox!.boxId).toBe(originalBox.boxId)
  expect(rotatedBox!.leftPinCount).toBe(originalBox.leftPinCount)
  expect(rotatedBox!.rightPinCount).toBe(originalBox.rightPinCount)
  expect(rotatedBox!.topPinCount).toBe(originalBox.topPinCount)
  expect(rotatedBox!.bottomPinCount).toBe(originalBox.bottomPinCount)

  // Should achieve perfect score since no rotation is needed
  expect(solver.outputSimilarityDistance).toBe(0)
  expect(solver.outputIssues).toHaveLength(0)
})
