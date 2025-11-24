import { Routes } from '@angular/router';
import { MenuComponent } from './pages/menu/menu.component';
import { ResumenComponent } from './pages/resumen/resumen.component';
import { PagoComponent } from './pages/pago/pago.component';
import { VerificadoComponent } from './pages/verificado/verificado.component';
import { MapaComponent } from './pages/mapa/mapa.component';

export const routes: Routes = [
  { path: '', redirectTo: 'menu', pathMatch: 'full' }, // Redirige al menú al entrar
  { path: 'menu', component: MenuComponent },
  { path: 'resumen', component: ResumenComponent },
  { path: 'pago', component: PagoComponent },
  { path: 'verificado', component: VerificadoComponent },
  { path: 'mapa', component: MapaComponent },
  { path: '**', redirectTo: 'menu' } // Si escriben cualquier cosa rara, vuelve al menú
];