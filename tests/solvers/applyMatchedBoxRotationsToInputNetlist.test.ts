import { test, expect } from "bun:test"
import { applyMatchedBoxRotationsToInputNetlist } from "lib/matching/matching-utils/applyMatchedBoxRotationsToInputNetlist"
import type { InputNetlist } from "lib/input-types"
import type { MatchedBox } from "lib/matching/types"

test("applyMatchedBoxRotationsToInputNetlist with 180 degree rotation", () => {
  const inputNetlist: InputNetlist = {
    boxes: [
      {
        boxId: "R1",
        leftPinCount: 1,
        rightPinCount: 1,
        topPinCount: 0,
        bottomPinCount: 0,
      },
    ],
    connections: [
      {
        connectedPorts: [
          { boxId: "R1", pinNumber: 1 }, // left pin
          { netId: "VCC" },
        ],
      },
      {
        connectedPorts: [
          { boxId: "R1", pinNumber: 2 }, // right pin
          { netId: "GND" },
        ],
      },
    ],
    nets: [{ netId: "VCC" }, { netId: "GND" }],
  }

  const matchedBoxes: MatchedBox[] = [
    {
      targetBoxIndex: 0,
      candidateBoxIndex: 0,
      issues: [],
      targetBoxRotationCcw: 180,
      score: 0,
    },
  ]

  const result = applyMatchedBoxRotationsToInputNetlist({
    inputNetlist,
    matchedBoxes,
  })

  expect(result).toMatchInlineSnapshot(`
{
  "boxes": [
    {
      "bottomPinCount": 0,
      "boxId": "R1",
      "leftPinCount": 1,
      "rightPinCount": 1,
      "topPinCount": 0,
    },
  ],
  "connections": [
    {
      "connectedPorts": [
        {
          "boxId": "R1",
          "pinNumber": 2,
        },
        {
          "netId": "VCC",
        },
      ],
    },
    {
      "connectedPorts": [
        {
          "boxId": "R1",
          "pinNumber": 1,
        },
        {
          "netId": "GND",
        },
      ],
    },
  ],
  "nets": [
    {
      "netId": "VCC",
    },
    {
      "netId": "GND",
    },
  ],
}
`)
})

test("applyMatchedBoxRotationsToInputNetlist with no rotation", () => {
  const inputNetlist: InputNetlist = {
    boxes: [
      {
        boxId: "R1",
        leftPinCount: 2,
        rightPinCount: 2,
        topPinCount: 0,
        bottomPinCount: 0,
      },
    ],
    connections: [
      {
        connectedPorts: [
          { boxId: "R1", pinNumber: 1 }, // left pin 1
          { netId: "VCC" },
        ],
      },
    ],
    nets: [{ netId: "VCC" }],
  }

  const matchedBoxes: MatchedBox[] = [
    {
      targetBoxIndex: 0,
      candidateBoxIndex: 0,
      issues: [],
      targetBoxRotationCcw: 0,
      score: 0,
    },
  ]

  const result = applyMatchedBoxRotationsToInputNetlist({
    inputNetlist,
    matchedBoxes,
  })

  // Should be unchanged
  expect(result).toEqual(inputNetlist)
})

test("applyMatchedBoxRotationsToInputNetlist with 90 degree rotation", () => {
  const inputNetlist: InputNetlist = {
    boxes: [
      {
        boxId: "U1",
        leftPinCount: 2,
        rightPinCount: 0,
        topPinCount: 1,
        bottomPinCount: 1,
      },
    ],
    connections: [
      {
        connectedPorts: [
          { boxId: "U1", pinNumber: 1 }, // left pin 1
          { netId: "A" },
        ],
      },
      {
        connectedPorts: [
          { boxId: "U1", pinNumber: 2 }, // left pin 2
          { netId: "B" },
        ],
      },
      {
        connectedPorts: [
          { boxId: "U1", pinNumber: 3 }, // bottom pin
          { netId: "C" },
        ],
      },
      {
        connectedPorts: [
          { boxId: "U1", pinNumber: 4 }, // top pin
          { netId: "D" },
        ],
      },
    ],
    nets: [{ netId: "A" }, { netId: "B" }, { netId: "C" }, { netId: "D" }],
  }

  const matchedBoxes: MatchedBox[] = [
    {
      targetBoxIndex: 0,
      candidateBoxIndex: 0,
      issues: [],
      targetBoxRotationCcw: 90,
      score: 0,
    },
  ]

  const result = applyMatchedBoxRotationsToInputNetlist({
    inputNetlist,
    matchedBoxes,
  })

  expect(result).toMatchInlineSnapshot(`
{
  "boxes": [
    {
      "bottomPinCount": 0,
      "boxId": "U1",
      "leftPinCount": 1,
      "rightPinCount": 1,
      "topPinCount": 2,
    },
  ],
  "connections": [
    {
      "connectedPorts": [
        {
          "boxId": "U1",
          "pinNumber": 4,
        },
        {
          "netId": "A",
        },
      ],
    },
    {
      "connectedPorts": [
        {
          "boxId": "U1",
          "pinNumber": 3,
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
          "pinNumber": 1,
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
          "pinNumber": 2,
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
