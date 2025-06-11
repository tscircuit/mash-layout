import { test, expect } from "bun:test"
import { testTscircuitCodeForLayout } from "tests/tscircuit/testTscircuitCodeForLayout"
import { corpus1Code } from "website/pages/corpus/corpus01.page"
import corpus1LayoutJson from "corpus/corpus2025-05-03-abcd1234.json"
import { circuitBuilderFromLayoutJson } from "lib/index"
import { convertCircuitJsonToSchematicSvg } from "circuit-to-svg"

test("corpus01 - template matching and basic structure", async () => {
  const templateFn = () =>
    circuitBuilderFromLayoutJson(corpus1LayoutJson as any)

  const { solver, laidOutCircuitJson, adaptedTemplate, adaptedOperations } =
    await testTscircuitCodeForLayout(corpus1Code, {
      templateFns: [templateFn],
    })

  expect(adaptedOperations).toMatchInlineSnapshot(`[]`)

  expect(solver.getLayout()).toMatchInlineSnapshot(`
    {
      "boxes": [
        {
          "bottomPinCount": 0,
          "boxId": "U1",
          "centerX": 1.5999999999999999,
          "centerY": 0.9000000000000001,
          "leftPinCount": 2,
          "pins": [
            {
              "pinNumber": 1,
              "x": 0.2,
              "y": 1,
            },
            {
              "pinNumber": 2,
              "x": 0.2,
              "y": 0.8,
            },
            {
              "pinNumber": 3,
              "x": 3,
              "y": 0.8,
            },
            {
              "pinNumber": 4,
              "x": 3,
              "y": 1,
            },
          ],
          "rightPinCount": 2,
          "topPinCount": 0,
        },
        {
          "bottomPinCount": 1,
          "boxId": "R1",
          "centerX": -1.2000000000000002,
          "centerY": -0.30000000000000004,
          "leftPinCount": 0,
          "pins": [
            {
              "pinNumber": 1,
              "x": -1.2000000000000002,
              "y": -0.8,
            },
            {
              "pinNumber": 2,
              "x": -1.2000000000000002,
              "y": 0.19999999999999996,
            },
          ],
          "rightPinCount": 0,
          "topPinCount": 1,
        },
      ],
      "junctions": [],
      "netLabels": [
        {
          "anchorPosition": "top",
          "netId": "NET1",
          "netLabelId": "NL1",
          "x": -1.2000000000000002,
          "y": -1.2000000000000002,
        },
        {
          "anchorPosition": "left",
          "netId": "NET2",
          "netLabelId": "NL2",
          "x": 3.8000000000000003,
          "y": 1,
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
              "x": -1.2000000000000002,
              "y": 0.19999999999999996,
            },
            {
              "x": -1.2000000000000002,
              "y": 1,
            },
            {
              "x": -1.2000000000000002,
              "y": 1,
            },
            {
              "x": 0.19999999999999996,
              "y": 1,
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
              "x": -1.2000000000000002,
              "y": -0.8,
            },
            {
              "x": -1.2000000000000002,
              "y": -1.2000000000000002,
            },
          ],
          "to": {
            "netId": "NET1",
            "netLabelId": "netlabel-eaa8b88f-f9f9-452b-bbf6-c9318eb72225",
          },
        },
        {
          "from": {
            "boxId": "U1",
            "pinNumber": 4,
          },
          "points": [
            {
              "x": 3,
              "y": 1,
            },
            {
              "x": 3.8000000000000003,
              "y": 1,
            },
          ],
          "to": {
            "netId": "NET2",
            "netLabelId": "netlabel-1e260b94-3c7d-45f9-93fd-65f547ad4c1b",
          },
        },
      ],
    }
  `)

  expect(
    convertCircuitJsonToSchematicSvg(laidOutCircuitJson),
  ).toMatchSvgSnapshot(import.meta.path)
})
