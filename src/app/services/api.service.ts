import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { PedidoCreate } from '../models/producto.model';

// INTERFAZ MOVIDA FUERA DE LA CLASE
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
  //private apiUrl = '/api'; 
  private apiUrl = 'https://14c99415aa88.ngrok-free.app'; 


  // --- MENÚ ---
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorias/`);
  }

  getPlatos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/platos/`);
  }

  // --- PEDIDOS ---
  crearPedidoCompleto(pedido: PedidoCreate, items: DetalleInput[]): Observable<any> {
    
    // 2. Unir la cabecera y los detalles en el objeto final (Payload)
    const detallesMapeados = items.map(item => ({
        plato_id: item.plato_id,
        cantidad: item.cantidad,
        observacion: item.observacion
    }));

    const pedidoCompletoPayload = {
      ...pedido, // <-- SINTAXIS CORRECTA para incluir chat_id, total, etc.
      detalles: detallesMapeados
    };
    
    // 3. Endpoint corregido a /pedidos/completo
    const endpoint = `${this.apiUrl}/pedidos/completo`; 
    
    console.log(`[API] Enviando POST a: ${endpoint}`);
    console.log('[API] PAYLOAD COMPLETO:', pedidoCompletoPayload);

    return this.http.post<any>(endpoint, pedidoCompletoPayload).pipe(
      catchError(error => {
        console.error('❌ Error al crear el pedido completo:', error);
        return of({ error: true, message: 'Fallo en la API al crear pedido completo', details: error });
      })
    );
  }
}