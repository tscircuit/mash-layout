import { test, expect } from "bun:test"
import { circuit } from "lib/builder"
import { getReadableNetlist } from "lib/netlist/getReadableNetlist"

test("getReadableNetlist", () => {
  const C = circuit()
  const U1 = C.chip().leftpins(3).rightpins(3)
  const U2 = C.chip().leftpins(2).rightpins(2).at(10, -1)

  U1.pin(6).line(4, 0).mark("m1").line(0, 2).label()

  U1.pin(5).line(3, 0).connect()
  U1.pin(4).line(1, 0).line(0, -2).label()

  U1.pin(1).line(-3, 0).label()
  U1.pin(3).line(-2, 0).line(0, -2).label()

  U2.pin(1).line(-3, 0).line(0, 1).connect()
  U2.pin(2).line(-2, 0).line(0, -1).label()
  U2.pin(4).line(2, 0).mark("m2").line(0, 4).label()
  U2.fromMark("m2").line(0, -2).passive().line(0, -2).label()

  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
               0.0         5.0         10.0         15.0 
     3.4                                     F
     3.2                                     │
     3.0                                     │
     2.8                                     │
     2.6                     A               │
     2.4                     │               │
     2.2                     │               │
     2.0                     │               │
     1.8                     │               │
     1.6                     │               │
     1.4                     │               │
     1.2                     │               │
     1.0       U1            │               │
     0.8       ┌─────┐       │               │
     0.6 C─────┤1   6├───────┘               │
     0.4       ┤2   5├────── │               │
     0.2   ┌───┤3   4├─┐     │               │
     0.0   │   └─────┘ │     │               │
    -0.2   │           │     │     U2        │
    -0.4   │           │     │     ┌─────┐   │
    -0.6   │           │     └─────┤1   4├───┤
    -0.8   │           │       ┌───┤2   3├   │
    -1.0   │           │       │   └─────┘   │
    -1.2   │           │       │             │
    -1.4   │           │       │             │
    -1.6   │           │       │             │
    -1.8   D           B       E             │
    -2.0                                     │
    -2.2                                     │
    -2.4                                     │
    -2.6                                     ┴
    -2.8
    -3.0                                     R3
    -3.2
    -3.4
    -3.6                                     ┬
    -3.8                                     │
    -4.0                                     │
    -4.2                                     │
    -4.4                                     │
    -4.6                                     │
    -4.8                                     │
    -5.0                                     │
    -5.2                                     │
    -5.4                                     │
    -5.6                                     G
    "
  `)

  expect(getReadableNetlist(C.getNetlist())).toMatchInlineSnapshot(`
    "Boxes:


                          ┌────────────────┐
                   C ──  1│                │6  ── A             
                         2│       U1       │5                   
                   D ──  3│                │4  ── B             
                          └────────────────┘


                          ┌────────────────┐
                         1│       U2       │4  ── F,R3.2        
                   E ──  2│                │3                   
                          └────────────────┘


                                U2.4,F     
                                  │        
                                  2        
                          ┌────────────────┐
                          │       R3       │                    
                          └────────────────┘
                                  1        
                                  │        
                                  G        

    Complex Connections (more than 2 points):
      - complex connection[0]:
        - U2.4
        - F
        - R3.2"
    `)
})
