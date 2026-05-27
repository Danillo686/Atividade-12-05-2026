import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:3000'
})

// Clientes
export const getClientes = () => API.get('/clientes')
export const getClienteById = (id) => API.get(`/clientes/${id}`)
export const createCliente = (dados) => API.post('/clientes', dados)
export const updateCliente = (id, dados) => API.put(`/clientes/${id}`, dados)
export const deleteCliente = (id) => API.delete(`/clientes/${id}`)

// Pedidos
export const getPedidos = () => API.get('/pedidos')
export const getPedidoById = (id) => API.get(`/pedidos/${id}`)
export const createPedido = (dados) => API.post('/pedidos', dados)
export const updatePedido = (id, dados) => API.put(`/pedidos/${id}`, dados)
export const deletePedido = (id) => API.delete(`/pedidos/${id}`)
