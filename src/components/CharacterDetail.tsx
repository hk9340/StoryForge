import { useState } from 'react'
import type { CharacterNote, CharacterRelation, Work } from '../data/sampleData'
import './CharacterDetail.css'

interface Props {
  character: CharacterNote
  work: Work
  onClose: () => void
  onSave: (updated: CharacterNote) => void
  isNew?: boolean
}

const COLOR_PALETTE = [
  '#FF6584', '#FF9F43', '#FECA57', '#00B894', '#00CEC9',
  '#6C63FF', '#A29BFE', '#E17055', '#B2BEC3', '#636E72',
  '#FD79A8', '#55EFC4', '#74B9FF', '#DFE6E9', '#2D3436',
]

export default function CharacterDetail({ character, work, onClose, onSave, isNew }: Props) {
  const [form, setForm] = useState({ ...character })
  const [activeTab, setActiveTab] = useState<'info' | 'relations'>('info')
  const [saved, setSaved] = useState(false)
  const [expandedRelation, setExpandedRelation] = useState<number | null>(null)

  const update = <K extends keyof CharacterNote>(key: K, value: CharacterNote[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    onSave(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addRelation = () => {
    const available = work.characters.filter(
      c => c.id !== character.id && !form.relations.some(r => r.targetId === c.id)
    )
    if (available.length === 0) return
    const newRel: CharacterRelation = {
      targetId: available[0].id,
      label: '',
      color: '#6C63FF',
    }
    update('relations', [...form.relations, newRel])
    setExpandedRelation(form.relations.length)
  }

  const updateRelation = (index: number, updates: Partial<CharacterRelation>) => {
    const updated = [...form.relations]
    updated[index] = { ...updated[index], ...updates }
    update('relations', updated)
  }

  const removeRelation = (index: number) => {
    update('relations', form.relations.filter((_, i) => i !== index))
    setExpandedRelation(null)
  }

  return (
    <div className="char-detail-overlay" onClick={onClose}>
      <div className="char-detail-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="char-detail-header">
          <div className="char-detail-avatar">{form.name?.[0] || '?'}</div>
          <div className="char-detail-title">
            <input
              className="char-name-input"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="캐릭터 이름"
              autoFocus={isNew}
            />
            <input
              className="char-role-input"
              value={form.role}
              onChange={e => update('role', e.target.value)}
              placeholder="역할 (예: 주인공, 조력자)"
            />
          </div>
          <div className="char-detail-actions">
            <button className="btn btn--primary btn--sm" onClick={handleSave}>
              {saved ? '저장됨!' : isNew ? '추가' : '저장'}
            </button>
            <button className="char-close-btn" onClick={onClose}>&times;</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="char-detail-tabs">
          <button
            className={`char-tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            기본 정보
          </button>
          <button
            className={`char-tab ${activeTab === 'relations' ? 'active' : ''}`}
            onClick={() => setActiveTab('relations')}
          >
            인물 관계 ({form.relations.length})
          </button>
        </div>

        {/* Content */}
        <div className="char-detail-body">
          {activeTab === 'info' && (
            <div className="char-info-form">
              <div className="char-form-row">
                <div className="char-form-group">
                  <label>나이</label>
                  <input value={form.age || ''} onChange={e => update('age', e.target.value)} placeholder="예: 16세" />
                </div>
                <div className="char-form-group">
                  <label>성별</label>
                  <input value={form.gender || ''} onChange={e => update('gender', e.target.value)} placeholder="예: 여성" />
                </div>
              </div>

              <div className="char-form-group">
                <label>외형</label>
                <textarea
                  value={form.appearance || ''}
                  onChange={e => update('appearance', e.target.value)}
                  placeholder="캐릭터의 외형을 묘사하세요..."
                  rows={2}
                />
              </div>

              <div className="char-form-group">
                <label>성격</label>
                <textarea
                  value={form.personality || ''}
                  onChange={e => update('personality', e.target.value)}
                  placeholder="캐릭터의 성격을 설명하세요..."
                  rows={2}
                />
              </div>

              <div className="char-form-group">
                <label>설명</label>
                <textarea
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="캐릭터에 대한 간단한 설명..."
                  rows={3}
                />
              </div>

              <div className="char-form-group">
                <label>배경 이야기</label>
                <textarea
                  value={form.backstory || ''}
                  onChange={e => update('backstory', e.target.value)}
                  placeholder="캐릭터의 과거와 배경..."
                  rows={4}
                />
              </div>

              <div className="char-form-group">
                <label>태그</label>
                <input
                  value={form.tags.join(', ')}
                  onChange={e => update('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                  placeholder="쉼표로 구분 (예: 주인공, 인간, 소녀)"
                />
              </div>
            </div>
          )}

          {activeTab === 'relations' && (
            <div className="char-relations">
              <div className="char-relations-header">
                <p className="char-relations-desc">
                  다른 캐릭터와의 관계를 자유롭게 설정하세요.
                </p>
                <button className="btn btn--ghost-sm" onClick={addRelation}>+ 관계 추가</button>
              </div>

              {form.relations.length === 0 ? (
                <div className="char-relations-empty">
                  <p>아직 설정된 관계가 없습니다.</p>
                  <button className="btn btn--ghost-sm" onClick={addRelation}>+ 첫 관계 추가</button>
                </div>
              ) : (
                <div className="char-relations-list">
                  {form.relations.map((rel, i) => {
                    const target = work.characters.find(c => c.id === rel.targetId)
                    const isExpanded = expandedRelation === i
                    return (
                      <div key={i} className={`relation-card ${isExpanded ? 'expanded' : ''}`}>
                        {/* Compact row */}
                        <div className="relation-card-header" onClick={() => setExpandedRelation(isExpanded ? null : i)}>
                          <div className="relation-color-dot" style={{ background: rel.color }} />
                          <div className="relation-card-summary">
                            <span className="relation-card-target">{target?.name || '?'}</span>
                            <span className="relation-card-label">{rel.label || '관계 설명 없음'}</span>
                          </div>
                          <span className="relation-card-toggle">{isExpanded ? '▲' : '▼'}</span>
                          <button className="relation-remove" onClick={e => { e.stopPropagation(); removeRelation(i) }}>&times;</button>
                        </div>

                        {/* Expanded form */}
                        {isExpanded && (
                          <div className="relation-card-body">
                            <div className="relation-form-group">
                              <label>대상 캐릭터</label>
                              <select
                                value={rel.targetId}
                                onChange={e => updateRelation(i, { targetId: e.target.value })}
                              >
                                {work.characters.filter(c => c.id !== character.id).map(c => (
                                  <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                                ))}
                              </select>
                            </div>

                            <div className="relation-form-group">
                              <label>관계 이름</label>
                              <input
                                value={rel.label}
                                onChange={e => updateRelation(i, { label: e.target.value })}
                                placeholder="예: 동행자, 라이벌, 스승, 첫사랑..."
                              />
                            </div>

                            <div className="relation-form-group">
                              <label>라인 색상</label>
                              <div className="color-picker">
                                {COLOR_PALETTE.map(c => (
                                  <button
                                    key={c}
                                    className={`color-swatch ${rel.color === c ? 'selected' : ''}`}
                                    style={{ background: c }}
                                    onClick={() => updateRelation(i, { color: c })}
                                  />
                                ))}
                                <input
                                  type="color"
                                  value={rel.color}
                                  onChange={e => updateRelation(i, { color: e.target.value })}
                                  className="color-custom"
                                  title="직접 색상 선택"
                                />
                              </div>
                            </div>

                            <div className="relation-form-group">
                              <label>상세 메모</label>
                              <textarea
                                value={rel.note || ''}
                                onChange={e => updateRelation(i, { note: e.target.value })}
                                placeholder="이 관계에 대해 자유롭게 메모하세요. 만남의 계기, 감정의 변화, 향후 전개 등..."
                                rows={4}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
