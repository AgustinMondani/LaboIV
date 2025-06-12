import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'ahorcado',
        loadComponent: () =>
          import('../../componentes/ahorcado/ahorcado.component').then(m => m.AhorcadoComponent),
      },
      {
        path: 'mayor-menor',
        loadComponent: () =>
          import('../../componentes/mayor-menor/mayor-menor.component').then(m => m.MayorMenorComponent),
      },
      {
        path: 'preguntados',
        loadComponent: () =>
          import('../../componentes//preguntados/preguntados.component').then(m => m.PreguntadosComponent),
      },
      {
        path: 'wordle',
        loadComponent: () =>
          import('../../componentes/wordle/wordle.component').then(m => m.WordleComponent),
      },
    ],
  },
];