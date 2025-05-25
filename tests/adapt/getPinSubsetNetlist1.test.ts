import { test, expect } from "bun:test"
import { getPinSubsetNetlist } from "lib/adapt/getPinSubsetNetlist"
import { CircuitBuilder } from "lib/builder"
import { getNetlistAsReadableTree } from "lib/netlist/getNetlistAsReadableTree"
import { getReadableNetlist } from "lib/netlist/getReadableNetlist"

test("getPinSubsetNetlist1", () => {
  const C = new CircuitBuilder()

  const U1 = C.chip().leftpins(2).rightpins(2)

  U1.pin(1).line(-2, 0).label()
  U1.pin(2).line(-2, 0).passive().line(-2, 0).label()
  U1.pin(3).line(2, 0).mark("m1").line(2, 0).passive().line(4, 0).label()
  U1.fromMark("m1").line(0, -2).label()
  U1.pin(4).line(6, 0).line(0, -1).intersect()

  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
                 0.0         5.0         10.0    
     0.8         U1
     0.6         ┌────────┐
     0.4     A───┤1      4├──────────┐
     0.2 B─R2────┤2      3├──┬───R3──┼───C
     0.0         └────────┘  │       │
    -0.2                     │       │
    -0.4                     │       │
    -0.6                     │       ●
    -0.8                     │
    -1.0                     │
    -1.2                     │
    -1.4                     │
    -1.6                     │
    -1.8                     D
    "
  `)

  expect(getReadableNetlist(C.getNetlist())).toMatchInlineSnapshot(`
    "Boxes:


                      ┌────────────────┐
               A ──  1│       U1       │4               
             ... ──  2│                │3  ── ...       
                      └────────────────┘


                      ┌────────────────┐
             ... ──  1│       R2       │2               
                      └────────────────┘


                      ┌────────────────┐
                     1│       R3       │2  ── ...       
                      └────────────────┘

    Complex Connections (more than 2 points):
      - Connection 1:
        - Box Pin: R2, Pin 1
        - Net: B
        - Box Pin: U1, Pin 2
      - Connection 2:
        - Box Pin: U1, Pin 3
        - Net: D
        - Box Pin: R3, Pin 2
        - Net: C"
  `)

  expect(getNetlistAsReadableTree(C.getNetlist())).toMatchInlineSnapshot(`
    "U1 (Box #0)
      pin1
        A (Net #1)
      pin2
        R2.pin1 (Box #3)
        B (Net #2)
      pin3
        D (Net #5)
        R3.pin2 (Box #6)
        C (Net #4)
      pin4
    R2 (Box #3)
      pin1
        B (Net #2)
        U1.pin2 (Box #0)
      pin2
    R3 (Box #6)
      pin1
      pin2
        U1.pin3 (Box #0)
        D (Net #5)
        C (Net #4)"
  `)

  expect(
    getPinSubsetNetlist({
      netlist: C.getNetlist(),
      chipId: "chip0",
      pinNumber: 1,
    }),
  ).toMatchInlineSnapshot(`
    {
      "boxes": [
        {
          "bottomPinCount": 0,
          "boxId": "chip0.pin1",
          "leftPinCount": 0,
          "rightPinCount": 1,
          "topPinCount": 0,
        },
      ],
      "connections": [],
      "nets": [],
    }
  `)

  expect(
    getPinSubsetNetlist({
      netlist: C.getNetlist(),
      chipId: "chip0",
      pinNumber: 2,
    }),
  ).toMatchInlineSnapshot(`
    {
      "boxes": [
        {
          "bottomPinCount": 0,
          "boxId": "chip0.pin2",
          "leftPinCount": 0,
          "rightPinCount": 1,
          "topPinCount": 0,
        },
      ],
      "connections": [],
      "nets": [],
    }
  `)

  expect(
    getPinSubsetNetlist({
      netlist: C.getNetlist(),
      chipId: "chip0",
      pinNumber: 3,
    }),
  ).toMatchInlineSnapshot(`
    {
      "boxes": [
        {
          "bottomPinCount": 0,
          "boxId": "chip0.pin3",
          "leftPinCount": 0,
          "rightPinCount": 1,
          "topPinCount": 0,
        },
      ],
      "connections": [],
      "nets": [],
    }
  `)

  expect(
    getPinSubsetNetlist({
      netlist: C.getNetlist(),
      chipId: "chip0",
      pinNumber: 4,
    }),
  ).toMatchInlineSnapshot(`
    {
      "boxes": [
        {
          "bottomPinCount": 0,
          "boxId": "chip0.pin4",
          "leftPinCount": 0,
          "rightPinCount": 1,
          "topPinCount": 0,
        },
      ],
      "connections": [],
      "nets": [],
    }
  `)
})
