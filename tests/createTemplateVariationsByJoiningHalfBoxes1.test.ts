import { test, expect } from "bun:test"
import { circuit } from "lib/builder"
import { createTemplateVariationsByJoiningHalfBoxes } from "lib/expanding/createTemplateVariationsByJoiningHalfBoxes"

test("createTemplateVariationsByJoiningHalfBoxes1", () => {
  const T1 = circuit()

  const T1_U1 = T1.chip().leftpins(2)
  T1_U1.pin(1).line(-2, 0).label()
  T1_U1.pin(2).line(-2, 0).label()

  const T2 = circuit()

  const T2_U1 = T2.chip().rightpins(2)
  T2_U1.pin(2).line(2, 0).line(0, -2).label()

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
  expect(`\n${T2.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0        
     0.8 U1
     0.6 ┌────┐
     0.4 │   2├──┐
     0.2 │   1├  │
     0.0 └────┘  │
    -0.2         │
    -0.4         │
    -0.6         │
    -0.8         │
    -1.0         │
    -1.2         │
    -1.4         │
    -1.6         A
    "
  `)

  const T1_flipped = T1.clone().flipX()

  expect(`\n${T1_flipped.toString()}\n`).toMatchInlineSnapshot(`
    "
             0.0        
     0.8 U1
     0.6 ┌────┐
     0.4 │   2├  ────A
     0.2 │   1├  ────B
     0.0 └────┘
    "
  `)

  const variations = createTemplateVariationsByJoiningHalfBoxes(T1, [
    T2,
    T1_flipped,
  ])
  expect(variations.length).toBe(2)
  expect(`\n${variations[0]!.toString()}\n`).toMatchInlineSnapshot(`
    "
             0.0         
     0.8     U1
     0.6     ┌────────┐
     0.4 A───┤1      4├
     0.2 B───┤2      3├
     0.0     └────────┘
    -0.2             │
    -0.4             │
    -0.6             │
    -0.8             │
    -1.0             │
    -1.2             │
    -1.4             │
    -1.6             A
    "
  `)
  expect(`\n${variations[1]!.toString()}\n`).toMatchInlineSnapshot(`
    "
                 0.0        
     0.8     U1
     0.6     ┌────────┐
     0.4 A───┤1      4├──A
     0.2 B───┤2      3├──B
     0.0     └────────┘
    "
  `)
})
