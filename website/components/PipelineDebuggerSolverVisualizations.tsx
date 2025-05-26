import type { BaseSolver } from "lib/solvers/BaseSolver"

export const PipelineDebuggerSolverVisualizations = (props: {
  solver: BaseSolver
}) => {
  const visualizations = []

  // Current State
  const currentStateAscii = props.solver.visualizeCurrentStateAscii()
  const currentStateGD = props.solver.visualizeCurrentStateGD()

  if (currentStateAscii) {
    visualizations.push(
      <div key="current-ascii" className="visualization-section">
        <h3>Current State (ASCII)</h3>
        <pre className="ascii-viz">{currentStateAscii}</pre>
      </div>,
    )
  }

  if (currentStateGD) {
    visualizations.push(
      <div key="current-gd" className="visualization-section">
        <h3>Current State (Graphics)</h3>
        <div className="graphics-viz">
          {JSON.stringify(currentStateGD, null, 2)}
        </div>
      </div>,
    )
  }

  // Input
  const inputAscii = props.solver.visualizeInputAscii()
  const inputGD = props.solver.visualizeInputGD()

  if (inputAscii) {
    visualizations.push(
      <div key="input-ascii" className="visualization-section">
        <h3>Input (ASCII)</h3>
        <pre className="ascii-viz">{inputAscii}</pre>
      </div>,
    )
  }

  if (inputGD) {
    visualizations.push(
      <div key="input-gd" className="visualization-section">
        <h3>Input (Graphics)</h3>
        <div className="graphics-viz">{JSON.stringify(inputGD, null, 2)}</div>
      </div>,
    )
  }

  // Output
  const outputAscii = props.solver.visualizeOutputAscii()
  const outputGD = props.solver.visualizeOutputGD()

  if (outputAscii) {
    visualizations.push(
      <div key="output-ascii" className="visualization-section">
        <h3>Output (ASCII)</h3>
        <pre className="ascii-viz">{outputAscii}</pre>
      </div>,
    )
  }

  if (outputGD) {
    visualizations.push(
      <div key="output-gd" className="visualization-section">
        <h3>Output (Graphics)</h3>
        <div className="graphics-viz">{JSON.stringify(outputGD, null, 2)}</div>
      </div>,
    )
  }

  return (
    <div className="visualizations">
      {visualizations.length > 0 ? (
        visualizations
      ) : (
        <div className="no-visualization">
          No visualizations available for this solver
        </div>
      )}
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
        .no-visualization {
          color: #666;
          font-style: italic;
          text-align: center;
          padding: 40px;
        }
      `}</style>
    </div>
  )
}
