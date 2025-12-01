import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements OnInit {
  
  private router = inject(Router);
  private map: any;
  private markerCliente: any;
  
  cargando: boolean = false;

  // 1. UBICACIÓN FIJA (RESTAURANTE)
  restauranteUbicacion = { lat: -17.7833, lng: -63.1821 };

  // 2. UBICACIÓN MÓVIL (CLIENTE - Default)
  clienteUbicacion = { lat: -17.7840, lng: -63.1830 };

  ngOnInit(): void {
    const savedLat = localStorage.getItem('delivery_lat');
    const savedLng = localStorage.getItem('delivery_lng');
    
    if (savedLat && savedLng) {
      this.clienteUbicacion = { lat: parseFloat(savedLat), lng: parseFloat(savedLng) };
    }
    
    setTimeout(() => this.initMap(), 100);
  }

  private initMap(): void {
    if (this.map) { this.map.remove(); }

    this.map = L.map('map', { zoomControl: false }).setView([this.clienteUbicacion.lat, this.clienteUbicacion.lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // MARCADOR RESTAURANTE
    const restauranteIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.marker([this.restauranteUbicacion.lat, this.restauranteUbicacion.lng], { icon: restauranteIcon })
      .addTo(this.map).bindPopup("<b>Restaurante</b>");

    // MARCADOR CLIENTE
    const clienteIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.markerCliente = L.marker([this.clienteUbicacion.lat, this.clienteUbicacion.lng], { 
      icon: clienteIcon, draggable: true 
    }).addTo(this.map);

    this.markerCliente.on('dragend', (e: any) => {
      const coord = e.target.getLatLng();
      this.clienteUbicacion = { lat: coord.lat, lng: coord.lng };
    });
    
    this.map.on('click', (e: any) => {
      this.moverPin(e.latlng.lat, e.latlng.lng);
    });
  }

  private moverPin(lat: number, lng: number) {
    const newLatLng = new L.LatLng(lat, lng);
    this.markerCliente.setLatLng(newLatLng);
    this.clienteUbicacion = { lat: lat, lng: lng };
    this.map.setView(newLatLng, 16);
  }

  // --- GEOLOCALIZACIÓN NATIVA (GPS) ---
  usarUbicacionActual() {
    if (!navigator.geolocation) {
      alert('La geolocalización no es soportada por tu navegador.');
      return;
    }

    this.cargando = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.moverPin(position.coords.latitude, position.coords.longitude);
        this.cargando = false;
      },
      (error) => {
        this.cargando = false;
        console.error(error);
        alert('No pudimos acceder a tu ubicación. Por favor revisa los permisos.');
      },
      { enableHighAccuracy: true } // Pedir máxima precisión al GPS
    );
  }

  // --- BÚSQUEDA MEJORADA PARA SANTA CRUZ ---
  async buscarDireccion(query: string) {
    if (!query.trim()) return;
    this.cargando = true;

    try {
      // TRUCO: Concatenamos "Santa Cruz de la Sierra" para forzar el contexto
      const queryContextualizado = `${query}, Santa Cruz de la Sierra`;

      // countrycodes=bo: Limita a Bolivia
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryContextualizado)}&countrycodes=bo&limit=1`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        this.moverPin(parseFloat(result.lat), parseFloat(result.lon));
      } else {
        // Intento secundario: Si falló, buscar sin agregar "Santa Cruz" pero manteniendo el país
        this.buscarDireccionGlobal(query);
      }
    } catch (error) {
      console.error(error);
      this.cargando = false;
    } finally {
      // El loading se apaga en el catch o en el segundo intento, 
      // si fue éxito directo lo apagamos aquí
      if(this.cargando) this.cargando = false; 
    }
  }

  // Fallback por si la búsqueda estricta falla
  async buscarDireccionGlobal(query: string) {
     const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=bo&limit=1`;
     const response = await fetch(url);
     const data = await response.json();
     if (data && data.length > 0) {
        const result = data[0];
        this.moverPin(parseFloat(result.lat), parseFloat(result.lon));
     } else {
        alert('Dirección no encontrada en Santa Cruz.');
     }
     this.cargando = false;
  }

  confirmarUbicacion() {
    localStorage.setItem('delivery_lat', this.clienteUbicacion.lat.toString());
    localStorage.setItem('delivery_lng', this.clienteUbicacion.lng.toString());
    this.router.navigate(['/pago']);
  }
}