import { CircuitBuilder } from "lib/builder"
import { test, expect } from "bun:test"

test("repro2-netlist-shared-gnd", () => {
  const C = new CircuitBuilder()

  const U1 = C.chip("U1").leftpins(2).rightpins(2)

  U1.pin(1).line(-2, 0).line(0, 1).label("VCC")
  U1.pin(2).line(-2, 0).line(0, -1).label("GND")

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
    -0.8 G           G
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
              "netLabelId": "NL1",
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
              "boxId": "U1",
              "pinNumber": 2,
            },
            {
              "netId": "GND",
              "netLabelId": "NL2",
            },
            {
              "boxId": "U1",
              "pinNumber": 3,
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
