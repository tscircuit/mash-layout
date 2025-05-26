import type { BaseSolver } from "lib/solvers/BaseSolver"

export const PipelineDebuggerSolverVisualizations = (props: {
  solver: BaseSolver
}) => {
  const visualizations = props.solver.visualize()

  if (visualizations.length === 0) {
    return (
      <div className="text-gray-600 italic text-center py-10">
        No visualizations available for this solver
      </div>
    )
  }

  return (
    <div>
      {visualizations.map((viz, index) => (
        <div key={`${viz.title}-${index}`} className="my-5 border border-gray-300 rounded p-4">
          <h3 className="text-lg font-semibold mb-3">{viz.title}</h3>
          
          {viz.ascii && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">ASCII View</h4>
              <pre className="bg-gray-50 p-2.5 font-mono text-xs overflow-x-auto whitespace-pre">
                {viz.ascii}
              </pre>
            </div>
          )}
          
          {viz.graphicsObject && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Graphics Object</h4>
              <div className="bg-gray-50 p-2.5 font-mono text-xs max-h-96 overflow-auto">
                {JSON.stringify(viz.graphicsObject, null, 2)}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
