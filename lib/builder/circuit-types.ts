import type { Side } from "lib/input-types"

export const SIDES_CCW: Side[] = ["left", "bottom", "right", "top"]

export type Edge = "left" | "right" | "up" | "down"
export interface Line {
  start: { x: number; y: number; ref: PortReference }
  end: { x: number; y: number; ref: PortReference }
  pathId?: string
}

export type { Side }
export type PortReference =
  | { boxId: string; pinNumber: number }
  | { netId: string }
  | { junctionId: string }

export interface NetLabel {
  labelId: string
  x: number
  y: number
  anchorSide: Side
  fromRef: PortReference
}

export interface ConnectionPoint {
  ref: PortReference
  x: number
  y: number
  showAsIntersection?: boolean
}

export interface Path {
  pathId: string
}
