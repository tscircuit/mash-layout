import { SchematicLayoutPipelineSolver } from "lib/solvers/SchematicLayoutPipelineSolver"
import type { BaseSolver } from "lib/solvers/BaseSolver"
import { PipelineDebuggerSidebar } from "./PipelineDebuggerSidebar"
import { PipelineDebuggerSolverVisualizations } from "./PipelineDebuggerSolverVisualizations"
import { ForceDirectedNetlistGraph } from "./ForceDirectedNetlistGraph"
import { useState, useEffect } from "react"
import { testTscircuitCodeForLayout } from "tests/tscircuit/testTscircuitCodeForLayout"
import { convertCircuitJsonToSchematicSvg } from "circuit-to-svg"
import { convertCircuitJsonToInputNetlist } from "lib/circuit-json/convertCircuitJsonToInputNetlist"

/**
 * This component debugs the Schematic Layout Pipeline.
 *
 * You can inspect each stage of the pipeline, and even sub-stages within each
 * stage. Even individual steps!
 *
 */
export const PipelineDebugger = (props: {
  tscircuitCode: string
}) => {
  const [selectedSolver, setSelectedSolver] = useState<BaseSolver | null>(null)
  const [currentSolver, setCurrentSolver] =
    useState<SchematicLayoutPipelineSolver | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [originalSvgString, setOriginalSvgString] = useState<string | null>(
    null,
  )
  const [laidOutSvgString, setLaidOutSvgString] = useState<string | null>(null)
  const [inputNetlist, setInputNetlist] = useState<any>(null)
  const [matchedTemplateNetlist, setMatchedTemplateNetlist] =
    useState<any>(null)
  const [originalCircuitJson, setOriginalCircuitJson] = useState<any>(null)

  useEffect(() => {
    const executeTscircuitCode = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const results = await testTscircuitCodeForLayout(props.tscircuitCode)

        setOriginalSvgString(
          convertCircuitJsonToSchematicSvg(results.originalCircuitJson, {
            grid: {
              cellSize: 1,
              labelCells: true,
            },
          }),
        )

        const inputNetlist = convertCircuitJsonToInputNetlist(
          results.originalCircuitJson,
        )

        // Store for download buttons
        setInputNetlist(inputNetlist)
        setOriginalCircuitJson(results.originalCircuitJson)
        const solver = new SchematicLayoutPipelineSolver({
          inputNetlist: inputNetlist,
        })
        solver.solve()

        // Get matched template netlist if available
        if (solver.matchPhaseSolver?.outputMatchedTemplates[0]?.template) {
          const matchedTemplateNetlist =
            solver.matchPhaseSolver.outputMatchedTemplates[0].template.getNetlist()
          setMatchedTemplateNetlist(matchedTemplateNetlist)
        }

        // Generate the laid out SVG if we have an adapted template
        if (solver.adaptPhaseSolver?.outputAdaptedTemplates[0]?.template) {
          const { applyCircuitLayoutToCircuitJson } = await import(
            "lib/circuit-json/applyCircuitLayoutToCircuitJson"
          )

          const laidOutCircuitJson = applyCircuitLayoutToCircuitJson(
            results.originalCircuitJson,
            inputNetlist,
            solver.adaptPhaseSolver.outputAdaptedTemplates[0].template,
          )

          setLaidOutSvgString(
            convertCircuitJsonToSchematicSvg(laidOutCircuitJson, {
              grid: {
                cellSize: 1,
                labelCells: true,
              },
            }),
          )
        }

        setCurrentSolver(solver)
        setSelectedSolver(solver)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    executeTscircuitCode()
  }, [props.tscircuitCode])

  const downloadJson = (data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading pipeline...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600 text-center">
          <h2>Pipeline Execution Error</h2>
          <p>{error.toString()}</p>
          <pre style={{ textAlign: "left", fontSize: 8, marginTop: 16 }}>
            {(error as Error).stack}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <div className="w-80 border-r border-gray-300 p-2.5">
        {currentSolver ? (
          <PipelineDebuggerSidebar
            solver={currentSolver}
            onSolverSelect={setSelectedSolver}
            selectedSolver={selectedSolver}
          />
        ) : (
          <div className="p-2.5 text-center text-gray-600">
            No solver available.
          </div>
        )}
      </div>
      <div className="flex-1 p-5 overflow-auto">
        {selectedSolver ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {selectedSolver.constructor.name}
            </h2>
            <div className="bg-gray-50 p-4 rounded mb-5">
              <p className="my-1">
                <strong>Solved:</strong> {selectedSolver.solved ? "Yes" : "No"}
              </p>
              <p className="my-1">
                <strong>Failed:</strong> {selectedSolver.failed ? "Yes" : "No"}
              </p>
              <p className="my-1">
                <strong>Iterations:</strong> {selectedSolver.iterations}
              </p>
              <p className="my-1">
                <strong>Progress:</strong>{" "}
                {(selectedSolver.progress * 100).toFixed(1)}%
              </p>
              {selectedSolver.timeToSolve && (
                <p className="my-1">
                  <strong>Time to Solve:</strong> {selectedSolver.timeToSolve}ms
                </p>
              )}
              {selectedSolver.error && (
                <p className="my-1">
                  <strong>Error:</strong>{" "}
                  <span className="text-red-600">{selectedSolver.error}</span>
                </p>
              )}
            </div>
            {selectedSolver.stats &&
              Object.keys(selectedSolver.stats).length > 0 && (
                <div className="bg-gray-50 p-4 rounded mb-5">
                  <h3 className="text-lg font-semibold mb-3">Stats</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">
                            Stat
                          </th>
                          <th className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(selectedSolver.stats).map(
                          ([key, value]) => (
                            <tr key={key} className="hover:bg-gray-50">
                              <td className="border border-gray-300 px-3 py-2 font-medium">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </td>
                              <td className="border border-gray-300 px-3 py-2">
                                {typeof value === "number"
                                  ? value.toLocaleString()
                                  : String(value)}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            {selectedSolver.constructor.name ===
              "SchematicLayoutPipelineSolver" &&
              (inputNetlist || originalCircuitJson) && (
                <div className="bg-gray-50 p-4 rounded mb-5">
                  <h3 className="text-lg font-semibold mb-3">Downloads</h3>
                  <div className="space-x-2">
                    {inputNetlist && (
                      <button
                        type="button"
                        onClick={() =>
                          downloadJson(inputNetlist, "input-netlist.json")
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Download Input Netlist
                      </button>
                    )}
                    {originalCircuitJson && (
                      <button
                        type="button"
                        onClick={() =>
                          downloadJson(
                            originalCircuitJson,
                            "original-circuit.json",
                          )
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Download Original Circuit JSON
                      </button>
                    )}
                  </div>
                </div>
              )}
            {selectedSolver.constructor.name ===
              "SchematicLayoutPipelineSolver" &&
              (originalSvgString ||
                laidOutSvgString ||
                inputNetlist ||
                matchedTemplateNetlist) && (
                <div className="mb-5">
                  <h3 className="text-lg font-semibold mb-3">
                    Circuit Visualization
                  </h3>
                  <div className="space-y-4">
                    {inputNetlist && (
                      <div>
                        <h4 className="text-md font-medium mb-2">
                          Input Netlist Graph
                        </h4>
                        <ForceDirectedNetlistGraph
                          netlist={inputNetlist}
                          width={800}
                          height={400}
                        />
                      </div>
                    )}
                    {matchedTemplateNetlist && (
                      <div>
                        <h4 className="text-md font-medium mb-2">
                          Matched Template Netlist Graph
                        </h4>
                        <ForceDirectedNetlistGraph
                          netlist={matchedTemplateNetlist}
                          width={800}
                          height={400}
                        />
                      </div>
                    )}
                    {originalSvgString && (
                      <div>
                        <h4 className="text-md font-medium mb-2">
                          Original Circuit
                        </h4>
                        <div className="border border-gray-300 rounded p-2 bg-white">
                          <div
                            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                            dangerouslySetInnerHTML={{
                              __html: originalSvgString,
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {laidOutSvgString && (
                      <div>
                        <h4 className="text-md font-medium mb-2">
                          After Layout Applied
                        </h4>
                        <div className="border border-gray-300 rounded p-2 bg-white">
                          <div
                            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                            dangerouslySetInnerHTML={{
                              __html: laidOutSvgString,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            {selectedSolver.constructor.name ===
              "ScoreNetlistTemplatePairSolver" && (
              <div className="mb-5">
                <h3 className="text-lg font-semibold mb-3">
                  Netlist Comparison
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-medium mb-2">
                      Input Netlist Graph
                    </h4>
                    <ForceDirectedNetlistGraph
                      netlist={(selectedSolver as any).inputNetlist}
                      width={800}
                      height={400}
                    />
                  </div>
                  <div>
                    <h4 className="text-md font-medium mb-2">
                      Template Netlist Graph
                    </h4>
                    <ForceDirectedNetlistGraph
                      netlist={(selectedSolver as any).template.getNetlist()}
                      width={800}
                      height={400}
                    />
                  </div>
                </div>
              </div>
            )}
            <PipelineDebuggerSolverVisualizations solver={selectedSolver} />
          </div>
        ) : currentSolver ? (
          <div className="text-gray-600 italic text-center py-10">
            <h2 className="text-xl mb-2">
              Select a solver stage from the sidebar to inspect its state
            </h2>
            <p>
              Available stages: {currentSolver.constructor.name} and its
              sub-solvers
            </p>
          </div>
        ) : (
          <div className="text-gray-600 italic text-center py-10">
            <h2 className="text-xl">No pipeline data available</h2>
          </div>
        )}
      </div>
    </div>
  )
}
