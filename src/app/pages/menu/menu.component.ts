import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { ApiService } from '../../services/api.service';
import { Plato, Categoria } from '../../models/producto.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss' 
})
export class MenuComponent implements OnInit {
  public carritoService = inject(CarritoService);
  private api = inject(ApiService);
  private route = inject(ActivatedRoute); 

  categorias = signal<Categoria[]>([]);
  productos = signal<Plato[]>([]);
  categoriaActualId = signal<number>(0);

  productosFiltrados = computed(() => {
    const catId = this.categoriaActualId();
    const listaProductos = this.productos();

    if (catId === 0) return listaProductos;
    return listaProductos.filter(p => p.categoria_id === catId);
  });

  ngOnInit() {
    this.cargarDatos();
    this.capturarParametrosDeUrl(); 
  }

  capturarParametrosDeUrl(): void {
    this.route.queryParams.subscribe(params => {
      const chatId = params['chat_id'];
      const nombreUsuario = params['nombre_usuario'];

      if (chatId) {
        localStorage.setItem('chat_id', chatId);
        console.log('Chat ID de la URL capturado y guardado:', chatId);
      }
      if (nombreUsuario) {
        localStorage.setItem('nombre_usuario', nombreUsuario);
        console.log('Nombre de Usuario de la URL capturado y guardado:', nombreUsuario);
      }
    });
  }

  cargarDatos() {
    this.api.getCategorias().subscribe({
      next: (cats) => {
        this.categorias.set(cats);
        if (cats.length > 0) {
          this.categoriaActualId.set(cats[0].id);
        }
      },
      error: (err) => console.error('Error cargando categorías:', err)
    });

    // Cargar Platos
    this.api.getPlatos().subscribe({
      next: (platos) => {
        console.log('Platos cargados:', platos); // Para depurar
        this.productos.set(platos);
      },
      error: (err) => console.error('Error cargando platos:', err)
    });
  }

  cambiarCategoria(catId: number) {
    this.categoriaActualId.set(catId);
  }
}