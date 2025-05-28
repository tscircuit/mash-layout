import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"

test("upward-passive-netlist", () => {
  const C = new CircuitBuilder()

  const U1 = C.chip().rightpins(2).leftpins(2)

  U1.pin(3).line(2, 0).line(0, 2).passive().line(0, 2).label()

  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         
     5.2         A
     5.0         │
     4.8         │
     4.6         │
     4.4         │
     4.2         │
     4.0         │
     3.8         │
     3.6         │
     3.4         │
     3.2         ┴
     3.0
     2.8         R2
     2.6
     2.4
     2.2         ┬
     2.0         │
     1.8         │
     1.6         │
     1.4         │
     1.2         │
     1.0         │
     0.8 U1      │
     0.6 ┌────┐  │
     0.4 ┤1  1├  │
     0.2 ┤2  2├──┘
     0.0 └────┘
    "
  `)

  expect(C.getReadableNetlist()).toMatchInlineSnapshot(`
    "Boxes:


                          ┌────────────────┐
                R2.1 ──  1│       U1       │4                   
                         2│                │3                   
                          └────────────────┘


                                  A        
                                  │        
                                  2        
                          ┌────────────────┐
                          │       R2       │                    
                          └────────────────┘
                                  1        
                                  │        
                                 U1.1      

    Complex Connections (more than 2 points):
      (none)"
  `)
})
