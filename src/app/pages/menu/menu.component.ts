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

  public displayChatId = signal<string>('Cargando...');
  public displayNombreUsuario = signal<string>('Cargando...');

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
        this.displayChatId.set(chatId);
      } else {
        this.displayChatId.set('ID No Encontrado');
      }
      
      if (nombreUsuario) {
        localStorage.setItem('nombre_usuario', nombreUsuario);
        this.displayNombreUsuario.set(nombreUsuario);
      } else {
        this.displayNombreUsuario.set('Nombre No Encontrado');
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