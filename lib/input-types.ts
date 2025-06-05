export interface Box {
  leftPinCount: number
  rightPinCount: number
  topPinCount: number
  bottomPinCount: number
  boxId: string
}

export type Side = "left" | "right" | "top" | "bottom"

export type NetReference =
  | { boxId: string; pinNumber: number }
  | { netId: string }

export interface Connection {
  connectedPorts: Array<NetReference>
}

export interface Net {
  netId: string
  /** True if this net is a ground connection (e.g. GND, AGND) */
  isGround?: boolean
  /** True if this net is a positive power rail (e.g. VCC, VDD, V5) */
  isPositivePower?: boolean
}

export interface InputNetlist {
  boxes: Array<Box>
  connections: Array<Connection>
  nets: Array<Net>
}

/** Represents a reference to a connectable point (a pin on a box or a named net). */
export type PortReference =
  | { boxId: string; pinNumber: number }
  | { netId: string; netLabelId: string }
  | { junctionId: string }
