import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, switchMap, map, catchError, of } from 'rxjs';
import { Categoria, Plato, PedidoCreate, DetalleCreate } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = '/api'; 

  // --- MENÚ ---
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias/`);
  }

  getPlatos(): Observable<Plato[]> {
    return this.http.get<Plato[]>(`${this.apiUrl}/platos/`);
  }

  // --- PEDIDOS ---
  crearPedidoCompleto(pedido: PedidoCreate, items: { plato_id: number, cantidad: number }[]): Observable<any> {
    
    // Crear cabecera del pedido
    return this.http.post<any>(`${this.apiUrl}/pedidos/`, pedido).pipe(
      switchMap((pedidoCreado) => {
        const pedidoId = pedidoCreado.id; 
        
        // Crear detalles usando el ID del pedido
        const peticionesDetalles = items.map((item: Partial<DetalleCreate>) => {
          const detalle: DetalleCreate = {
            pedido_id: pedidoId,
            plato_id: item.plato_id!,
            cantidad: item.cantidad!,
            observacion: item.observacion || ''
          };
          return this.http.post<any>(`${this.apiUrl}/detalles/`, detalle);
        });

        // Ejecutar todas las creaciones de detalles
        return forkJoin(peticionesDetalles).pipe(
          map(() => pedidoCreado) 
        );
      })
    );
  }
}