import { NavLink } from 'react-router-dom'
import { Coffee, Users, ClipboardList, Home as HomeIcon } from 'lucide-react'
import '../styles/index.css'

export function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand">
          <span className="brand-icon">
            <Coffee size={24} strokeWidth={2.5} />
          </span>
          Cafeteria Premium
        </div>
        <nav className="nav">
          <NavLink to="/" end>
            <HomeIcon size={16} />
            <span>Início</span>
          </NavLink>
          <NavLink to="/clientes">
            <Users size={16} />
            <span>Clientes</span>
          </NavLink>
          <NavLink to="/pedidos">
            <ClipboardList size={16} />
            <span>Pedidos</span>
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
