import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { ApiService } from '../../services/api.service';
import { PedidoCreate } from '../../models/producto.model';
import { TelegramService } from '../../services/telegram.service'; // Importar TelegramService

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
  private telegramService = inject(TelegramService); // Inyectar TelegramService

  // Valores de ejemplo fijos, o se obtienen de otro lado (ej. Configuración)
  private deliveryId: number = 1; // ID del delivery asignado (ajustar si es dinámico)
  private precioDelivery: number = 10; // Precio fijo de delivery

  direccionEntrega: string = 'Ubicación no seleccionada';
  coordenadas: string = '-17.7833, -63.1821'; // Default

  ngOnInit() {
    // Recuperar coordenadas del paso anterior (Mapa)
    const lat = localStorage.getItem('delivery_lat');
    const lng = localStorage.getItem('delivery_lng');

    if (lat && lng) {
      this.coordenadas = `${lat}, ${lng}`;
      this.direccionEntrega = `Lat: ${lat.slice(0, 7)}, Lng: ${lng.slice(0, 7)}`;
    }
  }

  procesarPedido() {
    const chatId = localStorage.getItem('chat_id');
    const nombreUsuario = localStorage.getItem('nombre_usuario');

    if (!chatId || !nombreUsuario) {
      console.error('ERROR: chat_id o nombre_usuario no encontrados.');
      alert('Error de sesión. Regresa al menú.');
      this.router.navigate(['/menu']);
      return;
    }

    const items = this.carritoService.items();
    if (items.length === 0) {
      alert('El carrito está vacío.');
      return;
    }

    // 1. Construir el objeto Pedido Cabecera
    const nuevoPedido: PedidoCreate = {
      chat_id: chatId, 
      nombre_usuario: nombreUsuario, 
      total: this.carritoService.totalPagar(),
      ubicacion_entrega: this.coordenadas, 
      estado: 'en local', 
      precio_delivery: this.precioDelivery, 
      delivery_id: this.deliveryId 
    } as PedidoCreate; 
    
    // 2. Construir los Detalles con Observación
    const detallesSimples = items.map(i => ({
      plato_id: i.producto.id,
      cantidad: i.cantidad,
      observacion: i.observacion // <-- Aseguramos que la observación se mapee
    }));

    // --- LOGS DE VERIFICACIÓN ---
    console.log('--- PREPARANDO PEDIDO COMPLETO PARA EL BACKEND ---');
    console.log('PEDIDO CABECERA (incluye chat/nombre):', nuevoPedido);
    console.log('DETALLES DEL PEDIDO (incluye observación):', detallesSimples);
    console.log('----------------------------------------------------');
    // ----------------------------

    // 3. Enviar a la BD
    this.api.crearPedidoCompleto(nuevoPedido, detallesSimples).subscribe({
      next: (res) => {
        console.log('✅ Pedido OK. Respuesta del Backend:', res);

        // Enviar notificación al bot de Telegram
        this.telegramService.sendData({
          action: 'pedido_creado',
          pedido_id: res.id,
          chat_id: chatId,
          nombre_usuario: nombreUsuario,
          total: nuevoPedido.total + nuevoPedido.precio_delivery
        });

        this.carritoService.limpiar();
        this.router.navigate(['/verificado']);
      },
      error: (err) => {
        console.error('❌ Error al crear el pedido completo. Revisa la consola para detalles.', err);
        alert('Error al conectar con el servidor. Revisa la consola.');
      }
    });
  }
}