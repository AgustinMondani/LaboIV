// wordle.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { PuntuacionService } from '../../service/puntuacion.service';

@Component({
  selector: 'app-wordle',
  standalone: true,
  templateUrl: './wordle.component.html',
  styleUrls: ['./wordle.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class WordleComponent implements OnInit {

  listaPalabras: string[] = ['PERRO', 'CASAS', 'GATOS', 'LUZES', 'ARBOL', 'NIEVE', 'RATON', 'PLAZA', 'FUEGO', 'AGUAS'];
  palabrasElegidas: string[] = [];
  palabraSecreta: string = '';
  intentoActual: string = '';
  intentos: string[] = [];
  colores: string[][] = [];
  maxIntentos: number = 6;
  juegoTerminado: boolean = false;
  mensaje: string = '';
  rondaActual: number = 0;
  puntaje: number = 0;
  juegoFinalizado: boolean = false;

  constructor(private supabase: AuthService, private puntuacionService: PuntuacionService){}

  ngOnInit(): void {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.puntaje = 0;
    this.rondaActual = 0;
    this.juegoFinalizado = false;
    this.palabrasElegidas = this.seleccionarPalabrasAleatorias(2);
    this.prepararRonda();
  }

  seleccionarPalabrasAleatorias(cantidad: number): string[] {
    const palabras = [...this.listaPalabras];
    const elegidas: string[] = [];

    while (elegidas.length < cantidad && palabras.length > 0) {
      const index = Math.floor(Math.random() * palabras.length);
      elegidas.push(palabras.splice(index, 1)[0].toUpperCase());
    }

    return elegidas;
  }

  prepararRonda() {
    this.palabraSecreta = this.palabrasElegidas[this.rondaActual];
    this.intentos = [];
    this.colores = [];
    this.intentoActual = '';
    this.juegoTerminado = false;
    this.mensaje = '';
  }

  enviarIntento() {
    const intento = this.intentoActual.toUpperCase();
    if (intento.length !== 5 || this.juegoTerminado || this.juegoFinalizado) return;

    const coloresFila = Array(5).fill('gris');
    const letrasUsadas = Array(5).fill(false);

    for (let i = 0; i < 5; i++) {
      if (intento[i] === this.palabraSecreta[i]) {
        coloresFila[i] = 'verde';
        letrasUsadas[i] = true;
      }
    }

    for (let i = 0; i < 5; i++) {
      if (coloresFila[i] === 'gris') {
        for (let j = 0; j < 5; j++) {
          if (!letrasUsadas[j] && intento[i] === this.palabraSecreta[j]) {
            coloresFila[i] = 'amarillo';
            letrasUsadas[j] = true;
            break;
          }
        }
      }
    }

    this.intentos.push(intento);
    this.colores.push(coloresFila);
    this.intentoActual = '';

    if (intento === this.palabraSecreta) {
      this.juegoTerminado = true;
      this.mensaje = '¡Correcto!';
      this.calcularPuntaje();
    } else if (this.intentos.length >= this.maxIntentos) {
      this.juegoTerminado = true;
      this.mensaje = `La palabra era: ${this.palabraSecreta}`;
    }

    if (this.juegoTerminado) {
      setTimeout(() => this.siguienteRonda(), 2000);
    }
  }

  calcularPuntaje() {
    const intento = this.intentos.length;
    if (intento === 1) this.puntaje += 6;
    else if (intento === 2) this.puntaje += 4;
    else if (intento === 3) this.puntaje += 2;
    else this.puntaje += 1;
  }

  async siguienteRonda() {
    this.rondaActual++;
    if (this.rondaActual < this.palabrasElegidas.length) {
      this.prepararRonda();
    } else {

      const usuario = await this.supabase.getSessionPuntaje();
      const nombre = usuario?.user_metadata?.['username'] ?? 'Anónimo';
      const email = usuario?.email ?? 'sin@email';

      await this.puntuacionService.guardarPuntaje(nombre, email, 'Wordle', this.puntaje);

      this.juegoFinalizado = true;
      this.mensaje = `¡Juego terminado! Puntaje final: ${this.puntaje} puntos`;
    }
  }

  reiniciarTodo() {
    this.iniciarJuego();
  }

  obtenerLetra(i: number, j: number): string {
    return this.intentos[i]?.[j] ?? '';
  }

  obtenerColor(i: number, j: number): string {
    return this.colores[i]?.[j] ?? 'gris';
  }
}
