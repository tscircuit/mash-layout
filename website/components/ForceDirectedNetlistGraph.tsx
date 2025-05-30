import React, { useEffect, useRef, useState } from "react"
import type { InputNetlist, Box, Connection } from "lib/input-types"

interface GraphNode {
  id: string
  boxId: string
  x: number
  y: number
  vx: number
  vy: number
  fx?: number
  fy?: number
}

interface GraphEdge {
  source: string
  target: string
  sourcePin: number
  targetPin: number
}

interface ForceDirectedNetlistGraphProps {
  netlist: InputNetlist
  width?: number
  height?: number
}

export const ForceDirectedNetlistGraph: React.FC<
  ForceDirectedNetlistGraphProps
> = ({ netlist, width = 600, height = 400 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const animationRef = useRef<number>()
  const isDragging = useRef(false)
  const dragNode = useRef<GraphNode | null>(null)

  useEffect(() => {
    // Convert netlist to graph data
    const graphNodes: GraphNode[] = netlist.boxes.map((box, boxIndex) => ({
      id: box.boxId,
      boxId: box.boxId,
      x: width / 2 + box.leftPinCount,
      y: height / 2 - box.topPinCount,
      vx: boxIndex,
      vy: 0,
    }))

    const graphEdges: GraphEdge[] = []

    // Process connections to create edges
    netlist.connections.forEach((connection) => {
      const boxPorts = connection.connectedPorts.filter(
        (port) => "boxId" in port,
      ) as Array<{ boxId: string; pinNumber: number }>

      // Create edges between all pairs of box ports in this connection
      for (let i = 0; i < boxPorts.length; i++) {
        for (let j = i + 1; j < boxPorts.length; j++) {
          graphEdges.push({
            source: boxPorts[i].boxId,
            target: boxPorts[j].boxId,
            sourcePin: boxPorts[i].pinNumber,
            targetPin: boxPorts[j].pinNumber,
          })
        }
      }
    })

    setNodes(graphNodes)
    setEdges(graphEdges)
  }, [netlist, width, height])

  useEffect(() => {
    if (!canvasRef.current || nodes.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Force simulation parameters
    const linkDistance = 100
    const linkStrength = 0.1
    const nodeStrength = -1000
    const alpha = 1.2
    const alphaDecay = 0.001
    const velocityDecay = 0.4

    let currentAlpha = alpha

    const simulate = () => {
      const simulationActive = currentAlpha >= 0.01

      // Apply forces
      nodes.forEach((node) => {
        if (node.fx !== undefined) {
          node.x = node.fx
          node.vx = 0
        }
        if (node.fy !== undefined) {
          node.y = node.fy
          node.vy = 0
        }
      })

      if (simulationActive) {
        // Link force
        edges.forEach((edge) => {
          const source = nodes.find((n) => n.id === edge.source)
          const target = nodes.find((n) => n.id === edge.target)
          if (!source || !target) return

          const dx = target.x - source.x
          const dy = target.y - source.y
          const distance = Math.sqrt(dx * dx + dy * dy) || 1
          const force = (distance - linkDistance) * linkStrength * currentAlpha

          const fx = (dx / distance) * force
          const fy = (dy / distance) * force

          source.vx += fx
          source.vy += fy
          target.vx -= fx
          target.vy -= fy
        })

        // Node repulsion force
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const nodeA = nodes[i]
            const nodeB = nodes[j]

            const dx = nodeB.x - nodeA.x
            const dy = nodeB.y - nodeA.y
            const distance = Math.sqrt(dx * dx + dy * dy) || 1

            const force = (nodeStrength * currentAlpha) / (distance * distance)
            const fx = (dx / distance) * force
            const fy = (dy / distance) * force

            nodeA.vx -= fx
            nodeA.vy -= fy
            nodeB.vx += fx
            nodeB.vy += fy
          }
        }

        // Update positions
        nodes.forEach((node) => {
          if (node.fx === undefined) {
            node.vx *= velocityDecay
            node.x += node.vx
            node.x = Math.max(30, Math.min(width - 30, node.x))
          }
          if (node.fy === undefined) {
            node.vy *= velocityDecay
            node.y += node.vy
            node.y = Math.max(30, Math.min(height - 30, node.y))
          }
        })

        currentAlpha -= alphaDecay
      }

      // Render
      ctx.clearRect(0, 0, width, height)

      // Draw edges
      ctx.strokeStyle = "#999"
      ctx.lineWidth = 1
      ctx.font = "10px monospace"
      ctx.fillStyle = "#666"

      // Calculate max pin count for better distribution
      const maxPinCount = Math.max(
        ...netlist.boxes.map((box) =>
          Math.max(
            box.leftPinCount,
            box.rightPinCount,
            box.topPinCount,
            box.bottomPinCount,
          ),
        ),
        8, // minimum for decent spacing
      )

      edges.forEach((edge) => {
        const source = nodes.find((n) => n.id === edge.source)
        const target = nodes.find((n) => n.id === edge.target)
        if (!source || !target) return

        const nodeRadius = 20
        const pinRadius = 28

        // Calculate pin positions around circumference
        const sourceAngle = (edge.sourcePin * 2 * Math.PI) / maxPinCount
        const sourcePinX = source.x + Math.cos(sourceAngle) * nodeRadius
        const sourcePinY = source.y + Math.sin(sourceAngle) * nodeRadius

        const targetAngle = (edge.targetPin * 2 * Math.PI) / maxPinCount
        const targetPinX = target.x + Math.cos(targetAngle) * nodeRadius
        const targetPinY = target.y + Math.sin(targetAngle) * nodeRadius

        // Draw edge from pin to pin
        ctx.beginPath()
        ctx.moveTo(sourcePinX, sourcePinY)
        ctx.lineTo(targetPinX, targetPinY)
        ctx.stroke()

        // Draw pin labels at extended radius
        const sourceLabelX = source.x + Math.cos(sourceAngle) * pinRadius
        const sourceLabelY = source.y + Math.sin(sourceAngle) * pinRadius
        ctx.fillText(`${edge.sourcePin}`, sourceLabelX - 5, sourceLabelY + 3)

        const targetLabelX = target.x + Math.cos(targetAngle) * pinRadius
        const targetLabelY = target.y + Math.sin(targetAngle) * pinRadius
        ctx.fillText(`${edge.targetPin}`, targetLabelX - 5, targetLabelY + 3)
      })

      // Draw nodes
      ctx.fillStyle = "rgba(0,0,0,0.1)"
      ctx.strokeStyle = "#333"
      ctx.lineWidth = 2
      ctx.font = "12px monospace"

      nodes.forEach((node) => {
        // Draw node circle
        ctx.beginPath()
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()

        // Draw box ID
        ctx.fillStyle = "#000"
        const textWidth = ctx.measureText(node.boxId).width
        ctx.fillText(node.boxId, node.x - textWidth / 2, node.y + 4)
        ctx.fillStyle = "#4CAF50"
      })

      animationRef.current = requestAnimationFrame(simulate)
    }

    // Mouse interaction
    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      const mousePos = getMousePos(e)
      const clickedNode = nodes.find((node) => {
        const dx = mousePos.x - node.x
        const dy = mousePos.y - node.y
        return Math.sqrt(dx * dx + dy * dy) < 20
      })

      if (clickedNode) {
        isDragging.current = true
        dragNode.current = clickedNode
        clickedNode.fx = clickedNode.x
        clickedNode.fy = clickedNode.y
        currentAlpha = 0.3 // Restart simulation
        if (!animationRef.current) {
          animationRef.current = requestAnimationFrame(simulate)
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current && dragNode.current) {
        const mousePos = getMousePos(e)
        dragNode.current.fx = mousePos.x
        dragNode.current.fy = mousePos.y
        currentAlpha = 0.3 // Keep simulation active during drag
        if (!animationRef.current) {
          animationRef.current = requestAnimationFrame(simulate)
        }
      }
    }

    const handleMouseUp = () => {
      if (dragNode.current) {
        dragNode.current.fx = undefined
        dragNode.current.fy = undefined
      }
      isDragging.current = false
      dragNode.current = null
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleMouseUp)

    animationRef.current = requestAnimationFrame(simulate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseup", handleMouseUp)
    }
  }, [nodes, edges, width, height])

  return (
    <div className="border border-gray-300 rounded p-2 bg-white">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-200"
        style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
      />
      <div className="mt-2 text-sm text-gray-600">
        <p>
          Nodes: {nodes.length} boxes | Edges: {edges.length} connections
        </p>
        <p>
          Drag nodes to reposition. Pin numbers are shown at edge endpoints.
        </p>
      </div>
    </div>
  )
}
