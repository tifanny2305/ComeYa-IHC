import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, RouterModule], // Importante para que funcionen los routerLink
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.scss' // O .css si no usas scss
})
export class PagoComponent {
  
  // Aquí inyectamos el "cerebro" del carrito
  // Esto permite que en el HTML uses: {{ carritoService.totalPagar() }}
  carritoService = inject(CarritoService);

}