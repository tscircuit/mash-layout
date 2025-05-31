import type { CircuitJson } from "circuit-json"

/**
 * Reorders schematic ports to be in counter-clockwise order.
 *
 * Often, a user will specify an alternative order for ports in their tscircuit code,
 * we reorder them here so that matching logic doesn't need to worry about the placement
 * of pins.
 *
 * This requires the following steps:
 * 1. Get all the pins for each source component
 * 2. Identify if they're out of order considering SIDES_CCW and the pin_number of each schematic_port
 * 3. Sort the pins by their true_ccw_index
 * 4. Swap the pin positions to match the true_ccw_index+1
 * 5. Rewrite the pin numbers such that they match true_ccw_index+1
 */
export const reorderChipPinsToCcw = (circuitJson: CircuitJson): CircuitJson => {
  const newCircuitJson = JSON.parse(JSON.stringify(circuitJson))

  // Find all schematic components that have a port arrangement (chips)
  const schematicComponents = newCircuitJson.filter(
    (item: any) => item.type === "schematic_component" && item.port_arrangement,
  )

  for (const component of schematicComponents) {
    // Get all schematic ports for this component
    const ports = newCircuitJson.filter(
      (item: any) =>
        item.type === "schematic_port" &&
        item.schematic_component_id === component.schematic_component_id &&
        item.true_ccw_index !== undefined,
    )

    if (ports.length === 0) continue

    // Sort ports by their true_ccw_index
    ports.sort((a: any, b: any) => a.true_ccw_index - b.true_ccw_index)

    // Create mapping from old pin numbers to new pin numbers based on CCW order
    const pinMapping: Record<number, number> = {}
    ports.forEach((port: any, index: number) => {
      pinMapping[port.pin_number] = index + 1
    })

    // Update all pin numbers in schematic ports
    for (const port of ports) {
      const newPinNumber = pinMapping[port.pin_number]
      port.pin_number = newPinNumber
    }

    // Update corresponding source ports
    for (const port of ports) {
      const sourcePort = newCircuitJson.find(
        (item: any) =>
          item.type === "source_port" &&
          item.source_port_id === port.source_port_id,
      )
      if (sourcePort) {
        sourcePort.pin_number = port.pin_number
      }
    }

    // Update port arrangement to reflect new pin order
    if (component.port_arrangement) {
      const updateSidePins = (side: string) => {
        if (component.port_arrangement[side]?.pins) {
          component.port_arrangement[side].pins = component.port_arrangement[
            side
          ].pins.map((oldPin: number) => pinMapping[oldPin] || oldPin)
        }
      }

      updateSidePins("left_side")
      updateSidePins("right_side")
      updateSidePins("top_side")
      updateSidePins("bottom_side")
    }

    // Update any port labels to use new pin numbers
    if (component.port_labels) {
      const newPortLabels: Record<string, string> = {}
      for (const [pinKey, label] of Object.entries(component.port_labels)) {
        const oldPinNumber = parseInt(pinKey.replace("pin", ""))
        const newPinNumber = pinMapping[oldPinNumber]
        if (newPinNumber !== undefined) {
          newPortLabels[`pin${newPinNumber}`] = label as string
        } else {
          newPortLabels[pinKey] = label as string
        }
      }
      component.port_labels = newPortLabels
    }

    // Update any pin styles to use new pin numbers
    if (component.pin_styles) {
      const newPinStyles: Record<string, any> = {}
      for (const [pinKey, style] of Object.entries(component.pin_styles)) {
        const oldPinNumber = parseInt(pinKey.replace("pin", ""))
        const newPinNumber = pinMapping[oldPinNumber]
        if (newPinNumber !== undefined) {
          newPinStyles[`pin${newPinNumber}`] = style
        } else {
          newPinStyles[pinKey] = style
        }
      }
      component.pin_styles = newPinStyles
    }
  }

  return newCircuitJson
}
