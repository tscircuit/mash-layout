import { runTscircuitCode } from "@tscircuit/eval"
import corpus1LayoutJson from "corpus/corpus2025-05-03-abcd1234.json"
import { test, expect } from "bun:test"
import { circuitBuilderFromLayoutJson } from "lib/utils/circuitBuilderFromLayoutJson"
import { corpus1Code } from "website/pages/corpus/corpus01.page"
import {
  applyCircuitLayoutToCircuitJson,
  convertCircuitJsonToInputNetlist,
} from "lib/index"
import { convertCircuitJsonToSchematicSvg } from "circuit-to-svg"

test("corpus01 - apply circuit operations", async () => {
  const circuitBuilder = circuitBuilderFromLayoutJson(corpus1LayoutJson as any)

  expect(circuitBuilder.toString()).toMatchInlineSnapshot(`
    "           0.0      
     3.0    U1
     2.8    ┌─────┐
     2.6 ┌──┤1   4├──N
     2.4 │  ┤2   3├
     2.2 ┴  └─────┘
     2.0
     1.8 P1
     1.6
     1.4
     1.2 ┬
     1.0 │
     0.8 │
     0.6 │
     0.4 N"
  `)

  const circuitJson = await runTscircuitCode(corpus1Code)

  // expect(circuitJson).toMatchInlineSnapshot()

  expect(convertCircuitJsonToSchematicSvg(circuitJson)).toMatchSvgSnapshot(
    `${import.meta.dir}/corpus01-apply-circuit-operations-original.svg`,
  )

  expect(circuitBuilder.serialize()).toMatchInlineSnapshot(`
    {
      "chips": [
        {
          "bottomPinCount": 0,
          "bottomPins": [],
          "leftPinCount": 2,
          "leftPins": [
            {
              "pinNumber": 1,
              "x": 2.9999999999999996,
              "y": 2.6,
            },
            {
              "pinNumber": 2,
              "x": -1.6,
              "y": 2.4000000000000004,
            },
          ],
          "marks": {},
          "rightPinCount": 2,
          "rightPins": [
            {
              "pinNumber": 3,
              "x": 1.2000000000000002,
              "y": 2.6,
            },
            {
              "pinNumber": 4,
              "x": 1.2000000000000002,
              "y": 2.4000000000000004,
            },
          ],
          "topPinCount": 0,
          "topPins": [],
          "x": -1.6,
          "y": 2.1000000000000005,
        },
        {
          "bottomPinCount": 1,
          "bottomPins": [
            {
              "pinNumber": 1,
              "x": -3.2,
              "y": 0.4,
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
              "x": -1.6,
              "y": 2.6,
            },
          ],
          "x": -3.2,
          "y": 1.7,
        },
      ],
      "connectionPoints": [],
      "lines": [
        {
          "end": {
            "ref": {
              "boxId": "P1",
              "pinNumber": 2,
            },
            "x": -3.2,
            "y": 2.6,
          },
          "pathId": "PATH1",
          "start": {
            "ref": {
              "boxId": "P1",
              "pinNumber": 2,
            },
            "x": -3.2,
            "y": 2.2,
          },
        },
        {
          "end": {
            "ref": {
              "boxId": "P1",
              "pinNumber": 2,
            },
            "x": -2.4000000000000004,
            "y": 2.6,
          },
          "pathId": "PATH1",
          "start": {
            "ref": {
              "boxId": "P1",
              "pinNumber": 2,
            },
            "x": -3.2,
            "y": 2.6,
          },
        },
        {
          "end": {
            "ref": {
              "boxId": "U1",
              "pinNumber": 1,
            },
            "x": -1.6,
            "y": 2.6,
          },
          "pathId": "PATH1",
          "start": {
            "ref": {
              "boxId": "P1",
              "pinNumber": 2,
            },
            "x": -2.4000000000000004,
            "y": 2.6,
          },
        },
        {
          "end": {
            "ref": {
              "netId": "NET1",
              "netLabelId": "loaded-nl-f5fbca2d-46d4-4d7d-8fb2-4a3fe91f25b2-0",
            },
            "x": -3.2,
            "y": 0.4,
          },
          "pathId": "PATH2",
          "start": {
            "ref": {
              "boxId": "P1",
              "pinNumber": 1,
            },
            "x": -3.2,
            "y": 1.2,
          },
        },
        {
          "end": {
            "ref": {
              "netId": "NET2",
              "netLabelId": "loaded-nl-94bc260e-ce15-4095-b4d5-91d9e73ef6a7-1",
            },
            "x": 2.9999999999999996,
            "y": 2.6,
          },
          "pathId": "PATH3",
          "start": {
            "ref": {
              "boxId": "U1",
              "pinNumber": 1,
            },
            "x": -1.6,
            "y": 2.6,
          },
        },
      ],
      "netLabels": [
        {
          "anchorSide": "top",
          "fromRef": {
            "boxId": "P1",
            "pinNumber": 1,
          },
          "netId": "NET1",
          "netLabelId": "NL1",
          "x": -3.2,
          "y": 0.4,
        },
        {
          "anchorSide": "left",
          "fromRef": {
            "boxId": "U1",
            "pinNumber": 1,
          },
          "netId": "NET2",
          "netLabelId": "NL2",
          "x": 3,
          "y": 2.6,
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
      ],
    }
  `)

  const laidOutCircuitJson = applyCircuitLayoutToCircuitJson(
    circuitJson,
    convertCircuitJsonToInputNetlist(circuitJson),
    circuitBuilder,
  )

  expect(laidOutCircuitJson).toMatchInlineSnapshot(`
    [
      {
        "software_used_string": "@tscircuit/core@0.0.443",
        "source_project_metadata_id": "source_project_metadata_0",
        "type": "source_project_metadata",
      },
      {
        "name": "pin1",
        "pin_number": 1,
        "port_hints": [
          "pin1",
          "1",
        ],
        "source_component_id": "source_component_0",
        "source_port_id": "source_port_0",
        "subcircuit_connectivity_map_key": "unnamedsubcircuit46_connectivity_net0",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "source_port",
      },
      {
        "name": "pin2",
        "pin_number": 2,
        "port_hints": [
          "pin2",
          "2",
        ],
        "source_component_id": "source_component_0",
        "source_port_id": "source_port_1",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "source_port",
      },
      {
        "name": "pin3",
        "pin_number": 3,
        "port_hints": [
          "pin3",
          "3",
        ],
        "source_component_id": "source_component_0",
        "source_port_id": "source_port_2",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "source_port",
      },
      {
        "name": "pin4",
        "pin_number": 4,
        "port_hints": [
          "pin4",
          "4",
        ],
        "source_component_id": "source_component_0",
        "source_port_id": "source_port_3",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "source_port",
      },
      {
        "ftype": "simple_chip",
        "manufacturer_part_number": undefined,
        "name": "U1",
        "source_component_id": "source_component_0",
        "source_group_id": "source_group_0",
        "supplier_part_numbers": undefined,
        "type": "source_component",
      },
      {
        "name": "pin1",
        "pin_number": 1,
        "port_hints": [
          "anode",
          "pos",
          "left",
          "pin1",
          "1",
        ],
        "source_component_id": "source_component_1",
        "source_port_id": "source_port_4",
        "subcircuit_connectivity_map_key": "unnamedsubcircuit46_connectivity_net0",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "source_port",
      },
      {
        "name": "pin2",
        "pin_number": 2,
        "port_hints": [
          "cathode",
          "neg",
          "right",
          "pin2",
          "2",
        ],
        "source_component_id": "source_component_1",
        "source_port_id": "source_port_5",
        "subcircuit_connectivity_map_key": "unnamedsubcircuit46_connectivity_net1",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "source_port",
      },
      {
        "are_pins_interchangeable": true,
        "display_resistance": "1kΩ",
        "ftype": "simple_resistor",
        "manufacturer_part_number": undefined,
        "name": "R1",
        "resistance": 1000,
        "source_component_id": "source_component_1",
        "source_group_id": "source_group_0",
        "supplier_part_numbers": {
          "jlcpcb": [
            "C11702",
            "C106235",
            "C25543",
          ],
        },
        "type": "source_component",
      },
      {
        "member_source_group_ids": [],
        "name": "GND",
        "source_net_id": "source_net_0",
        "subcircuit_connectivity_map_key": "unnamedsubcircuit46_connectivity_net1",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "source_net",
      },
      {
        "is_subcircuit": true,
        "name": undefined,
        "source_group_id": "source_group_0",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "source_group",
      },
      {
        "connected_source_net_ids": [],
        "connected_source_port_ids": [
          "source_port_0",
          "source_port_4",
        ],
        "display_name": "chip.U1 > port.pin1 to .R1 .pin1",
        "max_length": undefined,
        "min_trace_thickness": undefined,
        "source_trace_id": "source_trace_0",
        "subcircuit_connectivity_map_key": "unnamedsubcircuit46_connectivity_net0",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "source_trace",
      },
      {
        "connected_source_net_ids": [
          "source_net_0",
        ],
        "connected_source_port_ids": [
          "source_port_5",
        ],
        "display_name": "resistor.R1 > port.pin2 to net.GND",
        "max_length": undefined,
        "min_trace_thickness": undefined,
        "source_trace_id": "source_trace_1",
        "subcircuit_connectivity_map_key": "unnamedsubcircuit46_connectivity_net1",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "source_trace",
      },
      {
        "center": {
          "x": -0.20000000000000018,
          "y": 2.5000000000000004,
        },
        "pin_spacing": 0.2,
        "pin_styles": undefined,
        "port_arrangement": undefined,
        "port_labels": {},
        "rotation": 0,
        "schematic_component_id": "schematic_component_0",
        "schematic_group_id": "schematic_group_0",
        "size": {
          "height": 0.8,
          "width": 1.9999999999999998,
        },
        "source_component_id": "source_component_0",
        "type": "schematic_component",
      },
      {
        "center": {
          "x": -3.2,
          "y": 1.7,
        },
        "schematic_component_id": "schematic_component_1",
        "schematic_group_id": "schematic_group_0",
        "size": {
          "height": 1,
          "width": 1,
        },
        "source_component_id": "source_component_1",
        "symbol_display_value": "1kΩ",
        "symbol_name": "boxresistor_down",
        "type": "schematic_component",
      },
      {
        "center": {
          "x": 0,
          "y": 0,
        },
        "height": 0,
        "is_subcircuit": true,
        "name": undefined,
        "schematic_component_ids": [],
        "schematic_group_id": "schematic_group_0",
        "source_group_id": "source_group_0",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "schematic_group",
        "width": 0,
      },
      {
        "center": {
          "x": -1.6,
          "y": 2.5000000000000004,
        },
        "display_pin_label": undefined,
        "distance_from_component_edge": 0.4,
        "facing_direction": "left",
        "pin_number": 1,
        "schematic_component_id": "schematic_component_0",
        "schematic_port_id": "schematic_port_0",
        "side_of_component": "left",
        "source_port_id": "source_port_0",
        "true_ccw_index": 0,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": -1.6,
          "y": 2.3000000000000003,
        },
        "display_pin_label": undefined,
        "distance_from_component_edge": 0.4,
        "facing_direction": "left",
        "pin_number": 2,
        "schematic_component_id": "schematic_component_0",
        "schematic_port_id": "schematic_port_1",
        "side_of_component": "left",
        "source_port_id": "source_port_1",
        "true_ccw_index": 1,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": 1.1999999999999997,
          "y": 2.3000000000000003,
        },
        "display_pin_label": undefined,
        "distance_from_component_edge": 0.4,
        "facing_direction": "right",
        "pin_number": 3,
        "schematic_component_id": "schematic_component_0",
        "schematic_port_id": "schematic_port_2",
        "side_of_component": "right",
        "source_port_id": "source_port_2",
        "true_ccw_index": 2,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": 1.1999999999999997,
          "y": 2.5000000000000004,
        },
        "display_pin_label": undefined,
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
          "x": -3.2,
          "y": 1.2,
        },
        "display_pin_label": "pos",
        "distance_from_component_edge": 0.4,
        "facing_direction": "up",
        "pin_number": 1,
        "schematic_component_id": "schematic_component_1",
        "schematic_port_id": "schematic_port_4",
        "side_of_component": undefined,
        "source_port_id": "source_port_4",
        "true_ccw_index": undefined,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": -3.2,
          "y": 2.2,
        },
        "display_pin_label": "neg",
        "distance_from_component_edge": 0.4,
        "facing_direction": "down",
        "pin_number": 2,
        "schematic_component_id": "schematic_component_1",
        "schematic_port_id": "schematic_port_5",
        "side_of_component": undefined,
        "source_port_id": "source_port_5",
        "true_ccw_index": undefined,
        "type": "schematic_port",
      },
      {
        "center": {
          "x": 0,
          "y": 0,
        },
        "height": 1.87,
        "layer": "top",
        "pcb_component_id": "pcb_component_0",
        "rotation": 0,
        "source_component_id": "source_component_0",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_component",
        "width": 5.3,
      },
      {
        "center": {
          "x": 0,
          "y": 0,
        },
        "height": 0.6000000000000001,
        "layer": "top",
        "pcb_component_id": "pcb_component_1",
        "rotation": 0,
        "source_component_id": "source_component_1",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_component",
        "width": 1.6,
      },
      {
        "center": {
          "x": 0,
          "y": 0,
        },
        "height": 10,
        "material": "fr4",
        "num_layers": 4,
        "outline": undefined,
        "pcb_board_id": "pcb_board_0",
        "thickness": 1.4,
        "type": "pcb_board",
        "width": 10,
      },
      {
        "height": 0.6,
        "layer": "top",
        "pcb_component_id": "pcb_component_0",
        "pcb_group_id": undefined,
        "pcb_port_id": "pcb_port_0",
        "pcb_smtpad_id": "pcb_smtpad_0",
        "port_hints": [
          "1",
        ],
        "shape": "rect",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_smtpad",
        "width": 1,
        "x": -2.15,
        "y": 0.635,
      },
      {
        "height": 0.42,
        "layer": "top",
        "pcb_component_id": "pcb_component_0",
        "pcb_group_id": undefined,
        "pcb_smtpad_id": "pcb_smtpad_0",
        "pcb_solder_paste_id": "pcb_solder_paste_0",
        "shape": "rect",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_solder_paste",
        "width": 0.7,
        "x": -2.15,
        "y": 0.635,
      },
      {
        "height": 0.6,
        "layer": "top",
        "pcb_component_id": "pcb_component_0",
        "pcb_group_id": undefined,
        "pcb_port_id": "pcb_port_1",
        "pcb_smtpad_id": "pcb_smtpad_1",
        "port_hints": [
          "2",
        ],
        "shape": "rect",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_smtpad",
        "width": 1,
        "x": -2.15,
        "y": -0.635,
      },
      {
        "height": 0.42,
        "layer": "top",
        "pcb_component_id": "pcb_component_0",
        "pcb_group_id": undefined,
        "pcb_smtpad_id": "pcb_smtpad_1",
        "pcb_solder_paste_id": "pcb_solder_paste_1",
        "shape": "rect",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_solder_paste",
        "width": 0.7,
        "x": -2.15,
        "y": -0.635,
      },
      {
        "height": 0.6,
        "layer": "top",
        "pcb_component_id": "pcb_component_0",
        "pcb_group_id": undefined,
        "pcb_port_id": "pcb_port_2",
        "pcb_smtpad_id": "pcb_smtpad_2",
        "port_hints": [
          "3",
        ],
        "shape": "rect",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_smtpad",
        "width": 1,
        "x": 2.15,
        "y": -0.635,
      },
      {
        "height": 0.42,
        "layer": "top",
        "pcb_component_id": "pcb_component_0",
        "pcb_group_id": undefined,
        "pcb_smtpad_id": "pcb_smtpad_2",
        "pcb_solder_paste_id": "pcb_solder_paste_2",
        "shape": "rect",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_solder_paste",
        "width": 0.7,
        "x": 2.15,
        "y": -0.635,
      },
      {
        "height": 0.6,
        "layer": "top",
        "pcb_component_id": "pcb_component_0",
        "pcb_group_id": undefined,
        "pcb_port_id": "pcb_port_3",
        "pcb_smtpad_id": "pcb_smtpad_3",
        "port_hints": [
          "4",
        ],
        "shape": "rect",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_smtpad",
        "width": 1,
        "x": 2.15,
        "y": 0.635,
      },
      {
        "height": 0.42,
        "layer": "top",
        "pcb_component_id": "pcb_component_0",
        "pcb_group_id": undefined,
        "pcb_smtpad_id": "pcb_smtpad_3",
        "pcb_solder_paste_id": "pcb_solder_paste_3",
        "shape": "rect",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_solder_paste",
        "width": 0.7,
        "x": 2.15,
        "y": 0.635,
      },
      {
        "layer": "top",
        "pcb_component_id": "pcb_component_0",
        "pcb_group_id": undefined,
        "pcb_silkscreen_path_id": "pcb_silkscreen_path_0",
        "route": [
          {
            "x": -1.5499999999999998,
            "y": -1.2525,
          },
          {
            "x": -1.5499999999999998,
            "y": 1.2525,
          },
          {
            "x": -0.5166666666666666,
            "y": 1.2525,
          },
          {
            "x": -0.47733775846416476,
            "y": 1.0547802266113702,
          },
          {
            "x": -0.3653385036130495,
            "y": 0.8871614963869503,
          },
          {
            "x": -0.19771977338862967,
            "y": 0.7751622415358352,
          },
          {
            "x": 0.000000000000000031636708977973285,
            "y": 0.7358333333333333,
          },
          {
            "x": 0.1977197733886297,
            "y": 0.7751622415358352,
          },
          {
            "x": 0.3653385036130496,
            "y": 0.8871614963869505,
          },
          {
            "x": 0.47733775846416476,
            "y": 1.0547802266113702,
          },
          {
            "x": 0.5166666666666666,
            "y": 1.2525,
          },
          {
            "x": 1.5499999999999998,
            "y": 1.2525,
          },
          {
            "x": 1.5499999999999998,
            "y": -1.2525,
          },
          {
            "x": -1.5499999999999998,
            "y": -1.2525,
          },
        ],
        "stroke_width": 0.1,
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_silkscreen_path",
      },
      {
        "anchor_alignment": "center",
        "anchor_position": {
          "x": 0,
          "y": 1.6524999999999999,
        },
        "ccw_rotation": 0,
        "font": "tscircuit2024",
        "font_size": 0.40875,
        "layer": "top",
        "pcb_component_id": "pcb_component_0",
        "pcb_group_id": undefined,
        "pcb_silkscreen_text_id": "pcb_silkscreen_text_0",
        "subcircuit_id": "subcircuit_source_group_0",
        "text": "U1",
        "type": "pcb_silkscreen_text",
      },
      {
        "height": 0.6000000000000001,
        "layer": "top",
        "pcb_component_id": "pcb_component_1",
        "pcb_group_id": undefined,
        "pcb_port_id": "pcb_port_4",
        "pcb_smtpad_id": "pcb_smtpad_4",
        "port_hints": [
          "1",
          "left",
        ],
        "shape": "rect",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_smtpad",
        "width": 0.6000000000000001,
        "x": -0.5,
        "y": 0,
      },
      {
        "height": 0.42000000000000004,
        "layer": "top",
        "pcb_component_id": "pcb_component_1",
        "pcb_group_id": undefined,
        "pcb_smtpad_id": "pcb_smtpad_4",
        "pcb_solder_paste_id": "pcb_solder_paste_4",
        "shape": "rect",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_solder_paste",
        "width": 0.42000000000000004,
        "x": -0.5,
        "y": 0,
      },
      {
        "height": 0.6000000000000001,
        "layer": "top",
        "pcb_component_id": "pcb_component_1",
        "pcb_group_id": undefined,
        "pcb_port_id": "pcb_port_5",
        "pcb_smtpad_id": "pcb_smtpad_5",
        "port_hints": [
          "2",
          "right",
        ],
        "shape": "rect",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_smtpad",
        "width": 0.6000000000000001,
        "x": 0.5,
        "y": 0,
      },
      {
        "height": 0.42000000000000004,
        "layer": "top",
        "pcb_component_id": "pcb_component_1",
        "pcb_group_id": undefined,
        "pcb_smtpad_id": "pcb_smtpad_5",
        "pcb_solder_paste_id": "pcb_solder_paste_5",
        "shape": "rect",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_solder_paste",
        "width": 0.42000000000000004,
        "x": 0.5,
        "y": 0,
      },
      {
        "layer": "top",
        "pcb_component_id": "pcb_component_1",
        "pcb_group_id": undefined,
        "pcb_silkscreen_path_id": "pcb_silkscreen_path_1",
        "route": [
          {
            "x": 0.5,
            "y": 0.7000000000000001,
          },
          {
            "x": -1,
            "y": 0.7000000000000001,
          },
          {
            "x": -1,
            "y": -0.7000000000000001,
          },
          {
            "x": 0.5,
            "y": -0.7000000000000001,
          },
        ],
        "stroke_width": 0.1,
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_silkscreen_path",
      },
      {
        "anchor_alignment": "center",
        "anchor_position": {
          "x": 0,
          "y": 1.2000000000000002,
        },
        "ccw_rotation": 0,
        "font": "tscircuit2024",
        "font_size": 0.4,
        "layer": "top",
        "pcb_component_id": "pcb_component_1",
        "pcb_group_id": undefined,
        "pcb_silkscreen_text_id": "pcb_silkscreen_text_1",
        "subcircuit_id": "subcircuit_source_group_0",
        "text": "R1",
        "type": "pcb_silkscreen_text",
      },
      {
        "layers": [
          "top",
        ],
        "pcb_component_id": "pcb_component_0",
        "pcb_group_id": undefined,
        "pcb_port_id": "pcb_port_0",
        "source_port_id": "source_port_0",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_port",
        "x": -2.15,
        "y": 0.635,
      },
      {
        "layers": [
          "top",
        ],
        "pcb_component_id": "pcb_component_0",
        "pcb_group_id": undefined,
        "pcb_port_id": "pcb_port_1",
        "source_port_id": "source_port_1",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_port",
        "x": -2.15,
        "y": -0.635,
      },
      {
        "layers": [
          "top",
        ],
        "pcb_component_id": "pcb_component_0",
        "pcb_group_id": undefined,
        "pcb_port_id": "pcb_port_2",
        "source_port_id": "source_port_2",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_port",
        "x": 2.15,
        "y": -0.635,
      },
      {
        "layers": [
          "top",
        ],
        "pcb_component_id": "pcb_component_0",
        "pcb_group_id": undefined,
        "pcb_port_id": "pcb_port_3",
        "source_port_id": "source_port_3",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_port",
        "x": 2.15,
        "y": 0.635,
      },
      {
        "layers": [
          "top",
        ],
        "pcb_component_id": "pcb_component_1",
        "pcb_group_id": undefined,
        "pcb_port_id": "pcb_port_4",
        "source_port_id": "source_port_4",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_port",
        "x": -0.5,
        "y": 0,
      },
      {
        "layers": [
          "top",
        ],
        "pcb_component_id": "pcb_component_1",
        "pcb_group_id": undefined,
        "pcb_port_id": "pcb_port_5",
        "source_port_id": "source_port_5",
        "subcircuit_id": "subcircuit_source_group_0",
        "type": "pcb_port",
        "x": 0.5,
        "y": 0,
      },
      {
        "cad_component_id": "cad_component_0",
        "footprinter_string": "soic4",
        "model_jscad": undefined,
        "model_obj_url": undefined,
        "model_stl_url": undefined,
        "pcb_component_id": "pcb_component_0",
        "position": {
          "x": 0,
          "y": 0,
          "z": 0.7,
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0,
        },
        "source_component_id": "source_component_0",
        "type": "cad_component",
      },
      {
        "cad_component_id": "cad_component_1",
        "footprinter_string": "0402",
        "model_jscad": undefined,
        "model_obj_url": undefined,
        "model_stl_url": undefined,
        "pcb_component_id": "pcb_component_1",
        "position": {
          "x": 0,
          "y": 0,
          "z": 0.7,
        },
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0,
        },
        "source_component_id": "source_component_1",
        "type": "cad_component",
      },
      {
        "anchor_position": {
          "x": -3.2,
          "y": 0.4,
        },
        "anchor_side": "top",
        "center": {
          "x": -3.2,
          "y": 0.4,
        },
        "schematic_net_label_id": "ERROR: did not find netId using net index",
        "source_net_id": "NET1",
        "text": "ERROR: did not find netId using net index",
        "type": "schematic_net_label",
      },
      {
        "anchor_position": {
          "x": 3,
          "y": 2.6,
        },
        "anchor_side": "left",
        "center": {
          "x": 3,
          "y": 2.6,
        },
        "schematic_net_label_id": "connectivity_net0",
        "source_net_id": "NET2",
        "text": "connectivity_net0",
        "type": "schematic_net_label",
      },
      {
        "edges": [
          {
            "from": {
              "layer": "top",
              "route_type": "wire",
              "width": 0.1,
              "x": -3.2,
              "y": 2.2,
            },
            "to": {
              "layer": "top",
              "route_type": "wire",
              "width": 0.1,
              "x": -3.2,
              "y": 2.6,
            },
          },
          {
            "from": {
              "layer": "top",
              "route_type": "wire",
              "width": 0.1,
              "x": -3.2,
              "y": 2.6,
            },
            "to": {
              "layer": "top",
              "route_type": "wire",
              "width": 0.1,
              "x": -2.4000000000000004,
              "y": 2.6,
            },
          },
          {
            "from": {
              "layer": "top",
              "route_type": "wire",
              "width": 0.1,
              "x": -2.4000000000000004,
              "y": 2.6,
            },
            "to": {
              "layer": "top",
              "route_type": "wire",
              "width": 0.1,
              "x": -1.6,
              "y": 2.6,
            },
          },
        ],
        "junctions": [],
        "schematic_trace_id": "sch_trace_PATH1",
        "source_trace_id": "source_trace_PATH1",
        "type": "schematic_trace",
      },
      {
        "edges": [
          {
            "from": {
              "layer": "top",
              "route_type": "wire",
              "width": 0.1,
              "x": -3.2,
              "y": 1.2,
            },
            "to": {
              "layer": "top",
              "route_type": "wire",
              "width": 0.1,
              "x": -3.2,
              "y": 0.4,
            },
          },
        ],
        "junctions": [],
        "schematic_trace_id": "sch_trace_PATH2",
        "source_trace_id": "source_trace_PATH2",
        "type": "schematic_trace",
      },
      {
        "edges": [
          {
            "from": {
              "layer": "top",
              "route_type": "wire",
              "width": 0.1,
              "x": -1.6,
              "y": 2.6,
            },
            "to": {
              "layer": "top",
              "route_type": "wire",
              "width": 0.1,
              "x": 2.9999999999999996,
              "y": 2.6,
            },
          },
        ],
        "junctions": [],
        "schematic_trace_id": "sch_trace_PATH3",
        "source_trace_id": "source_trace_PATH3",
        "type": "schematic_trace",
      },
    ]
  `)

  expect(
    convertCircuitJsonToSchematicSvg(laidOutCircuitJson, {
      grid: {
        cellSize: 1,
        labelCells: true,
      },
    }),
  ).toMatchSvgSnapshot(
    `${import.meta.dir}/corpus01-apply-circuit-operations-laid-out.svg`,
  )
})
