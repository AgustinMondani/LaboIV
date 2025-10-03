import { Component, OnInit } from '@angular/core';
import { PreguntadosService, Pregunta } from '../../service/preguntados.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { PuntuacionService } from '../../service/puntuacion.service';

@Component({
  selector: 'app-preguntados-simpson',
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.scss'],
  imports: [CommonModule]
})
export class PreguntadosComponent implements OnInit {
  preguntas: Pregunta[] = [];
  indicePregunta = 0;
  pregunta!: Pregunta | null;
  seleccion = '';
  mensaje = '';
  puntaje = 0;
  totalPreguntas = 3;
  respondidas = 0;
  juegoFinalizado = false;
  cargando: boolean = false;

  constructor(
    private preguntadosService: PreguntadosService,
    private supabase: AuthService,
    private puntuacionService: PuntuacionService
  ) {}

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego(): void {
    this.cargando = true;
    this.juegoFinalizado = false;
    this.puntaje = 0;
    this.respondidas = 0;
    this.indicePregunta = 0;
    this.seleccion = '';
    this.mensaje = '';
    this.pregunta = null;

    this.preguntadosService.obtenerPreguntas(this.totalPreguntas).subscribe(
      preguntas => {
        this.preguntas = preguntas;
        if (this.preguntas.length > 0) {
          this.mostrarPreguntaActual();
        }
        this.cargando = false;
      },
      error => {
        console.error('Error cargando preguntas', error);
        this.cargando = false;
      }
    );
  }

  mostrarPreguntaActual() {
    if (this.indicePregunta < this.preguntas.length) {
      this.pregunta = this.preguntas[this.indicePregunta];
      this.seleccion = '';
      this.mensaje = '';
    } else {
      this.finalizarJuego();
    }
  }

  elegir(op: string): void {
    if (!this.pregunta || this.seleccion) return;

    this.seleccion = op;
    this.respondidas++;

    if (op === this.pregunta.correcta) {
      this.puntaje += 10;
      this.mensaje = '¡Correcto!';
    } else {
      this.mensaje = `Incorrecto. La respuesta correcta era: ${this.pregunta.correcta}`;
    }
  }

  siguiente(): void {
    if (!this.seleccion) return;
    this.indicePregunta++;
    this.mostrarPreguntaActual();
  }

  reiniciar(): void {
    this.iniciarJuego();
  }

  private async finalizarJuego() {
    this.juegoFinalizado = true;
    const usuario = await this.supabase.getSessionPuntaje();
    const nombre = usuario?.user_metadata?.['username'] ?? 'Anónimo';
    const email = usuario?.email ?? 'sin@email';
    await this.puntuacionService.guardarPuntaje(nombre, email, 'Preguntados', this.puntaje);
  }
}
