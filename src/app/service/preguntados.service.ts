import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, of , switchMap} from 'rxjs';

export interface Pregunta {
  imagen: string;
  opciones: string[];
  correcta: string;
}


@Injectable({ providedIn: 'root' })
export class PreguntadosService {
  private urlApi = 'https://thesimpsonsquoteapi.glitch.me/quotes?count=1';

  // Lista estática de personajes conocidos en la API (podés agregar más si querés)
  private personajesDisponibles: string[] = [
    'Homer Simpson', 'Marge Simpson', 'Bart Simpson', 'Lisa Simpson',
    'Mr. Burns', 'Milhouse Van Houten', 'Ned Flanders', 'Krusty the Clown',
    'Chief Wiggum', 'Ralph Wiggum', 'Moe Szyslak', 'Apu Nahasapeemapetilon'
  ];

  private usados: string[] = [];

  constructor(private http: HttpClient) {}

  obtenerPregunta(): Observable<Pregunta | null> {
  if (this.usados.length >= this.personajesDisponibles.length) {
    return of(null); // Fin del juego
  }

  return this.http.get<any[]>(this.urlApi).pipe(
    map(res => {
      const item = res[0];
      const personaje = item.character;

      // Si el personaje no está en la lista permitida o ya fue usado, ignoramos este intento
      if (
        !this.personajesDisponibles.includes(personaje) ||
        this.usados.includes(personaje)
      ) {
        return this.obtenerPregunta(); // 🔁 REINTENTAMOS
      }

      this.usados.push(personaje);

      // Opciones incorrectas + la correcta
      const distractoras = this.personajesDisponibles
        .filter(p => p !== personaje)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const opciones = [...distractoras, personaje].sort(() => Math.random() - 0.5);

      return {
        imagen: item.image,
        opciones,
        correcta: personaje
      };
    }),
    // 🛠️ FLATTEN el observable anidado por el reintento
    // 👇 Necesitamos convertirlo si devolvemos un observable dentro del map
    switchMap(pregunta => {
      if (pregunta instanceof Observable) {
        return pregunta; // devolvemos el intento reintentado
      }
      return of(pregunta); // devolvemos la pregunta válida
    })
  );
}


obtenerPreguntas(cantidad: number = 6): Observable<Pregunta[]> {
  this.reiniciarJuego();
  const preguntas: Pregunta[] = [];
  
  const obtenerUnaPreguntaRecursiva = (): Observable<Pregunta> => {
    return this.http.get<any[]>(this.urlApi).pipe(
      switchMap(res => {
        const item = res[0];
        const personaje = item.character;

        if (
          !this.personajesDisponibles.includes(personaje) ||
          this.usados.includes(personaje)
        ) {
          // Intentamos de nuevo si no es válido o ya usado
          return obtenerUnaPreguntaRecursiva();
        }

        this.usados.push(personaje);

        const distractoras = this.personajesDisponibles
          .filter(p => p !== personaje)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        const opciones = [...distractoras, personaje].sort(() => Math.random() - 0.5);

        const pregunta: Pregunta = {
          imagen: item.image,
          opciones,
          correcta: personaje
        };

        return of(pregunta);
      })
    );
  };

  return new Observable<Pregunta[]>(subscriber => {
    const cargarSiguiente = () => {
      if (preguntas.length >= cantidad) {
        subscriber.next(preguntas);
        subscriber.complete();
        return;
      }

      obtenerUnaPreguntaRecursiva().subscribe(pregunta => {
        preguntas.push(pregunta);
        cargarSiguiente();
      }, err => subscriber.error(err));
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