import { test, expect } from "bun:test"
import template4 from "../templates/template4"

test("template4", () => {
  const C = template4()
  console.table(C.lines.map((l) => l.start))
  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0   
     2.6             A
     2.4             │
     2.2             │
     2.0             │
     1.8             │
     1.6             │
     1.4             │
     1.2 U1          │
     1.0 ┌────┐      │
     0.8 │    │      │
     0.6 │   3├──────┤
     0.4 │   2├──C   │
     0.2 │   1├┐     │
     0.0 └────┘│     │
    -0.2       │     │
    -0.4       │     │
    -0.6       │     │
    -0.8       │     │
    -1.0       │     │
    -1.2       │     │
    -1.4       │     ┴
    -1.6       │
    -1.8       D     R2
    -2.0
    -2.2
    -2.4             ┬
    -2.6             │
    -2.8             │
    -3.0             │
    -3.2             │
    -3.4             │
    -3.6             │
    -3.8             │
    -4.0             │
    -4.2             │
    -4.4             B
    "
  `)
  expect(C.getNetlist()).toMatchInlineSnapshot(`
    {
      "boxes": [
        {
          "bottomPinCount": 0,
          "boxId": "U1",
          "leftPinCount": 0,
          "rightPinCount": 3,
          "topPinCount": 0,
        },
        {
          "bottomPinCount": 1,
          "boxId": "R2",
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
              "pinNumber": 3,
            },
            {
              "netId": "A",
            },
            {
              "boxId": "R2",
              "pinNumber": 1,
            },
            {
              "netId": "B",
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
              "netId": "C",
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxId": "U1",
              "pinNumber": 1,
            },
            {
              "netId": "D",
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
      ],
    }
  `)
})
