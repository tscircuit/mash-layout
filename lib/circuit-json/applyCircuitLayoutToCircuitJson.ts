import type {
  CircuitJson,
  SchematicNetLabel,
  SchematicPort,
  SchematicTrace,
  SourceTrace,
  SourcePort,
  SourceNet,
  Point,
  SchematicTraceEdge,
} from "circuit-json"
import type { CircuitBuilder } from "lib/builder"
import type { InputNetlist } from "lib/input-types"
import { cju } from "@tscircuit/circuit-json-util"
import { normalizeNetlist } from "lib/scoring/normalizeNetlist"
import { groupBy } from "lib/utils/groupBy"
import { getFullConnectivityMapFromCircuitJson } from "circuit-json-to-connectivity-map"
import { getMatchedBoxes } from "lib/matching/getMatchedBoxes"

/**
 * Re-position/rotate schematic components in the circuit json to match the
 * layout of the circuit builder.
 */
export const applyCircuitLayoutToCircuitJson = (
  circuitJson: CircuitJson,
  circuitJsonNetlist: InputNetlist,
  layout: CircuitBuilder,
): CircuitJson => {
  // Work on a deep-clone so callers keep their original object intact
  let cj = structuredClone(circuitJson)

  const connMap = getFullConnectivityMapFromCircuitJson(circuitJson)
  const layoutNetlist = layout.getNetlist()
  const layoutNorm = normalizeNetlist(layoutNetlist)
  const cjNorm = normalizeNetlist(circuitJsonNetlist)

  const matchedBoxes = getMatchedBoxes({
    candidateNetlist: layoutNorm.normalizedNetlist,
    targetNetlist: cjNorm.normalizedNetlist,
    candidateNormalizationTransform: layoutNorm.transform,
    targetNormalizationTransform: cjNorm.transform,
  })

  const layoutBoxIndexToBoxId = new Map<number, string>()
  for (const matchedBox of matchedBoxes) {
    layoutBoxIndexToBoxId.set(
      matchedBox.candidateBoxIndex,
      matchedBox._targetBoxId!,
    )
  }

  for (const schematicComponent of cju(cj).schematic_component.list()) {
    const sourceComponent = cju(cj).source_component.get(
      schematicComponent.source_component_id,
    )!
    const schematicPorts = cju(cj).schematic_port.list({
      schematic_component_id: schematicComponent.schematic_component_id,
    })
    // Find the schematic box index
    const boxIndex = cjNorm.transform.boxIdToBoxIndex[sourceComponent.name]!

    // Find the layout boxId
    const layoutBoxId = layoutBoxIndexToBoxId.get(boxIndex)!

    if (!layoutBoxId) {
      // console.warn(`${sourceComponent.name} was not laid out`)
      continue
    }

    const layoutChip = layout.chips.find((c) => c.chipId === layoutBoxId)!

    if (!layoutChip) {
      continue
      // throw new Error(`Layout chip ${layoutBoxId} not found in layout.chips`)
    }

    let cjChipWidth = layoutChip.getWidth() - 0.8
    let cjChipHeight = layoutChip.getHeight()

    if (layoutChip.isPassive) {
      cjChipWidth = 1
      cjChipHeight = 1
    }

    schematicComponent.center = layoutChip.getCenter()
    schematicComponent.size = {
      width: cjChipWidth,
      height: cjChipHeight,
    }

    for (const schematicPort of schematicPorts) {
      const { true_ccw_index, pin_number } = schematicPort
      const pn = true_ccw_index !== undefined ? true_ccw_index + 1 : pin_number

      // Use getPinLocation to get the static position of the pin,
      // as layoutChip.pin(pin_number!).x/y might have been modified by fluent calls.
      try {
        const { x: layoutX, y: layoutY } = layoutChip.getPinLocation(pn!)
        schematicPort.center = {
          x: layoutX,
          y: layoutY,
        }
      } catch (e) {
        console.error(
          `Error getting pin location for ${sourceComponent.name} pin ${pin_number}:`,
          e,
        )
      }
    }

    // Change schematic_component.symbol_name for passives to match the
    // correct orientation based on pin positions
    if (layoutChip.isPassive && schematicComponent.symbol_name) {
      // Find pin1 and pin2 positions
      const pin1Port = schematicPorts.find(
        (p) => p.pin_number === 1 || p.true_ccw_index === 0,
      )
      const pin2Port = schematicPorts.find(
        (p) => p.pin_number === 2 || p.true_ccw_index === 1,
      )

      if (pin1Port?.center && pin2Port?.center) {
        const dx = pin2Port.center.x - pin1Port.center.x
        const dy = pin2Port.center.y - pin1Port.center.y

        // Determine orientation based on relative positions
        // If pin1 is above pin2 (dy > 0), orientation is "down"
        // If pin1 is below pin2 (dy < 0), orientation is "up"
        // If pin1 is left of pin2 (dx > 0), orientation is "right"
        // If pin1 is right of pin2 (dx < 0), orientation is "left"
        let newOrientation: string

        if (Math.abs(dy) > Math.abs(dx)) {
          // Vertical orientation
          newOrientation = dy > 0 ? "down" : "up"
        } else {
          // Horizontal orientation
          newOrientation = dx > 0 ? "right" : "left"
        }

        // Update symbol_name if it's a resistor
        if (schematicComponent.symbol_name.includes("boxresistor")) {
          schematicComponent.symbol_name = `boxresistor_${newOrientation}`
        }
        // Could extend this for other passive types like capacitors, inductors
      }
    }
  }

  // Filter all existing schematic_net_label items
  cj = cj.filter((elm) => elm.type !== "schematic_net_label")

  // Create new schematic_net_label items from layout.netLabels
  const newSchematicNetLabels: SchematicNetLabel[] = []
  for (const layoutLabel of layout.netLabels) {
    // What pins does this layoutLabel connect to?

    const fromRef = layoutLabel.fromRef
    // e.g. { boxId: "R1", pinNumber: 1 }
    // or { boxId: "U1", pinNumber: 3 }

    if (!("boxId" in fromRef)) {
      throw new Error("boxId not found in fromRef for label")
    }

    const matchedBox = matchedBoxes.find(
      (mb) => mb._candidateBoxId === fromRef.boxId,
    )
    if (!matchedBox) {
      throw new Error(
        `${fromRef.boxId} was not laid out for net label ${layoutLabel.netLabelId}/${layoutLabel.netId}`,
      )
    }

    // Find the connectivity net for this label on the target (the circuit json)
    const cjChipId = matchedBox._targetBoxId

    // Find the source_port_id for this pin in the circuit json
    const source_component = cju(cj).source_component.getWhere({
      name: cjChipId,
    })
    if (!source_component) continue

    const source_port = cju(cj).source_port.getWhere({
      source_component_id: source_component!.source_component_id,
      pin_number: fromRef.pinNumber,
    })
    if (!source_port) continue

    const source_net = cju(cj).source_net.getWhere({
      subcircuit_connectivity_map_key:
        source_port!.subcircuit_connectivity_map_key,
    })
    if (!source_net) continue

    const newLabel: SchematicNetLabel = {
      type: "schematic_net_label",
      schematic_net_label_id: layoutLabel.netLabelId,
      source_net_id: source_net!.source_net_id,
      text: source_net!.name,
      center: { x: layoutLabel.x, y: layoutLabel.y },
      anchor_position: { x: layoutLabel.x, y: layoutLabel.y }, // Typically same as center for labels
      anchor_side: layoutLabel.anchorSide,
    }

    newSchematicNetLabels.push(newLabel)
  }

  // Add all newly created labels to the circuitJson array
  if (newSchematicNetLabels.length > 0) {
    cj.push(...newSchematicNetLabels)
  }

  const linesByPath = groupBy(layout.lines, (ln) => ln.pathId!)

  /* ------------------------------------------------------------------
     2.  BUILD ONE schematic_trace PER PATH
         – all segments that share a pathId form a single poly-line
     ------------------------------------------------------------------ */
  const newSchematicTraces: SchematicTrace[] = []

  for (const [pathId, segments] of Object.entries(linesByPath)) {
    const edges: SchematicTraceEdge[] = segments.map((seg) => ({
      from: {
        x: seg.start.x,
        y: seg.start.y,
        layer: "top", // or seg.layer if you later add it
        route_type: "wire",
        width: 0.1,
      },
      to: {
        x: seg.end.x,
        y: seg.end.y,
        layer: "top",
        route_type: "wire",
        width: 0.1,
      },
    }))

    newSchematicTraces.push({
      type: "schematic_trace",
      schematic_trace_id: `sch_trace_${pathId}`, // ⇢ unique per path
      source_trace_id: `source_trace_${pathId}`, // ⇢ no collisions
      edges,
      junctions: [],
    })
  }

  cj = cj.filter((c) => c.type !== "schematic_trace")
  cj.push(...newSchematicTraces)

  // Filter all schematic_traces (they won't properly connect after the moving)
  cj = cj.filter((c) => c.type !== "schematic_text")

  return cj
}
