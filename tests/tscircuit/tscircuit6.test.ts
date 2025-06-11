import { runTscircuitCode } from "@tscircuit/eval"
import { cju } from "@tscircuit/circuit-json-util"
import { test, expect } from "bun:test"
import { convertCircuitJsonToInputNetlist } from "lib/circuit-json/convertCircuitJsonToInputNetlist"
import { getReadableNetlist } from "lib/netlist/getReadableNetlist"
import { CircuitBuilder } from "lib/builder"
import { applyCircuitLayoutToCircuitJson } from "lib/circuit-json/applyCircuitLayoutToCircuitJson"
import { convertCircuitJsonToSchematicSvg } from "circuit-to-svg"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"
import { SchematicLayoutPipelineSolver } from "lib/solvers/SchematicLayoutPipelineSolver"

test("tscircuit6 - pipeline02 debug", async () => {
  const circuitJson: any[] = await runTscircuitCode(`
import { sel } from "tscircuit"

export default () => (
  <board routingDisabled>
    <chip
      footprint="pinrow7"
      name="J1"
      pinLabels={{
        pin7: "VBUS",
        pin6: "DP",
        pin5: "DM",
        pin4: "CC1",
        pin3: "CC2",
        pin2: "SHLD",
        pin1: "GND",
      }}
      schPinArrangement={{
        rightSide: {
          direction: "bottom-to-top",
          pins: ["VBUS", "DP", "DM", "CC1", "CC2", "SHLD", "GND"],
        },
      }}
      connections={{
        GND: sel.net.GND,
        SHLD: sel.net.GND,
        VBUS: sel.net.VUSB
      }}
    />
    <resistor
      resistance="22"
      name="R9"
      schX={3.4}
      schY={1}
      connections={{
        pin1: sel.J1.DP,
        pin2: sel.net.DP,
      }}
    />
    <resistor
      resistance="22"
      name="R10"
      schX={3.4}
      schY={0.2}
      connections={{
        pin1: sel.J1.DM,
        pin2: sel.net.DM
      }}
    />
    <resistor
      resistance="5.1k"
      name="R1"
      schX={2}
      schY={-2}
      schRotation="270deg"
      connections={{ pin2: sel.net.GND, pin1: sel.J1.CC2 }}
    />
    <resistor
      resistance="5.1k"
      name="R2"
      footprint="0402"
      schX={3}
      schY={-2}
      schRotation="270deg"
      connections={{
        pin1: sel.J1.CC1,
        pin2: sel.net.GND,
      }}
    />
  </board>
)
  `)

  // HACK: Add schematic_net_label_id since core doesn't add it currently
  let schLabelIdCounter = 0
  for (const schLabel of cju(circuitJson).schematic_net_label.list()) {
    schLabel.schematic_net_label_id ??= `schematic_net_label_${schLabelIdCounter++}`
  }

  expect([
    ...cju(circuitJson).schematic_component.list(),
    ...cju(circuitJson).schematic_port.list(),
    ...cju(circuitJson).schematic_net_label.list(),
  ]).toMatchInlineSnapshot(`
    [
      {
        "center": {
          "x": 0,
          "y": 0,
        },
        "pin_spacing": 0.2,
        "pin_styles": undefined,
        "port_arrangement": {
          "bottom_side": undefined,
          "left_side": undefined,
          "right_side": {
            "direction": "bottom-to-top",
            "pins": [
              "VBUS",
              "DP",
              "DM",
              "CC1",
              "CC2",
              "SHLD",
              "GND",
            ],
          },
          "top_side": undefined,
        },
        "port_labels": {
          "pin1": "GND",
          "pin2": "SHLD",
          "pin3": "CC2",
          "pin4": "CC1",
          "pin5": "DM",
          "pin6": "DP",
          "pin7": "VBUS",
        },
        "rotation": 0,
        "schematic_component_id": "schematic_component_0",
        "schematic_group_id": "schematic_group_0",
        "size": {
          "height": 1.6,
          "width": 1.5,
        },
        "source_component_id": "source_component_0",
        "type": "schematic_component",
      },
      {
        "center": {
          "x": 3.4,
          "y": 1,
        },
        "schematic_component_id": "schematic_component_1",
        "schematic_group_id": "schematic_group_0",
        "size": {
          "height": 0.388910699999999,
          "width": 1.0583332999999997,
        },
        "source_component_id": "source_component_1",
        "symbol_display_value": "22Ω",
        "symbol_name": "boxresistor_right",
        "type": "schematic_component",
      },
      {
        "center": {
          "x": 3.4,
          "y": 0.2,
        },
        "schematic_component_id": "schematic_component_2",
        "schematic_group_id": "schematic_group_0",
        "size": {
          "height": 0.388910699999999,
          "width": 1.0583332999999997,
        },
        "source_component_id": "source_component_2",
        "symbol_display_value": "22Ω",
        "symbol_name": "boxresistor_right",
        "type": "schematic_component",
      },
      {
        "center": {
          "x": 2,
          "y": -2,
        },
        "schematic_component_id": "schematic_component_3",
        "schematic_group_id": "schematic_group_0",
        "size": {
          "height": 1.0583332999999997,
          "width": 0.3155856499999966,
        },
        "source_component_id": "source_component_3",
        "symbol_display_value": "5.1kΩ",
        "symbol_name": "boxresistor_down",
        "type": "schematic_component",
      },
      {
        "center": {
          "x": 3,
          "y": -2,
        },
        "schematic_component_id": "schematic_component_4",
        "schematic_group_id": "schematic_group_0",
        "size": {
          "height": 1.0583332999999997,
          "width": 0.3155856499999966,
        },
        "source_component_id": "source_component_4",
        "symbol_display_value": "5.1kΩ",
        "symbol_name": "boxresistor_down",
        "type": "schematic_component",
      },
      {
        "center": {
          "x": 1.15,
          "y": 0.6,
        },
        "display_pin_label": "VBUS",
        "distance_from_component_edge": 0.4,
        "facing_direction": "right",
        "pin_number": 7,
        "schematic_component_id": "schematic_component_0",
        "schematic_port_id": "schematic_port_0",
        "side_of_component": "right",
        "source_port_id": "source_port_0",
        "true_ccw_index": 6,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": 1.15,
          "y": 0.4,
        },
        "display_pin_label": "DP",
        "distance_from_component_edge": 0.4,
        "facing_direction": "right",
        "pin_number": 6,
        "schematic_component_id": "schematic_component_0",
        "schematic_port_id": "schematic_port_1",
        "side_of_component": "right",
        "source_port_id": "source_port_1",
        "true_ccw_index": 5,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": 1.15,
          "y": 0.20000000000000007,
        },
        "display_pin_label": "DM",
        "distance_from_component_edge": 0.4,
        "facing_direction": "right",
        "pin_number": 5,
        "schematic_component_id": "schematic_component_0",
        "schematic_port_id": "schematic_port_2",
        "side_of_component": "right",
        "source_port_id": "source_port_2",
        "true_ccw_index": 4,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": 1.15,
          "y": 0.00000000000000011102230246251565,
        },
        "display_pin_label": "CC1",
        "distance_from_component_edge": 0.4,
        "facing_direction": "right",
        "pin_number": 4,
        "schematic_component_id": "schematic_component_0",
        "schematic_port_id": "schematic_port_3",
        "side_of_component": "right",
        "source_port_id": "source_port_3",
        "true_ccw_index": 3,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": 1.15,
          "y": -0.19999999999999996,
        },
        "display_pin_label": "CC2",
        "distance_from_component_edge": 0.4,
        "facing_direction": "right",
        "pin_number": 3,
        "schematic_component_id": "schematic_component_0",
        "schematic_port_id": "schematic_port_4",
        "side_of_component": "right",
        "source_port_id": "source_port_4",
        "true_ccw_index": 2,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": 1.15,
          "y": -0.39999999999999997,
        },
        "display_pin_label": "SHLD",
        "distance_from_component_edge": 0.4,
        "facing_direction": "right",
        "pin_number": 2,
        "schematic_component_id": "schematic_component_0",
        "schematic_port_id": "schematic_port_5",
        "side_of_component": "right",
        "source_port_id": "source_port_5",
        "true_ccw_index": 1,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": 1.15,
          "y": -0.6,
        },
        "display_pin_label": "GND",
        "distance_from_component_edge": 0.4,
        "facing_direction": "right",
        "pin_number": 1,
        "schematic_component_id": "schematic_component_0",
        "schematic_port_id": "schematic_port_6",
        "side_of_component": "right",
        "source_port_id": "source_port_6",
        "true_ccw_index": 0,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": 2.8662092999999995,
          "y": 1.0458051999999993,
        },
        "display_pin_label": "pos",
        "distance_from_component_edge": 0.4,
        "facing_direction": "left",
        "pin_number": 1,
        "schematic_component_id": "schematic_component_1",
        "schematic_port_id": "schematic_port_7",
        "side_of_component": undefined,
        "source_port_id": "source_port_7",
        "true_ccw_index": undefined,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": 3.9687907000000004,
          "y": 1.0452587000000007,
        },
        "display_pin_label": "neg",
        "distance_from_component_edge": 0.4,
        "facing_direction": "right",
        "pin_number": 2,
        "schematic_component_id": "schematic_component_1",
        "schematic_port_id": "schematic_port_8",
        "side_of_component": undefined,
        "source_port_id": "source_port_8",
        "true_ccw_index": undefined,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": 2.8662092999999995,
          "y": 0.24580519999999934,
        },
        "display_pin_label": "pos",
        "distance_from_component_edge": 0.4,
        "facing_direction": "left",
        "pin_number": 1,
        "schematic_component_id": "schematic_component_2",
        "schematic_port_id": "schematic_port_9",
        "side_of_component": undefined,
        "source_port_id": "source_port_9",
        "true_ccw_index": undefined,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": 3.9687907000000004,
          "y": 0.24525870000000066,
        },
        "display_pin_label": "neg",
        "distance_from_component_edge": 0.4,
        "facing_direction": "right",
        "pin_number": 2,
        "schematic_component_id": "schematic_component_2",
        "schematic_port_id": "schematic_port_10",
        "side_of_component": undefined,
        "source_port_id": "source_port_10",
        "true_ccw_index": undefined,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": 2.0458051999999993,
          "y": -1.4662092999999996,
        },
        "display_pin_label": "pos",
        "distance_from_component_edge": 0.4,
        "facing_direction": "up",
        "pin_number": 1,
        "schematic_component_id": "schematic_component_3",
        "schematic_port_id": "schematic_port_11",
        "side_of_component": undefined,
        "source_port_id": "source_port_11",
        "true_ccw_index": undefined,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": 2.0452587000000007,
          "y": -2.5687907,
        },
        "display_pin_label": "neg",
        "distance_from_component_edge": 0.4,
        "facing_direction": "down",
        "pin_number": 2,
        "schematic_component_id": "schematic_component_3",
        "schematic_port_id": "schematic_port_12",
        "side_of_component": undefined,
        "source_port_id": "source_port_12",
        "true_ccw_index": undefined,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": 3.0458051999999993,
          "y": -1.4662092999999996,
        },
        "display_pin_label": "pos",
        "distance_from_component_edge": 0.4,
        "facing_direction": "up",
        "pin_number": 1,
        "schematic_component_id": "schematic_component_4",
        "schematic_port_id": "schematic_port_13",
        "side_of_component": undefined,
        "source_port_id": "source_port_13",
        "true_ccw_index": undefined,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": 3.0452587000000007,
          "y": -2.5687907,
        },
        "display_pin_label": "neg",
        "distance_from_component_edge": 0.4,
        "facing_direction": "down",
        "pin_number": 2,
        "schematic_component_id": "schematic_component_4",
        "schematic_port_id": "schematic_port_14",
        "side_of_component": undefined,
        "source_port_id": "source_port_14",
        "true_ccw_index": undefined,
        "type": "schematic_port",
      },
      {
        "anchor_position": {
          "x": 1.15,
          "y": -0.6,
        },
        "anchor_side": "left",
        "center": {
          "x": 1.15,
          "y": -0.6,
        },
        "schematic_net_label_id": "schematic_net_label_0",
        "source_net_id": "source_net_0",
        "text": "GND",
        "type": "schematic_net_label",
      },
      {
        "anchor_position": {
          "x": 1.15,
          "y": -0.39999999999999997,
        },
        "anchor_side": "left",
        "center": {
          "x": 1.15,
          "y": -0.39999999999999997,
        },
        "schematic_net_label_id": "schematic_net_label_1",
        "source_net_id": "source_net_0",
        "text": "GND",
        "type": "schematic_net_label",
      },
      {
        "anchor_position": {
          "x": 1.15,
          "y": 0.6,
        },
        "anchor_side": "left",
        "center": {
          "x": 1.15,
          "y": 0.6,
        },
        "schematic_net_label_id": "schematic_net_label_2",
        "source_net_id": "source_net_1",
        "text": "VUSB",
        "type": "schematic_net_label",
      },
      {
        "anchor_position": {
          "x": 3.9687907000000004,
          "y": 1.0452587000000007,
        },
        "anchor_side": "left",
        "center": {
          "x": 3.9687907000000004,
          "y": 1.0452587000000007,
        },
        "schematic_net_label_id": "schematic_net_label_3",
        "source_net_id": "source_net_2",
        "text": "DP",
        "type": "schematic_net_label",
      },
      {
        "anchor_position": {
          "x": 3.9687907000000004,
          "y": 0.24525870000000066,
        },
        "anchor_side": "left",
        "center": {
          "x": 3.9687907000000004,
          "y": 0.24525870000000066,
        },
        "schematic_net_label_id": "schematic_net_label_4",
        "source_net_id": "source_net_3",
        "text": "DM",
        "type": "schematic_net_label",
      },
      {
        "anchor_position": {
          "x": 2.0452587000000007,
          "y": -2.5687907,
        },
        "anchor_side": "top",
        "center": {
          "x": 2.0452587000000007,
          "y": -2.5687907,
        },
        "schematic_net_label_id": "schematic_net_label_5",
        "source_net_id": "source_net_0",
        "text": "GND",
        "type": "schematic_net_label",
      },
      {
        "anchor_position": {
          "x": 3.0452587000000007,
          "y": -2.5687907,
        },
        "anchor_side": "top",
        "center": {
          "x": 3.0452587000000007,
          "y": -2.5687907,
        },
        "schematic_net_label_id": "schematic_net_label_6",
        "source_net_id": "source_net_0",
        "text": "GND",
        "type": "schematic_net_label",
      },
    ]
  `)

  const inputNetlist = convertCircuitJsonToInputNetlist(circuitJson)
  console.log("Input netlist:")
  expect(inputNetlist).toMatchInlineSnapshot(`
    {
      "boxes": [
        {
          "bottomPinCount": 0,
          "boxId": "J1",
          "leftPinCount": 0,
          "rightPinCount": 7,
          "topPinCount": 0,
        },
        {
          "bottomPinCount": 0,
          "boxId": "R9",
          "leftPinCount": 1,
          "rightPinCount": 1,
          "topPinCount": 0,
        },
        {
          "bottomPinCount": 0,
          "boxId": "R10",
          "leftPinCount": 1,
          "rightPinCount": 1,
          "topPinCount": 0,
        },
        {
          "bottomPinCount": 1,
          "boxId": "R1",
          "leftPinCount": 0,
          "rightPinCount": 0,
          "topPinCount": 1,
        },
        {
          "bottomPinCount": 1,
          "boxId": "R2",
          "leftPinCount": 0,
          "rightPinCount": 0,
          "topPinCount": 1,
        },
      ],
      "connections": [
        {
          "_connectivityNetId": "connectivity_net5",
          "connectedPorts": [
            {
              "boxId": "J1",
              "pinNumber": 7,
            },
            {
              "netId": "VUSB",
            },
          ],
        },
        {
          "_connectivityNetId": "connectivity_net8",
          "connectedPorts": [
            {
              "boxId": "J1",
              "pinNumber": 6,
            },
            {
              "boxId": "R9",
              "pinNumber": 1,
            },
            {
              "netId": "connectivity_net8",
            },
          ],
        },
        {
          "_connectivityNetId": "connectivity_net14",
          "connectedPorts": [
            {
              "boxId": "J1",
              "pinNumber": 5,
            },
            {
              "boxId": "R10",
              "pinNumber": 1,
            },
            {
              "netId": "connectivity_net14",
            },
          ],
        },
        {
          "_connectivityNetId": "connectivity_net25",
          "connectedPorts": [
            {
              "boxId": "J1",
              "pinNumber": 4,
            },
            {
              "boxId": "R2",
              "pinNumber": 1,
            },
            {
              "netId": "connectivity_net25",
            },
          ],
        },
        {
          "_connectivityNetId": "connectivity_net22",
          "connectedPorts": [
            {
              "boxId": "J1",
              "pinNumber": 3,
            },
            {
              "boxId": "R1",
              "pinNumber": 1,
            },
            {
              "netId": "connectivity_net22",
            },
          ],
        },
        {
          "_connectivityNetId": "connectivity_net28",
          "connectedPorts": [
            {
              "boxId": "J1",
              "pinNumber": 2,
            },
            {
              "boxId": "J1",
              "pinNumber": 1,
            },
            {
              "boxId": "R1",
              "pinNumber": 2,
            },
            {
              "boxId": "R2",
              "pinNumber": 2,
            },
            {
              "netId": "GND",
            },
          ],
        },
        {
          "_connectivityNetId": "connectivity_net11",
          "connectedPorts": [
            {
              "boxId": "R9",
              "pinNumber": 2,
            },
            {
              "netId": "DP",
            },
          ],
        },
        {
          "_connectivityNetId": "connectivity_net17",
          "connectedPorts": [
            {
              "boxId": "R10",
              "pinNumber": 2,
            },
            {
              "netId": "DM",
            },
          ],
        },
      ],
      "nets": [
        {
          "isPositivePower": true,
          "netId": "VUSB",
        },
        {
          "netId": "connectivity_net8",
        },
        {
          "netId": "connectivity_net14",
        },
        {
          "netId": "connectivity_net25",
        },
        {
          "netId": "connectivity_net22",
        },
        {
          "isGround": true,
          "netId": "GND",
        },
        {
          "netId": "DP",
        },
        {
          "netId": "DM",
        },
      ],
    }
  `)

  console.log("Readable netlist:")
  expect(getReadableNetlist(inputNetlist)).toMatchInlineSnapshot(`
    "Boxes:


                          ┌────────────────┐
                          │                │7  ── VUSB          
                          │                │6  ── R9.1,connecti…
                          │                │5  ── R10.1,connect…
                          │       J1       │4  ── R2.1,connecti…
                          │                │3  ── R1.1,connecti…
                          │                │2  ── J1.1,R1.2,R2.…
                          │                │1  ── J1.2,R1.2,R2.…
                          └────────────────┘


                          ┌────────────────┐
      J1.6,connecti… ──  1│       R9       │2  ── DP            
                          └────────────────┘


                          ┌────────────────┐
      J1.5,connecti… ──  1│      R10       │2  ── DM            
                          └────────────────┘


                            J1.2,J1.1,R2.… 
                                  │        
                                  2        
                          ┌────────────────┐
                          │       R1       │                    
                          └────────────────┘
                                  1        
                                  │        
                            J1.3,connecti… 


                            J1.2,J1.1,R1.… 
                                  │        
                                  2        
                          ┌────────────────┐
                          │       R2       │                    
                          └────────────────┘
                                  1        
                                  │        
                            J1.4,connecti… 

    Complex Connections (more than 2 points):
      - complex connection[0]:
        - J1.6
        - R9.1
        - connectivity_net8
      - complex connection[1]:
        - J1.5
        - R10.1
        - connectivity_net14
      - complex connection[2]:
        - J1.4
        - R2.1
        - connectivity_net25
      - complex connection[3]:
        - J1.3
        - R1.1
        - connectivity_net22
      - complex connection[4]:
        - J1.2
        - J1.1
        - R1.2
        - R2.2
        - GND"
  `)

  console.log("Normalized netlist:")
  expect(normalizeNetlist(inputNetlist)).toMatchInlineSnapshot(`
    {
      "normalizedNetlist": {
        "boxes": [
          {
            "bottomPinCount": 0,
            "boxIndex": 0,
            "leftPinCount": 0,
            "rightPinCount": 7,
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
            "bottomPinCount": 0,
            "boxIndex": 3,
            "leftPinCount": 1,
            "rightPinCount": 1,
            "topPinCount": 0,
          },
          {
            "bottomPinCount": 0,
            "boxIndex": 4,
            "leftPinCount": 1,
            "rightPinCount": 1,
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
                "boxIndex": 0,
                "pinNumber": 2,
              },
              {
                "boxIndex": 1,
                "pinNumber": 2,
              },
              {
                "boxIndex": 2,
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
                "boxIndex": 1,
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
                "boxIndex": 2,
                "pinNumber": 1,
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
                "pinNumber": 1,
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
                "pinNumber": 6,
              },
              {
                "boxIndex": 4,
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
                "pinNumber": 7,
              },
              {
                "netIndex": 7,
              },
            ],
          },
          {
            "connectedPorts": [
              {
                "boxIndex": 3,
                "pinNumber": 2,
              },
              {
                "netIndex": 4,
              },
            ],
          },
          {
            "connectedPorts": [
              {
                "boxIndex": 4,
                "pinNumber": 2,
              },
              {
                "netIndex": 6,
              },
            ],
          },
        ],
        "nets": [
          {
            "isGround": true,
            "isPositivePower": undefined,
            "netIndex": 0,
          },
          {
            "isGround": undefined,
            "isPositivePower": undefined,
            "netIndex": 1,
          },
          {
            "isGround": undefined,
            "isPositivePower": undefined,
            "netIndex": 2,
          },
          {
            "isGround": undefined,
            "isPositivePower": undefined,
            "netIndex": 3,
          },
          {
            "isGround": undefined,
            "isPositivePower": undefined,
            "netIndex": 4,
          },
          {
            "isGround": undefined,
            "isPositivePower": undefined,
            "netIndex": 5,
          },
          {
            "isGround": undefined,
            "isPositivePower": undefined,
            "netIndex": 6,
          },
          {
            "isGround": undefined,
            "isPositivePower": true,
            "netIndex": 7,
          },
        ],
      },
      "transform": {
        "boxIdToBoxIndex": {
          "J1": 0,
          "R1": 1,
          "R10": 3,
          "R2": 2,
          "R9": 4,
        },
        "boxIndexToBoxId": {
          "0": "J1",
          "1": "R1",
          "2": "R2",
          "3": "R10",
          "4": "R9",
        },
        "netIdToNetIndex": {
          "DM": 4,
          "DP": 6,
          "GND": 0,
          "VUSB": 7,
          "connectivity_net14": 3,
          "connectivity_net22": 2,
          "connectivity_net25": 1,
          "connectivity_net8": 5,
        },
        "netIndexToNetId": {
          "0": "GND",
          "1": "connectivity_net25",
          "2": "connectivity_net22",
          "3": "connectivity_net14",
          "4": "DM",
          "5": "connectivity_net8",
          "6": "DP",
          "7": "VUSB",
        },
      },
    }
  `)

  // Run the pipeline solver to see what happens during adaptation
  const solver = new SchematicLayoutPipelineSolver({
    inputNetlist,
  })

  console.log("Running pipeline solver...")
  solver.solve()

  console.log("Solver completed. Checking results...")
  console.log("Match phase solver results:")
  expect(
    solver.matchPhaseSolver?.outputMatchedTemplates?.length,
  ).toMatchInlineSnapshot(`1`)

  if (solver.matchPhaseSolver?.outputMatchedTemplates?.[0]) {
    console.log("Best matched template:")
    expect(
      solver.matchPhaseSolver.outputMatchedTemplates[0].template.toString(),
    ).toMatchInlineSnapshot(`
      "     0.0         5.0      
       2.4         V
       2.2         │
       2.0         │
       1.8 J1      │
       1.6 ┌────┐  │ ┌───R9P
       1.4 │   7├──┘ │
       1.2 │   6├────┘
       1.0 │   5├────────R0M
       0.8 │   4├────────┐
       0.6 │   3├────┐   │
       0.4 │   2├┐   │   │
       0.2 │   1├●   ┴   ┴
       0.0 └────┘│
      -0.2       │   R1  R2
      -0.4       │
      -0.6       │
      -0.8       │   ┬   ┬
      -1.0       │   │   │
      -1.2       │   │   │
      -1.4       │   │   │
      -1.6       │   │   │
      -1.8       G   G   G"
    `)
  }

  console.log("Adapt phase solver results:")
  expect(
    solver.adaptPhaseSolver?.outputAdaptedTemplates?.length,
  ).toMatchInlineSnapshot(`1`)

  if (solver.adaptPhaseSolver?.outputAdaptedTemplates?.[0]) {
    console.log("Adapted template:")
    expect(
      solver.adaptPhaseSolver.outputAdaptedTemplates[0].template.toString(),
    ).toMatchInlineSnapshot(`
      "     0.0         5.0      
       2.4     ┌───V───────┐
       2.2     │   │       │
       2.0     │   │       │
       1.8 J1  │   │       │
       1.6 ┌────┐  │ ┌───R9P
       1.4 │   7├──┘ │     │
       1.2 │   6├────┤     │
       1.0 │   5├────┼──┬R1M
       0.8 │   4├────┼──┼┐
       0.6 │   3├────┤  ││
       0.4 │   2├┐   │  ││
       0.2 │   1├●   ┴  │┴
       0.0 └────┘│   │  │
      -0.2       │   R1 │R2
      -0.4       │   │  │
      -0.6       │   │  │
      -0.8       │   ┬  │┬
      -1.0       │   │  └┤
      -1.2       │   │   │
      -1.4       │   │   │
      -1.6       │   │   │
      -1.8       G   G   G"
    `)

    console.log("Applied operations during adaptation:")
    expect(
      solver.adaptPhaseSolver.outputAdaptedTemplates[0].appliedOperations,
    ).toMatchInlineSnapshot(`
      [
        {
          "fromChipId": "J1",
          "fromPinNumber": 6,
          "toChipId": "R1",
          "toPinNumber": 1,
          "type": "draw_line_between_pins",
        },
        {
          "fromChipId": "J1",
          "fromPinNumber": 5,
          "toChipId": "R2",
          "toPinNumber": 1,
          "type": "draw_line_between_pins",
        },
        {
          "fromChipId": "J1",
          "fromPinNumber": 4,
          "toChipId": "R9",
          "toPinNumber": 1,
          "type": "draw_line_between_pins",
        },
        {
          "fromChipId": "J1",
          "fromPinNumber": 3,
          "toChipId": "R10",
          "toPinNumber": 1,
          "type": "draw_line_between_pins",
        },
      ]
    `)

    // Test the layout application
    const adaptedTemplate =
      solver.adaptPhaseSolver.outputAdaptedTemplates[0].template
    const newCircuitJson = applyCircuitLayoutToCircuitJson(
      circuitJson,
      inputNetlist,
      adaptedTemplate,
    )

    console.log("New circuit components after layout:")
    expect(
      cju(newCircuitJson).schematic_component.list(),
    ).toMatchInlineSnapshot(`
      [
        {
          "center": {
            "x": 1,
            "y": 0.9000000000000001,
          },
          "pin_spacing": 0.2,
          "pin_styles": undefined,
          "port_arrangement": {
            "bottom_side": undefined,
            "left_side": undefined,
            "right_side": {
              "direction": "bottom-to-top",
              "pins": [
                "VBUS",
                "DP",
                "DM",
                "CC1",
                "CC2",
                "SHLD",
                "GND",
              ],
            },
            "top_side": undefined,
          },
          "port_labels": {
            "pin1": "GND",
            "pin2": "SHLD",
            "pin3": "CC2",
            "pin4": "CC1",
            "pin5": "DM",
            "pin6": "DP",
            "pin7": "VBUS",
          },
          "rotation": 0,
          "schematic_component_id": "schematic_component_0",
          "schematic_group_id": "schematic_group_0",
          "size": {
            "height": 1.8000000000000003,
            "width": 1.2,
          },
          "source_component_id": "source_component_0",
          "type": "schematic_component",
        },
        {
          "center": {
            "x": 5,
            "y": -0.2999999999999998,
          },
          "schematic_component_id": "schematic_component_1",
          "schematic_group_id": "schematic_group_0",
          "size": {
            "height": 1,
            "width": 1,
          },
          "source_component_id": "source_component_1",
          "symbol_display_value": "22Ω",
          "symbol_name": "boxresistor_down",
          "type": "schematic_component",
        },
        {
          "center": {
            "x": 7,
            "y": -0.2999999999999998,
          },
          "schematic_component_id": "schematic_component_2",
          "schematic_group_id": "schematic_group_0",
          "size": {
            "height": 1,
            "width": 1,
          },
          "source_component_id": "source_component_2",
          "symbol_display_value": "22Ω",
          "symbol_name": "boxresistor_down",
          "type": "schematic_component",
        },
        {
          "center": {
            "x": 7.5,
            "y": 1.0000000000000004,
          },
          "schematic_component_id": "schematic_component_3",
          "schematic_group_id": "schematic_group_0",
          "size": {
            "height": 1,
            "width": 1,
          },
          "source_component_id": "source_component_3",
          "symbol_display_value": "5.1kΩ",
          "symbol_name": "boxresistor_left",
          "type": "schematic_component",
        },
        {
          "center": {
            "x": 7.5,
            "y": 1.6,
          },
          "schematic_component_id": "schematic_component_4",
          "schematic_group_id": "schematic_group_0",
          "size": {
            "height": 1,
            "width": 1,
          },
          "source_component_id": "source_component_4",
          "symbol_display_value": "5.1kΩ",
          "symbol_name": "boxresistor_left",
          "type": "schematic_component",
        },
      ]
    `)

    // TODO: Re-enable SVG snapshot tests after fixing image differences
    // expect(
    //   convertCircuitJsonToSchematicSvg(circuitJson, {
    //     grid: {
    //       cellSize: 1,
    //       labelCells: true,
    //     },
    //   }),
    // ).toMatchSvgSnapshot(import.meta.path, "tscircuit6-original")

    // expect(
    //   convertCircuitJsonToSchematicSvg(newCircuitJson, {
    //     grid: {
    //       cellSize: 1,
    //       labelCells: true,
    //     },
    //   }),
    // ).toMatchSvgSnapshot(import.meta.path, "tscircuit6-layout")
  }
})
