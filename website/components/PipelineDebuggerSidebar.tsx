import { BaseSolver } from "lib/solvers/BaseSolver"
import type { SchematicLayoutPipelineSolver } from "lib/solvers/SchematicLayoutPipelineSolver"

export const SidebarTreeNode = (props: {
  solver: BaseSolver
  onSolverSelect: (solver: BaseSolver) => void
  selectedSolver: BaseSolver | null
  depth?: number
}) => {
  const depth = props.depth || 0
  const isSelected = props.selectedSolver === props.solver

  return (
    <div style={{ marginLeft: `${depth * 20}px` }}>
      <button
        type="button"
        onClick={() => props.onSolverSelect(props.solver)}
        className={`
          w-full text-left cursor-pointer p-2 rounded border-2 my-0.5
          transition-colors duration-150
          ${isSelected 
            ? 'bg-blue-50 border-blue-500 font-bold' 
            : 'bg-transparent border-transparent hover:bg-gray-50'
          }
        `}
      >
        <div className={isSelected ? "font-bold" : "font-normal"}>
          {props.solver.constructor.name}
        </div>
        <div className="text-xs text-gray-600 mt-0.5">
          {props.solver.solved ? "✅" : props.solver.failed ? "❌" : "⏳"}{" "}
          Iterations: {props.solver.iterations}
          {props.solver.progress > 0 &&
            ` (${(props.solver.progress * 100).toFixed(0)}%)`}
        </div>
      </button>
      <div>
        {props.solver.usedSubSolvers.map((subSolver, i) => (
          <SidebarTreeNode
            key={`${props.solver.constructor.name}-${i}`}
            solver={subSolver}
            onSolverSelect={props.onSolverSelect}
            selectedSolver={props.selectedSolver}
            depth={depth + 1}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * A tree view that shows different stages and sub-stages, allowing you to click
 * in and inspect the state of the pipeline at each stage.
 */
export const PipelineDebuggerSidebar = (props: {
  solver: SchematicLayoutPipelineSolver
  onSolverSelect: (solver: BaseSolver) => void
  selectedSolver: BaseSolver | null
}) => {
  return (
    <div>
      <h3 className="mb-4 px-2 font-semibold text-gray-800">
        Pipeline Stages
      </h3>
      <SidebarTreeNode
        solver={props.solver}
        onSolverSelect={props.onSolverSelect}
        selectedSolver={props.selectedSolver}
      />
    </div>
  )
}
