import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { PuntuacionService } from '../../../service/puntuacion.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-batalla-naval',
  templateUrl: './batalla-naval.component.html',
  styleUrls: ['./batalla-naval.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class BatallaNavalComponent implements OnInit {
  tablero: string[][] = [];
  barcos: Set<string> = new Set();
  intentos = 8;
  aciertos = 0;
  juegoFinalizado = false;
  mensaje = '';
  usuario: any;

  constructor(
    private puntuacionService: PuntuacionService,
    private supabase: AuthService
  ) { }

  ngOnInit() {
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.tablero = Array.from({ length: 6 }, () => Array(6).fill(''));
    this.barcos.clear();
    this.intentos = 8;
    this.aciertos = 0;
    this.juegoFinalizado = false;
    this.mensaje = '';

    while (this.barcos.size < 7) {
      const fila = Math.floor(Math.random() * 6);
      const col = Math.floor(Math.random() * 6);
      this.barcos.add(`${fila},${col}`);
    }

    const debugTablero = Array.from({ length: 6 }, (_, f) =>
      Array.from({ length: 6 }, (_, c) =>
        this.barcos.has(`${f},${c}`) ? '🚢' : '🌊'
      )
    );

    console.table(debugTablero);
  }

  disparar(fila: number, col: number) {
    if (this.juegoFinalizado || this.tablero[fila][col] !== '') return;

    const key = `${fila},${col}`;
    if (this.barcos.has(key)) {
      this.tablero[fila][col] = 'hit';
      this.aciertos++;
      this.mensaje = '¡Tocado!';
    } else {
      let minDist = Infinity;
      this.barcos.forEach(pos => {
        const [bf, bc] = pos.split(',').map(Number);
        const dist = Math.abs(fila - bf) + Math.abs(col - bc);
        if (dist < minDist) minDist = dist;
      });
      this.tablero[fila][col] = `miss-${minDist}`;

      this.mensaje = `¡Agua! El barco más cercano está a ${minDist} casillas`;
      this.intentos--;
    }

    let puntos = 0;
    if (this.aciertos === 7) {
      this.juegoFinalizado = true;
      puntos = this.intentos * 10 + 100;
      this.mensaje = `¡Ganaste! Puntaje: ${puntos}`;
      this.guardarPuntuacion(puntos);
    } else if (this.intentos === 0) {
      this.juegoFinalizado = true;
      puntos = this.aciertos * 5;
      this.mensaje = `¡Perdiste! Puntaje: ${puntos}`;
      this.guardarPuntuacion(puntos);
    }
  }

  async guardarPuntuacion(puntos: any) {

    const usuario = await this.supabase.getSessionPuntaje();
    const nombre = usuario?.user_metadata?.['username'] ?? 'Anónimo';
    const email = usuario?.email ?? 'sin@email';

    await this.puntuacionService.guardarPuntaje(nombre, email, 'Naval', puntos);

  }

  reiniciar() {
    this.iniciarJuego();
  }
}
