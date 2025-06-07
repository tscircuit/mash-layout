import React from "react"
import corpus1CircuitJson from "tests/corpus/assets/corpus1.circuit.json"
import corpus from "lib/corpus-vfs"
import { circuitBuilderFromLayoutJson } from "lib/utils/circuitBuilderFromLayoutJson"
import { convertCircuitJsonToInputNetlist } from "lib/circuit-json/convertCircuitJsonToInputNetlist"
import { SchematicLayoutPipelineSolver } from "lib/solvers/SchematicLayoutPipelineSolver"
import { applyCircuitLayoutToCircuitJson } from "lib/circuit-json/applyCircuitLayoutToCircuitJson"
import { convertCircuitJsonToSchematicSvg } from "circuit-to-svg"

const corpusLayout = corpus["corpus2025-05-03-abcd1234.json"] as any
const corpusTemplateFn = () => circuitBuilderFromLayoutJson(corpusLayout)

export default function Corpus1Page() {
  const inputNetlist = convertCircuitJsonToInputNetlist(corpus1CircuitJson as any)
  const solver = new SchematicLayoutPipelineSolver({
    inputNetlist,
    templateFns: [corpusTemplateFn],
  })
  solver.solve()

  const matchedTemplate = solver.matchPhaseSolver!.outputMatchedTemplates[0]!.template
  const adaptedTemplate = solver.adaptPhaseSolver!.outputAdaptedTemplates[0]!.template

  const laidOutCircuitJson = applyCircuitLayoutToCircuitJson(
    corpus1CircuitJson as any,
    inputNetlist,
    adaptedTemplate,
  )

  const originalSvg = convertCircuitJsonToSchematicSvg(corpus1CircuitJson as any, {
    grid: { cellSize: 1, labelCells: true },
  })
  const layoutSvg = convertCircuitJsonToSchematicSvg(laidOutCircuitJson as any, {
    grid: { cellSize: 1, labelCells: true },
  })

  return (
    <div style={{ fontFamily: "monospace", padding: 20 }}>
      <h1>Corpus1</h1>
      <h2>Matched Template</h2>
      <pre>{matchedTemplate.toString()}</pre>
      <h2>Adapted Template</h2>
      <pre>{adaptedTemplate.toString()}</pre>
      <h2>Original</h2>
      <div dangerouslySetInnerHTML={{ __html: originalSvg }} />
      <h2>Laid Out</h2>
      <div dangerouslySetInnerHTML={{ __html: layoutSvg }} />
    </div>
  )
}
