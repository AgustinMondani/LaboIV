import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { PuntuacionService } from '../../service/puntuacion.service';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './mayor-menor.component.html',
  styleUrls: ['./mayor-menor.component.scss']
})
export class MayorMenorComponent implements OnInit {

  nombreUsuario: any = null;
  idMazo: string = '';
  cartaActual: any = null;
  cartaSiguiente: any = null;
  puntaje: number = 0;
  cartasRestantes: number = 52;
  mensajeResultado: string = '';
  ordenValores: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE'];

  constructor(
    private http: HttpClient,
    private router: Router,
    private servicioAuth: AuthService,
    private servicioPuntuacion: PuntuacionService
  ) {}

  async ngOnInit() {
    this.nombreUsuario = await this.servicioAuth.getSessionUser();
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.http.get<any>('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .subscribe(res => {
        this.idMazo = res.deck_id;
        this.puntaje = 0;
        this.cartasRestantes = 52;
        this.mensajeResultado = '';
        this.sacarCartaInicial();
      });
  }

  sacarCartaInicial() {
    this.http.get<any>(`https://deckofcardsapi.com/api/deck/${this.idMazo}/draw/?count=1`)
      .subscribe(res => {
        this.cartaActual = res.cards[0];
        this.cartasRestantes = res.remaining;
      });
  }

  async adivinar(esMayor: boolean) {

    if (this.cartasRestantes === 0) {
      const usuario = await this.servicioAuth.getSessionPuntaje();
      const nombre = usuario?.user_metadata?.['username'] ?? 'Anónimo';
      const email = usuario?.email ?? 'sin@email';

      await this.servicioPuntuacion.guardarPuntaje(nombre, email, 'Mayor menor', this.puntaje);
      this.mensajeResultado = '¡No quedan más cartas!';
      return;
    }

    this.http.get<any>(`https://deckofcardsapi.com/api/deck/${this.idMazo}/draw/?count=1`)
      .subscribe(res => {
        this.cartaSiguiente = res.cards[0];
        this.cartasRestantes = res.remaining;

        const indiceActual = this.ordenValores.indexOf(this.cartaActual.value);
        const indiceSiguiente = this.ordenValores.indexOf(this.cartaSiguiente.value);

        const acierto = esMayor ? indiceSiguiente > indiceActual : indiceSiguiente < indiceActual;

        if (acierto) {
          this.puntaje++;
          this.mensajeResultado = '¡Correcto!';
        } else {
          this.mensajeResultado = 'Fallaste :(';
        }

        this.cartaActual = this.cartaSiguiente;
        this.cartaSiguiente = null;
      });
  }
}
