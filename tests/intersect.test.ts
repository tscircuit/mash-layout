import { circuit } from "lib/builder"
import { test, expect } from "bun:test"

test(".intersect", () => {
  const c = circuit()
  const chip = c.chip().rightpins(2)
  chip.pin(1).line(4, 0).label("A")
  chip.pin(2).line(2, 0).line(0, -1).intersect()

  expect(`\n${c.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0  
     0.8 U1
     0.6 ┌────┐
     0.4 │   2├──┐
     0.2 │   1├──┼───A
     0.0 └────┘  │
    -0.2         │
    -0.4         │
    -0.6         ●
    "
  `)

  expect(c.getNetlist()).toMatchInlineSnapshot(`
    {
      "boxes": [
        {
          "bottomPinCount": 0,
          "boxId": "U1",
          "leftPinCount": 0,
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
              "netId": "A",
            },
          ],
        },
      ],
      "nets": [
        {
          "netId": "A",
        },
      ],
    }
  `)
})
