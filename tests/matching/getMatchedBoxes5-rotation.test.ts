import { test, expect } from "bun:test"
import { circuit } from "lib/builder"
import { getMatchedBoxes } from "lib/matching/getMatchedBoxes"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"
import { getMatchedBoxString } from "./getMatchedBoxString"
import { applyMatchedBoxRotationsToInputNetlist } from "lib/matching/matching-utils/applyMatchedBoxRotationsToInputNetlist"
import { getReadableNetlist } from "lib/netlist/getReadableNetlist"

test("getMatchedBoxes5 - correctly handles passive rotation", () => {
  const target = circuit()

  target.chip("R1").leftpins(1).rightpins(1)

  const template = circuit()
  template.chip("C1").toppins(1).bottompins(1)

  expect(target.getReadableNetlist()).toMatchInlineSnapshot(`
    "Boxes:


                      ┌────────────────┐
                     1│       R1       │2               
                      └────────────────┘

    Complex Connections (more than 2 points):
      (none)"
  `)
  expect(template.getReadableNetlist()).toMatchInlineSnapshot(`
    "Boxes:


                                       
                              │        
                              2        
                      ┌────────────────┐
                      │       C1       │                
                      └────────────────┘
                              1        
                              │        
                                       

    Complex Connections (more than 2 points):
      (none)"
  `)

  const targetNorm = normalizeNetlist(target.getNetlist())
  const templateNorm = normalizeNetlist(template.getNetlist())

  const matchedBoxes = getMatchedBoxes({
    candidateNetlist: templateNorm.normalizedNetlist,
    targetNetlist: targetNorm.normalizedNetlist,
  })

  expect(matchedBoxes[0]!.targetBoxRotationCcw).not.toBe(0)

  const inputNetlistWithRotations = applyMatchedBoxRotationsToInputNetlist({
    inputNetlist: structuredClone(target.getNetlist()),
    matchedBoxes,
  })

  expect(getReadableNetlist(inputNetlistWithRotations)).toMatchInlineSnapshot(`
    "Boxes:


                                       
                              │        
                              2        
                      ┌────────────────┐
                      │       R1       │                
                      └────────────────┘
                              1        
                              │        
                                       

    Complex Connections (more than 2 points):
      (none)"
  `)
})
