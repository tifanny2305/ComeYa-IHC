export interface Categoria {
  id: number;
  nombre: string;
}

export interface Plato {
  id: number;
  nombre: string;
  precio_venta: number;
  categoria_id: number;
  url_imagen: string;
}

export interface ItemCarrito {
  producto: Plato;
  cantidad: number;
  observacion: string;
}

export interface PedidoCreate {
  chat_id: string; // Nuevo: El ID de la conversación de Telegram
  nombre_usuario: string; // Nuevo: Nombre del usuario de Telegram
  total: number;
  ubicacion_entrega: string;
  estado: string;
  precio_delivery: number; // o string, dependiendo de tu backend
  delivery_id: number;
}
// También es buena práctica incluir 'observacion' en DetalleCreate
export interface DetalleCreate {
  pedido_id: number;
  plato_id: number;
  cantidad: number;
  observacion: string;
}