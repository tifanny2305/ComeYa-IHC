import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <--- ESTO ES LA CLAVE

@Component({
  selector: 'app-verificado',
  standalone: true,
  // Sin RouterModule aquí, el botón es solo un adorno y no navega
  imports: [CommonModule, RouterModule], 
  templateUrl: './verificado.component.html',
  styleUrl: './verificado.component.scss'
})
export class VerificadoComponent {
  // No necesitamos lógica aquí, solo navegación
}