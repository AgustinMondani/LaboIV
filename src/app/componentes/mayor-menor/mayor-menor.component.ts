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
  username: any =null;
  deckId: string = '';
  currentCard: any = null;
  nextCard: any = null;
  score: number = 0;
  remaining: number = 52;
  result: string = '';

  valoresOrden: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING', 'ACE'];

  constructor(private http: HttpClient, private router: Router, private supabase: AuthService, private puntuacionService: PuntuacionService) {}

  async ngOnInit(){
    this.username = await this.supabase.getSessionUser();
    this.iniciarJuego();
  }

  iniciarJuego() {
    this.http.get<any>('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .subscribe(res => {
        this.deckId = res.deck_id;
        this.score = 0;
        this.remaining = 52;
        this.result = '';
        this.drawInitialCard();
      });
  }

  drawInitialCard() {
    this.http.get<any>(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`)
      .subscribe(res => {
        this.currentCard = res.cards[0];
        this.remaining = res.remaining;
      });
  }

  async guess(higher: boolean) {
    if (this.remaining === 0) {

    const usuario = await this.supabase.getSessionPuntaje();
    const nombre = usuario?.user_metadata?.['username'] ?? 'Anónimo';
    const email = usuario?.email ?? 'sin@email';
    await this.puntuacionService.guardarPuntaje(nombre, email, 'Mayor menor', this.score);

      this.result = '¡No quedan más cartas!';
      return;
    }

    this.http.get<any>(`https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`)
      .subscribe(res => {
        this.nextCard = res.cards[0];
        this.remaining = res.remaining;

        const currentIndex = this.valoresOrden.indexOf(this.currentCard.value);
        const nextIndex = this.valoresOrden.indexOf(this.nextCard.value);

        const acertado = higher ? nextIndex > currentIndex : nextIndex < currentIndex;

        if (acertado) {
          this.score++;
          this.result = '¡Correcto!';
        } else {
          this.result = 'Fallaste :(';
        }

        // Pasamos la carta nueva como actual
        this.currentCard = this.nextCard;
        this.nextCard = null;
      });
  }
}