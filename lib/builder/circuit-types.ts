import type { Side } from "lib/input-types"

export const SIDES_CCW: Side[] = ["left", "bottom", "right", "top"]

export type Edge = "left" | "right" | "up" | "down"
export interface Line {
  start: { x: number; y: number; ref: PortReference; fromJunctionId?: string }
  end: { x: number; y: number; ref: PortReference; fromJunctionId?: string }
  pathId?: string
}

export type { Side }
export type PortReference =
  | { boxId: string; pinNumber: number }
  | { netId: string; netLabelId: string }
  | { junctionId: string }

export interface NetLabel {
  netLabelId: string
  netId: string
  x: number
  y: number
  anchorSide: Side
  fromRef: PortReference
}

export interface ConnectionPoint {
  pinRef: PortReference
  junctionId: string
  x: number
  y: number
  showAsIntersection?: boolean
}

export interface Path {
  pathId: string
}
