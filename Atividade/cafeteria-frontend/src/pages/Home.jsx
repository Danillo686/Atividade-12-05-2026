import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, ClipboardList, Coffee, Award, ShieldAlert } from 'lucide-react'
import { getClientes, getPedidos } from '../services/api'
import '../styles/index.css'

export function Home() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    pedidosAtivos: 0,
    pedidosProntos: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarEstatisticas() {
      try {
        const [clientesRes, pedidosRes] = await Promise.all([
          getClientes(),
          getPedidos()
        ])
        
        const clientes = clientesRes.data || []
        const pedidos = pedidosRes.data || []
        
        const ativos = pedidos.filter(p => ['pendente', 'preparando'].includes(p.status)).length
        const prontos = pedidos.filter(p => p.status === 'pronto').length

        setStats({
          totalClientes: clientes.length,
          pedidosAtivos: ativos,
          pedidosProntos: prontos
        })
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    carregarEstatisticas()
  }, [])

  return (
    <div className="page">
      <div className="container">
        
        {/* Hero Section */}
        <div className="hero">
          <div style={{ display: 'inline-flex', padding: '8px 16px', borderRadius: '50px', background: '#faf6f0', border: '1px solid #ebdcd0', color: '#d97706', fontSize: '13px', fontWeight: '600', gap: '6px', alignItems: 'center', marginBottom: '16px' }}>
            <Award size={14} /> Especialistas em Grãos Selecionados
          </div>
          <h1>Cafeteria Premium</h1>
          <p>
            Gerencie sua base de clientes, crie novos pedidos e acompanhe o status da preparação do café em tempo real com facilidade e elegância.
          </p>
        </div>

        {/* Live Statistics Section */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-value">{loading ? '...' : stats.totalClientes}</div>
            <div className="stat-card-label">Clientes Cadastrados</div>
          </div>
          <div className="stat-card" style={{ '--accent': '#0284c7' }}>
            <div className="stat-card-value">{loading ? '...' : stats.pedidosAtivos}</div>
            <div className="stat-card-label">Pedidos em Preparo</div>
          </div>
          <div className="stat-card" style={{ '--accent': '#16a34a' }}>
            <div className="stat-card-value">{loading ? '...' : stats.pedidosProntos}</div>
            <div className="stat-card-label">Prontos para Entrega</div>
          </div>
        </div>

        {/* Navigational Action Cards */}
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon-wrapper">
              <Users size={28} />
            </div>
            <div>
              <h3>Controle de Clientes</h3>
              <p>Cadastre e gerencie as informações de contato dos seus clientes regulares. Visualize histórico e mantenha sua base de dados atualizada.</p>
            </div>
            <Link className="btn" to="/clientes" style={{ width: '100%' }}>
              Acessar Clientes
            </Link>
          </div>

          <div className="dashboard-card">
            <div className="card-icon-wrapper" style={{ color: '#0284c7', backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
              <ClipboardList size={28} />
            </div>
            <div>
              <h3>Gestão de Pedidos</h3>
              <p>Registre novos pedidos de café, selecione o cliente, adicione a quantidade e atualize o progresso da produção de forma dinâmica.</p>
            </div>
            <Link className="btn" to="/pedidos" style={{ width: '100%', backgroundColor: '#0284c7' }}>
              Visualizar Pedidos
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
