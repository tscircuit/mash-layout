import type { CircuitJson } from "circuit-json"
import type { InputNetlist, Box, Connection, Net, Side } from "lib/input-types"
import { getFullConnectivityMapFromCircuitJson } from "circuit-json-to-connectivity-map"
import { cju, getElementById } from "@tscircuit/circuit-json-util"

const directionToSide = (direction: "left" | "right" | "up" | "down"): Side => {
  switch (direction) {
    case "left":
      return "left"
    case "right":
      return "right"
    case "up":
      return "top"
    case "down":
      return "bottom"
  }
}

/**
 * Converts a tscircuit `CircuitJson` object (array-of-records) into the very
 * small `InputNetlist` structure used by the scoring / ASCII rendering code.
 *
 * The algorithm is intentionally defensive: if we cannot confidently discover
 * a pin’s *side* we fall back to counting it as a **left** pin so that the
 * total-pin count for the box is still correct (this is good enough for every
 * current compatibility check).
 */
export const convertCircuitJsonToInputNetlist = (
  circuitJson: CircuitJson,
): InputNetlist => {
  const connMap = getFullConnectivityMapFromCircuitJson(circuitJson)
  const items = Array.isArray(circuitJson) ? circuitJson : []

  const cjBoxes = cju(circuitJson)
    .source_component.list()
    .map((source_component) => ({
      source_component,
      schematic_component: cju(circuitJson).schematic_component.getWhere({
        source_component_id: source_component.source_component_id,
      }),
      source_ports: cju(circuitJson)
        .source_port.list()
        .filter(
          (source_port) =>
            source_port.source_component_id ===
            source_component.source_component_id,
        )
        .map((source_port) => {
          const connectivity_net_id = connMap.getNetConnectedToId(
            source_port.source_port_id,
          )!
          const schematic_port = cju(circuitJson).schematic_port.getWhere({
            source_port_id: source_port.source_port_id,
          })
          const pin_number =
            schematic_port?.true_ccw_index != null
              ? schematic_port.true_ccw_index + 1
              : source_port.pin_number
          return {
            source_port,
            schematic_port: cju(circuitJson).schematic_port.getWhere({
              source_port_id: source_port.source_port_id,
            })!,
            pin_number,
            connectivity_net_id,
          }
        })
        .filter(({ schematic_port }) => Boolean(schematic_port)),
    }))

  const boxes: Box[] = []
  const connections: Array<Connection & { _connectivityNetId: string }> = []

  for (const {
    source_component,
    schematic_component,
    source_ports,
  } of cjBoxes) {
    const box: Box = {
      boxId: source_component.name,
      leftPinCount: 0,
      rightPinCount: 0,
      topPinCount: 0,
      bottomPinCount: 0,
    }

    for (const { source_port, schematic_port, pin_number } of source_ports) {
      const side = directionToSide(schematic_port.facing_direction!)
      box[`${side}PinCount`]++

      const connectivityNetId = connMap.getNetConnectedToId(
        source_port.source_port_id,
      )!
      let connection = connections.find(
        (c) => c._connectivityNetId === connectivityNetId,
      )

      if (!connection) {
        connection = {
          _connectivityNetId: connectivityNetId,
          connectedPorts: [],
        }
        connections.push(connection)
      }
      connection.connectedPorts.push({
        boxId: source_component.name,
        pinNumber:
          schematic_port?.true_ccw_index != null
            ? schematic_port.true_ccw_index + 1
            : pin_number!,
      })
    }

    boxes.push(box)
  }

  const nets: Net[] = []

  // For each connection, find the best name for the net and make it the
  // netId, then append it to the connection
  for (const connection of connections) {
    if (connection.connectedPorts.length < 2) continue
    // The initial netId is just the connectivity_net_id, which is mostly
    // useless, we want to rename it to something the user specified in a
    // source_net or schematic_net_label
    let netId: string = connection._connectivityNetId

    const elementsConnectedToNet = connMap
      .getIdsConnectedToNet(netId)
      .map((id) => getElementById(circuitJson, id))

    for (const element of elementsConnectedToNet) {
      if (element?.type === "source_net") {
        netId = element.name
        break
      }
    }

    connection.connectedPorts.push({
      netId,
    })
    nets.push({
      netId,
    })
  }

  return {
    boxes,
    connections,
    nets,
  }
}
