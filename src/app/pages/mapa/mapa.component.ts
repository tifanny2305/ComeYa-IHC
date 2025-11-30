import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as L from 'leaflet';
import { CarritoService } from '../../services/carrito.service';
import { TelegramService } from '../../services/telegram.service'; // Asegúrate de tener este servicio
import { Router } from '@angular/router';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {

  private map: any;
  private marker: any;
  carritoService = inject(CarritoService);
  telegramService = inject(TelegramService); // Servicio para cerrar la app y enviar datos
  router = inject(Router);

  // Guardamos la ubicación actual
  ubicacion = { lat: -17.7833, lng: -63.1821 };

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', { zoomControl: false }).setView([this.ubicacion.lat, this.ubicacion.lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '© OpenStreetMap'
    }).addTo(this.map);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    this.marker = L.marker([this.ubicacion.lat, this.ubicacion.lng], { draggable: true }).addTo(this.map);

    // Actualizar coordenada al mover
    this.marker.on('dragend', (e: any) => {
      const coord = e.target.getLatLng();
      this.ubicacion = { lat: coord.lat, lng: coord.lng };
    });
  }

  // mapa.component.ts
  confirmarUbicacion() {
    // 1. Armamos el objeto con toda la info
    const datosParaBackend = {
      action: 'NUEVO_PEDIDO', // Una etiqueta para que el back sepa qué hacer
      usuario: this.telegramService.user, // ID de Telegram
      pedido: {
        items: this.carritoService.items().map(item => ({
          producto_id: item.producto.id,
          nombre: item.producto.nombre,
          cantidad: item.cantidad,
          precio_unitario: item.producto.precio,
          subtotal: item.producto.precio * item.cantidad,
          observacion: item.observacion || ''
        })),
        total_pagar: this.carritoService.totalPagar()
      },
      ubicacion: {
        latitud: this.ubicacion.lat,
        longitud: this.ubicacion.lng,
        direccion_google_maps: `https://maps.google.com/?q=${this.ubicacion.lat},${this.ubicacion.lng}`
      }
    };

    // 2. ENVIAR Y CERRAR
    // Esto hace que aparezca en el chat "Datos enviados" (mensaje de servicio)
    // Y tu backend recibe el evento automáticamente.
    this.telegramService.sendData(datosParaBackend);

    // Redirigir al menú después de confirmar la ubicación
    this.router.navigate(['/menu']);
  }
}