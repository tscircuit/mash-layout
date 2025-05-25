import { test, expect } from "bun:test"
import { circuit } from "lib/builder"

test("flipX should flip the circuit horizontally", () => {
  const c = circuit()
  const u1 = c.chip().rightpins(2)
  u1.pin(2).line(4, 0).label("A")
  u1.pin(1).line(2, 0).label("B")

  expect(`\n${c.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0      
     1.0  U1
     0.8 ┌──┐
     0.6 │  │
     0.4 │ 2├    ────────A
     0.2 │ 1├    ────B
     0.0 └──┘
    "
  `)

  c.flipX()

  // When we flip, the pins are renumbered to be CCW, but we don't change the
  // lines etc. so the netlist is actually changing a little
  expect(`\n${c.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0 
     1.0      U1
     0.8         ┌──┐
     0.6         │  │
     0.4 A───────┤1 │
     0.2     B───┤2 │
     0.0         └──┘
    "
  `)
})
