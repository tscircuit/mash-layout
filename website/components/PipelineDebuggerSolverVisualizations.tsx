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
        <div
          key={`${viz.title}-${index}`}
          className="my-5 border border-gray-300 rounded p-4"
        >
          <h3 className="text-lg font-semibold mb-3">{viz.title}</h3>

          {viz.ascii && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                ASCII View
              </h4>
              <pre className="bg-gray-50 p-2.5 font-mono text-xs overflow-x-auto whitespace-pre">
                {viz.ascii}
              </pre>
            </div>
          )}

          {viz.graphicsObject && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Graphics Object
              </h4>
              <div className="bg-gray-50 p-2.5 font-mono text-xs max-h-96 overflow-auto">
                {JSON.stringify(viz.graphicsObject, null, 2)}
              </div>
            </div>
          )}

          {viz.table && viz.table.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Issues Table
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(viz.table[0]).map((header) => (
                        <th
                          key={header}
                          className="border border-gray-300 px-2 py-1 text-left font-medium text-gray-700"
                        >
                          {header
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {viz.table.map((row, rowIndex) => (
                      <tr
                        key={`row-${rowIndex}-${JSON.stringify(row).slice(0, 50)}`}
                        className={
                          rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }
                      >
                        {Object.entries(row).map(([key, value]) => (
                          <td
                            key={`${key}-${String(value)}`}
                            className="border border-gray-300 px-2 py-1"
                          >
                            {key.toLowerCase().includes("details") ? (
                              <details className="cursor-pointer">
                                <summary className="text-blue-600 hover:text-blue-800">
                                  Show details
                                </summary>
                                <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto max-w-md">
                                  {JSON.stringify(value, null, 2)}
                                </pre>
                              </details>
                            ) : (
                              String(value)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
