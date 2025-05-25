import { test, expect } from "bun:test"
import { circuit } from "lib/builder"
import { areNetlistsCompatible } from "lib/scoring/areNetlistsCompatible"

test("areNetlistsCompatible2: input connection not satisfiable by template's connections", () => {
  // Input connects chip.R1 to chip.R2
  const inputCircuit = circuit()
  const inputChip = inputCircuit.chip().rightpins(2)
  inputChip.pin(2).line(2, 0).mark("p1_end")
  inputChip.pin(1).line(2, 0).line(0, 1).intersect()
  inputChip.fromMark("p1_end").line(2, 0).label()

  // Template connects chip.R1 to a Net, and chip.R2 to a different Net (or same net but separate connections)
  const templateCircuit = circuit()
  const templateChip = templateCircuit.chip().rightpins(2)
  templateChip.pin(2).line(2, 0).label("A")
  templateChip.pin(1).line(3, 0).label("A") // or .label("NetA") but still not a direct R1-R2 connection

  expect(`\nInput:\n${inputCircuit.toString()}\n`).toMatchInlineSnapshot(`
    "
    Input:
         0.0         5.0  
     1.2         ●
     1.0         │
     0.8 U1      │
     0.6 ┌────┐  │
     0.4 │   2├──┼───A
     0.2 │   1├──┘
     0.0 └────┘
    "
  `)
  expect(`\nTemplate:\n${templateCircuit.toString()}\n`).toMatchInlineSnapshot(`
    "
    Template:
         0.0         5.0
     0.8 U1
     0.6 ┌────┐
     0.4 │   2├──A
     0.2 │   1├────A
     0.0 └────┘
    "
  `)

  expect(inputCircuit.getReadableNetlist()).toMatchInlineSnapshot(`
    "Boxes:


                      ┌────────────────┐
                      │       U1       │2  ── A         
                      │                │1               
                      └────────────────┘

    Complex Connections (more than 2 points):
      (none)"
  `)
  expect(templateCircuit.getReadableNetlist()).toMatchInlineSnapshot(`
    "Boxes:


                      ┌────────────────┐
                      │       U1       │2  ── ...       
                      │                │1  ── ...       
                      └────────────────┘

    Complex Connections (more than 2 points):
      - Connection 1:
        - Box Pin: U1, Pin 2
        - Net: A
        - Box Pin: U1, Pin 1"
  `)

  expect(
    areNetlistsCompatible(
      inputCircuit.getNetlist(),
      templateCircuit.getNetlist(),
    ),
  ).toBe(true)
})
