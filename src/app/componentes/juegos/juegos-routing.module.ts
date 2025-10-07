import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ahorcado',
        loadComponent: () =>
          import('./ahorcado/ahorcado.component').then(m => m.AhorcadoComponent),
      },
      {
        path: 'mayor-menor',
        loadComponent: () =>
          import('./mayor-menor/mayor-menor.component').then(m => m.MayorMenorComponent),
      },
      {
        path: 'preguntados',
        loadComponent: () =>
          import('./preguntados/preguntados.component').then(m => m.PreguntadosComponent),
      },
      {
        path: 'wordle',
        loadComponent: () =>
          import('../wordle/wordle.component').then(m => m.WordleComponent),
      },
      {
        path: 'naval',
        loadComponent: () =>
          import('./batalla-naval/batalla-naval.component').then(m => m.BatallaNavalComponent)
      }
    ],
  },
];