import { test, expect } from "bun:test"
import { circuit } from "lib/builder"
import { getMatchedBoxes } from "lib/matching/getMatchedBoxes"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"
import type { InputNetlist } from "lib/input-types"
import { getMatchedBoxString } from "./getMatchedBoxString"

test("getMatchedBoxes3 - always match the largest target box first (even if it means throwing away a good match)", () => {
  const targetCircuit = circuit()
  targetCircuit.chip("T1").leftpins(1) // chip0
  targetCircuit.chip("T2").at(8, 0).rightpins(2) // chip1 - extra

  const candidateCircuit = circuit()
  candidateCircuit.chip("C1").leftpins(1) // chip0 - should match chip0 from target

  expect(`\n${targetCircuit.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0         10.0 
     1.0                 T2
     0.8 T1              ┌────┐
     0.6 ┌────┐          │    │
     0.4 │    │          │   2├
     0.2 ┤1   │          │   1├
     0.0 └────┘          └────┘
    "
  `)

  expect(`\n${candidateCircuit.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0     
     0.8 C1
     0.6 ┌────┐
     0.4 │    │
     0.2 ┤1   │
     0.0 └────┘
    "
  `)

  const { normalizedNetlist: normTarget, transform: targetTransform } =
    normalizeNetlist(targetCircuit.getNetlist())
  const { normalizedNetlist: normCandidate, transform: candidateTransform } =
    normalizeNetlist(candidateCircuit.getNetlist())

  const matchedBoxes = getMatchedBoxes({
    candidateNetlist: normCandidate,
    targetNetlist: normTarget,
  })

  // LARGEST boxes always are match first from the target! This is correct!
  expect(
    getMatchedBoxString({
      matchedBoxes,
      candidateTransform,
      targetTransform,
    }),
  ).toEqual(`
cand       target
C1       → T2
`)
})
