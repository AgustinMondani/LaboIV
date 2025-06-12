import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PuntuacionService {
  private supabase = createClient(environment.apiUrl, environment.publicAnonKey);

  async guardarPuntaje(nombre: string, email: string, juego: string, puntaje: number) {
    const { error } = await this.supabase.from('puntuaciones').insert([
      {
        nombre,
        email,
        juego,
        puntaje,
        fecha: new Date().toISOString()
      }
    ]);

    if (error) {
      console.error('Error al guardar el puntaje:', error.message);
    } else {
      console.log('Puntaje guardado correctamente');
    }
  }

  async obtenerPuntajesPorJuego(juego: string) {
  const { data, error } = await this.supabase
    .from('puntuaciones')
    .select('nombre, email, juego, puntaje, fecha')
    .eq('juego', juego)
    .order('puntaje', { ascending: false });

  if (error) throw error;
  return data;
}
}
