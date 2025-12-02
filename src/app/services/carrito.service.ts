import { Injectable, signal, computed } from '@angular/core';
import { Plato, ItemCarrito } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  
  items = signal<ItemCarrito[]>([]);

  totalPagar = computed(() => {
    return this.items().reduce((total, item) => total + (item.producto.precio_venta * item.cantidad), 0);
  });

  cantidadItems = computed(() => {
    return this.items().reduce((total, item) => total + item.cantidad, 0);
  });

  constructor() { }

  agregar(producto: Plato) {
    this.items.update(itemsActuales => {
      const itemExistente = itemsActuales.find(item => item.producto.id === producto.id);

      if (itemExistente) {
        return itemsActuales.map(item => 
          item.producto.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        );
      } else {
        return [
          ...itemsActuales, 
          { producto, cantidad: 1, observacion: '' }
        ];
      }
    });
  }

  restar(productoId: number) {
    this.items.update(itemsActuales => {
      const itemExistente = itemsActuales.find(item => item.producto.id === productoId);
      
      if (itemExistente && itemExistente.cantidad > 1) {
        return itemsActuales.map(item => 
          item.producto.id === productoId 
            ? { ...item, cantidad: item.cantidad - 1 } 
            : item
        );
      } else {
        return itemsActuales.filter(item => item.producto.id !== productoId);
      }
    });
  }
  
  cantidadPorProducto(productoId: number) {
    const item = this.items().find(i => i.producto.id === productoId);
    return item ? item.cantidad : 0;
  }

  limpiar() {
    this.items.set([]);
  }
}