import type { SchematicLayoutPipelineSolver } from "lib/solvers/SchematicLayoutPipelineSolver"
import type { BaseSolver } from "lib/solvers/BaseSolver"
import { PipelineDebuggerSidebar } from "./PipelineDebuggerSidebar"
import { PipelineDebuggerSolverVisualizations } from "./PipelineDebuggerSolverVisualizations"
import { useState, useEffect } from "react"
import { testTscircuitCodeForLayout } from "tests/tscircuit/testTscircuitCodeForLayout"
import { convertCircuitJsonToSchematicSvg } from "circuit-to-svg"

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
  const [error, setError] = useState<string | null>(null)
  const [originalSvgString, setOriginalSvgString] = useState<string | null>(
    null,
  )

  useEffect(() => {
    const executeTscircuitCode = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const results = await testTscircuitCodeForLayout(props.tscircuitCode)

        // Extract the solver from the execution
        // We need to re-run the solver to get the full pipeline state
        const { SchematicLayoutPipelineSolver } = await import(
          "lib/solvers/SchematicLayoutPipelineSolver"
        )
        const { convertCircuitJsonToInputNetlist } = await import(
          "lib/circuit-json/convertCircuitJsonToInputNetlist"
        )

        setOriginalSvgString(
          convertCircuitJsonToSchematicSvg(results.originalCircuitJson),
        )

        const inputNetlist = convertCircuitJsonToInputNetlist(
          results.originalCircuitJson,
        )
        const solver = new SchematicLayoutPipelineSolver({
          inputNetlist: inputNetlist,
        })
        await solver.solve()

        setCurrentSolver(solver)
        setSelectedSolver(solver)
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setIsLoading(false)
      }
    }

    executeTscircuitCode()
  }, [props.tscircuitCode])

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
          <p>{error}</p>
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
              originalSvgString && (
                <div>
                  <div
                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                    dangerouslySetInnerHTML={{
                      __html: originalSvgString,
                    }}
                  />
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
