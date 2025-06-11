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

  expect(circuitBuilder.toString()).toMatchInlineSnapshot(`
    "       0.0        
     1.4   U1
     1.2   ┌─────┐
     1.0 ┌─┤1   4├─N
     0.8 │ ┤2   3├
     0.6 │ └─────┘
     0.4 │
     0.2 ┴
     0.0
    -0.2
    -0.4 P1
    -0.6
    -0.8 ┬
    -1.0 │
    -1.2 N"
  `)

  expect(
    circuitBuilder.lines.map((l) => ({
      startX: l.start.x,
      startY: l.start.y,
      endX: l.end.x,
      endY: l.end.y,
      pathId: l.pathId,
    })),
  ).toMatchInlineSnapshot(`
    [
      {
        "endX": -1.2000000000000002,
        "endY": 1,
        "pathId": "PATH1",
        "startX": -1.2000000000000002,
        "startY": 0.19999999999999996,
      },
      {
        "endX": 0.19999999999999996,
        "endY": 1,
        "pathId": "PATH1",
        "startX": -1.2000000000000002,
        "startY": 1,
      },
      {
        "endX": -1.2000000000000002,
        "endY": -1.2000000000000002,
        "pathId": "PATH2",
        "startX": -1.2000000000000002,
        "startY": -0.8,
      },
      {
        "endX": 3.8000000000000003,
        "endY": 1,
        "pathId": "PATH3",
        "startX": 3,
        "startY": 1,
      },
    ]
  `)

  expect(graphics).toMatchInlineSnapshot(`
    {
      "circles": [
        {
          "center": {
            "x": 0.2,
            "y": 1,
          },
          "fill": "rgba(255,0,0,0.8)",
          "label": "Pin 1",
          "radius": 0.1,
        },
        {
          "center": {
            "x": 0.2,
            "y": 0.8,
          },
          "fill": "rgba(255,0,0,0.8)",
          "label": "Pin 2",
          "radius": 0.1,
        },
        {
          "center": {
            "x": 3,
            "y": 0.8,
          },
          "fill": "rgba(255,0,0,0.8)",
          "label": "Pin 3",
          "radius": 0.1,
        },
        {
          "center": {
            "x": 3,
            "y": 1,
          },
          "fill": "rgba(255,0,0,0.8)",
          "label": "Pin 4",
          "radius": 0.1,
        },
        {
          "center": {
            "x": -1.2000000000000002,
            "y": -0.8,
          },
          "fill": "rgba(255,0,0,0.8)",
          "label": "Pin 1",
          "radius": 0.1,
        },
        {
          "center": {
            "x": -1.2000000000000002,
            "y": 0.19999999999999996,
          },
          "fill": "rgba(255,0,0,0.8)",
          "label": "Pin 2",
          "radius": 0.1,
        },
      ],
      "coordinateSystem": "cartesian",
      "lines": [
        {
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
          "strokeColor": "rgba(0,0,0,0.8)",
          "strokeWidth": 0.05,
        },
        {
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
          "strokeColor": "rgba(0,0,0,0.8)",
          "strokeWidth": 0.05,
        },
        {
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
          "strokeColor": "rgba(0,0,0,0.8)",
          "strokeWidth": 0.05,
        },
      ],
      "points": [
        {
          "color": "rgba(128,0,128,0.8)",
          "label": "NET1 (top)",
          "x": -1.2000000000000002,
          "y": -1.2000000000000002,
        },
        {
          "color": "rgba(128,0,128,0.8)",
          "label": "NET2 (left)",
          "x": 3.8000000000000003,
          "y": 1,
        },
      ],
      "rects": [
        {
          "center": {
            "x": 1.5999999999999999,
            "y": 0.9000000000000001,
          },
          "fill": "rgba(173,216,230,0.8)",
          "height": 0.8,
          "label": "U1",
          "width": 2.8,
        },
        {
          "center": {
            "x": -1.2000000000000002,
            "y": -0.30000000000000004,
          },
          "fill": "rgba(173,216,230,0.8)",
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

  expect(circuitBuilder.toString()).toMatchInlineSnapshot(`
    "       0.0        
     1.4   U1
     1.2   ┌─────┐
     1.0 ┌─┤1   4├─N
     0.8 │ ┤2   3├
     0.6 │ └─────┘
     0.4 │
     0.2 ┴
     0.0
    -0.2
    -0.4 P1
    -0.6
    -0.8 ┬
    -1.0 │
    -1.2 N"
  `)
})
