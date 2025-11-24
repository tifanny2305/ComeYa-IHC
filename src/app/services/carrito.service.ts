import { Injectable, signal, computed } from '@angular/core';
import { Producto, ItemCarrito } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  
  // Esta es la lista "reactiva" de items en el carrito
  items = signal<ItemCarrito[]>([]);

  // Calculamos el total de dinero automáticamente
  totalPagar = computed(() => {
    return this.items().reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
  });

  // Calculamos la cantidad de items totales automáticamente
  cantidadItems = computed(() => {
    return this.items().reduce((total, item) => total + item.cantidad, 0);
  });

  constructor() { }

  agregar(producto: Producto) {
    this.items.update(itemsActuales => {
      const itemExistente = itemsActuales.find(item => item.producto.id === producto.id);

      if (itemExistente) {
        // Si ya existe, creamos una nueva lista actualizando la cantidad de ese item
        return itemsActuales.map(item => 
          item.producto.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        );
      } else {
        // Si no existe, lo agregamos nuevo
        return [...itemsActuales, { producto, cantidad: 1 }];
      }
    });
  }

  restar(productoId: number) {
    this.items.update(itemsActuales => {
      const itemExistente = itemsActuales.find(item => item.producto.id === productoId);
      
      if (itemExistente && itemExistente.cantidad > 1) {
        // Si hay más de 1, bajamos la cantidad
        return itemsActuales.map(item => 
          item.producto.id === productoId 
            ? { ...item, cantidad: item.cantidad - 1 } 
            : item
        );
      } else {
        // Si llega a 0, lo sacamos del carrito
        return itemsActuales.filter(item => item.producto.id !== productoId);
      }
    });
  }

  // Función auxiliar para saber cuántos de UN producto específico hay (para pintar el número en la tarjeta)
  cantidadPorProducto(productoId: number) {
    const item = this.items().find(i => i.producto.id === productoId);
    return item ? item.cantidad : 0;
  }
}