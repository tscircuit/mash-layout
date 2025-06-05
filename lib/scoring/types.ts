export interface NormalizedNetlistBox {
  leftPinCount: number
  rightPinCount: number
  topPinCount: number
  bottomPinCount: number
  boxIndex: number
}
export interface NormalizedNetlistConnection {
  connectedPorts: Array<
    { boxIndex: number; pinNumber: number } | { netIndex: number }
  >
}
export interface NormalizedNetlistNet {
  netIndex: number
  /** Whether the original net was a ground connection */
  isGround?: boolean
  /** Whether the original net was a positive power rail */
  isPositivePower?: boolean
}
export interface NormalizedNetlist {
  boxes: Array<NormalizedNetlistBox>
  nets: Array<NormalizedNetlistNet>
  connections: Array<NormalizedNetlistConnection>
}
