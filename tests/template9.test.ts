import { test, expect } from "bun:test"
import template9 from "../templates/template9"

test("template9", () => {
  const C = template9()
  expect(C.serialize()).toMatchInlineSnapshot(`
    {
      "chips": [
        {
          "bottomPinCount": 0,
          "bottomPins": [],
          "leftPinCount": 6,
          "leftPins": [
            {
              "pinNumber": 1,
              "x": 0,
              "y": 1.2000000000000002,
            },
            {
              "pinNumber": 2,
              "x": 0,
              "y": 1,
            },
            {
              "pinNumber": 3,
              "x": 0,
              "y": 0.8000000000000002,
            },
            {
              "pinNumber": 4,
              "x": 0,
              "y": 0.6,
            },
            {
              "pinNumber": 5,
              "x": 0,
              "y": 0.4,
            },
            {
              "pinNumber": 6,
              "x": 0,
              "y": 0.20000000000000007,
            },
          ],
          "marks": {
            "aboveC2": {
              "pinBuilder": {
                "pinNumber": 1,
                "x": 0,
                "y": 1.2000000000000002,
              },
              "state": {
                "lastConnected": null,
                "lastDx": -1,
                "lastDy": 0,
                "x": -1,
                "y": 1.2000000000000002,
              },
            },
            "rightOf7": {
              "pinBuilder": {
                "pinNumber": 7,
                "x": 2.8,
                "y": 0.20000000000000007,
              },
              "state": {
                "lastConnected": null,
                "lastDx": 0,
                "lastDy": 0.2,
                "x": 4.8,
                "y": 0.4000000000000001,
              },
            },
            "rightOfNCS": {
              "pinBuilder": {
                "pinNumber": 12,
                "x": 2.8,
                "y": 1.2000000000000002,
              },
              "state": {
                "lastConnected": null,
                "lastDx": 1,
                "lastDy": 0,
                "x": 3.8,
                "y": 1.2000000000000002,
              },
            },
          },
          "rightPinCount": 6,
          "rightPins": [
            {
              "pinNumber": 7,
              "x": 2.8,
              "y": 0.20000000000000007,
            },
            {
              "pinNumber": 8,
              "x": 2.8,
              "y": 0.4,
            },
            {
              "pinNumber": 9,
              "x": 2.8,
              "y": 0.6,
            },
            {
              "pinNumber": 10,
              "x": 2.8,
              "y": 0.8000000000000002,
            },
            {
              "pinNumber": 11,
              "x": 2.8,
              "y": 1,
            },
            {
              "pinNumber": 12,
              "x": 2.8,
              "y": 1.2000000000000002,
            },
          ],
          "topPinCount": 0,
          "topPins": [],
          "x": 0,
          "y": 0,
        },
        {
          "bottomPinCount": 1,
          "bottomPins": [
            {
              "pinNumber": 1,
              "x": -1,
              "y": 0.1990000000000003,
            },
          ],
          "leftPinCount": 0,
          "leftPins": [],
          "marks": {
            "GND1": {
              "pinBuilder": {
                "pinNumber": 1,
                "x": -1,
                "y": 0.1990000000000003,
              },
              "state": {
                "lastConnected": null,
                "lastDx": 0,
                "lastDy": -0.001,
                "x": -1,
                "y": 0.1980000000000003,
              },
            },
          },
          "rightPinCount": 0,
          "rightPins": [],
          "topPinCount": 1,
          "topPins": [
            {
              "pinNumber": 2,
              "x": -1,
              "y": 1.1990000000000003,
            },
          ],
          "x": -1,
          "y": 0.6990000000000003,
        },
        {
          "bottomPinCount": 1,
          "bottomPins": [
            {
              "pinNumber": 1,
              "x": 3.8,
              "y": 1.4000000000000001,
            },
          ],
          "leftPinCount": 0,
          "leftPins": [],
          "marks": {},
          "rightPinCount": 0,
          "rightPins": [],
          "topPinCount": 1,
          "topPins": [
            {
              "pinNumber": 2,
              "x": 3.8,
              "y": 2.4000000000000004,
            },
          ],
          "x": 3.8,
          "y": 1.9000000000000001,
        },
      ],
      "connectionPoints": [
        {
          "junctionId": "XX1",
          "pinRef": {
            "boxId": "U3",
            "pinNumber": 1,
          },
          "showAsIntersection": false,
          "x": -1,
          "y": 1.2000000000000002,
        },
        {
          "junctionId": "XX2",
          "pinRef": {
            "boxId": "C20",
            "pinNumber": 1,
          },
          "showAsIntersection": false,
          "x": -1,
          "y": 0.1980000000000003,
        },
        {
          "junctionId": "XX3",
          "pinRef": {
            "boxId": "U3",
            "pinNumber": 7,
          },
          "showAsIntersection": false,
          "x": 4.8,
          "y": 0.4000000000000001,
        },
        {
          "junctionId": "XX4",
          "pinRef": {
            "boxId": "U3",
            "pinNumber": 12,
          },
          "showAsIntersection": false,
          "x": 3.8,
          "y": 1.2000000000000002,
        },
      ],
      "lines": [
        {
          "end": {
            "ref": {
              "boxId": "U3",
              "pinNumber": 1,
            },
            "x": -1,
            "y": 1.2000000000000002,
          },
          "pathId": "PATH1",
          "start": {
            "ref": {
              "boxId": "U3",
              "pinNumber": 1,
            },
            "x": 0,
            "y": 1.2000000000000002,
          },
        },
        {
          "end": {
            "fromJunctionId": undefined,
            "ref": {
              "boxId": "C20",
              "pinNumber": 2,
            },
            "x": -1,
            "y": 1.1990000000000003,
          },
          "pathId": "PATH2",
          "start": {
            "fromJunctionId": "XX1",
            "ref": {
              "boxId": "U3",
              "pinNumber": 1,
            },
            "x": -1,
            "y": 1.2000000000000002,
          },
        },
        {
          "end": {
            "ref": {
              "boxId": "C20",
              "pinNumber": 1,
            },
            "x": -1,
            "y": 0.1980000000000003,
          },
          "pathId": "PATH3",
          "start": {
            "ref": {
              "boxId": "C20",
              "pinNumber": 1,
            },
            "x": -1,
            "y": 0.1990000000000003,
          },
        },
        {
          "end": {
            "fromJunctionId": undefined,
            "ref": {
              "netId": "GND",
              "netLabelId": "NL1",
            },
            "x": -1,
            "y": -0.0019999999999997242,
          },
          "pathId": "PATH4",
          "start": {
            "fromJunctionId": "XX2",
            "ref": {
              "boxId": "C20",
              "pinNumber": 1,
            },
            "x": -1,
            "y": 0.1980000000000003,
          },
        },
        {
          "end": {
            "fromJunctionId": undefined,
            "ref": {
              "netId": "V3_3",
              "netLabelId": "NL2",
            },
            "x": -1,
            "y": 1.4000000000000001,
          },
          "pathId": "PATH5",
          "start": {
            "fromJunctionId": "XX1",
            "ref": {
              "boxId": "U3",
              "pinNumber": 1,
            },
            "x": -1,
            "y": 1.2000000000000002,
          },
        },
        {
          "end": {
            "ref": {
              "boxId": "U3",
              "pinNumber": 6,
            },
            "x": -1,
            "y": 0.20000000000000007,
          },
          "pathId": "PATH6",
          "start": {
            "ref": {
              "boxId": "U3",
              "pinNumber": 6,
            },
            "x": 0,
            "y": 0.20000000000000007,
          },
        },
        {
          "end": {
            "fromJunctionId": "XX2",
            "ref": {
              "boxId": "U3",
              "pinNumber": 6,
            },
            "x": -1,
            "y": 0.1980000000000003,
          },
          "pathId": "PATH6",
          "start": {
            "ref": {
              "boxId": "U3",
              "pinNumber": 6,
            },
            "x": -1,
            "y": 0.20000000000000007,
          },
        },
        {
          "end": {
            "ref": {
              "boxId": "U3",
              "pinNumber": 7,
            },
            "x": 4.8,
            "y": 0.20000000000000007,
          },
          "pathId": "PATH7",
          "start": {
            "ref": {
              "boxId": "U3",
              "pinNumber": 7,
            },
            "x": 2.8,
            "y": 0.20000000000000007,
          },
        },
        {
          "end": {
            "ref": {
              "boxId": "U3",
              "pinNumber": 7,
            },
            "x": 4.8,
            "y": 0.4000000000000001,
          },
          "pathId": "PATH7",
          "start": {
            "ref": {
              "boxId": "U3",
              "pinNumber": 7,
            },
            "x": 4.8,
            "y": 0.20000000000000007,
          },
        },
        {
          "end": {
            "fromJunctionId": undefined,
            "ref": {
              "netId": "V3_3",
              "netLabelId": "NL3",
            },
            "x": 4.8,
            "y": 2.4,
          },
          "pathId": "PATH8",
          "start": {
            "fromJunctionId": "XX3",
            "ref": {
              "boxId": "U3",
              "pinNumber": 7,
            },
            "x": 4.8,
            "y": 0.4000000000000001,
          },
        },
        {
          "end": {
            "ref": {
              "boxId": "U3",
              "pinNumber": 8,
            },
            "x": 4.8,
            "y": 0.4,
          },
          "pathId": "PATH9",
          "start": {
            "ref": {
              "boxId": "U3",
              "pinNumber": 8,
            },
            "x": 2.8,
            "y": 0.4,
          },
        },
        {
          "end": {
            "fromJunctionId": "XX3",
            "ref": {
              "boxId": "U3",
              "pinNumber": 8,
            },
            "x": 4.8,
            "y": 0.4000000000000001,
          },
          "pathId": "PATH9",
          "start": {
            "ref": {
              "boxId": "U3",
              "pinNumber": 8,
            },
            "x": 4.8,
            "y": 0.4,
          },
        },
        {
          "end": {
            "fromJunctionId": undefined,
            "ref": {
              "netId": "A",
              "netLabelId": "NL4",
            },
            "x": 5.8,
            "y": 0.6,
          },
          "pathId": "PATH10",
          "start": {
            "ref": {
              "boxId": "U3",
              "pinNumber": 9,
            },
            "x": 2.8,
            "y": 0.6,
          },
        },
        {
          "end": {
            "fromJunctionId": undefined,
            "ref": {
              "netId": "B",
              "netLabelId": "NL5",
            },
            "x": 5.8,
            "y": 0.8000000000000002,
          },
          "pathId": "PATH11",
          "start": {
            "ref": {
              "boxId": "U3",
              "pinNumber": 10,
            },
            "x": 2.8,
            "y": 0.8000000000000002,
          },
        },
        {
          "end": {
            "fromJunctionId": undefined,
            "ref": {
              "netId": "C",
              "netLabelId": "NL6",
            },
            "x": 5.8,
            "y": 1,
          },
          "pathId": "PATH12",
          "start": {
            "ref": {
              "boxId": "U3",
              "pinNumber": 11,
            },
            "x": 2.8,
            "y": 1,
          },
        },
        {
          "end": {
            "ref": {
              "boxId": "U3",
              "pinNumber": 12,
            },
            "x": 3.8,
            "y": 1.2000000000000002,
          },
          "pathId": "PATH13",
          "start": {
            "ref": {
              "boxId": "U3",
              "pinNumber": 12,
            },
            "x": 2.8,
            "y": 1.2000000000000002,
          },
        },
        {
          "end": {
            "fromJunctionId": undefined,
            "ref": {
              "netId": "D",
              "netLabelId": "NL7",
            },
            "x": 5.8,
            "y": 1.2000000000000002,
          },
          "pathId": "PATH14",
          "start": {
            "fromJunctionId": "XX4",
            "ref": {
              "boxId": "U3",
              "pinNumber": 12,
            },
            "x": 3.8,
            "y": 1.2000000000000002,
          },
        },
        {
          "end": {
            "fromJunctionId": undefined,
            "ref": {
              "boxId": "R11",
              "pinNumber": 1,
            },
            "x": 3.8,
            "y": 1.4000000000000001,
          },
          "pathId": "PATH15",
          "start": {
            "fromJunctionId": "XX4",
            "ref": {
              "boxId": "U3",
              "pinNumber": 12,
            },
            "x": 3.8,
            "y": 1.2000000000000002,
          },
        },
        {
          "end": {
            "fromJunctionId": undefined,
            "ref": {
              "netId": "V3_3",
              "netLabelId": "NL8",
            },
            "x": 3.8,
            "y": 2.6000000000000005,
          },
          "pathId": "PATH16",
          "start": {
            "ref": {
              "boxId": "R11",
              "pinNumber": 2,
            },
            "x": 3.8,
            "y": 2.4000000000000004,
          },
        },
      ],
      "netLabels": [
        {
          "anchorSide": "top",
          "fromRef": {
            "boxId": "C20",
            "pinNumber": 1,
          },
          "netId": "GND",
          "netLabelId": "NL1",
          "x": -1,
          "y": -0.0019999999999997242,
        },
        {
          "anchorSide": "bottom",
          "fromRef": {
            "boxId": "U3",
            "pinNumber": 1,
          },
          "netId": "V3_3",
          "netLabelId": "NL2",
          "x": -1,
          "y": 1.4000000000000001,
        },
        {
          "anchorSide": "bottom",
          "fromRef": {
            "boxId": "U3",
            "pinNumber": 7,
          },
          "netId": "V3_3",
          "netLabelId": "NL3",
          "x": 4.8,
          "y": 2.4,
        },
        {
          "anchorSide": "left",
          "fromRef": {
            "boxId": "U3",
            "pinNumber": 9,
          },
          "netId": "A",
          "netLabelId": "NL4",
          "x": 5.8,
          "y": 0.6,
        },
        {
          "anchorSide": "left",
          "fromRef": {
            "boxId": "U3",
            "pinNumber": 10,
          },
          "netId": "B",
          "netLabelId": "NL5",
          "x": 5.8,
          "y": 0.8000000000000002,
        },
        {
          "anchorSide": "left",
          "fromRef": {
            "boxId": "U3",
            "pinNumber": 11,
          },
          "netId": "C",
          "netLabelId": "NL6",
          "x": 5.8,
          "y": 1,
        },
        {
          "anchorSide": "left",
          "fromRef": {
            "boxId": "U3",
            "pinNumber": 12,
          },
          "netId": "D",
          "netLabelId": "NL7",
          "x": 5.8,
          "y": 1.2000000000000002,
        },
        {
          "anchorSide": "bottom",
          "fromRef": {
            "boxId": "R11",
            "pinNumber": 2,
          },
          "netId": "V3_3",
          "netLabelId": "NL8",
          "x": 3.8,
          "y": 2.6000000000000005,
        },
      ],
      "paths": [
        {
          "pathId": "PATH1",
        },
        {
          "pathId": "PATH2",
        },
        {
          "pathId": "PATH3",
        },
        {
          "pathId": "PATH4",
        },
        {
          "pathId": "PATH5",
        },
        {
          "pathId": "PATH6",
        },
        {
          "pathId": "PATH7",
        },
        {
          "pathId": "PATH8",
        },
        {
          "pathId": "PATH9",
        },
        {
          "pathId": "PATH10",
        },
        {
          "pathId": "PATH11",
        },
        {
          "pathId": "PATH12",
        },
        {
          "pathId": "PATH13",
        },
        {
          "pathId": "PATH14",
        },
        {
          "pathId": "PATH15",
        },
        {
          "pathId": "PATH16",
        },
      ],
    }
  `)

  expect(
    C.chips.find((c) => c.chipId === "R11")!.serialize(),
  ).toMatchInlineSnapshot(`
    {
      "bottomPinCount": 1,
      "bottomPins": [
        {
          "pinNumber": 1,
          "x": 3.8,
          "y": 1.4000000000000001,
        },
      ],
      "leftPinCount": 0,
      "leftPins": [],
      "marks": {},
      "rightPinCount": 0,
      "rightPins": [],
      "topPinCount": 1,
      "topPins": [
        {
          "pinNumber": 2,
          "x": 3.8,
          "y": 2.4000000000000004,
        },
      ],
      "x": 3.8,
      "y": 1.9000000000000001,
    }
  `)
  expect(`\n${C.toString()}\n`).toMatchInlineSnapshot(`
    "
           0.0         5.0  
     2.6           V
     2.4           ┴ V
     2.2             │
     2.0           R1│
     1.8             │
     1.6   U3        │
     1.4 V ┌─────┐ ┬ │
     1.2 ┴─┤1  12├─┴─┼─D
     1.0   ┤2  11├───┼─C
     0.8   ┤3  10├───┼─B
     0.6 C2┤4   9├───┼─A
     0.4   ┤5   8├───┤
     0.2 ┬─┤6   7├───┘
     0.0 G └─────┘
    "
  `)
})
