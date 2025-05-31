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

test("tscircuit4 - USB-C with push button pin number error", async () => {
  const circuitJson: any[] = await runTscircuitCode(`
import { usePushButton } from "@tsci/seveibar.push-button"
import { useUsbC } from "@tsci/seveibar.smd-usb-c"

export default () => {
  const USBC = useUsbC("USBC")
  const Button = usePushButton("SW1")
  return (
    <board width="12mm" height="30mm" routingDisabled>
      <USBC
        GND1="net.GND"
        GND2="net.GND"
        VBUS1="net.VBUS"
        VBUS2="net.VBUS"
        pcbY={-10}
        schX={-4}
      />
      <led
        name="LED"
        supplierPartNumbers={{
          jlcpcb: ["965799"],
        }}
        color="red"
        footprint="0603"
        pcbY={12}
        schY={2}
      />
      <Button pcbY={0} pin2=".R1 > .pos" pin3="net.VBUS" schY={-2} />
      <resistor name="R1" footprint="0603" resistance="1k" pcbY={7} />

      <trace from=".R1 > .neg" to=".LED .pos" />
      <trace from=".LED .neg" to="net.GND" />
    </board>
  )
}
  `)

  // HACK: Add schematic_net_label_id since core doesn't add it currently
  let schLabelIdCounter = 0
  for (const schLabel of cju(circuitJson).schematic_net_label.list()) {
    // @ts-expect-error until circuit-json adds schematic_net_label_id
    schLabel.schematic_net_label_id ??= `schematic_net_label_${schLabelIdCounter++}`
  }

  const inputNetlist = convertCircuitJsonToInputNetlist(circuitJson)
  const readableNetlist = getReadableNetlist(inputNetlist)

  expect(`\n${readableNetlist}\n`).toMatchInlineSnapshot(`
    "
    Boxes:


                          ┌────────────────┐
                          │                │12 ── USBC.11,SW1.3…
                          │                │11 ── USBC.12,SW1.3…
                          │                │10                  
                          │                │9                   
                          │      USBC      │8                   
                          │                │7                   
                          │                │6                   
                          │                │5                   
                          │                │4                   
                          │                │3                   
                          └────────────────┘
                              1       2    
                              │       │    
                           USBC.2,LUSBC.1,L


                          ┌────────────────┐
      R1.2,connecti… ──  1│      LED       │2  ── USBC.1,USBC.2…
                          └────────────────┘


                          ┌────────────────┐
                         1│      SW1       │4                   
      R1.1,connecti… ──  2│                │3  ── USBC.12,USBC.…
                          └────────────────┘


                          ┌────────────────┐
      SW1.2,connect… ──  1│       R1       │2  ── LED.1,connect…
                          └────────────────┘

    Complex Connections (more than 2 points):
      - complex connection[0]:
        - USBC.1
        - USBC.2
        - LED.2
        - GND
      - complex connection[1]:
        - USBC.12
        - USBC.11
        - SW1.3
        - VBUS
      - complex connection[2]:
        - LED.1
        - R1.2
        - connectivity_net15
      - complex connection[3]:
        - SW1.2
        - R1.1
        - connectivity_net10
    "
  `)

  // Try to apply layout to trigger the pin number error
  const solver = new SchematicLayoutPipelineSolver({
    inputNetlist: inputNetlist,
  })
  await solver.solve()

  const adaptedTemplate =
    solver.adaptPhaseSolver!.outputAdaptedTemplates[0]!.template

  expect(`\n${adaptedTemplate.toString()}\n`).toMatchInlineSnapshot(`
    "
         0.0         5.0         10.0     
     2.4 U1
     2.2 ┌────┐
     2.0 │  12├
     1.8 │  11├
     1.6 │  10├
     1.4 │   9├
     1.2 │   8├
     1.0 │   7├
     0.8 │   6├              U2
     0.6 │   5├              ┌────┐
     0.4 │   4├──────────────┤1  2├
     0.2 │   3├              └────┘
     0.0 └────┘
    "
  `)

  const newCircuitJson = applyCircuitLayoutToCircuitJson(
    circuitJson,
    convertCircuitJsonToInputNetlist(circuitJson),
    adaptedTemplate,
  )

  expect(
    convertCircuitJsonToSchematicSvg(circuitJson, {
      grid: {
        cellSize: 1,
        labelCells: true,
      },
    }),
  ).toMatchSvgSnapshot(import.meta.path, "tscircuit4-original")
  expect(
    convertCircuitJsonToSchematicSvg(newCircuitJson, {
      grid: {
        cellSize: 1,
        labelCells: true,
      },
    }),
  ).toMatchSvgSnapshot(import.meta.path, "tscircuit4-layout")
})
