import { test, expect } from "bun:test"
import { circuit } from "lib/builder"
import { getMatchedBoxes } from "lib/matching/getMatchedBoxes"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"
import type { InputNetlist } from "lib/input-types"

test("getMatchedBoxes should correctly match boxes between two netlists", () => {
  // Define a target circuit with two chips
  const targetCircuit = circuit()
  const targetChip1 = targetCircuit.chip().at(0, 0).leftpins(2).rightpins(1) // chipId: "chip0", 3 pins
  const targetChip2 = targetCircuit.chip().at(0, 5).leftpins(1) // chipId: "chip1", 1 pin

  // Define a candidate circuit with two chips that should match the target ones
  // Note: chipC_Y is defined first but should match targetChip2
  // chipC_X should match targetChip1
  const candidateCircuit = circuit()
  const candidateChip_Y = candidateCircuit.chip().at(0, 0).leftpins(1) // chipId: "chip0", 1 pin (matches targetChip2)
  const candidateChip_X = candidateCircuit
    .chip()
    .at(0, 5)
    .leftpins(2)
    .rightpins(1) // chipId: "chip1", 3 pins (matches targetChip1)

  expect(`\n${targetCircuit.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         
     5.6 U2
     5.4 ┌────┐
     5.2 ┤1   │
     5.0 └────┘
     4.8
     4.6
     4.4
     4.2
     4.0
     3.8
     3.6
     3.4
     3.2
     3.0
     2.8
     2.6
     2.4
     2.2
     2.0
     1.8
     1.6
     1.4
     1.2
     1.0
     0.8 U1
     0.6 ┌────────┐
     0.4 ┤1      3├
     0.2 ┤2       │
     0.0 └────────┘
    "
  `)
  expect(`\n${candidateCircuit.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         
     5.8 U2
     5.6 ┌────────┐
     5.4 ┤1      3├
     5.2 ┤2       │
     5.0 └────────┘
     4.8
     4.6
     4.4
     4.2
     4.0
     3.8
     3.6
     3.4
     3.2
     3.0
     2.8
     2.6
     2.4
     2.2
     2.0
     1.8
     1.6
     1.4
     1.2
     1.0
     0.8
     0.6 U1
     0.4 ┌────┐
     0.2 ┤1   │
     0.0 └────┘
    "
  `)

  const targetNetlist: InputNetlist = targetCircuit.getNetlist()
  const candidateNetlist: InputNetlist = candidateCircuit.getNetlist()

  const { normalizedNetlist: normTarget, transform: targetTransform } =
    normalizeNetlist(targetNetlist)
  const { normalizedNetlist: normCandidate, transform: candidateTransform } =
    normalizeNetlist(candidateNetlist)

  expect(normTarget.boxes).toMatchInlineSnapshot(`
    [
      {
        "bottomPinCount": 0,
        "boxIndex": 0,
        "leftPinCount": 2,
        "rightPinCount": 1,
        "topPinCount": 0,
      },
      {
        "bottomPinCount": 0,
        "boxIndex": 1,
        "leftPinCount": 1,
        "rightPinCount": 0,
        "topPinCount": 0,
      },
    ]
  `)
  expect(normCandidate.boxes).toMatchInlineSnapshot(`
    [
      {
        "bottomPinCount": 0,
        "boxIndex": 0,
        "leftPinCount": 2,
        "rightPinCount": 1,
        "topPinCount": 0,
      },
      {
        "bottomPinCount": 0,
        "boxIndex": 1,
        "leftPinCount": 1,
        "rightPinCount": 0,
        "topPinCount": 0,
      },
    ]
  `)

  expect(normCandidate.boxes).toEqual(normTarget.boxes)

  const matchedBoxes = getMatchedBoxes({
    candidateNetlist: normCandidate,
    targetNetlist: normTarget,
  })

  expect(matchedBoxes).toMatchInlineSnapshot(`
    [
      {
        "candidateBoxIndex": 0,
        "issues": [],
        "score": 0,
        "targetBoxIndex": 0,
      },
      {
        "candidateBoxIndex": 1,
        "issues": [],
        "score": 0,
        "targetBoxIndex": 1,
      },
    ]
  `)
})
