import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { PedidoCreate } from '../models/producto.model';

interface DetalleInput {
  plato_id: number;
  cantidad: number;
  observacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  //private apiUrl = 'https://14c99415aa88.ngrok-free.app';
  private apiUrl = 'http://34.176.223.70';

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorias/`);
  }

  getPlatos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/platos/`);
  }

  calcularTarifaDelivery(ubicacionEntrega: string): Observable<number> {
    return this.http.get<string | { tarifa: string }>(`${this.apiUrl}/deliveries/calcular-tarifa/${ubicacionEntrega}`).pipe(
      map(response => {
        const tarifaStr = typeof response === 'string' ? response : response.tarifa;
        const precio = parseFloat(tarifaStr);
        if (isNaN(precio)) throw new Error(`Tarifa inválida: ${tarifaStr}`);
        return precio;
      }),
      catchError(() => of(0))
    );
  }

  getDeliveryMasCercano(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/deliveries/mas-cercano`).pipe(
      catchError(err => throwError(() => new Error('Delivery no disponible')))
    );
  }

  updateDeliveryDisponibilidad(deliveryId: number, disponible: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/deliveries/${deliveryId}`, { disponible }).pipe(
      catchError(err => throwError(() => new Error('Error al actualizar delivery')))
    );
  }

  crearPedidoCompleto(pedido: PedidoCreate, items: DetalleInput[]): Observable<any> {
    const payload = {
      ...pedido,
      detalles: items.map(i => ({
        plato_id: i.plato_id,
        cantidad: i.cantidad,
        observacion: i.observacion
      }))
    };

    return this.http.post<any>(`${this.apiUrl}/pedidos/completo`, payload).pipe(
      catchError(error => of({ error: true, message: 'Error al crear pedido', details: error }))
    );
  }
}