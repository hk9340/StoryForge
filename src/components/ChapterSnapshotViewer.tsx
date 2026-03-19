import { useState } from 'react'
import type { CharacterNote, ChapterRelationSnapshot, ChapterCharRelation, Chapter } from '../data/sampleData'
import RelationDiagram from './RelationDiagram'

interface Props {
  chapterId: string
  chapters: Chapter[]
  characters: CharacterNote[]
  chapterSnapshots: ChapterRelationSnapshot[]
  onUpdateSnapshots: (snapshots: ChapterRelationSnapshot[]) => void
  onClose: () => void
}

export default function ChapterSnapshotViewer({
  chapterId, chapters, characters, chapterSnapshots, onUpdateSnapshots, onClose,
}: Props) {
  const snapshot = chapterSnapshots.find(s => s.chapterId === chapterId)
  const [copySource, setCopySource] = useState<string>('global')

  const chaptersWithSnapshot = chapterSnapshots
    .map(s => chapters.find(c => c.id === s.chapterId))
    .filter(Boolean) as Chapter[]

  const createSnapshot = () => {
    let relations: ChapterCharRelation[] = []

    if (copySource === 'global') {
      // Copy from global character relations
      for (const char of characters) {
        for (const rel of char.relations) {
          relations.push({
            sourceId: char.id,
            targetId: rel.targetId,
            label: rel.label,
            color: rel.color,
            note: rel.note,
          })
        }
      }
    } else {
      // Copy from another chapter's snapshot
      const source = chapterSnapshots.find(s => s.chapterId === copySource)
      if (source) {
        relations = source.relations.map(r => ({ ...r }))
      }
    }

    const newSnapshot: ChapterRelationSnapshot = { chapterId, relations }
    onUpdateSnapshots([...chapterSnapshots.filter(s => s.chapterId !== chapterId), newSnapshot])
  }

  // Transform snapshot to CharacterNote[] for RelationDiagram
  const snapshotToCharacters = (): CharacterNote[] => {
    if (!snapshot) return characters
    return characters.map(c => ({
      ...c,
      relations: snapshot.relations
        .filter(r => r.sourceId === c.id)
        .map(r => ({ targetId: r.targetId, label: r.label, color: r.color, note: r.note })),
    }))
  }

  const handleUpdateRelation = (charId: string, relIndex: number, updates: Partial<{ label: string; color: string; note: string }>) => {
    if (!snapshot) return
    const charRels = snapshot.relations.filter(r => r.sourceId === charId)
    const targetRel = charRels[relIndex]
    if (!targetRel) return

    const newRelations = snapshot.relations.map(r => {
      if (r.sourceId === targetRel.sourceId && r.targetId === targetRel.targetId && r.label === targetRel.label) {
        return { ...r, ...updates }
      }
      return r
    })

    onUpdateSnapshots(
      chapterSnapshots.map(s => s.chapterId === chapterId ? { ...s, relations: newRelations } : s)
    )
  }

  const chapter = chapters.find(c => c.id === chapterId)

  return (
    <div className="tl-snapshot">
      <div className="tl-snapshot-header">
        <h3>&#128268; {chapter?.title} — 관계도 스냅샷</h3>
        <button className="tl-editor-close" onClick={onClose}>&times;</button>
      </div>

      {!snapshot ? (
        <div className="tl-snapshot-create">
          <p>이 챕터의 관계도 스냅샷이 없습니다. 어디서 복사할까요?</p>
          <div className="tl-snapshot-source">
            <select value={copySource} onChange={e => setCopySource(e.target.value)}>
              <option value="global">전체 관계도에서 복사</option>
              {chaptersWithSnapshot.map(ch => (
                <option key={ch.id} value={ch.id}>{ch.title}에서 복사</option>
              ))}
            </select>
            <button className="btn btn--primary btn--sm" onClick={createSnapshot}>스냅샷 생성</button>
          </div>
        </div>
      ) : (
        <div className="tl-snapshot-diagram">
          <RelationDiagram
            characters={snapshotToCharacters()}
            onSelectCharacter={() => {}}
            onUpdateRelation={handleUpdateRelation}
          />
        </div>
      )}
    </div>
  )
}
