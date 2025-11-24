import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para usar *ngFor o @for
import { RouterModule } from '@angular/router';
import { Producto } from '../../models/producto.model';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule], // Asegúrate de tener esto
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss' // O .css según tengas
})
export class MenuComponent {
  carritoService = inject(CarritoService);
  categoriaActual: string = 'hamburguesas';

  // DATOS COMPLETOS
  productos: Producto[] = [
    // HAMBURGUESAS
    {
      id: 1,
      nombre: 'Hamburguesa Clásica',
      precio: 50,
      imagen: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
      categoria: 'hamburguesas'
    },
    {
      id: 2,
      nombre: 'Royal Doble Carne',
      precio: 75,
      imagen: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png', // Puedes buscar otro icono si quieres
      categoria: 'hamburguesas'
    },
    {
      id: 3,
      nombre: 'Chicken Crispy',
      precio: 45,
      imagen: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
      categoria: 'hamburguesas'
    },
    
    // PIZZAS
    {
      id: 4,
      nombre: 'Pizza Pepperoni',
      precio: 80,
      imagen: 'https://cdn-icons-png.flaticon.com/512/1404/1404945.png',
      categoria: 'pizzas'
    },
    {
      id: 5,
      nombre: 'Pizza Hawaiana',
      precio: 70,
      imagen: 'https://cdn-icons-png.flaticon.com/512/1404/1404945.png',
      categoria: 'pizzas'
    },

    // BEBIDAS
    {
      id: 6,
      nombre: 'Coca Cola 2L',
      precio: 15,
      imagen: 'https://cdn-icons-png.flaticon.com/512/2405/2405597.png',
      categoria: 'bebidas'
    },
    {
      id: 7,
      nombre: 'Limonada Frozen',
      precio: 20,
      imagen: 'https://cdn-icons-png.flaticon.com/512/2442/2442019.png',
      categoria: 'bebidas'
    },

    // ENSALADAS
    {
      id: 8,
      nombre: 'Ensalada César',
      precio: 40,
      imagen: 'https://cdn-icons-png.flaticon.com/512/2515/2515183.png',
      categoria: 'ensaladas'
    }
  ];

  get productosFiltrados() {
    return this.productos.filter(p => p.categoria === this.categoriaActual);
  }

  cambiarCategoria(cat: string) {
    this.categoriaActual = cat;
  }
}