import { test, expect } from "bun:test"
import { testTscircuitCodeForLayout } from "tests/tscircuit/testTscircuitCodeForLayout"
import { corpus1Code } from "website/pages/corpus/corpus01.page"
import corpus1LayoutJson from "corpus/corpus2025-05-03-abcd1234.json"
import { circuitBuilderFromLayoutJson } from "lib/index"

test("corpus01 - template matching and basic structure", async () => {
  const templateFn = () =>
    circuitBuilderFromLayoutJson(corpus1LayoutJson as any)

  const { solver } = await testTscircuitCodeForLayout(corpus1Code, {
    templateFns: [templateFn],
  })

  expect(solver.getLayout()).toMatchInlineSnapshot(`
    {
      "boxes": [
        {
          "bottomPinCount": 0,
          "boxId": "U1",
          "centerX": -0.20000000000000018,
          "centerY": 2.5000000000000004,
          "leftPinCount": 2,
          "pins": [
            {
              "pinNumber": 1,
              "x": -1.6,
              "y": 2.5000000000000004,
            },
            {
              "pinNumber": 2,
              "x": -1.6,
              "y": 2.3000000000000003,
            },
            {
              "pinNumber": 3,
              "x": 1.1999999999999997,
              "y": 2.3000000000000003,
            },
            {
              "pinNumber": 4,
              "x": 1.1999999999999997,
              "y": 2.5000000000000004,
            },
          ],
          "rightPinCount": 2,
          "topPinCount": 0,
        },
        {
          "bottomPinCount": 0,
          "boxId": "P1",
          "centerX": -2.5000000000000004,
          "centerY": 1.2,
          "leftPinCount": 0,
          "pins": [],
          "rightPinCount": 0,
          "topPinCount": 0,
        },
      ],
      "junctions": [],
      "netLabels": [
        {
          "anchorPosition": "left",
          "netId": "NET2",
          "netLabelId": "NL2",
          "x": 1.2000000000000002,
          "y": 2.6,
        },
      ],
      "paths": [],
    }
  `)
})
