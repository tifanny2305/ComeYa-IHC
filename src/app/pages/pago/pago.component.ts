import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Agregar RouterModule
import { CarritoService } from '../../services/carrito.service';
import { ApiService } from '../../services/api.service';
import { PedidoCreate } from '../../models/producto.model';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  public carritoService = inject(CarritoService);
  private api = inject(ApiService);
  private router = inject(Router);

  // Variable para mostrar la dirección en el HTML si quieres
  direccionEntrega: string = 'Ubicación no seleccionada';
  coordenadas: string = '-17.7833, -63.1821'; // Default

  ngOnInit() {
    // Recuperar coordenadas del paso anterior (Mapa)
    const lat = localStorage.getItem('delivery_lat');
    const lng = localStorage.getItem('delivery_lng');
    
    if (lat && lng) {
      this.coordenadas = `${lat}, ${lng}`;
      this.direccionEntrega = `Lat: ${lat.slice(0,7)}, Lng: ${lng.slice(0,7)}`;
    }
  }

  procesarPedido() {
    const dbUserId = localStorage.getItem('db_user_id');
    const items = this.carritoService.items();

    if (!dbUserId) {
      alert('Error de sesión. Vuelve al menú.');
      this.router.navigate(['/menu']);
      return;
    }

    if (items.length === 0) return;

    // Crear pedido con coordenadas REALES del mapa
    const nuevoPedido: PedidoCreate = {
      usuario_id: Number(dbUserId),
      total: this.carritoService.totalPagar(),
      ubicacion_entrega: this.coordenadas, // <--- AQUÍ VA LA UBICACIÓN DEL MAPA
      estado: 'pendiente',
      precio_delivery: 10 // Puedes calcularlo según distancia si quieres lucirte
    };

    const detallesSimples = items.map(i => ({
      plato_id: i.producto.id,
      cantidad: i.cantidad
    }));

    // Enviar a la BD
    this.api.crearPedidoCompleto(nuevoPedido, detallesSimples).subscribe({
      next: (res) => {
        console.log('Pedido OK:', res);
        this.carritoService.limpiar();
        this.router.navigate(['/verificado']);
      },
      error: (err) => {
        console.error(err);
        alert('Error al conectar con el servidor.');
      }
    });
  }
}