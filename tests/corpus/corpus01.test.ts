import { test, expect } from "bun:test"
import { testTscircuitCodeForLayout } from "tests/tscircuit/testTscircuitCodeForLayout"
import { corpus1Code } from "website/pages/corpus/corpus01.page"
import corpus1LayoutJson from "corpus/corpus2025-05-03-abcd1234.json"
import { circuitBuilderFromLayoutJson } from "lib/index"
import { convertCircuitJsonToSchematicSvg } from "circuit-to-svg"

test("corpus01 - template matching and basic structure", async () => {
  const templateFn = () =>
    circuitBuilderFromLayoutJson(corpus1LayoutJson as any)

  const { solver, laidOutCircuitJson } = await testTscircuitCodeForLayout(
    corpus1Code,
    {
      templateFns: [templateFn],
    },
  )

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
              "y": 2.6,
            },
            {
              "pinNumber": 2,
              "x": -1.6,
              "y": 2.4000000000000004,
            },
            {
              "pinNumber": 3,
              "x": 1.2000000000000002,
              "y": 2.6,
            },
            {
              "pinNumber": 4,
              "x": 1.2000000000000002,
              "y": 2.4000000000000004,
            },
          ],
          "rightPinCount": 2,
          "topPinCount": 0,
        },
        {
          "bottomPinCount": 1,
          "boxId": "R1",
          "centerX": -3.2,
          "centerY": 1.7,
          "leftPinCount": 0,
          "pins": [
            {
              "pinNumber": 1,
              "x": -3.2,
              "y": 1.2,
            },
            {
              "pinNumber": 2,
              "x": -3.2,
              "y": 2.2,
            },
          ],
          "rightPinCount": 0,
          "topPinCount": 1,
        },
      ],
      "junctions": [],
      "netLabels": [
        {
          "anchorPosition": "left",
          "netId": "NET1",
          "netLabelId": "NL1",
          "x": -3.2,
          "y": 0.4,
        },
        {
          "anchorPosition": "left",
          "netId": "NET2",
          "netLabelId": "NL2",
          "x": 1.8,
          "y": 2.6,
        },
      ],
      "paths": [
        {
          "from": {
            "boxId": "R1",
            "pinNumber": 2,
          },
          "points": [
            {
              "x": -3.2,
              "y": 2.2,
            },
            {
              "x": -3.2,
              "y": 2.6,
            },
            {
              "x": -3.2,
              "y": 2.6,
            },
            {
              "x": -2.4000000000000004,
              "y": 2.6,
            },
            {
              "x": -2.4000000000000004,
              "y": 2.6,
            },
            {
              "x": -1.6,
              "y": 2.6,
            },
          ],
          "to": {
            "boxId": "U1",
            "pinNumber": 1,
          },
        },
        {
          "from": {
            "boxId": "R1",
            "pinNumber": 1,
          },
          "points": [
            {
              "x": -3.2,
              "y": 1.2,
            },
            {
              "x": -3.2,
              "y": 0.4,
            },
          ],
          "to": {
            "netId": "NET1",
            "netLabelId": "loaded-nl-e89d34ed-c264-4102-a8d1-c9610c6261a7-0",
          },
        },
        {
          "from": {
            "boxId": "U1",
            "pinNumber": 1,
          },
          "points": [
            {
              "x": -1.6,
              "y": 2.6,
            },
            {
              "x": 1.8000000000000003,
              "y": 2.6,
            },
          ],
          "to": {
            "netId": "NET2",
            "netLabelId": "loaded-nl-ec21e938-ff10-44b0-9667-1b414aff2a1e-1",
          },
        },
      ],
    }
  `)

  expect(
    convertCircuitJsonToSchematicSvg(laidOutCircuitJson),
  ).toMatchSvgSnapshot(import.meta.path)
})
