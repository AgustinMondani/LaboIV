import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface Pregunta {
  imagen: string;
  opciones: string[];
  correcta: string;
}

@Injectable({
  providedIn: 'root'
})
export class PreguntadosService {
  private apiUrl = 'https://disneyapi.dev/api/character/';
  private personajesDisponibles: string[] = [
    'Mickey Mouse', 'Donald Duck', 'Goofy', 'Pluto', 'Minnie Mouse',
    'Elsa', 'Anna', 'Olaf', 'Simba', 'Ariel', 'Belle', 'Aladdin'
  ];
  private usados: string[] = [];

  constructor(private http: HttpClient) {}

  private obtenerPreguntaConReintento(intentos: number = 3): Observable<Pregunta | null> {
    if (this.usados.length >= this.personajesDisponibles.length) {
      return of(null); // Fin del juego
    }

    const restantes = this.personajesDisponibles.filter(p => !this.usados.includes(p));
    const correcto = restantes[Math.floor(Math.random() * restantes.length)];
    this.usados.push(correcto);

    return this.http.get<any[]>(`${this.apiUrl}?name=${encodeURIComponent(correcto)}`).pipe(
      switchMap(res => {
        const personaje = res?.[0];
        if (!personaje && intentos > 0) {
          // Si no se obtiene un personaje, reintentar
          return this.obtenerPreguntaConReintento(intentos - 1);
        } else if (!personaje) {
          // Si se agotaron los intentos, devolver null
          return of(null);
        }

        const distractoras = this.personajesDisponibles
          .filter(p => p !== correcto)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        const opciones = [...distractoras, correcto].sort(() => Math.random() - 0.5);

        return of({
          imagen: personaje.imageUrl,
          opciones,
          correcta: correcto
        });
      })
    );
  }

  obtenerPregunta(): Observable<Pregunta | null> {
    return this.obtenerPreguntaConReintento();
  }

  obtenerPreguntas(cantidad: number = 6): Observable<Pregunta[]> {
    this.reiniciarJuego();
    const preguntas: Pregunta[] = [];

    return new Observable<Pregunta[]>(subscriber => {
      const cargarSiguiente = () => {
        if (preguntas.length >= cantidad) {
          subscriber.next(preguntas);
          subscriber.complete();
          return;
        }

        this.obtenerPregunta().subscribe(p => {
          if (p) preguntas.push(p);
          cargarSiguiente();
        }, err => {
          console.error('Error al obtener pregunta:', err);
          cargarSiguiente(); // Continuar con la siguiente pregunta
        });
      };

      cargarSiguiente();
    });
  }

  reiniciarJuego() {
    this.usados = [];
  }

  obtenerTotalPreguntas(): number {
    return this.personajesDisponibles.length;
  }
}
