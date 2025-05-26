import { BaseSolver } from "lib/solvers/BaseSolver"
import type { SchematicLayoutPipelineSolver } from "lib/solvers/SchematicLayoutPipelineSolver"

export const SidebarTreeNode = (props: {
  solver: BaseSolver
}) => {
  return (
    <div>
      <div>{props.solver.constructor.name}</div>
      <div>
        {props.solver.usedSubSolvers.map((subSolver, i) => (
          <SidebarTreeNode
            key={`${props.solver.constructor.name}-${i}`}
            solver={subSolver}
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
}) => {
  return (
    <div>
      <SidebarTreeNode solver={props.solver} />
    </div>
  )
}
