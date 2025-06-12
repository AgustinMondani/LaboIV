import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponent } from '../../app.component';
import { PuntuacionService } from '../../service/puntuacion.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: (['./home.component.scss']),
})
export class HomeComponent{

  puntajes: any[] = [];
  
  constructor(private auth: AuthService, private router: Router, private appComponent:AppComponent, private puntuacionService: PuntuacionService) { }

  async ngOnInit() {

  }

  irAJuego(juego: string) {
    this.router.navigate([`/${juego}`]);
  }

  async filtrarPorJuego(juego: string) {
    try {
      this.puntajes = await this.puntuacionService.obtenerPuntajesPorJuego(juego);
    } catch (error) {
      console.error('Error al obtener puntajes', error);
    }
  }

  irAChat() {
  this.router.navigate(['/chat']);
}

irAVerEncuestas() {
  this.router.navigate(['/ver-encuesta']);
}

  irAEncuesta() {
  this.router.navigate(['/encuesta']);
}

irAQuienSoy() {
  this.router.navigate(['/quien-soy']);
}
  
}