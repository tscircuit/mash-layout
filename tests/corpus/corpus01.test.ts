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
        {
          "bottomPinCount": 0,
          "boxId": "U1",
          "centerX": -0.0000000000000002220446049250313,
          "centerY": 2.5,
          "leftPinCount": 2,
          "pins": [
            {
              "pinNumber": 1,
              "x": -1.4000000000000001,
              "y": 2.6,
            },
            {
              "pinNumber": 2,
              "x": -1.4000000000000001,
              "y": 2.4000000000000004,
            },
            {
              "pinNumber": 3,
              "x": 1.4000000000000001,
              "y": 2.6,
            },
            {
              "pinNumber": 4,
              "x": 1.4000000000000001,
              "y": 2.4000000000000004,
            },
          ],
          "rightPinCount": 2,
          "topPinCount": 0,
        },
      ],
      "junctions": [],
      "netLabels": [
        {
          "anchorPosition": "top",
          "netId": "NET1",
          "netLabelId": "NL1",
          "x": -3.2,
          "y": 0.4,
        },
        {
          "anchorPosition": "left",
          "netId": "NET2",
          "netLabelId": "NL2",
          "x": 3,
          "y": 2.6,
        },
      ],
      "paths": [
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
            "netLabelId": "loaded-nl-f52e651d-5a7a-4fc5-beb7-f94e64093efa-0",
          },
        },
        {
          "from": {
            "boxId": "U1",
            "pinNumber": 3,
          },
          "points": [
            {
              "x": 1.4000000000000001,
              "y": 2.6,
            },
            {
              "x": 3,
              "y": 2.6,
            },
          ],
          "to": {
            "netId": "NET2",
            "netLabelId": "loaded-nl-42be119e-1250-46ea-a62d-61f14a37ba8d-1",
          },
        },
        {
          "from": {
            "boxId": "U1",
            "pinNumber": 1,
          },
          "points": [
            {
              "x": -1.4000000000000001,
              "y": 2.6,
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
              "x": -3.2,
              "y": 2.2,
            },
          ],
          "to": {
            "boxId": "R1",
            "pinNumber": 2,
          },
        },
      ],
    }
  `)

  expect(
    convertCircuitJsonToSchematicSvg(laidOutCircuitJson),
  ).toMatchSvgSnapshot(import.meta.path)
})
