import { useMemo } from 'react'
import type { CharacterNote } from '../data/sampleData'
import './RelationDiagram.css'

interface Props {
  characters: CharacterNote[]
  onSelectCharacter: (char: CharacterNote) => void
}

const RELATION_COLORS: Record<string, string> = {
  ally: '#00B894',
  enemy: '#FF6584',
  family: '#6C63FF',
  romantic: '#E17055',
  neutral: '#B2BEC3',
}

const RELATION_LABELS: Record<string, string> = {
  ally: '우호',
  enemy: '적대',
  family: '가족',
  romantic: '연인',
  neutral: '중립',
}

interface NodePos {
  x: number
  y: number
  char: CharacterNote
}

export default function RelationDiagram({ characters, onSelectCharacter }: Props) {
  const width = 700
  const height = 500

  // Position nodes in a circle
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

  // Collect edges (deduplicated)
  const edges = useMemo(() => {
    const seen = new Set<string>()
    const result: { from: NodePos; to: NodePos; label: string; type: string }[] = []

    for (const node of nodes) {
      for (const rel of node.char.relations) {
        const targetNode = nodes.find(n => n.char.id === rel.targetId)
        if (!targetNode) continue

        const edgeKey = [node.char.id, targetNode.char.id].sort().join('-')
        if (seen.has(edgeKey)) continue
        seen.add(edgeKey)

        result.push({
          from: node,
          to: targetNode,
          label: rel.label,
          type: rel.type,
        })
      }
    }
    return result
  }, [nodes])

  if (characters.length === 0) {
    return (
      <div className="diagram-empty">
        <p>캐릭터를 추가하면 관계도가 표시됩니다.</p>
      </div>
    )
  }

  return (
    <div className="diagram-container">
      <div className="diagram-legend">
        {Object.entries(RELATION_LABELS).map(([key, label]) => (
          <span key={key} className="legend-item">
            <span className="legend-line" style={{ background: RELATION_COLORS[key] }} />
            {label}
          </span>
        ))}
      </div>

      <div className="diagram-svg-wrapper">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="diagram-svg"
        >
          <defs>
            {Object.entries(RELATION_COLORS).map(([key, color]) => (
              <marker
                key={key}
                id={`arrow-${key}`}
                viewBox="0 0 10 6"
                refX="10"
                refY="3"
                markerWidth="8"
                markerHeight="6"
                orient="auto"
              >
                <path d="M0,0 L10,3 L0,6 Z" fill={color} />
              </marker>
            ))}
          </defs>

          {/* Edges */}
          {edges.map((edge, i) => {
            const color = RELATION_COLORS[edge.type] || '#B2BEC3'
            const dx = edge.to.x - edge.from.x
            const dy = edge.to.y - edge.from.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            const nx = dx / dist
            const ny = dy / dist
            const nodeR = 30
            const x1 = edge.from.x + nx * nodeR
            const y1 = edge.from.y + ny * nodeR
            const x2 = edge.to.x - nx * nodeR
            const y2 = edge.to.y - ny * nodeR
            const mx = (x1 + x2) / 2
            const my = (y1 + y2) / 2

            // Curve offset for better readability
            const cx = mx + ny * 20
            const cy = my - nx * 20

            return (
              <g key={i}>
                <path
                  d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="2"
                  strokeDasharray={edge.type === 'neutral' ? '6,4' : 'none'}
                  opacity="0.7"
                />
                {/* Edge label */}
                {edge.label && (
                  <g>
                    <rect
                      x={cx - edge.label.length * 5 - 4}
                      y={cy - 10}
                      width={edge.label.length * 10 + 8}
                      height={20}
                      rx="4"
                      fill="white"
                      stroke={color}
                      strokeWidth="1"
                      opacity="0.95"
                    />
                    <text
                      x={cx}
                      y={cy + 4}
                      textAnchor="middle"
                      fill={color}
                      fontSize="11"
                      fontWeight="600"
                      fontFamily="var(--sans)"
                    >
                      {edge.label}
                    </text>
                  </g>
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
              {/* Glow */}
              <circle
                cx={node.x}
                cy={node.y}
                r={34}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1"
                opacity="0.15"
              />
              {/* Circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={30}
                fill="url(#grad)"
                stroke="white"
                strokeWidth="3"
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--accent)" />
                </linearGradient>
              </defs>
              {/* Initial */}
              <text
                x={node.x}
                y={node.y + 6}
                textAnchor="middle"
                fill="white"
                fontSize="18"
                fontWeight="700"
                fontFamily="var(--sans)"
              >
                {node.char.name[0]}
              </text>
              {/* Name label */}
              <text
                x={node.x}
                y={node.y + 50}
                textAnchor="middle"
                fill="var(--text-primary)"
                fontSize="13"
                fontWeight="600"
                fontFamily="var(--sans)"
              >
                {node.char.name}
              </text>
              {/* Role label */}
              <text
                x={node.x}
                y={node.y + 65}
                textAnchor="middle"
                fill="var(--text-light)"
                fontSize="10"
                fontFamily="var(--sans)"
              >
                {node.char.role}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
