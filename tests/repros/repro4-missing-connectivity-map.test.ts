import { test, expect } from "bun:test"
import { convertCircuitJsonToInputNetlist } from "lib/circuit-json/convertCircuitJsonToInputNetlist"

const circuitJson = [
  {
    type: "source_component",
    source_component_id: "sc0",
    ftype: "simple_chip",
    name: "U1",
    source_group_id: "g0",
  },
  {
    type: "source_port",
    source_port_id: "p1",
    pin_number: 1,
    name: "pin1",
    source_component_id: "sc0",
    subcircuit_id: "sub0",
  },
  {
    type: "source_port",
    source_port_id: "p2",
    pin_number: 2,
    name: "pin2",
    source_component_id: "sc0",
    subcircuit_id: "sub0",
  },
  {
    type: "schematic_component",
    schematic_component_id: "schc0",
    source_component_id: "sc0",
    center: { x: 0, y: 0 },
    rotation: 0,
    size: { width: 1, height: 1 },
    pin_spacing: 0.1,
    port_labels: {},
    schematic_group_id: "sg0",
  },
  {
    type: "schematic_port",
    schematic_port_id: "sp1",
    schematic_component_id: "schc0",
    source_port_id: "p1",
    center: { x: -0.1, y: 0 },
    facing_direction: "left",
    distance_from_component_edge: 0.2,
    side_of_component: "left",
    pin_number: 1,
    true_ccw_index: 0,
  },
  {
    type: "schematic_port",
    schematic_port_id: "sp2",
    schematic_component_id: "schc0",
    source_port_id: "p2",
    center: { x: 0.1, y: 0 },
    facing_direction: "right",
    distance_from_component_edge: 0.2,
    side_of_component: "right",
    pin_number: 2,
    true_ccw_index: 1,
  },
]

test("repro4-missing-connectivity-map", () => {
  const result = convertCircuitJsonToInputNetlist(circuitJson as any)
  expect(result).toMatchInlineSnapshot(`
    {
      "boxes": [
        {
          "bottomPinCount": 0,
          "boxId": "U1",
          "leftPinCount": 1,
          "rightPinCount": 1,
          "topPinCount": 0,
        },
      ],
      "connections": [],
      "nets": [],
    }
  `)
})
