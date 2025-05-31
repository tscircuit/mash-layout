import { Box } from "./input-types"

export type LayoutPointRef =
  | {
      boxId: string
      pinNumber: number
    }
  | {
      junctionId: string
    }
  | {
      netId: string
    }

export interface LaidOutBox extends Box {
  centerX: number
  centerY: number

  pins: Array<{
    pinNumber: number
    x: number
    y: number
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
  netId: string
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
