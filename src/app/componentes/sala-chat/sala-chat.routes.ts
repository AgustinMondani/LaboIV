import { Routes } from '@angular/router';
import { SalaChatComponent } from './sala-chat.component';
import { AuthGuard } from '../../guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: SalaChatComponent,
    canActivate: [AuthGuard]
  }
];