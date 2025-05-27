import { test, expect } from "bun:test"
import { getAsciiForNetlistBox } from "lib/matching/matching-utils/getAsciiForNetlistBox"
import type { InputNetlist } from "lib/input-types"
import type { NormalizationTransform } from "lib/scoring/normalizeNetlist"

test("getAsciiForNetlistBox - simple resistor with top and bottom pins", () => {
  const netlist: InputNetlist = {
    boxes: [
      {
        boxId: "R1",
        leftPinCount: 0,
        rightPinCount: 0,
        topPinCount: 1,
        bottomPinCount: 1,
      },
    ],
    connections: [],
    nets: [],
  }

  const transform: NormalizationTransform = {
    boxIdToBoxIndex: { R1: 0 },
    boxIndexToBoxId: { "0": "R1" },
    netIdToNetIndex: {},
    netIndexToNetId: {},
  }

  const result = getAsciiForNetlistBox(0, netlist, transform)

  expect(result.join("\n")).toMatchInlineSnapshot(`
    "           2
      ┌────────────────┐
      │       R1       │  
      └────────────────┘
               1"
  `)
})

test("getAsciiForNetlistBox - component with left and right pins", () => {
  const netlist: InputNetlist = {
    boxes: [
      {
        boxId: "U1",
        leftPinCount: 2,
        rightPinCount: 2,
        topPinCount: 0,
        bottomPinCount: 0,
      },
    ],
    connections: [],
    nets: [],
  }

  const transform: NormalizationTransform = {
    boxIdToBoxIndex: { U1: 0 },
    boxIndexToBoxId: { "0": "U1" },
    netIdToNetIndex: {},
    netIndexToNetId: {},
  }

  const result = getAsciiForNetlistBox(0, netlist, transform)

  expect(result.join("\n")).toMatchInlineSnapshot(`
    "  ┌────────────────┐
     1│       U1       │4 
     2│                │3 
      └────────────────┘"
  `)
})

test("getAsciiForNetlistBox - component with pins on all sides", () => {
  const netlist: InputNetlist = {
    boxes: [
      {
        boxId: "MCU",
        leftPinCount: 2,
        rightPinCount: 2,
        topPinCount: 2,
        bottomPinCount: 2,
      },
    ],
    connections: [],
    nets: [],
  }

  const transform: NormalizationTransform = {
    boxIdToBoxIndex: { MCU: 0 },
    boxIndexToBoxId: { "0": "MCU" },
    netIdToNetIndex: {},
    netIndexToNetId: {},
  }

  const result = getAsciiForNetlistBox(0, netlist, transform)

  expect(result.join("\n")).toMatchInlineSnapshot(`
    "          7 8
      ┌────────────────┐
     1│      MCU       │6 
     2│                │5 
      └────────────────┘
              3 4"
  `)
})

test("getAsciiForNetlistBox - long boxId gets truncated", () => {
  const netlist: InputNetlist = {
    boxes: [
      {
        boxId: "VeryLongComponentName",
        leftPinCount: 1,
        rightPinCount: 1,
        topPinCount: 0,
        bottomPinCount: 0,
      },
    ],
    connections: [],
    nets: [],
  }

  const transform: NormalizationTransform = {
    boxIdToBoxIndex: { VeryLongComponentName: 0 },
    boxIndexToBoxId: { "0": "VeryLongComponentName" },
    netIdToNetIndex: {},
    netIndexToNetId: {},
  }

  const result = getAsciiForNetlistBox(0, netlist, transform)

  expect(result.join("\n")).toMatchInlineSnapshot(`
    "  ┌────────────────┐
     1│ VeryLongCompo… │2 
      └────────────────┘"
  `)
})

test("getAsciiForNetlistBox - error cases", () => {
  const netlist: InputNetlist = {
    boxes: [
      {
        boxId: "R1",
        leftPinCount: 1,
        rightPinCount: 1,
        topPinCount: 0,
        bottomPinCount: 0,
      },
    ],
    connections: [],
    nets: [],
  }

  // Missing transform
  const result1 = getAsciiForNetlistBox(0, netlist, null as any)
  expect(result1).toEqual(["Box 0 (no transform)"])

  // Box index not found in transform
  const transform: NormalizationTransform = {
    boxIdToBoxIndex: { R1: 0 },
    boxIndexToBoxId: { "0": "R1" },
    netIdToNetIndex: {},
    netIndexToNetId: {},
  }
  const result2 = getAsciiForNetlistBox(99, netlist, transform)
  expect(result2).toEqual(["Box 99 (not found)"])

  // BoxId not found in netlist
  const transform2: NormalizationTransform = {
    boxIdToBoxIndex: { NonExistent: 0 },
    boxIndexToBoxId: { "0": "NonExistent" },
    netIdToNetIndex: {},
    netIndexToNetId: {},
  }
  const result3 = getAsciiForNetlistBox(0, netlist, transform2)
  expect(result3).toEqual(["Box NonExistent (not found)"])
})

test("getAsciiForNetlistBox - custom maxWidth", () => {
  const netlist: InputNetlist = {
    boxes: [
      {
        boxId: "R1",
        leftPinCount: 1,
        rightPinCount: 1,
        topPinCount: 0,
        bottomPinCount: 0,
      },
    ],
    connections: [],
    nets: [],
  }

  const transform: NormalizationTransform = {
    boxIdToBoxIndex: { R1: 0 },
    boxIndexToBoxId: { "0": "R1" },
    netIdToNetIndex: {},
    netIndexToNetId: {},
  }

  const result = getAsciiForNetlistBox(0, netlist, transform, 20)

  expect(result.join("\n")).toMatchInlineSnapshot(`
    "  ┌────────────────┐
     1│       R1       │2 
      └────────────────┘"
  `)
})
