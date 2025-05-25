import { test, expect } from "bun:test"
import template5 from "../templates/template5"

test("template5", () => {
  const C = template5()
  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0         10.0         
     1.0 U1                  U2
     0.8 ┌────────┐          ┌────────┐
     0.6 │        │          │        │
     0.4 ┤1      4├──────────┤1      2├
     0.2 ┤2      3├          └────────┘
     0.0 └────────┘
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
          "bottomPinCount": 0,
          "boxId": "U2",
          "leftPinCount": 1,
          "rightPinCount": 1,
          "topPinCount": 0,
        },
      ],
      "connections": [
        {
          "connectedPorts": [
            {
              "boxId": "U2",
              "pinNumber": 1,
            },
            {
              "boxId": "U1",
              "pinNumber": 4,
            },
          ],
        },
      ],
      "nets": [],
    }
  `)
})
