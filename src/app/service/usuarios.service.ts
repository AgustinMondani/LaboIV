import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioResponse } from '../modelos/usuario-response.model';
import { environment } from '../../environments/environment.prod';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class UsuariosService {

  constructor(private http: HttpClient) { }

  TraerUsuarios(usuario: string) {
    return this.http.get<UsuarioResponse[]>(`${API_URL}?username=${usuario}`);
  }

}