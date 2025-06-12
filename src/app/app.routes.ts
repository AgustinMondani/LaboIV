import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AuthGuardAdmin } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./componentes/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./componentes/registro/registro.component').then(m => m.RegistroComponent),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./componentes/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'quien-soy',
    loadComponent: () =>
      import('./componentes/quien-soy/quien-soy.component').then(m => m.QuienSoyComponent),
  },
  {
    path: 'juegos',
    loadChildren: () =>
      import('./modulos/juegos/juegos-routing.module').then(m => m.routes),
    canActivate: [AuthGuard]
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./componentes/sala-chat/sala-chat.routes').then(m => m.routes),
    canActivate: [AuthGuard]
  },
  {
    path: 'encuesta',
    loadComponent: () =>
      import('./componentes/encuesta/encuesta.component').then(m => m.EncuestaComponent),
  },
  {
    path: 'ver-encuesta',
    loadComponent: () =>
      import('./componentes/ver-encuestas/ver-encuestas.component').then(m => m.VerEncuestasComponent),
    canActivate: [AuthGuardAdmin]
  }
];