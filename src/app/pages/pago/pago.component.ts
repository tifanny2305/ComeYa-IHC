import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { ApiService } from '../../services/api.service';
import { PedidoCreate } from '../../models/producto.model';
import { TelegramService } from '../../services/telegram.service';
import { catchError, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  carritoService = inject(CarritoService);
  private api = inject(ApiService);
  private router = inject(Router);
  private telegram = inject(TelegramService);

  precioDelivery = 0;
  totalFinalMostrado = signal(0);
  deliveryDisponible = true;
  private deliveryId = 0;
  coordenadas = '-17.7833, -63.1821';

  ngOnInit() {
    const lat = localStorage.getItem('delivery_lat');
    const lng = localStorage.getItem('delivery_lng');
    if (lat && lng) this.coordenadas = `${lat}, ${lng}`;

    this.cargarDelivery();
  }

  private cargarDelivery() {
    this.api.getDeliveryMasCercano().pipe(
      tap(d => {
        this.deliveryId = d.id;
        this.deliveryDisponible = true;
      }),
      switchMap(() => this.api.calcularTarifaDelivery(this.coordenadas)),
      tap(t => {
        this.precioDelivery = t;
        this.totalFinalMostrado.set(this.carritoService.totalPagar() + t);
      }),
      catchError(err => {
        this.deliveryDisponible = false;
        this.totalFinalMostrado.set(this.carritoService.totalPagar());
        alert('⚠️ Lo sentimos, no hay repartidores disponibles en este momento.');
        return of(null);
      })
    ).subscribe();
  }

  reintentar() {
    this.cargarDelivery();
  }

  procesarPedido(): void {
    const chatId = localStorage.getItem('chat_id');
    const nombreUsuario = localStorage.getItem('nombre_usuario');
    const items = this.carritoService.items();

    if (!chatId || !nombreUsuario || !items.length || !this.deliveryId) {
      alert('Error: Datos incompletos');
      return;
    }

    this.api.updateDeliveryDisponibilidad(this.deliveryId, false).pipe(
      switchMap(() => {
        const pedido: PedidoCreate = {
          chat_id: chatId,
          nombre_usuario: nombreUsuario,
          total: this.carritoService.totalPagar() + this.precioDelivery,
          ubicacion_entrega: this.coordenadas,
          estado: 'en local',
          precio_delivery: this.precioDelivery,
          delivery_id: this.deliveryId
        };

        const detalles = items.map(i => ({
          plato_id: i.producto.id,
          cantidad: i.cantidad,
          observacion: i.observacion
        }));

        return this.api.crearPedidoCompleto(pedido, detalles);
      })
    ).subscribe({
      next: (res) => {
        this.telegram.sendData({ action: 'pedido_confirmado', pedido_id: res.id, total: res.total, chat_id: chatId });
        this.carritoService.limpiar();
        this.router.navigate(['/verificado']);
      },
      error: (err) => {
        alert(`Error: ${err.message || 'Desconocido'}`);
        this.api.updateDeliveryDisponibilidad(this.deliveryId, true).subscribe();
      }
    });
  }
}