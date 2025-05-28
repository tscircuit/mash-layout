import { CircuitBuilder } from "lib/builder"
import { test, expect } from "bun:test"

test("repro3-top-pin-passive", () => {
  const C = new CircuitBuilder()

  const U1 = C.chip("U1").leftpins(2).rightpins(2)

  U1.pin(1).line(-2, 0).line(0, 1).label("VCC")
  U1.pin(2).line(-2, 0).line(0, -1).passive("R1").line(0, -0.2).label("GND")

  U1.pin(4).line(2, 0).line(0, 1).label("VCC")
  U1.pin(3).line(2, 0).line(0, -1).label("GND")

  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
             0.0        
     1.4 V           V
     1.2 │           │
     1.0 │           │
     0.8 │   U1      │
     0.6 │   ┌────┐  │
     0.4 └───┤1  4├──┘
     0.2 ┌───┤2  3├──┐
     0.0 │   └────┘  │
    -0.2 │           │
    -0.4 │           │
    -0.6 │           │
    -0.8 ┴           G
    -1.0
    -1.2 R1
    -1.4
    -1.6
    -1.8 ┬
    -2.0 G
    "
  `)

  expect(C.getNetlist()).toMatchInlineSnapshot(`
    {
      "boxes": [
        {
          "bottomPinCount": 0,
          "boxId": "U1",
          "leftPinCount": 2,
          "rightPinCount": 2,
          "topPinCount": 0,
        },
        {
          "bottomPinCount": 1,
          "boxId": "R1",
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
              "pinNumber": 1,
            },
            {
              "netId": "VCC",
            },
            {
              "boxId": "U1",
              "pinNumber": 4,
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxId": "R1",
              "pinNumber": 1,
            },
            {
              "netId": "GND",
            },
            {
              "boxId": "U1",
              "pinNumber": 3,
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
              "boxId": "R1",
              "pinNumber": 2,
            },
          ],
        },
      ],
      "nets": [
        {
          "netId": "VCC",
        },
        {
          "netId": "GND",
        },
      ],
    }
  `)
})
