import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-ver-encuestas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-encuestas.component.html',
  styleUrls: ['./ver-encuestas.component.scss'],
})
export class VerEncuestasComponent implements OnInit {
  encuestas: any[] = [];
  cargando = true;
  mensajeError: string | null = null;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    try {
      const { data, error } = await this.authService.obtenerEncuestas();
      if (error) throw error;
      this.encuestas = data;
    } catch (err) {
      console.error(err);
      this.mensajeError = 'Error al cargar encuestas.';
    } finally {
      this.cargando = false;
    }
  }
}