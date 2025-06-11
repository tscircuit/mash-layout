import { circuit } from "lib/builder"
import { test, expect } from "bun:test"

test("clone", () => {
  const C = circuit()
  const U1 = C.chip().leftpins(3).rightpins(3)

  U1.pin(6).line(4, 0).mark("m1").line(0, 2).label()
  U1.fromMark("m1").line(0, -2).passive().line(0, -2).label()

  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0     
     2.6               A
     2.4               │
     2.2               │
     2.0               │
     1.8               │
     1.6               │
     1.4               │
     1.2               │
     1.0 U1            │
     0.8 ┌─────┐       │
     0.6 ┤1   6├───────┤
     0.4 ┤2   5├       │
     0.2 ┤3   4├       │
     0.0 └─────┘       │
    -0.2               │
    -0.4               │
    -0.6               │
    -0.8               │
    -1.0               │
    -1.2               │
    -1.4               ┴
    -1.6
    -1.8               R2
    -2.0
    -2.2
    -2.4               ┬
    -2.6               │
    -2.8               │
    -3.0               │
    -3.2               │
    -3.4               │
    -3.6               │
    -3.8               │
    -4.0               │
    -4.2               │
    -4.4               B
    "
  `)

  const C2 = C.clone()

  expect(`\n${C2.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0     
     2.6               A
     2.4               │
     2.2               │
     2.0               │
     1.8               │
     1.6               │
     1.4               │
     1.2               │
     1.0 U1            │
     0.8 ┌─────┐       │
     0.6 ┤1   6├───────┤
     0.4 ┤2   5├       │
     0.2 ┤3   4├       │
     0.0 └─────┘       │
    -0.2               │
    -0.4               │
    -0.6               │
    -0.8               │
    -1.0               │
    -1.2               │
    -1.4               ┴
    -1.6
    -1.8               R2
    -2.0
    -2.2
    -2.4               ┬
    -2.6               │
    -2.8               │
    -3.0               │
    -3.2               │
    -3.4               │
    -3.6               │
    -3.8               │
    -4.0               │
    -4.2               │
    -4.4               B
    "
  `)
})
