import { test, expect } from "bun:test"
import { getMatchedBoxes } from "lib/matching/getMatchedBoxes"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"
import template7 from "templates/template7"
import { getNetlistFromTscircuitCode } from "tests/tscircuit/getNetlistFromTscircuitCode"
import { pipeline04Code } from "website/pages/pipeline/pipeline04.page"

test("getMatchedBoxes6", async () => {
  const { normalizedNetlist: normalizedInputNetlist } = normalizeNetlist(
    await getNetlistFromTscircuitCode(pipeline04Code),
  )
  const { normalizedNetlist: normalizedTemplateNetlist } = normalizeNetlist(
    template7().getNetlist(),
  )

  expect(normalizedInputNetlist).toMatchInlineSnapshot(`
    {
      "boxes": [
        {
          "bottomPinCount": 0,
          "boxIndex": 0,
          "leftPinCount": 3,
          "rightPinCount": 3,
          "topPinCount": 0,
        },
        {
          "bottomPinCount": 1,
          "boxIndex": 1,
          "leftPinCount": 0,
          "rightPinCount": 0,
          "topPinCount": 1,
        },
        {
          "bottomPinCount": 1,
          "boxIndex": 2,
          "leftPinCount": 0,
          "rightPinCount": 0,
          "topPinCount": 1,
        },
        {
          "bottomPinCount": 1,
          "boxIndex": 3,
          "leftPinCount": 0,
          "rightPinCount": 0,
          "topPinCount": 1,
        },
        {
          "bottomPinCount": 1,
          "boxIndex": 4,
          "leftPinCount": 0,
          "rightPinCount": 0,
          "topPinCount": 1,
        },
        {
          "bottomPinCount": 1,
          "boxIndex": 5,
          "leftPinCount": 0,
          "rightPinCount": 0,
          "topPinCount": 1,
        },
        {
          "bottomPinCount": 0,
          "boxIndex": 6,
          "leftPinCount": 2,
          "rightPinCount": 0,
          "topPinCount": 0,
        },
      ],
      "connections": [
        {
          "connectedPorts": [
            {
              "boxIndex": 0,
              "pinNumber": 1,
            },
            {
              "boxIndex": 1,
              "pinNumber": 1,
            },
            {
              "boxIndex": 2,
              "pinNumber": 1,
            },
            {
              "netIndex": 0,
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxIndex": 0,
              "pinNumber": 2,
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxIndex": 0,
              "pinNumber": 3,
            },
            {
              "boxIndex": 3,
              "pinNumber": 1,
            },
            {
              "netIndex": 2,
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxIndex": 0,
              "pinNumber": 4,
            },
            {
              "boxIndex": 1,
              "pinNumber": 2,
            },
            {
              "boxIndex": 4,
              "pinNumber": 2,
            },
            {
              "boxIndex": 5,
              "pinNumber": 2,
            },
            {
              "boxIndex": 6,
              "pinNumber": 2,
            },
            {
              "netIndex": 3,
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxIndex": 0,
              "pinNumber": 5,
            },
            {
              "boxIndex": 5,
              "pinNumber": 1,
            },
            {
              "netIndex": 5,
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxIndex": 0,
              "pinNumber": 6,
            },
            {
              "boxIndex": 4,
              "pinNumber": 1,
            },
            {
              "boxIndex": 6,
              "pinNumber": 1,
            },
            {
              "netIndex": 4,
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxIndex": 2,
              "pinNumber": 2,
            },
            {
              "boxIndex": 3,
              "pinNumber": 2,
            },
            {
              "netIndex": 1,
            },
          ],
        },
      ],
      "nets": [
        {
          "netIndex": 0,
        },
        {
          "netIndex": 1,
        },
        {
          "netIndex": 2,
        },
        {
          "netIndex": 3,
        },
        {
          "netIndex": 4,
        },
        {
          "netIndex": 5,
        },
      ],
    }
  `)
  expect(normalizedTemplateNetlist).toMatchInlineSnapshot(`
    {
      "boxes": [
        {
          "bottomPinCount": 0,
          "boxIndex": 0,
          "leftPinCount": 3,
          "rightPinCount": 3,
          "topPinCount": 0,
        },
        {
          "bottomPinCount": 1,
          "boxIndex": 1,
          "leftPinCount": 0,
          "rightPinCount": 0,
          "topPinCount": 1,
        },
        {
          "bottomPinCount": 1,
          "boxIndex": 2,
          "leftPinCount": 0,
          "rightPinCount": 0,
          "topPinCount": 1,
        },
        {
          "bottomPinCount": 1,
          "boxIndex": 3,
          "leftPinCount": 0,
          "rightPinCount": 0,
          "topPinCount": 1,
        },
        {
          "bottomPinCount": 1,
          "boxIndex": 4,
          "leftPinCount": 0,
          "rightPinCount": 0,
          "topPinCount": 1,
        },
        {
          "bottomPinCount": 0,
          "boxIndex": 5,
          "leftPinCount": 2,
          "rightPinCount": 0,
          "topPinCount": 0,
        },
      ],
      "connections": [
        {
          "connectedPorts": [
            {
              "boxIndex": 0,
              "pinNumber": 1,
            },
            {
              "boxIndex": 1,
              "pinNumber": 2,
            },
            {
              "netIndex": 0,
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxIndex": 0,
              "pinNumber": 3,
            },
            {
              "boxIndex": 2,
              "pinNumber": 2,
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxIndex": 0,
              "pinNumber": 4,
            },
            {
              "boxIndex": 3,
              "pinNumber": 1,
            },
            {
              "boxIndex": 4,
              "pinNumber": 1,
            },
            {
              "boxIndex": 5,
              "pinNumber": 2,
            },
            {
              "netIndex": 1,
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxIndex": 0,
              "pinNumber": 5,
            },
            {
              "boxIndex": 3,
              "pinNumber": 2,
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxIndex": 0,
              "pinNumber": 6,
            },
            {
              "boxIndex": 4,
              "pinNumber": 2,
            },
            {
              "boxIndex": 5,
              "pinNumber": 1,
            },
            {
              "netIndex": 2,
            },
          ],
        },
        {
          "connectedPorts": [
            {
              "boxIndex": 1,
              "pinNumber": 1,
            },
            {
              "boxIndex": 2,
              "pinNumber": 1,
            },
          ],
        },
      ],
      "nets": [
        {
          "netIndex": 0,
        },
        {
          "netIndex": 1,
        },
        {
          "netIndex": 2,
        },
      ],
    }
  `)

  expect(
    getMatchedBoxes({
      candidateNetlist: normalizedInputNetlist,
      targetNetlist: normalizedTemplateNetlist,
    }),
  ).toMatchInlineSnapshot(`
    [
      {
        "candidateBoxIndex": 0,
        "issues": [
          {
            "candidateBoxIndex": 0,
            "candidateShapeSignatures": [
              "B1T1,R1,B1T1",
              "R1",
              "B1T1,R1,B1T1,B1T1,L2",
              "B1T1,R1",
              "B1T1,R1,L2",
            ],
            "side": "left",
            "targetBoxIndex": 0,
            "targetPinNumber": 3,
            "targetPinShapeSignature": "B1T1,R1",
            "type": "matched_box_missing_pin_shape_on_side",
          },
          {
            "candidateBoxIndex": 0,
            "candidateShapeSignatures": [
              "B1T1,R1,B1T1",
              "R1",
              "B1T1,R1,B1T1,B1T1,L2",
              "B1T1,R1",
              "B1T1,R1,L2",
            ],
            "side": "right",
            "targetBoxIndex": 0,
            "targetPinNumber": 4,
            "targetPinShapeSignature": "B1T1,R1,B1T1,L2",
            "type": "matched_box_missing_pin_shape_on_side",
          },
        ],
        "score": 2,
        "targetBoxIndex": 0,
        "targetBoxRotationCcw": 0,
      },
      {
        "candidateBoxIndex": 3,
        "issues": [],
        "score": 0,
        "targetBoxIndex": 1,
        "targetBoxRotationCcw": 0,
      },
      {
        "candidateBoxIndex": 2,
        "issues": [
          {
            "candidateBoxIndex": 2,
            "candidateShapeSignatures": [
              "L3R3,R1,B1T1",
            ],
            "side": "top",
            "targetBoxIndex": 2,
            "targetPinNumber": 2,
            "targetPinShapeSignature": "L3R3,R1",
            "type": "matched_box_missing_pin_shape_on_side",
          },
        ],
        "score": 1,
        "targetBoxIndex": 2,
        "targetBoxRotationCcw": 0,
      },
      {
        "candidateBoxIndex": 5,
        "issues": [
          {
            "candidateBoxIndex": 5,
            "candidateShapeSignatures": [
              "L3R3,R1",
              "L3R3,R1,B1T1,B1T1,L2",
            ],
            "side": "bottom",
            "targetBoxIndex": 3,
            "targetPinNumber": 1,
            "targetPinShapeSignature": "L3R3,R1,B1T1,L2",
            "type": "matched_box_missing_pin_shape_on_side",
          },
        ],
        "score": 1,
        "targetBoxIndex": 3,
        "targetBoxRotationCcw": 0,
      },
      {
        "candidateBoxIndex": 4,
        "issues": [
          {
            "candidateBoxIndex": 4,
            "candidateShapeSignatures": [
              "L3R3,R1,L2",
              "L3R3,R1,B1T1,B1T1,L2",
            ],
            "side": "bottom",
            "targetBoxIndex": 4,
            "targetPinNumber": 1,
            "targetPinShapeSignature": "L3R3,R1,B1T1,L2",
            "type": "matched_box_missing_pin_shape_on_side",
          },
        ],
        "score": 1,
        "targetBoxIndex": 4,
        "targetBoxRotationCcw": 0,
      },
      {
        "candidateBoxIndex": 6,
        "issues": [
          {
            "candidateBoxIndex": 6,
            "candidateShapeSignatures": [
              "L3R3,R1,B1T1,B1T1,B1T1",
            ],
            "side": "left",
            "targetBoxIndex": 5,
            "targetPinNumber": 2,
            "targetPinShapeSignature": "L3R3,R1,B1T1,B1T1",
            "type": "matched_box_missing_pin_shape_on_side",
          },
        ],
        "score": 1,
        "targetBoxIndex": 5,
        "targetBoxRotationCcw": 0,
      },
    ]
  `)
})
