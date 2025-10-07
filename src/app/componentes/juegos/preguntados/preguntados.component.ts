import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RickMortyService, Personaje } from '../../../service/rick-morty.service';
import { AuthService } from '../../../service/auth.service';
import { PuntuacionService } from '../../../service/puntuacion.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.scss']
})
export class PreguntadosComponent implements OnInit, OnDestroy {
  personajeCorrecto: Personaje | null = null;
  opciones: string[] = [];
  puntaje: number = 0;
  mensaje: string = '';

  juegoIniciado: boolean = false;
  juegoTerminado: boolean = false;
  tiempoRestante: number = 30;
  temporizador: any;

  opcionSeleccionada: string | null = null;
  opcionCorrecta: string | null = null;

  private todosPersonajes: Personaje[] = [];
  private personajesUsados: Set<number> = new Set();

  constructor(
    private rmService: RickMortyService,
    private supabase: AuthService,
    private puntuacionService: PuntuacionService
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    clearInterval(this.temporizador);
  }

  comenzarJuego() {
    this.juegoIniciado = true;
    this.juegoTerminado = false;
    this.puntaje = 0;
    this.tiempoRestante = 30;
    this.personajesUsados.clear();
 
    this.rmService.obtenerPersonajes().subscribe(res => {
      this.todosPersonajes = res.results;
      this.cargarPregunta();
    });

    this.temporizador = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.finalizarJuego();
      }
    }, 1000);
  }

  cargarPregunta() {
    this.mensaje = '';
    this.opcionSeleccionada = null;
    this.opcionCorrecta = null;

    // Filtramos los personajes que no se usaron
    const disponibles = this.todosPersonajes.filter(p => !this.personajesUsados.has(p.id));

    if (disponibles.length === 0) {
      // Si no hay más personajes disponibles, termina el juego
      this.finalizarJuego();
      return;
    }

    // Seleccionamos personaje correcto aleatorio
    const indice = Math.floor(Math.random() * disponibles.length);
    this.personajeCorrecto = disponibles[indice];
    this.personajesUsados.add(this.personajeCorrecto.id);

    // Opciones incorrectas
    const opcionesIncorrectas = disponibles
      .filter(p => p.id !== this.personajeCorrecto!.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    // Mezclamos correcta + incorrectas
    this.opciones = [
      this.personajeCorrecto.name,
      ...opcionesIncorrectas.map(p => p.name)
    ].sort(() => 0.5 - Math.random());
  }

  seleccionarOpcion(nombre: string) {
    if (this.juegoTerminado || this.opcionSeleccionada) return;

    this.opcionSeleccionada = nombre;
    this.opcionCorrecta = this.personajeCorrecto?.name ?? null;

    if (nombre === this.personajeCorrecto?.name) {
      this.puntaje += 10;
    } else {
      if(this.puntaje >= 3){
        this.puntaje -= 3;
      }
    }

    setTimeout(() => this.cargarPregunta(), 1000);
  }

  async finalizarJuego() {
    clearInterval(this.temporizador);
    this.juegoTerminado = true;

    const usuario = await this.supabase.getSessionPuntaje();
    const nombreUsuario = usuario?.user_metadata?.['username'] ?? 'Anónimo';
    const email = usuario?.email ?? 'sin@email';
    await this.puntuacionService.guardarPuntaje(nombreUsuario, email, 'Preguntados', this.puntaje);
  }

  reiniciarJuego() {
    this.juegoIniciado = false;
    this.juegoTerminado = false;
    this.puntaje = 0;
    this.tiempoRestante = 30;
    this.personajesUsados.clear();
  }
}
