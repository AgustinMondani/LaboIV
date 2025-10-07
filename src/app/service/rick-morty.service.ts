import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Personaje {
  id: number;
  name: string;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class RickMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api/character';

  constructor(private http: HttpClient) { }

  obtenerPersonajes(): Observable<{ results: Personaje[] }> {
    return this.http.get<{ results: Personaje[] }>(this.apiUrl);
  }
}
