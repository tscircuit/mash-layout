import { Box, PortReference } from "./input-types"

export type LayoutPointRef = PortReference

export interface LaidOutBox {
  boxId: string

  leftPinCount: number
  rightPinCount: number
  topPinCount: number
  bottomPinCount: number

  centerX: number
  centerY: number

  pins: Array<{
    pinNumber: number
    x: number
    y: number
    marginFromLastPin?: number
  }>
}

export interface LaidOutPath {
  points: Array<{
    x: number
    y: number
  }>
  from: LayoutPointRef
  to: LayoutPointRef
}

export interface LaidOutNetLabel {
  netLabelId: string
  netId: string
  anchorPosition: "top" | "bottom" | "left" | "right"
  x: number
  y: number
}

export interface CircuitLayoutJson {
  boxes: LaidOutBox[]
  netLabels: Array<LaidOutNetLabel>
  paths: Array<LaidOutPath>
  junctions: Array<{
    junctionId: string
    x: number
    y: number
  }>
}
