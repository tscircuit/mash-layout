import { test, expect } from "bun:test"
import { circuit } from "lib/builder"
import { mergeCircuits } from "lib/expanding/mergeCircuits"

test("mergeCircuits2", () => {
  const T1 = circuit()
  const T1_U1 = T1.chip().leftpins(2)
  T1_U1.pin(1).line(-2, 0).label()
  T1_U1.pin(2).line(-2, 0).label()

  expect(`\n${T1.toString()}\n`).toMatchInlineSnapshot(`
    "
             0.0     
     0.8     U1
     0.6     ┌────┐
     0.4 A───┤1   │
     0.2 B───┤2   │
     0.0     └────┘
    "
  `)

  const T2 = circuit()
  const T2_U1 = T2.chip().rightpins(2)
  T2_U1.pin(1).line(2, 0).label()
  T2_U1.pin(2).line(2, 0).label()

  expect(`\n${T2.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0        
     0.8 U1
     0.6 ┌────┐
     0.4 │   2├──B
     0.2 │   1├──A
     0.0 └────┘
    "
  `)

  const merged = mergeCircuits({
    circuit1: T1,
    circuit2: T2,
    circuit1ChipId: T1_U1.chipId,
    circuit2ChipId: T2_U1.chipId,
  })

  expect(`\n${merged.toString()}\n`).toMatchInlineSnapshot(`
    "
             0.0        
     0.8     U1
     0.6     ┌─────┐
     0.4 A───┤1   4├─B
     0.2 B───┤2   3├─A
     0.0     └─────┘
    "
  `)
})
