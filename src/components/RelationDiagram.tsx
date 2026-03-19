import { useMemo, useState, useRef } from 'react'
import type { CharacterNote, CharacterRelation } from '../data/sampleData'
import './RelationDiagram.css'

interface Props {
  characters: CharacterNote[]
  onSelectCharacter: (char: CharacterNote) => void
  onUpdateRelation?: (charId: string, relIndex: number, updates: Partial<CharacterRelation>) => void
}

interface NodePos {
  x: number
  y: number
  char: CharacterNote
}

interface Edge {
  from: NodePos
  to: NodePos
  label: string
  color: string
  note?: string
  charId: string
  relIndex: number
  ctrlX: number
  ctrlY: number
  lx: number
  ly: number
  x1: number
  y1: number
  x2: number
  y2: number
}

interface SelectedEdge {
  edge: Edge
  label: string
  note: string
  color: string
}

interface TooltipState {
  edge: Edge
  screenX: number
  screenY: number
}

const COLOR_PALETTE = [
  '#FF6584', '#FF9F43', '#FECA57', '#00B894', '#00CEC9',
  '#6C63FF', '#A29BFE', '#E17055', '#B2BEC3', '#636E72',
]

export default function RelationDiagram({ characters, onSelectCharacter, onUpdateRelation }: Props) {
  const width = 700
  const height = 500
  const [selectedEdge, setSelectedEdge] = useState<SelectedEdge | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const nodes = useMemo<NodePos[]>(() => {
    const cx = width / 2
    const cy = height / 2
    const radius = Math.min(width, height) * 0.32
    return characters.map((char, i) => {
      const angle = (2 * Math.PI * i) / characters.length - Math.PI / 2
      return {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
        char,
      }
    })
  }, [characters])

  const edges = useMemo<Edge[]>(() => {
    const result: Edge[] = []
    const pairCount = new Map<string, number>()

    for (const node of nodes) {
      for (const rel of node.char.relations) {
        const targetNode = nodes.find(n => n.char.id === rel.targetId)
        if (!targetNode) continue
        const pairKey = [node.char.id, targetNode.char.id].sort().join('-')
        pairCount.set(pairKey, (pairCount.get(pairKey) || 0) + 1)
      }
    }

    const pairIndex = new Map<string, number>()
    const nodeR = 30

    for (const node of nodes) {
      for (let ri = 0; ri < node.char.relations.length; ri++) {
        const rel = node.char.relations[ri]
        const targetNode = nodes.find(n => n.char.id === rel.targetId)
        if (!targetNode) continue

        const pairKey = [node.char.id, targetNode.char.id].sort().join('-')
        const total = pairCount.get(pairKey) || 1
        const idx = pairIndex.get(pairKey) || 0
        pairIndex.set(pairKey, idx + 1)

        const dx = targetNode.x - node.x
        const dy = targetNode.y - node.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const ux = dx / dist  // unit vector along line
        const uy = dy / dist
        const px = -uy  // perpendicular vector
        const py = ux

        // For bidirectional: two parallel straight lines offset perpendicular
        // For single: slight curve for aesthetics
        const lineShift = total > 1 ? (idx === 0 ? 10 : -10) : 0
        const curveAmount = total > 1 ? 0 : 20  // no curve for parallel, slight curve for single

        const x1 = node.x + ux * nodeR + px * lineShift
        const y1 = node.y + uy * nodeR + py * lineShift
        const x2 = targetNode.x - ux * nodeR + px * lineShift
        const y2 = targetNode.y - uy * nodeR + py * lineShift

        const mx = (x1 + x2) / 2
        const my = (y1 + y2) / 2
        const ctrlX = mx + px * curveAmount
        const ctrlY = my + py * curveAmount

        // Label position: for bidirectional at 35% from source, single at center
        const t = total > 1 ? 0.35 : 0.5
        const t1 = 1 - t
        const lx = t1 * t1 * x1 + 2 * t1 * t * ctrlX + t * t * x2
        const ly = t1 * t1 * y1 + 2 * t1 * t * ctrlY + t * t * y2

        result.push({
          from: node, to: targetNode,
          label: rel.label, color: rel.color, note: rel.note,
          charId: node.char.id, relIndex: ri,
          ctrlX, ctrlY, lx, ly, x1, y1, x2, y2,
        })
      }
    }
    return result
  }, [nodes])

  const handleEdgeClick = (edge: Edge, e: React.MouseEvent) => {
    e.stopPropagation()
    setTooltip({ edge, screenX: e.clientX, screenY: e.clientY })
  }

  const openEditFromTooltip = () => {
    if (!tooltip) return
    setSelectedEdge({
      edge: tooltip.edge,
      label: tooltip.edge.label,
      note: tooltip.edge.note || '',
      color: tooltip.edge.color,
    })
    setTooltip(null)
  }

  const handleEdgeSave = () => {
    if (!selectedEdge || !onUpdateRelation) return
    const { edge, label, note, color } = selectedEdge
    onUpdateRelation(edge.charId, edge.relIndex, { label, note, color })
    setSelectedEdge(null)
  }

  if (characters.length === 0) {
    return (
      <div className="diagram-empty">
        <p>캐릭터를 추가하면 관계도가 표시됩니다.</p>
      </div>
    )
  }

  return (
    <div className="diagram-container">
      <div className="diagram-svg-wrapper" onClick={() => setTooltip(null)}>
        <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="diagram-svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
            {edges.map((edge, i) => (
              <marker
                key={`arrow-${i}`}
                id={`arrow-${i}`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 8 5 L 0 9 z" fill={edge.color} opacity="0.7" />
              </marker>
            ))}
          </defs>

          {/* Edges */}
          {edges.map((edge, i) => {
            const isActive = tooltip?.edge.charId === edge.charId && tooltip?.edge.relIndex === edge.relIndex
            const pathD = `M ${edge.x1} ${edge.y1} Q ${edge.ctrlX} ${edge.ctrlY} ${edge.x2} ${edge.y2}`

            return (
              <g key={i}>
                {/* Invisible thick line for easier clicking */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="16"
                  style={{ cursor: 'pointer' }}
                  onClick={e => handleEdgeClick(edge, e)}
                />
                {/* Visible line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={edge.color}
                  strokeWidth={isActive ? 3.5 : 2}
                  opacity={isActive ? 1 : 0.7}
                  style={{ cursor: 'pointer' }}
                  onClick={e => handleEdgeClick(edge, e)}
                  markerEnd={`url(#arrow-${i})`}
                />
                {/* Edge label */}
                {edge.label && (
                  <g style={{ cursor: 'pointer' }} onClick={e => handleEdgeClick(edge, e)}>
                    <rect
                      x={edge.lx - Math.min(edge.label.length * 5 + 4, 80)}
                      y={edge.ly - 10}
                      width={Math.min(edge.label.length * 10 + 8, 160)}
                      height={20}
                      rx="4"
                      fill="white"
                      stroke={isActive ? edge.color : 'var(--border)'}
                      strokeWidth={isActive ? 2 : 1}
                      opacity="0.95"
                    />
                    <text
                      x={edge.lx}
                      y={edge.ly + 4}
                      textAnchor="middle"
                      fill={edge.color}
                      fontSize="11"
                      fontWeight="600"
                      fontFamily="var(--sans)"
                    >
                      {edge.label.length > 14 ? edge.label.slice(0, 14) + '…' : edge.label}
                    </text>
                  </g>
                )}
                {/* Note indicator */}
                {edge.note && (
                  <circle
                    cx={edge.lx + Math.min(edge.label.length * 5 + 8, 84)}
                    cy={edge.ly}
                    r="5"
                    fill={edge.color}
                    opacity="0.6"
                  />
                )}
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map(node => (
            <g
              key={node.char.id}
              className="diagram-node"
              onClick={() => onSelectCharacter(node.char)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={node.x} cy={node.y} r={34} fill="none" stroke="var(--primary)" strokeWidth="1" opacity="0.15" />
              <circle cx={node.x} cy={node.y} r={30} fill="url(#grad)" stroke="white" strokeWidth="3" />
              <text x={node.x} y={node.y + 6} textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="var(--sans)">
                {node.char.name[0]}
              </text>
              <text x={node.x} y={node.y + 50} textAnchor="middle" fill="var(--text-primary)" fontSize="13" fontWeight="600" fontFamily="var(--sans)">
                {node.char.name}
              </text>
              <text x={node.x} y={node.y + 65} textAnchor="middle" fill="var(--text-light)" fontSize="10" fontFamily="var(--sans)">
                {node.char.role}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Edge tooltip (click to view) */}
      {tooltip && (
        <div className="edge-tooltip-overlay" onClick={() => setTooltip(null)}>
          <div
            className="edge-tooltip"
            style={{
              top: Math.min(tooltip.screenY + 8, window.innerHeight - 200),
              left: Math.min(tooltip.screenX, window.innerWidth - 300),
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="edge-tooltip-header">
              <span className="edge-tooltip-color" style={{ background: tooltip.edge.color }} />
              <span className="edge-tooltip-names">
                {tooltip.edge.from.char.name} → {tooltip.edge.to.char.name}
              </span>
            </div>
            <div className="edge-tooltip-label">{tooltip.edge.label || '관계 설명 없음'}</div>
            {tooltip.edge.note && (
              <p className="edge-tooltip-note">{tooltip.edge.note}</p>
            )}
            <div className="edge-tooltip-actions">
              <button className="btn btn--primary btn--sm" onClick={openEditFromTooltip}>수정</button>
              <button className="btn btn--ghost-sm" onClick={() => setTooltip(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {/* Edge edit popup */}
      {selectedEdge && (
        <div className="edge-edit-overlay" onClick={() => setSelectedEdge(null)}>
          <div className="edge-edit-panel" onClick={e => e.stopPropagation()}>
            <div className="edge-edit-header">
              <div className="edge-edit-title">
                <span className="edge-color-dot" style={{ background: selectedEdge.color }} />
                <h3>
                  {characters.find(c => c.id === selectedEdge.edge.from.char.id)?.name}
                  {' → '}
                  {characters.find(c => c.id === selectedEdge.edge.to.char.id)?.name}
                </h3>
              </div>
              <button className="edge-edit-close" onClick={() => setSelectedEdge(null)}>&times;</button>
            </div>

            <div className="edge-edit-body">
              <div className="edge-form-group">
                <label>관계 이름</label>
                <input
                  value={selectedEdge.label}
                  onChange={e => setSelectedEdge({ ...selectedEdge, label: e.target.value })}
                  placeholder="관계를 설명하는 짧은 이름..."
                />
              </div>

              <div className="edge-form-group">
                <label>라인 색상</label>
                <div className="color-picker">
                  {COLOR_PALETTE.map(c => (
                    <button
                      key={c}
                      className={`color-swatch ${selectedEdge.color === c ? 'selected' : ''}`}
                      style={{ background: c }}
                      onClick={() => setSelectedEdge({ ...selectedEdge, color: c })}
                    />
                  ))}
                  <input
                    type="color"
                    value={selectedEdge.color}
                    onChange={e => setSelectedEdge({ ...selectedEdge, color: e.target.value })}
                    className="color-custom"
                    title="직접 색상 선택"
                  />
                </div>
              </div>

              <div className="edge-form-group">
                <label>상세 메모</label>
                <textarea
                  value={selectedEdge.note}
                  onChange={e => setSelectedEdge({ ...selectedEdge, note: e.target.value })}
                  placeholder="이 관계에 대한 메모를 자유롭게 작성하세요..."
                  rows={5}
                />
              </div>
            </div>

            <div className="edge-edit-footer">
              <button className="btn btn--ghost-sm" onClick={() => setSelectedEdge(null)}>취소</button>
              <button className="btn btn--primary btn--sm" onClick={handleEdgeSave}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
