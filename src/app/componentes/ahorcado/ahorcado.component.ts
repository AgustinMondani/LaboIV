import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { PuntuacionService } from '../../service/puntuacion.service';

@Component({
  standalone: true,
  selector: 'app-ahorcado',
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.scss']
})

export class AhorcadoComponent implements OnInit {
  palabra: string = '';
  letrasAdivinadas: string[] = [];
  letrasIncorrectas: string[] = [];
  maxIntentos: number = 6;
  letras: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  mensaje: string = '';
  juegoTerminado: boolean = false;
  dibujoAhorcado: string[] = [];
  ultimaPalabra: string = '';
  puntaje: number = 0;

  constructor(private router: Router, private supabase : AuthService, private puntuacionService: PuntuacionService){

  }

  private palabrasDisponibles: string[] = ['perro', 'gato', 'python', 'ionic', 'angular', 'celular', 'canguro'];

  async ngOnInit(){
    this.iniciarJuego();
  }

  private iniciarJuego(): void {
    this.letrasAdivinadas = [];
    this.letrasIncorrectas = [];
    this.mensaje = '';
    this.juegoTerminado = false;
    this.palabra = this.seleccionarPalabraAleatoria();
    this.actualizarDibujo();
  }

  private seleccionarPalabraAleatoria(): string {
    let nuevaPalabra = '';
    do {
      nuevaPalabra = this.palabrasDisponibles[Math.floor(Math.random() * this.palabrasDisponibles.length)].toUpperCase();
    } while (nuevaPalabra === this.ultimaPalabra);
    this.ultimaPalabra = nuevaPalabra;
    return nuevaPalabra;
  }

  presionarLetra(letra: string) {
    if (this.juegoTerminado || this.letrasAdivinadas.includes(letra) || this.letrasIncorrectas.includes(letra)) {
      return;
    }

    if (this.palabra.includes(letra)) {
      this.letrasAdivinadas.push(letra);
      this.verificarVictoria();
    } else {
      this.letrasIncorrectas.push(letra);
      this.actualizarDibujo();
      this.verificarDerrota();
    }
  }

  obtenerPalabraMostrada(): string {
    return this.palabra
      .split('')
      .map(letra => this.letrasAdivinadas.includes(letra) ? letra : '_')
      .join(' ');
  }

  async verificarVictoria() {
  const palabraUnica = [...new Set(this.palabra.split(''))];
  const letrasCorrectas = palabraUnica.every(letra => this.letrasAdivinadas.includes(letra));

  if (letrasCorrectas) {
    const intentosUsados = this.letrasIncorrectas.length;

    switch (intentosUsados) {
      case 0:
        this.puntaje = 200;
        break;
      case 1:
        this.puntaje = 150;
        break;
      case 2:
        this.puntaje = 100;
        break;
      case 3:
        this.puntaje = 50;
        break;
      case 4:
        this.puntaje = 10;
        break;
      case 5:
        this.puntaje = 1;
        break;
      default:
        this.puntaje = 0;
        break;
    }

    this.mensaje = `¡Ganaste! Puntaje: ${this.puntaje}`;
    this.juegoTerminado = true;

    const usuario = await this.supabase.getSessionPuntaje();
    const nombre = usuario?.user_metadata?.['username'] ?? 'Anónimo';
    const email = usuario?.email ?? 'sin@email';


    await this.puntuacionService.guardarPuntaje(nombre, email, 'Ahorcado', this.puntaje);
  }
}

  verificarDerrota() {
    if (this.letrasIncorrectas.length >= this.maxIntentos) {
      this.mensaje = `Perdiste. La palabra era: ${this.palabra}`;
      this.juegoTerminado = true;
    }
  }

  reiniciarJuego() {
    this.iniciarJuego();
  }

  actualizarDibujo() {
    const etapa = this.letrasIncorrectas.length;
    const dibujos = [
      `
      
      
      
      
      
      =========
      `,
      `
      |
      |
      |
      |
      |
      =========
      `,
      `
      +---+
      |
      |
      |
      |
      =========
      `,
      `
      +---+
      |   O
      |
      |
      |
      =========
      `,
      `
      +---+
      |   O
      |   |
      |
      |
      =========
      `,
      `
      +---+
      |   O
      |  /|\\
      |
      |
      =========
      `,
      `
      +---+
      |   O
      |  /|\\
      |  / \\
      |
      =========
      `
    ];
    this.dibujoAhorcado = dibujos[etapa].split('\n');
  }
}