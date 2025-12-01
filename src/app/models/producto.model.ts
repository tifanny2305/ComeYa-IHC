export interface Categoria {
  id: number;
  nombre: string;
}

export interface Plato {
  id: number;
  nombre: string;
  precio_venta: number;
  categoria_id: number;
  imagen?: string;
}

export interface ItemCarrito {
  producto: Plato;
  cantidad: number;
}

export interface UsuarioCreate {
  user_id: string; // ID de Telegram
  nombre: string;
  username: string;
  telefono?: string;
}

export interface PedidoCreate {
  usuario_id: number;
  total: number;
  ubicacion_entrega: string;
  estado: string;
  precio_delivery: number;
}

export interface DetalleCreate {
  pedido_id: number;
  plato_id: number;
  cantidad: number;
}