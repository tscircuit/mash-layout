import { circuit } from "lib/builder"
import { test, expect } from "bun:test"

test("lineAt with single dimension change", () => {
  const c = circuit()
  const chip = c.chip().rightpins(1)
  chip.pin(1).lineAt(3, 0).label("A")

  expect(`\n${c.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0      
     0.8 U1
     0.6 ┌────┐
     0.4 │    │
     0.2 │   1├┐
     0.0 └────┘A
    "
  `)
})

test("lineAt with two-dimensional movement from pin", () => {
  const c = circuit()
  const chip = c.chip().rightpins(1)
  // Pin faces horizontally, so should move horizontal first
  chip.pin(1).lineAt(3, 2).label("A")

  expect(`\n${c.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0      
     2.0       A
     1.8       │
     1.6       │
     1.4       │
     1.2       │
     1.0       │
     0.8 U1    │
     0.6 ┌────┐│
     0.4 │    ││
     0.2 │   1├┘
     0.0 └────┘
    "
  `)
})

test("lineAt with orthogonal movement after line", () => {
  const c = circuit()
  const chip = c.chip().rightpins(1)
  // First horizontal line, then lineAt should move vertical first to avoid overlap
  chip.pin(1).line(2, 0).lineAt(4, 2).label("A")

  expect(`\n${c.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0        
     2.0         A
     1.8         │
     1.6         │
     1.4         │
     1.2         │
     1.0         │
     0.8 U1      │
     0.6 ┌────┐  │
     0.4 │    │  │
     0.2 │   1├──┘
     0.0 └────┘
    "
  `)
})

test("intersectsAt functionality", () => {
  const c = circuit()
  const chip = c.chip().rightpins(2)
  chip.pin(1).lineAt(5, 0).label("A")
  chip.pin(2).intersectsAt(2, -1)

  expect(`\n${c.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0
     1.0 U1
     0.8 ┌────┐
     0.6 │    │
     0.4 │   2├
     0.2 │   1├────┐
     0.0 └────┘    A
    -0.2     │
    -0.4     │
    -0.6     │
    -0.8     │
    -1.0     ●
    "
  `)
})
