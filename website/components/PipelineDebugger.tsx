import type { SchematicLayoutPipelineSolver } from "lib/solvers/SchematicLayoutPipelineSolver"
import type { BaseSolver } from "lib/solvers/BaseSolver"
import { PipelineDebuggerSidebar } from "./PipelineDebuggerSidebar"
import { PipelineDebuggerSolverVisualizations } from "./PipelineDebuggerSolverVisualizations"
import { useState, useEffect } from "react"
import { testTscircuitCodeForLayout } from "tests/tscircuit/testTscircuitCodeForLayout"

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

        const inputNetlist = convertCircuitJsonToInputNetlist(
          results.originalCircuitJson,
        )
        const solver = new SchematicLayoutPipelineSolver({
          inputNetlist: inputNetlist,
        })
        await solver.solve()

        setCurrentSolver(solver)
        setSelectedSolver(null)
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div>Loading pipeline...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div style={{ color: "red", textAlign: "center" }}>
          <h2>Pipeline Execution Error</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {currentSolver ? (
          <PipelineDebuggerSidebar
            solver={currentSolver}
            onSolverSelect={setSelectedSolver}
            selectedSolver={selectedSolver}
          />
        ) : (
          <div style={{ padding: "10px", textAlign: "center", color: "#666" }}>
            No solver available.
          </div>
        )}
      </div>
      <div style={{ flex: 1, padding: "20px", overflow: "auto" }}>
        {selectedSolver ? (
          <div>
            <h2>{selectedSolver.constructor.name}</h2>
            <div className="solver-stats">
              <p>
                <strong>Solved:</strong> {selectedSolver.solved ? "Yes" : "No"}
              </p>
              <p>
                <strong>Failed:</strong> {selectedSolver.failed ? "Yes" : "No"}
              </p>
              <p>
                <strong>Iterations:</strong> {selectedSolver.iterations}
              </p>
              <p>
                <strong>Progress:</strong>{" "}
                {(selectedSolver.progress * 100).toFixed(1)}%
              </p>
              {selectedSolver.timeToSolve && (
                <p>
                  <strong>Time to Solve:</strong> {selectedSolver.timeToSolve}ms
                </p>
              )}
              {selectedSolver.error && (
                <p>
                  <strong>Error:</strong>{" "}
                  <span style={{ color: "red" }}>{selectedSolver.error}</span>
                </p>
              )}
            </div>
            <PipelineDebuggerSolverVisualizations solver={selectedSolver} />
          </div>
        ) : currentSolver ? (
          <div className="no-selection">
            <h2>Select a solver stage from the sidebar to inspect its state</h2>
            <p>
              Available stages: {currentSolver.constructor.name} and its
              sub-solvers
            </p>
          </div>
        ) : (
          <div className="no-selection">
            <h2>No pipeline data available</h2>
          </div>
        )}
        <style jsx>{`
          .solver-stats {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 20px;
          }
          .solver-stats p {
            margin: 5px 0;
          }
          .no-selection {
            color: #666;
            font-style: italic;
            text-align: center;
            padding: 40px;
          }
        `}</style>
      </div>
    </div>
  )
}
