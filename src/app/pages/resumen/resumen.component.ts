import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './resumen.component.html'
})
export class ResumenComponent {
  carritoService = inject(CarritoService);
}