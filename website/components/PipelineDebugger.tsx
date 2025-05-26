import type { SchematicLayoutPipelineSolver } from "lib/solvers/SchematicLayoutPipelineSolver"
import type { BaseSolver } from "lib/solvers/BaseSolver"
import { PipelineDebuggerSidebar } from "./PipelineDebuggerSidebar"
import { useState } from "react"
import { testTscircuitCodeForLayout } from "tests/tscircuit/testTscircuitCodeForLayout"

/**
 * This component debugs the Schematic Layout Pipeline.
 *
 * You can inspect each stage of the pipeline, and even sub-stages within each
 * stage. Even individual steps!
 *
 */
export const PipelineDebugger = (props: {
  solver?: SchematicLayoutPipelineSolver
}) => {
  const [selectedSolver, setSelectedSolver] = useState<BaseSolver | null>(null)
  const [currentSolver, setCurrentSolver] = useState<SchematicLayoutPipelineSolver | null>(props.solver || null)
  const [tscircuitCode, setTscircuitCode] = useState(`import { sel } from "tscircuit"

export default () => (
  <board routingDisabled>
    <chip
      name="U1"
      footprint="soic4"
      connections={{ pin1: sel.R1.pin1, pin3: sel.net.GND1 }}
    />
    <resistor
      name="R1"
      schX={-3}
      resistance="1k"
      footprint="0402"
      connections={{ pin2: sel.net.GND2 }}
    />
  </board>
)`)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionError, setExecutionError] = useState<string | null>(null)
  const [executionResults, setExecutionResults] = useState<any>(null)

  const executeTscircuitCode = async () => {
    setIsExecuting(true)
    setExecutionError(null)
    setExecutionResults(null)
    
    try {
      const results = await testTscircuitCodeForLayout(tscircuitCode)
      setExecutionResults(results)
      
      // Extract the solver from the execution
      // We need to re-run the solver to get the full pipeline state
      const { SchematicLayoutPipelineSolver } = await import("lib/solvers/SchematicLayoutPipelineSolver")
      const { convertCircuitJsonToInputNetlist } = await import("lib/circuit-json/convertCircuitJsonToInputNetlist")
      
      const inputNetlist = convertCircuitJsonToInputNetlist(results.originalCircuitJson)
      const solver = new SchematicLayoutPipelineSolver({
        inputNetlist: inputNetlist,
      })
      await solver.solve()
      
      setCurrentSolver(solver)
      setSelectedSolver(null) // Clear selection to show the new solver
    } catch (error) {
      setExecutionError(error instanceof Error ? error.message : String(error))
    } finally {
      setIsExecuting(false)
    }
  }

  const renderVisualization = (solver: BaseSolver) => {
    const visualizations = []

    // Current State
    const currentStateAscii = solver.visualizeCurrentStateAscii()
    const currentStateGD = solver.visualizeCurrentStateGD()
    
    if (currentStateAscii) {
      visualizations.push(
        <div key="current-ascii" className="visualization-section">
          <h3>Current State (ASCII)</h3>
          <pre className="ascii-viz">{currentStateAscii}</pre>
        </div>
      )
    }
    
    if (currentStateGD) {
      visualizations.push(
        <div key="current-gd" className="visualization-section">
          <h3>Current State (Graphics)</h3>
          <div className="graphics-viz">{JSON.stringify(currentStateGD, null, 2)}</div>
        </div>
      )
    }

    // Input
    const inputAscii = solver.visualizeInputAscii()
    const inputGD = solver.visualizeInputGD()
    
    if (inputAscii) {
      visualizations.push(
        <div key="input-ascii" className="visualization-section">
          <h3>Input (ASCII)</h3>
          <pre className="ascii-viz">{inputAscii}</pre>
        </div>
      )
    }
    
    if (inputGD) {
      visualizations.push(
        <div key="input-gd" className="visualization-section">
          <h3>Input (Graphics)</h3>
          <div className="graphics-viz">{JSON.stringify(inputGD, null, 2)}</div>
        </div>
      )
    }

    // Output
    const outputAscii = solver.visualizeOutputAscii()
    const outputGD = solver.visualizeOutputGD()
    
    if (outputAscii) {
      visualizations.push(
        <div key="output-ascii" className="visualization-section">
          <h3>Output (ASCII)</h3>
          <pre className="ascii-viz">{outputAscii}</pre>
        </div>
      )
    }
    
    if (outputGD) {
      visualizations.push(
        <div key="output-gd" className="visualization-section">
          <h3>Output (Graphics)</h3>
          <div className="graphics-viz">{JSON.stringify(outputGD, null, 2)}</div>
        </div>
      )
    }

    return visualizations.length > 0 ? visualizations : (
      <div className="no-visualization">No visualizations available for this solver</div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '10px' }}>
        {currentSolver ? (
          <PipelineDebuggerSidebar 
            solver={currentSolver} 
            onSolverSelect={setSelectedSolver}
            selectedSolver={selectedSolver}
          />
        ) : (
          <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
            No solver available.<br />
            Execute TSCircuit code to generate a pipeline.
          </div>
        )}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Code Execution Panel */}
        <div style={{ borderBottom: '1px solid #ccc', padding: '15px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>TSCircuit Code Execution</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button 
              onClick={executeTscircuitCode}
              disabled={isExecuting}
              style={{
                padding: '8px 16px',
                backgroundColor: isExecuting ? '#ccc' : '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isExecuting ? 'not-allowed' : 'pointer'
              }}
            >
              {isExecuting ? 'Executing...' : 'Execute & Debug Pipeline'}
            </button>
          </div>
          <textarea
            value={tscircuitCode}
            onChange={(e) => setTscircuitCode(e.target.value)}
            style={{
              width: '100%',
              height: '150px',
              fontFamily: 'monospace',
              fontSize: '12px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            placeholder="Enter your TSCircuit code here..."
          />
          {executionError && (
            <div style={{ 
              color: 'red', 
              backgroundColor: '#fee', 
              padding: '10px', 
              borderRadius: '4px',
              marginTop: '10px',
              fontSize: '12px'
            }}>
              <strong>Execution Error:</strong> {executionError}
            </div>
          )}
          {executionResults && (
            <div style={{
              backgroundColor: '#e8f5e8',
              padding: '10px',
              borderRadius: '4px',
              marginTop: '10px',
              fontSize: '12px'
            }}>
              <strong>✅ Execution completed successfully!</strong>
              <br />Original circuit has {executionResults.originalCircuitJson.length} elements
              <br />Pipeline generated solver with stages - inspect in sidebar ←
            </div>
          )}
        </div>

        {/* Solver Inspection Panel */}
        <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
          {selectedSolver ? (
            <div>
              <h2>{selectedSolver.constructor.name}</h2>
              <div className="solver-stats">
                <p><strong>Solved:</strong> {selectedSolver.solved ? 'Yes' : 'No'}</p>
                <p><strong>Failed:</strong> {selectedSolver.failed ? 'Yes' : 'No'}</p>
                <p><strong>Iterations:</strong> {selectedSolver.iterations}</p>
                <p><strong>Progress:</strong> {(selectedSolver.progress * 100).toFixed(1)}%</p>
                {selectedSolver.timeToSolve && (
                  <p><strong>Time to Solve:</strong> {selectedSolver.timeToSolve}ms</p>
                )}
                {selectedSolver.error && (
                  <p><strong>Error:</strong> <span style={{ color: 'red' }}>{selectedSolver.error}</span></p>
                )}
              </div>
              <div className="visualizations">
                {renderVisualization(selectedSolver)}
              </div>
            </div>
          ) : currentSolver ? (
            <div className="no-selection">
              <h2>Select a solver stage from the sidebar to inspect its state</h2>
              <p>Available stages: {currentSolver.constructor.name} and its sub-solvers</p>
            </div>
          ) : (
            <div className="no-selection">
              <h2>Execute TSCircuit code above to start debugging the pipeline</h2>
              <p>The default code will create a simple circuit with a chip and resistor.</p>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .visualization-section {
          margin: 20px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 15px;
        }
        .ascii-viz {
          background: #f5f5f5;
          padding: 10px;
          font-family: monospace;
          font-size: 12px;
          overflow-x: auto;
          white-space: pre;
        }
        .graphics-viz {
          background: #f5f5f5;
          padding: 10px;
          font-family: monospace;
          font-size: 11px;
          max-height: 400px;
          overflow: auto;
        }
        .solver-stats {
          background: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .solver-stats p {
          margin: 5px 0;
        }
        .no-visualization, .no-selection {
          color: #666;
          font-style: italic;
          text-align: center;
          padding: 40px;
        }
      `}</style>
    </div>
  )
}
