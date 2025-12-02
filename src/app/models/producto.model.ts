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
  chat_id: string;
  nombre_usuario: string;
  total: number;
  ubicacion_entrega: string;
  estado: string;
  precio_delivery: number;
  delivery_id: number;
}

export interface DetalleCreate {
  pedido_id: number;
  plato_id: number;
  cantidad: number;
  observacion: string;
}