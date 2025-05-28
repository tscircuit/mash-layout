import { test, expect } from "bun:test"
import { circuit } from "lib/builder"
import { getNetlistAsReadableTree } from "lib/netlist/getNetlistAsReadableTree"

test("template2", () => {
  const C = circuit()
  const U1 = C.chip().rightpins(7)

  U1.pin(7).line(2, 0).line(0, 2).label()
  U1.pin(6).line(3, 0).line(0, 1).line(2, 0).passive().line(3, 0).label()
  U1.pin(5).line(5, 0).passive().line(3, 0).label()
  U1.pin(4).line(6, 0).line(0, -4).passive().line(0, -2).label()
  U1.pin(3).line(3, 0).line(0, -3).passive().line(0, -2).label()
  U1.pin(2).line(1, 0).line(0, -4).label() // Default label "L"

  // Pin 7 connects to the horizontal segment of Pin 6's trace
  U1.pin(1).line(1, 0).intersect()

  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0         10.0
     3.4         A
     3.2         │
     3.0         │
     2.8         │
     2.6         │
     2.4         │
     2.2         │ ┌───R2────B
     2.0         │ │
     1.8 U1      │ │
     1.6 ┌────┐  │ │
     1.4 │   7├──┘ │
     1.2 │   6├────┘
     1.0 │   5├────────R3────C
     0.8 │   4├──────────┐
     0.6 │   3├────┐     │
     0.4 │   2├┐   │     │
     0.2 │   1├●   │     │
     0.0 └────┘│   │     │
    -0.2       │   │     │
    -0.4       │   │     │
    -0.6       │   │     │
    -0.8       │   │     │
    -1.0       │   │     │
    -1.2       │   │     │
    -1.4       │   │     │
    -1.6       │   │     │
    -1.8       │   │     │
    -2.0       │   │     │
    -2.2       │   │     │
    -2.4       │   ┴     │
    -2.6       │         │
    -2.8       │   R5    │
    -3.0       │         │
    -3.2       │         ┴
    -3.4       │   ┬
    -3.6       F   │     R4
    -3.8           │
    -4.0           │
    -4.2           │     ┬
    -4.4           │     │
    -4.6           │     │
    -4.8           │     │
    -5.0           │     │
    -5.2           │     │
    -5.4           E     │
    -5.6                 │
    -5.8                 │
    -6.0                 │
    -6.2                 D
    "
  `)
  expect(C.getNetlist()).toMatchInlineSnapshot(`
    {
      "boxes": [
        {
          "bottomPinCount": 0,
          "boxId": "U1",
          "leftPinCount": 0,
          "rightPinCount": 7,
          "topPinCount": 0,
        },
        {
          "bottomPinCount": 0,
          "boxId": "R2",
          "leftPinCount": 1,
          "rightPinCount": 1,
          "topPinCount": 0,
        },
        {
          "bottomPinCount": 0,
          "boxId": "R3",
          "leftPinCount": 1,
          "rightPinCount": 1,
          "topPinCount": 0,
        },
        {
          "bottomPinCount": 1,
          "boxId": "R4",
          "leftPinCount": 0,
          "rightPinCount": 0,
          "topPinCount": 1,
        },
        {
          "bottomPinCount": 1,
          "boxId": "R5",
          "leftPinCount": 0,
          "rightPinCount": 0,
          "topPinCount": 1,
        },
      ],
      "connections": [
        {
          "connectedPorts": [
            {
              "boxId": "U1",
              "pinNumber": 7,
            },
            {
              "netId": "A",
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxId": "R2",
              "pinNumber": 2,
            },
            {
              "netId": "B",
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxId": "R3",
              "pinNumber": 2,
            },
            {
              "netId": "C",
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxId": "R4",
              "pinNumber": 1,
            },
            {
              "netId": "D",
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxId": "R5",
              "pinNumber": 1,
            },
            {
              "netId": "E",
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxId": "U1",
              "pinNumber": 2,
            },
            {
              "netId": "F",
            },
            {
              "boxId": "U1",
              "pinNumber": 1,
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxId": "U1",
              "pinNumber": 6,
            },
            {
              "boxId": "R2",
              "pinNumber": 1,
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxId": "U1",
              "pinNumber": 5,
            },
            {
              "boxId": "R3",
              "pinNumber": 1,
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxId": "U1",
              "pinNumber": 4,
            },
            {
              "boxId": "R4",
              "pinNumber": 2,
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxId": "U1",
              "pinNumber": 3,
            },
            {
              "boxId": "R5",
              "pinNumber": 2,
            },
          ],
        },
      ],
      "nets": [
        {
          "netId": "A",
        },
        {
          "netId": "B",
        },
        {
          "netId": "C",
        },
        {
          "netId": "D",
        },
        {
          "netId": "E",
        },
        {
          "netId": "F",
        },
      ],
    }
  `)

  expect(getNetlistAsReadableTree(C.getNetlist())).toMatchInlineSnapshot(`
    "U1 (Box #0)
      pin1
        U1.pin2 (Box #0)
        F (Net #1)
      pin2
        F (Net #1)
        U1.pin1 (Box #0)
      pin3
        R5.pin2 (Box #2)
      pin4
        R4.pin2 (Box #4)
      pin5
        R3.pin1 (Box #6)
      pin6
        R2.pin1 (Box #8)
      pin7
        A (Net #10)
    R5 (Box #2)
      pin1
        E (Net #3)
      pin2
        U1.pin3 (Box #0)
    R4 (Box #4)
      pin1
        D (Net #5)
      pin2
        U1.pin4 (Box #0)
    R3 (Box #6)
      pin1
        U1.pin5 (Box #0)
      pin2
        C (Net #7)
    R2 (Box #8)
      pin1
        U1.pin6 (Box #0)
      pin2
        B (Net #9)"
  `)
})
