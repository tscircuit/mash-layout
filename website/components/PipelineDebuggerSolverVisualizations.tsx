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
      <div key="current-ascii" className="my-5 border border-gray-300 rounded p-4">
        <h3 className="text-lg font-semibold mb-3">Current State (ASCII)</h3>
        <pre className="bg-gray-50 p-2.5 font-mono text-xs overflow-x-auto whitespace-pre">
          {currentStateAscii}
        </pre>
      </div>,
    )
  }

  if (currentStateGD) {
    visualizations.push(
      <div key="current-gd" className="my-5 border border-gray-300 rounded p-4">
        <h3 className="text-lg font-semibold mb-3">Current State (Graphics)</h3>
        <div className="bg-gray-50 p-2.5 font-mono text-xs max-h-96 overflow-auto">
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
      <div key="input-ascii" className="my-5 border border-gray-300 rounded p-4">
        <h3 className="text-lg font-semibold mb-3">Input (ASCII)</h3>
        <pre className="bg-gray-50 p-2.5 font-mono text-xs overflow-x-auto whitespace-pre">
          {inputAscii}
        </pre>
      </div>,
    )
  }

  if (inputGD) {
    visualizations.push(
      <div key="input-gd" className="my-5 border border-gray-300 rounded p-4">
        <h3 className="text-lg font-semibold mb-3">Input (Graphics)</h3>
        <div className="bg-gray-50 p-2.5 font-mono text-xs max-h-96 overflow-auto">
          {JSON.stringify(inputGD, null, 2)}
        </div>
      </div>,
    )
  }

  // Output
  const outputAscii = props.solver.visualizeOutputAscii()
  const outputGD = props.solver.visualizeOutputGD()

  if (outputAscii) {
    visualizations.push(
      <div key="output-ascii" className="my-5 border border-gray-300 rounded p-4">
        <h3 className="text-lg font-semibold mb-3">Output (ASCII)</h3>
        <pre className="bg-gray-50 p-2.5 font-mono text-xs overflow-x-auto whitespace-pre">
          {outputAscii}
        </pre>
      </div>,
    )
  }

  if (outputGD) {
    visualizations.push(
      <div key="output-gd" className="my-5 border border-gray-300 rounded p-4">
        <h3 className="text-lg font-semibold mb-3">Output (Graphics)</h3>
        <div className="bg-gray-50 p-2.5 font-mono text-xs max-h-96 overflow-auto">
          {JSON.stringify(outputGD, null, 2)}
        </div>
      </div>,
    )
  }

  return (
    <div>
      {visualizations.length > 0 ? (
        visualizations
      ) : (
        <div className="text-gray-600 italic text-center py-10">
          No visualizations available for this solver
        </div>
      )}
    </div>
  )
}
