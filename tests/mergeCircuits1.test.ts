import { test, expect } from "bun:test"
import { CircuitBuilder } from "lib/builder"
import { mergeCircuits } from "lib/expanding/mergeCircuits"

test("mergeCircuits1", () => {
  const C1 = new CircuitBuilder()
  const U1 = C1.chip().rightpins(2)
  U1.pin(1).line(4, 0).label()
  U1.pin(2).line(4, 0).label()

  const C2 = new CircuitBuilder()
  const U2 = C2.chip().leftpins(2)
  U2.pin(1).line(-8, 0).line(0, -2).passive().line(0, -2).label()
  U2.pin(2).line(-3, 0).line(0, -2).label()

  expect(`\n${C1.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0  
     0.8 U1
     0.6 ┌────┐
     0.4 │   2├──────B
     0.2 │   1├──────A
     0.0 └────┘
    "
  `)
  expect(`\n${C2.toString()}\n`).toMatchInlineSnapshot(`
    "
               -5.0         0.0     
     0.8                 U1
     0.6                 ┌────┐
     0.4 ┌───────────────┤1   │
     0.2 │         ┌─────┤2   │
     0.0 │         │     └────┘
    -0.2 │         │
    -0.4 │         │
    -0.6 │         │
    -0.8 │         │
    -1.0 │         │
    -1.2 │         │
    -1.4 │         │
    -1.6 ┴         │
    -1.8           B
    -2.0 R2
    -2.2
    -2.4
    -2.6 ┬
    -2.8 │
    -3.0 │
    -3.2 │
    -3.4 │
    -3.6 │
    -3.8 │
    -4.0 │
    -4.2 │
    -4.4 │
    -4.6 A
    "
  `)

  const mergedCircuit = mergeCircuits({
    circuit1: C1,
    circuit2: C2,
    circuit1ChipId: U1.chipId,
    circuit2ChipId: U2.chipId,
  })

  expect(`\n${mergedCircuit.toString()}\n`).toMatchInlineSnapshot(`
    "
               -5.0         0.0         5.0  
     0.8                 U1
     0.6                 ┌─────┐
     0.4 ┌───────────────┤1   4├─────B
     0.2 │         ┌─────┤2   3├─────A
     0.0 │         │     └─────┘
    -0.2 │         │
    -0.4 │         │
    -0.6 │         │
    -0.8 │         │
    -1.0 │         │
    -1.2 │         │
    -1.4 │         │
    -1.6 ┴         │
    -1.8           B
    -2.0 R2
    -2.2
    -2.4
    -2.6 ┬
    -2.8 │
    -3.0 │
    -3.2 │
    -3.4 │
    -3.6 │
    -3.8 │
    -4.0 │
    -4.2 │
    -4.4 │
    -4.6 A
    "
  `)
})
