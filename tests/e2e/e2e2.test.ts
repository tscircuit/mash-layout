import { test, expect } from "bun:test"
import { SchematicLayoutPipelineSolver } from "../../lib/solvers/SchematicLayoutPipelineSolver"
import { circuit } from "../../lib/builder"
import { getReadableNetlist } from "../../lib/netlist/getReadableNetlist"

test("e2e2", () => {
  // Create a circuit using CircuitBuilder similar to template1.ts
  const C = circuit()

  // Add a chip with 4 left pins and 4 right pins
  const U1 = C.chip().leftpins(4).rightpins(4)
  U1.pin(1).line(-5, 0).passive().line(-2, 0).label("X")
  U1.pin(2).line(-3, 0).label("Y")
  U1.pin(7).line(4, 0).label()
  U1.pin(8).line(4, 0).label()

  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
             -5.0         0.0         5.0      
     1.2               U1
     1.0               ┌────────┐
     0.8 X─R2──────────┤1      8├──────B
     0.6         Y─────┤2      7├──────A
     0.4               ┤3      6├
     0.2               ┤4      5├
     0.0               └────────┘
    "
  `)
  const inputNetlist = C.getNetlist()

  const solver = new SchematicLayoutPipelineSolver({
    inputNetlist,
  })

  solver.solve()

  expect(
    `\n${solver.matchPhaseSolver?.outputMatchedTemplates[0]?.template.toString()}\n`,
  ).toMatchInlineSnapshot(`
    "
         0.0         5.0        
     3.4         A
     3.2         │
     3.0         │
     2.8         │
     2.6         │
     2.4         │
     2.2         │ ┌───R2──B
     2.0         │ │
     1.8 U1      │ │
     1.6 ┌────┐  │ │
     1.4 │   7├──┘ │
     1.2 │   6├────┘
     1.0 │   5├────────R3──C
     0.8 │   4├──────────┐
     0.6 │   3├────┐     │
     0.4 │   2├┐   │     │
     0.2 │   1├●   │     │
     0.0 └────┘│   │     │
    -0.2       │   │     │
    -0.4       │   │     │
    -0.6       │   │     │
    -0.8       │   │     │
    -1.0       │   │     │
    -1.2       │   │     │
    -1.4       │   │     │
    -1.6       │   │     │
    -1.8       │   │     │
    -2.0       │   │     │
    -2.2       │   │     │
    -2.4       │   ┴     │
    -2.6       │         │
    -2.8       │   R5    │
    -3.0       │         │
    -3.2       │         ┴
    -3.4       │   ┬
    -3.6       F   │     R4
    -3.8           │
    -4.0           │
    -4.2           │     ┬
    -4.4           │     │
    -4.6           │     │
    -4.8           │     │
    -5.0           │     │
    -5.2           │     │
    -5.4           E     │
    -5.6                 │
    -5.8                 │
    -6.0                 │
    -6.2                 D
    "
  `)

  expect(
    `\n${solver.adaptPhaseSolver?.outputAdaptedTemplates[0]?.template.toString()}\n`,
  ).toMatchInlineSnapshot(`
    "
                 0.0         5.0         10.0
     1.2         U1
     1.0         ┌────────┐
     0.8 G─R3X───┤1      8├──J────────
     0.6     H───┤2      7├──I──
     0.4         ┤3      6├
     0.2         ┤4      5├
     0.0         └────────┘
    "
  `)

  expect(
    solver.adaptPhaseSolver?.outputAdaptedTemplates[0]?.template.getReadableNetlist(),
  ).toMatchInlineSnapshot(`
    "Boxes:


                      ┌────────────────┐
             ... ──  1│                │8  ── J         
               H ──  2│       U1       │7  ── I         
                     3│                │6               
                     4│                │5               
                      └────────────────┘


                      ┌────────────────┐
             ... ──  1│       R3       │2               
                      └────────────────┘

    Complex Connections (more than 2 points):
      - Connection 1:
        - Box Pin: U1, Pin 1
        - Net: G
        - Box Pin: R3, Pin 1
        - Net: X"
  `)
})
