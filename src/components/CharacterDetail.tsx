import { useState } from 'react'
import type { CharacterNote, CharacterRelation, Work } from '../data/sampleData'
import './CharacterDetail.css'

interface Props {
  character: CharacterNote
  work: Work
  onClose: () => void
  onSave: (updated: CharacterNote) => void
}

const RELATION_TYPES: { value: CharacterRelation['type']; label: string; color: string }[] = [
  { value: 'ally', label: '우호', color: '#00B894' },
  { value: 'enemy', label: '적대', color: '#FF6584' },
  { value: 'family', label: '가족', color: '#6C63FF' },
  { value: 'romantic', label: '연인', color: '#E17055' },
  { value: 'neutral', label: '중립', color: '#B2BEC3' },
]

export default function CharacterDetail({ character, work, onClose, onSave }: Props) {
  const [form, setForm] = useState({ ...character })
  const [activeTab, setActiveTab] = useState<'info' | 'relations'>('info')
  const [saved, setSaved] = useState(false)

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
    update('relations', [
      ...form.relations,
      { targetId: available[0].id, label: '', type: 'neutral' as const },
    ])
  }

  const updateRelation = (index: number, field: keyof CharacterRelation, value: string) => {
    const updated = [...form.relations]
    updated[index] = { ...updated[index], [field]: value }
    update('relations', updated)
  }

  const removeRelation = (index: number) => {
    update('relations', form.relations.filter((_, i) => i !== index))
  }

  const getRelTypeInfo = (type: string) =>
    RELATION_TYPES.find(t => t.value === type) || RELATION_TYPES[4]

  return (
    <div className="char-detail-overlay" onClick={onClose}>
      <div className="char-detail-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="char-detail-header">
          <div className="char-detail-avatar">{form.name[0]}</div>
          <div className="char-detail-title">
            <input
              className="char-name-input"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="캐릭터 이름"
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
              {saved ? '저장됨!' : '저장'}
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
                  다른 캐릭터와의 관계를 설정하세요. 관계도 탭에서 다이어그램으로 확인할 수 있습니다.
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
                    const typeInfo = getRelTypeInfo(rel.type)
                    return (
                      <div key={i} className="relation-item">
                        <div className="relation-item-left">
                          <div className="relation-target-avatar" style={{ background: typeInfo.color }}>
                            {target?.name[0] || '?'}
                          </div>
                          <div className="relation-item-fields">
                            <select
                              value={rel.targetId}
                              onChange={e => updateRelation(i, 'targetId', e.target.value)}
                            >
                              {work.characters.filter(c => c.id !== character.id).map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                            <input
                              className="relation-label-input"
                              value={rel.label}
                              onChange={e => updateRelation(i, 'label', e.target.value)}
                              placeholder="관계 설명 (예: 동행자, 라이벌)"
                            />
                          </div>
                        </div>
                        <div className="relation-item-right">
                          <select
                            className="relation-type-select"
                            value={rel.type}
                            onChange={e => updateRelation(i, 'type', e.target.value)}
                            style={{ borderColor: typeInfo.color }}
                          >
                            {RELATION_TYPES.map(t => (
                              <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                          </select>
                          <button className="relation-remove" onClick={() => removeRelation(i)}>&times;</button>
                        </div>
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
