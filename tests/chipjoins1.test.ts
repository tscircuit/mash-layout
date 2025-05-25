import { test, expect } from "bun:test"
import { circuit } from "lib/builder"

test("chipjoins1", () => {
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
  U2.pin(4).line(2, 0).line(0, 4).label()

  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
               0.0         5.0         10.0         15.0  
     3.4                                       F
     3.2                                       │
     3.0                                       │
     2.8                                       │
     2.6                       A               │
     2.4                       │               │
     2.2                       │               │
     2.0                       │               │
     1.8                       │               │
     1.6                       │               │
     1.4                       │               │
     1.2                       │               │
     1.0       U1              │               │
     0.8       ┌────────┐      │               │
     0.6 C─────┤1      6├──────┘               │
     0.4       ┤2      5├────┐                 │
     0.2   ┌───┤3      4├┐   │                 │
     0.0   │   └────────┘│   │                 │
    -0.2   │             │   │     U2          │
    -0.4   │             │   │     ┌────────┐  │
    -0.6   │             │   └─────┤1      4├──┘
    -0.8   │             │     ┌───┤2      3├
    -1.0   │             │     │   └────────┘
    -1.2   │             │     │
    -1.4   │             │     │
    -1.6   │             │     │
    -1.8   D             B     E
    "
  `)
})
