import { runTscircuitCode } from "@tscircuit/eval"
import { cju } from "@tscircuit/circuit-json-util"
import { test, expect } from "bun:test"
import { convertCircuitJsonToInputNetlist } from "lib/circuit-json/convertCircuitJsonToInputNetlist"
import { getReadableNetlist } from "lib/netlist/getReadableNetlist"
import { CircuitBuilder } from "lib/builder"
import { applyCircuitLayoutToCircuitJson } from "lib/circuit-json/applyCircuitLayoutToCircuitJson"
import { convertCircuitJsonToSchematicSvg } from "circuit-to-svg"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"

test("tscircuit2", async () => {
  const circuitJson: any[] = await runTscircuitCode(`
import { sel } from "tscircuit"

export default () => (
  <board routingDisabled>
    <chip
      name="U1"
      footprint="soic8"
      pinLabels={{
        pin1: "EN1",
        pin2: "EN2",
        pin5: "DGND",
        pin6: "D0",
        pin7: "D1",
        pin8: "VCC"
      }}
      connections={{
        EN1: sel.R1.pin1,
        DGND: sel.net.GND,
        D0: sel.net.D0,
        D1: [sel.R3.pin1, sel.net.D1],
        VCC: sel.net.VCC,
      }}
    />
    <resistor
      name="R1"
      resistance="1k"
      footprint="0402"
      schX={-4}
      connections={{ pin2: sel.net.GND }}
    />
    <resistor
      name="R2"
      resistance="10k"
      schX={-2}
      schY={2}
      schRotation="90deg"
      connections={{ pin1: sel.U1.pin2, pin2: "net.VCC" }}
    />
    <resistor
      name="R3"
      resistance="10k"
      schX={2}
      schY={2}
      schRotation="90deg"
      connections={{
        pin2: sel.net.VCC,
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

  expect(
    getReadableNetlist(convertCircuitJsonToInputNetlist(circuitJson)),
  ).toMatchInlineSnapshot(`
    "Boxes:


                          ┌────────────────┐
      R1.1,connecti… ──  1│                │8  ── R2.2,R3.2,VCC 
      R2.1,connecti… ──  2│       U1       │7  ── R3.1,D1       
                         3│                │6                   
                         4│                │5  ── R1.2,GND      
                          └────────────────┘


                          ┌────────────────┐
      U1.1,connecti… ──  1│       R1       │2  ── U1.5,GND      
                          └────────────────┘


                            U1.8,R3.2,VCC  
                                  │        
                                  2        
                          ┌────────────────┐
                          │       R2       │                    
                          └────────────────┘
                                  1        
                                  │        
                            U1.2,connecti… 


                            U1.8,R2.2,VCC  
                                  │        
                                  2        
                          ┌────────────────┐
                          │       R3       │                    
                          └────────────────┘
                                  1        
                                  │        
                               U1.7,D1     

    Complex Connections (more than 2 points):
      - complex connection[0]:
        - U1.1
        - R1.1
        - connectivity_net0
      - complex connection[1]:
        - U1.2
        - R2.1
        - connectivity_net19
      - complex connection[2]:
        - U1.5
        - R1.2
        - GND
      - complex connection[3]:
        - U1.7
        - R3.1
        - D1
      - complex connection[4]:
        - U1.8
        - R2.2
        - R3.2
        - VCC"
  `)

  const C = (mode: "ascii" | "cj") => {
    const C = new CircuitBuilder()
    const U1 = C.chip().leftpins(4).rightpins(4)

    U1.pin(1).line(-3, 0).passive().line(-1, 0).line(0, -1).label()
    U1.pin(2).line(-1, 0).line(0, 3).passive().line(0, 1).label()
    // U1.pin(3).line(-1, 0).line(0, -1).connect()
    // U1.pin(4).line(-1, 0).line(0, -1).label()
    U1.pin(8).line(1, 0).line(0, 3).line(1, 0).intersect()
    U1.pin(7).line(2, 0).mark("m1").line(0, 2).passive().line(0, 3).label()
    U1.fromMark("m1").line(1, 0).label()
    U1.pin(6).line(1, 0).label()
    U1.pin(5).line(1, 0).line(0, -1).label()
    return C
  }

  expect(`\n${C("ascii").toString()}\n`).toMatchInlineSnapshot(`
    "
                 0.0         5.0  
     6.6                   C
     6.4                   │
     6.2                   │
     6.0                   │
     5.8                   │
     5.6       B           │
     5.4       │           │
     5.2       │           │
     5.0       │           │
     4.8       │           │
     4.6       ┴           │
     4.4                   │
     4.2       R3          │
     4.0                   │
     3.8                 ┌─●
     3.6       ┬         │ ┴
     3.4       │         │
     3.2       │         │ R4
     3.0       │         │
     2.8       │         │
     2.6       │         │ ┬
     2.4       │         │ │
     2.2       │         │ │
     2.0       │         │ │
     1.8       │         │ │
     1.6       │         │ │
     1.4       │         │ │
     1.2       │ U1      │ │
     1.0       │ ┌─────┐ │ │
     0.8 R2────┼─┤1   8├─┘ │
     0.6 │     └─┤2   7├───┴─D
     0.4 │       ┤3   6├─E
     0.2 │       ┤4   5├─┐
     0.0 │       └─────┘ │
    -0.2 A               │
    -0.4                 │
    -0.6                 │
    -0.8                 F
    "
  `)

  expect(normalizeNetlist(C("cj").getNetlist())).toMatchInlineSnapshot(`
    {
      "normalizedNetlist": {
        "boxes": [
          {
            "bottomPinCount": 0,
            "boxIndex": 0,
            "leftPinCount": 4,
            "rightPinCount": 4,
            "topPinCount": 0,
          },
          {
            "bottomPinCount": 0,
            "boxIndex": 1,
            "leftPinCount": 1,
            "rightPinCount": 1,
            "topPinCount": 0,
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
            ],
          },
          {
            "connectedPorts": [
              {
                "boxIndex": 0,
                "pinNumber": 2,
              },
              {
                "boxIndex": 2,
                "pinNumber": 1,
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
                "netIndex": 2,
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
                "netIndex": 3,
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
                "boxIndex": 3,
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
                "boxIndex": 0,
                "pinNumber": 8,
              },
              {
                "boxIndex": 3,
                "pinNumber": 2,
              },
              {
                "netIndex": 5,
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
                "netIndex": 0,
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
                "netIndex": 1,
              },
            ],
          },
        ],
        "nets": [
          {
            "isGround": undefined,
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
        ],
      },
      "transform": {
        "boxIdToBoxIndex": {
          "R2": 1,
          "R3": 2,
          "R4": 3,
          "U1": 0,
        },
        "boxIndexToBoxId": {
          "0": "U1",
          "1": "R2",
          "2": "R3",
          "3": "R4",
        },
        "netIdToNetIndex": {
          "A": 0,
          "B": 1,
          "C": 5,
          "D": 4,
          "E": 3,
          "F": 2,
        },
        "netIndexToNetId": {
          "0": "A",
          "1": "B",
          "2": "F",
          "3": "E",
          "4": "D",
          "5": "C",
        },
      },
    }
  `)

  expect(
    normalizeNetlist(convertCircuitJsonToInputNetlist(circuitJson)),
  ).toMatchInlineSnapshot(`
    {
      "normalizedNetlist": {
        "boxes": [
          {
            "bottomPinCount": 0,
            "boxIndex": 0,
            "leftPinCount": 4,
            "rightPinCount": 4,
            "topPinCount": 0,
          },
          {
            "bottomPinCount": 0,
            "boxIndex": 1,
            "leftPinCount": 1,
            "rightPinCount": 1,
            "topPinCount": 0,
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
              {
                "boxIndex": 2,
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
                "pinNumber": 3,
              },
            ],
          },
          {
            "connectedPorts": [
              {
                "boxIndex": 0,
                "pinNumber": 4,
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
                "boxIndex": 1,
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
                "pinNumber": 6,
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
                "boxIndex": 3,
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
                "boxIndex": 0,
                "pinNumber": 8,
              },
              {
                "boxIndex": 2,
                "pinNumber": 2,
              },
              {
                "boxIndex": 3,
                "pinNumber": 2,
              },
              {
                "netIndex": 3,
              },
            ],
          },
        ],
        "nets": [
          {
            "isGround": undefined,
            "isPositivePower": undefined,
            "netIndex": 0,
          },
          {
            "isGround": true,
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
            "isPositivePower": true,
            "netIndex": 3,
          },
          {
            "isGround": undefined,
            "isPositivePower": undefined,
            "netIndex": 4,
          },
        ],
      },
      "transform": {
        "boxIdToBoxIndex": {
          "R1": 1,
          "R2": 2,
          "R3": 3,
          "U1": 0,
        },
        "boxIndexToBoxId": {
          "0": "U1",
          "1": "R1",
          "2": "R2",
          "3": "R3",
        },
        "netIdToNetIndex": {
          "D1": 4,
          "GND": 1,
          "VCC": 3,
          "connectivity_net0": 0,
          "connectivity_net19": 2,
        },
        "netIndexToNetId": {
          "0": "connectivity_net0",
          "1": "GND",
          "2": "connectivity_net19",
          "3": "VCC",
          "4": "D1",
        },
      },
    }
  `)

  const newCircuitJson = applyCircuitLayoutToCircuitJson(
    circuitJson,
    convertCircuitJsonToInputNetlist(circuitJson),
    C("cj"),
  )

  expect(
    convertCircuitJsonToSchematicSvg(circuitJson, {
      grid: {
        cellSize: 1,
        labelCells: true,
      },
    }),
  ).toMatchSvgSnapshot(import.meta.path, "tscircuit2-original")
  expect(
    convertCircuitJsonToSchematicSvg(newCircuitJson, {
      grid: {
        cellSize: 1,
        labelCells: true,
      },
    }),
  ).toMatchSvgSnapshot(import.meta.path, "tscircuit2-layout")
})
