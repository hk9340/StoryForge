import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import './ConfirmDialog.css'

interface ConfirmState {
  message: string
  resolve: (value: boolean) => void
}

interface ConfirmContextType {
  confirm: (message: string) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextType | null>(null)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null)

  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise(resolve => {
      setState({ message, resolve })
    })
  }, [])

  const handleConfirm = () => {
    state?.resolve(true)
    setState(null)
  }

  const handleCancel = () => {
    state?.resolve(false)
    setState(null)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state && (
        <div className="confirm-overlay" onClick={handleCancel}>
          <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className="confirm-body">
              <span className="confirm-icon">&#9888;</span>
              <p className="confirm-message">{state.message}</p>
            </div>
            <div className="confirm-actions">
              <button className="btn btn--ghost-sm" onClick={handleCancel}>취소</button>
              <button className="btn btn--danger btn--sm" onClick={handleConfirm}>확인</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider')
  return ctx.confirm
}
