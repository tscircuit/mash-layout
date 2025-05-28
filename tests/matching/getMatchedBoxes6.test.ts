import { test, expect } from "bun:test"
import { getMatchedBoxes } from "lib/matching/getMatchedBoxes"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"
import template7 from "templates/template7"

const inputNetlist = {
  boxes: [
    {
      boxId: "U1",
      leftPinCount: 3,
      rightPinCount: 3,
      topPinCount: 0,
      bottomPinCount: 0,
    },
    {
      boxId: "C3",
      leftPinCount: 0,
      rightPinCount: 0,
      topPinCount: 1,
      bottomPinCount: 1,
    },
    {
      boxId: "C4",
      leftPinCount: 0,
      rightPinCount: 0,
      topPinCount: 1,
      bottomPinCount: 1,
    },
    {
      boxId: "D1",
      leftPinCount: 0,
      rightPinCount: 0,
      topPinCount: 1,
      bottomPinCount: 1,
    },
    {
      boxId: "R5",
      leftPinCount: 0,
      rightPinCount: 0,
      topPinCount: 1,
      bottomPinCount: 1,
    },
    {
      boxId: "R6",
      leftPinCount: 0,
      rightPinCount: 0,
      topPinCount: 1,
      bottomPinCount: 1,
    },
    {
      boxId: "J2",
      leftPinCount: 2,
      rightPinCount: 0,
      topPinCount: 0,
      bottomPinCount: 0,
    },
  ],
  connections: [
    {
      _connectivityNetId: "connectivity_net13",
      connectedPorts: [
        {
          boxId: "U1",
          pinNumber: 1,
        },
        {
          boxId: "C3",
          pinNumber: 1,
        },
        {
          boxId: "D1",
          pinNumber: 1,
        },
        {
          netId: "connectivity_net13",
        },
      ],
    },
    {
      _connectivityNetId: "connectivity_net18",
      connectedPorts: [
        {
          boxId: "U1",
          pinNumber: 3,
        },
        {
          boxId: "R5",
          pinNumber: 1,
        },
        {
          netId: "connectivity_net18",
        },
      ],
    },
    {
      _connectivityNetId: "connectivity_net28",
      connectedPorts: [
        {
          boxId: "U1",
          pinNumber: 4,
        },
        {
          boxId: "C3",
          pinNumber: 2,
        },
        {
          boxId: "C4",
          pinNumber: 2,
        },
        {
          boxId: "R6",
          pinNumber: 2,
        },
        {
          boxId: "J2",
          pinNumber: 2,
        },
        {
          netId: "GND",
        },
      ],
    },
    {
      _connectivityNetId: "connectivity_net21",
      connectedPorts: [
        {
          boxId: "U1",
          pinNumber: 5,
        },
        {
          boxId: "R6",
          pinNumber: 1,
        },
        {
          netId: "connectivity_net21",
        },
      ],
    },
    {
      _connectivityNetId: "connectivity_net26",
      connectedPorts: [
        {
          boxId: "U1",
          pinNumber: 6,
        },
        {
          boxId: "C4",
          pinNumber: 1,
        },
        {
          boxId: "J2",
          pinNumber: 1,
        },
        {
          netId: "connectivity_net26",
        },
      ],
    },
    {
      _connectivityNetId: "connectivity_net50",
      connectedPorts: [
        {
          boxId: "U1",
          pinNumber: 2,
        },
      ],
    },
    {
      _connectivityNetId: "connectivity_net15",
      connectedPorts: [
        {
          boxId: "D1",
          pinNumber: 2,
        },
        {
          boxId: "R5",
          pinNumber: 2,
        },
        {
          netId: "connectivity_net15",
        },
      ],
    },
  ],
  nets: [
    {
      netId: "connectivity_net13",
    },
    {
      netId: "connectivity_net18",
    },
    {
      netId: "GND",
    },
    {
      netId: "connectivity_net21",
    },
    {
      netId: "connectivity_net26",
    },
    {
      netId: "connectivity_net15",
    },
  ],
}

test("getMatchedBoxes6", () => {
  const { normalizedNetlist: normalizedInputNetlist } =
    normalizeNetlist(inputNetlist)
  const { normalizedNetlist: normalizedTemplateNetlist } = normalizeNetlist(
    template7().getNetlist(),
  )

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
              "L0B1R0T1,L0B0R1T0,L0B1R0T1",
              "L0B0R1T0",
              "L0B1R0T1,L0B0R1T0,L0B1R0T1,L0B1R0T1,L2B0R0T0",
              "L0B1R0T1,L0B0R1T0",
              "L0B1R0T1,L0B0R1T0,L2B0R0T0",
            ],
            "side": "left",
            "targetBoxIndex": 0,
            "targetPinNumber": 3,
            "targetPinShapeSignature": "L0B1R0T1,L0B0R1T0",
            "type": "matched_box_missing_pin_shape_on_side",
          },
          {
            "candidateBoxIndex": 0,
            "candidateShapeSignatures": [
              "L0B1R0T1,L0B0R1T0,L0B1R0T1",
              "L0B0R1T0",
              "L0B1R0T1,L0B0R1T0,L0B1R0T1,L0B1R0T1,L2B0R0T0",
              "L0B1R0T1,L0B0R1T0",
              "L0B1R0T1,L0B0R1T0,L2B0R0T0",
            ],
            "side": "right",
            "targetBoxIndex": 0,
            "targetPinNumber": 4,
            "targetPinShapeSignature": "L0B1R0T1,L0B0R1T0,L0B1R0T1,L2B0R0T0",
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
              "L3B0R3T0,L0B0R1T0,L0B1R0T1",
            ],
            "side": "top",
            "targetBoxIndex": 2,
            "targetPinNumber": 2,
            "targetPinShapeSignature": "L3B0R3T0,L0B0R1T0",
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
              "L3B0R3T0,L0B0R1T0",
              "L3B0R3T0,L0B0R1T0,L0B1R0T1,L0B1R0T1,L2B0R0T0",
            ],
            "side": "bottom",
            "targetBoxIndex": 3,
            "targetPinNumber": 1,
            "targetPinShapeSignature": "L3B0R3T0,L0B0R1T0,L0B1R0T1,L2B0R0T0",
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
              "L3B0R3T0,L0B0R1T0,L2B0R0T0",
              "L3B0R3T0,L0B0R1T0,L0B1R0T1,L0B1R0T1,L2B0R0T0",
            ],
            "side": "bottom",
            "targetBoxIndex": 4,
            "targetPinNumber": 1,
            "targetPinShapeSignature": "L3B0R3T0,L0B0R1T0,L0B1R0T1,L2B0R0T0",
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
              "L3B0R3T0,L0B0R1T0,L0B1R0T1,L0B1R0T1,L0B1R0T1",
            ],
            "side": "left",
            "targetBoxIndex": 5,
            "targetPinNumber": 2,
            "targetPinShapeSignature": "L3B0R3T0,L0B0R1T0,L0B1R0T1,L0B1R0T1",
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
