import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react'
import '../styles/mensagem.css'

export function Mensagem({ tipo, texto, onClose }) {
  const renderIcon = () => {
    switch (tipo) {
      case 'sucesso':
        return <CheckCircle2 size={18} strokeWidth={2.5} />
      case 'erro':
        return <XCircle size={18} strokeWidth={2.5} />
      case 'aviso':
        return <AlertTriangle size={18} strokeWidth={2.5} />
      default:
        return null
    }
  }

  return (
    <div className={`mensagem mensagem-${tipo}`}>
      <div className="mensagem-content">
        {renderIcon()}
        <span>{texto}</span>
      </div>
      <button onClick={onClose} aria-label="Fechar mensagem">
        <X size={16} strokeWidth={2.5} />
      </button>
    </div>
  )
}
