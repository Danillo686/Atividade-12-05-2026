import { useState, useEffect } from 'react'
import { Pencil, Trash2, UserPlus, X, Save, Users } from 'lucide-react'
import { getClientes, createCliente, updateCliente, deleteCliente } from '../services/api'
import { Mensagem } from '../components/Mensagem'
import { Loading } from '../components/Loading'
import '../styles/index.css'

export function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [mensagem, setMensagem] = useState(null)
  const [editando, setEditando] = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: ''
  })

  useEffect(() => {
    carregarClientes()
  }, [])

  const carregarClientes = async () => {
    try {
      setLoading(true)
      const response = await getClientes()
      setClientes(response.data)
    } catch (erro) {
      setMensagem({ tipo: 'erro', texto: 'Não foi possível carregar os clientes' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.nome || !formData.email || !formData.telefone) {
      setMensagem({ tipo: 'aviso', texto: 'Preencha todos os campos' })
      return
    }

    try {
      if (editando) {
        await updateCliente(editando.id, formData)
        setMensagem({ tipo: 'sucesso', texto: 'Cliente atualizado com sucesso!' })
      } else {
        await createCliente(formData)
        setMensagem({ tipo: 'sucesso', texto: 'Cliente cadastrado com sucesso!' })
      }
      
      setFormData({ nome: '', email: '', telefone: '' })
      setEditando(null)
      setMostrarForm(false)
      carregarClientes()
    } catch (erro) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar cliente' })
    }
  }

  const handleEditar = (cliente) => {
    setEditando(cliente)
    setFormData(cliente)
    setMostrarForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelar = () => {
    setEditando(null)
    setFormData({ nome: '', email: '', telefone: '' })
    setMostrarForm(false)
  }

  const handleExcluir = async (id) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteCliente(id)
        setMensagem({ tipo: 'sucesso', texto: 'Cliente removido com sucesso!' })
        carregarClientes()
      } catch (erro) {
        setMensagem({ tipo: 'erro', texto: 'Erro ao remover cliente. Verifique se ele não possui pedidos ativos.' })
      }
    }
  }

  if (loading) return <Loading />

  return (
    <div className="clientes page">
      <div className="container">
        
        {/* Header da Página */}
        <div className="header-page">
          <h1>Clientes</h1>
          <button 
            className={`btn ${mostrarForm ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => {
              if (mostrarForm) {
                handleCancelar()
              } else {
                setMostrarForm(true)
              }
            }}
          >
            {mostrarForm ? (
              <>
                <X size={16} />
                <span>Cancelar</span>
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Novo Cliente</span>
              </>
            )}
          </button>
        </div>

        {/* Mensagens de feedback */}
        {mensagem && (
          <Mensagem 
            tipo={mensagem.tipo}
            texto={mensagem.texto}
            onClose={() => setMensagem(null)}
          />
        )}

        {/* Formulário de cadastro/edição */}
        {mostrarForm && (
          <form className="form" onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: '18px', color: 'var(--primary)', borderBottom: '1px dashed var(--border-color)', paddingBottom: '10px' }}>
              {editando ? 'Editar Cadastro do Cliente' : 'Novo Cadastro de Cliente'}
            </h3>
            
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input
                id="nome"
                type="text"
                placeholder="Ex: João Silva"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Ex: joao@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone / WhatsApp</label>
                <input
                  id="telefone"
                  type="tel"
                  placeholder="Ex: (11) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <Save size={16} />
                <span>{editando ? 'Atualizar Dados' : 'Salvar Cliente'}</span>
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancelar}>
                <X size={16} />
                <span>Cancelar</span>
              </button>
            </div>
          </form>
        )}

        {/* Lista de clientes em tabela moderna */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th style={{ width: '180px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px 0' }}>
                      <Users size={32} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                      <span>Nenhum cliente cadastrado ainda.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                clientes.map(cliente => (
                  <tr key={cliente.id}>
                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{cliente.nome}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.telefone}</td>
                    <td>
                      <div className="acoes">
                        <button 
                          className="btn btn-small btn-edit"
                          onClick={() => handleEditar(cliente)}
                          title="Editar cliente"
                        >
                          <Pencil size={13} />
                          <span>Editar</span>
                        </button>
                        <button 
                          className="btn btn-small btn-delete"
                          onClick={() => handleExcluir(cliente.id)}
                          title="Excluir cliente"
                        >
                          <Trash2 size={13} />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
