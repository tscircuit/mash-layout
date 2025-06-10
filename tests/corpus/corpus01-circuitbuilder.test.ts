import { test, expect } from "bun:test"
import { testTscircuitCodeForLayout } from "tests/tscircuit/testTscircuitCodeForLayout"
import { corpus1Code } from "website/pages/corpus/corpus01.page"
import corpus1LayoutJson from "corpus/corpus2025-05-03-abcd1234.json"
import { circuitBuilderFromLayoutJson } from "lib/index"
import { convertCircuitJsonToSchematicSvg } from "circuit-to-svg"
import { convertCircuitLayoutToGraphics } from "lib/utils/convertCircuitLayoutToGraphics"
import { getSvgFromGraphicsObject } from "graphics-debug"

test("corpus01 - template matching and basic structure", async () => {
  const circuitBuilder = circuitBuilderFromLayoutJson(corpus1LayoutJson as any)

  const graphics = convertCircuitLayoutToGraphics(
    circuitBuilder.getLayoutJson(),
  )

  expect(graphics).toMatchInlineSnapshot(`
    {
      "circles": [
        {
          "center": {
            "x": -1.6,
            "y": 2.6,
          },
          "fill": "red",
          "label": "Pin 1",
          "radius": 0.1,
        },
        {
          "center": {
            "x": -1.6,
            "y": 2.4000000000000004,
          },
          "fill": "red",
          "label": "Pin 2",
          "radius": 0.1,
        },
        {
          "center": {
            "x": 1.2000000000000002,
            "y": 2.6,
          },
          "fill": "red",
          "label": "Pin 3",
          "radius": 0.1,
        },
        {
          "center": {
            "x": 1.2000000000000002,
            "y": 2.4000000000000004,
          },
          "fill": "red",
          "label": "Pin 4",
          "radius": 0.1,
        },
        {
          "center": {
            "x": -3.2,
            "y": 1.2,
          },
          "fill": "red",
          "label": "Pin 1",
          "radius": 0.1,
        },
        {
          "center": {
            "x": -3.2,
            "y": 2.2,
          },
          "fill": "red",
          "label": "Pin 2",
          "radius": 0.1,
        },
      ],
      "coordinateSystem": "cartesian",
      "lines": [
        {
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
          "strokeColor": "black",
          "strokeWidth": 0.05,
        },
        {
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
          "strokeColor": "black",
          "strokeWidth": 0.05,
        },
        {
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
          "strokeColor": "black",
          "strokeWidth": 0.05,
        },
      ],
      "points": [
        {
          "color": "purple",
          "label": "NET1 (left)",
          "x": -3.2,
          "y": 0.4,
        },
        {
          "color": "purple",
          "label": "NET2 (left)",
          "x": 1.8,
          "y": 2.6,
        },
      ],
      "rects": [
        {
          "center": {
            "x": -0.20000000000000018,
            "y": 2.5000000000000004,
          },
          "fill": "lightblue",
          "height": 0.8,
          "label": "U1",
          "width": 2.8,
        },
        {
          "center": {
            "x": -3.2,
            "y": 1.7,
          },
          "fill": "lightblue",
          "height": 1,
          "label": "P1",
          "width": 0.2,
        },
      ],
      "title": "Circuit Layout Visualization",
    }
  `)

  expect(
    getSvgFromGraphicsObject(graphics, {
      backgroundColor: "white",
      includeTextLabels: true,
    }),
  ).toMatchSvgSnapshot(import.meta.path)
})
