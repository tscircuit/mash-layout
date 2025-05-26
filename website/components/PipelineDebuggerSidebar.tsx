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
      <div 
        onClick={() => props.onSolverSelect(props.solver)}
        style={{
          cursor: 'pointer',
          padding: '8px',
          backgroundColor: isSelected ? '#e3f2fd' : 'transparent',
          borderRadius: '4px',
          border: isSelected ? '2px solid #2196f3' : '2px solid transparent',
          margin: '2px 0'
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = '#f5f5f5'
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = 'transparent'
          }
        }}
      >
        <div style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
          {props.solver.constructor.name}
        </div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
          {props.solver.solved ? '✅' : props.solver.failed ? '❌' : '⏳'} 
          {' '}Iterations: {props.solver.iterations}
          {props.solver.progress > 0 && ` (${(props.solver.progress * 100).toFixed(0)}%)`}
        </div>
      </div>
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
      <h3 style={{ margin: '0 0 15px 0', padding: '0 8px' }}>Pipeline Stages</h3>
      <SidebarTreeNode 
        solver={props.solver} 
        onSolverSelect={props.onSolverSelect}
        selectedSolver={props.selectedSolver}
      />
    </div>
  )
}
