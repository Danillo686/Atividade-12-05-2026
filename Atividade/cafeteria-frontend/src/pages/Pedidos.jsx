import { useState, useEffect } from 'react'
import { Pencil, Trash2, PlusCircle, X, Save, ClipboardList, Filter, Coffee } from 'lucide-react'
import { getPedidos, getClientes, createPedido, updatePedido, deletePedido } from '../services/api'
import { Mensagem } from '../components/Mensagem'
import { Loading } from '../components/Loading'
import '../styles/index.css'

export function Pedidos() {
  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [mensagem, setMensagem] = useState(null)
  const [editando, setEditando] = useState(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState('')

  const [formData, setFormData] = useState({
    cliente_id: '',
    descricao: '',
    quantidade: '',
    status: 'pendente'
  })

  const status_opcoes = ['pendente', 'preparando', 'pronto', 'entregue', 'cancelado']

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      setLoading(true)
      const [pedidosRes, clientesRes] = await Promise.all([
        getPedidos(),
        getClientes()
      ])
      setPedidos(pedidosRes.data || [])
      setClientes(clientesRes.data || [])
    } catch (erro) {
      setMensagem({ tipo: 'erro', texto: 'Não foi possível carregar os dados de pedidos' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.cliente_id || !formData.descricao || !formData.quantidade) {
      setMensagem({ tipo: 'aviso', texto: 'Preencha todos os campos do formulário' })
      return
    }

    try {
      const dados = {
        cliente_id: parseInt(formData.cliente_id),
        descricao: formData.descricao,
        quantidade: parseInt(formData.quantidade),
        status: formData.status
      }

      if (editando) {
        await updatePedido(editando.id, dados)
        setMensagem({ tipo: 'sucesso', texto: 'Pedido atualizado com sucesso!' })
      } else {
        await createPedido(dados)
        setMensagem({ tipo: 'sucesso', texto: 'Pedido criado com sucesso!' })
      }

      setFormData({ cliente_id: '', descricao: '', quantidade: '', status: 'pendente' })
      setEditando(null)
      setMostrarForm(false)
      carregarDados()
    } catch (erro) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar o pedido' })
    }
  }

  const handleEditar = (pedido) => {
    setEditando(pedido)
    setFormData({
      cliente_id: pedido.cliente_id,
      descricao: pedido.descricao,
      quantidade: pedido.quantidade,
      status: pedido.status
    })
    setMostrarForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelar = () => {
    setEditando(null)
    setFormData({ cliente_id: '', descricao: '', quantidade: '', status: 'pendente' })
    setMostrarForm(false)
  }

  const handleExcluir = async (id) => {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        await deletePedido(id)
        setMensagem({ tipo: 'sucesso', texto: 'Pedido excluído!' })
        carregarDados()
      } catch (erro) {
        setMensagem({ tipo: 'erro', texto: 'Erro ao remover pedido' })
      }
    }
  }

  const getNomeCliente = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId)
    return cliente ? cliente.nome : 'Cliente não encontrado'
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pendente': return 'Pendente'
      case 'preparando': return 'Preparando'
      case 'pronto': return 'Pronto'
      case 'entregue': return 'Entregue'
      case 'cancelado': return 'Cancelado'
      default: return status
    }
  }

  const pedidosFiltrados = filtroStatus 
    ? pedidos.filter(p => p.status === filtroStatus)
    : pedidos

  if (loading) return <Loading />

  return (
    <div className="pedidos page">
      <div className="container">
        
        {/* Cabeçalho da Página */}
        <div className="header-page">
          <h1>Pedidos</h1>
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
                <PlusCircle size={16} />
                <span>Novo Pedido</span>
              </>
            )}
          </button>
        </div>

        {/* Mensagem de Feedback */}
        {mensagem && (
          <Mensagem 
            tipo={mensagem.tipo}
            texto={mensagem.texto}
            onClose={() => setMensagem(null)}
          />
        )}

        {/* Barra de Filtros */}
        <div className="filtros">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
            <Filter size={16} strokeWidth={2.5} />
            <label htmlFor="filtro-status">Filtrar por Status:</label>
          </div>
          <select 
            id="filtro-status"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="select"
            style={{ maxWidth: '240px', padding: '8px 12px' }}
          >
            <option value="">Todos os Pedidos</option>
            {status_opcoes.map(s => (
              <option key={s} value={s}>{getStatusLabel(s)}</option>
            ))}
          </select>
        </div>

        {/* Formulário de Novo/Editar Pedido */}
        {mostrarForm && (
          <form className="form" onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: '18px', color: 'var(--primary)', borderBottom: '1px dashed var(--border-color)', paddingBottom: '10px' }}>
              {editando ? 'Editar Detalhes do Pedido' : 'Registrar Novo Pedido de Café'}
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cliente">Cliente Solicitante</label>
                <select
                  id="cliente"
                  value={formData.cliente_id}
                  onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                  className="select"
                >
                  <option value="">Selecione um cliente cadastrado</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status do Pedido</label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="select"
                >
                  {status_opcoes.map(s => (
                    <option key={s} value={s}>
                      {getStatusLabel(s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label htmlFor="descricao">Descrição do Pedido (Ex: Café Espresso Duplo com Leite)</label>
              <textarea
                id="descricao"
                placeholder="Ex: Café Latte Macchiato com calda de caramelo extra..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="quantidade">Quantidade de Itens</label>
              <input
                id="quantidade"
                type="number"
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                min="1"
                placeholder="Ex: 1"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <Save size={16} />
                <span>{editando ? 'Salvar Alterações' : 'Confirmar Pedido'}</span>
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancelar}>
                <X size={16} />
                <span>Cancelar</span>
              </button>
            </div>
          </form>
        )}

        {/* Tabela de Pedidos */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Descrição do Pedido</th>
                <th style={{ width: '100px' }}>Qtd.</th>
                <th style={{ width: '150px' }}>Status</th>
                <th style={{ width: '180px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px 0' }}>
                      <Coffee size={32} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                      <span>Nenhum pedido encontrado.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map(pedido => (
                  <tr key={pedido.id}>
                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>
                      {getNomeCliente(pedido.cliente_id)}
                    </td>
                    <td>{pedido.descricao}</td>
                    <td style={{ fontWeight: '600' }}>{pedido.quantidade}</td>
                    <td>
                      <span className={`badge badge-${pedido.status}`}>
                        {getStatusLabel(pedido.status)}
                      </span>
                    </td>
                    <td>
                      <div className="acoes">
                        <button 
                          className="btn btn-small btn-edit"
                          onClick={() => handleEditar(pedido)}
                          title="Editar pedido"
                        >
                          <Pencil size={13} />
                          <span>Editar</span>
                        </button>
                        <button 
                          className="btn btn-small btn-delete"
                          onClick={() => handleExcluir(pedido.id)}
                          title="Excluir pedido"
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
