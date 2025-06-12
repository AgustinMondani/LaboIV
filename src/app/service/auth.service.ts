import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  async login(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  }

  async register(email: string, password: string, username: string) {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        }
      }
    });
  }

  async logout() {
    return await supabase.auth.signOut();
  }

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }

  async getSessionPuntaje() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      console.error('No se pudo obtener el usuario', error?.message);
      return null;
    }
    return data.user;
  }

  async getSessionUser() {
    const { data } = await supabase.auth.getUser();
    console.log('Usuario completo:', data.user);
    return data.user?.user_metadata?.['username'] || null;
  }

  get client() {
    return supabase;
  }

  async getUserId(): Promise<string | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      console.error('No se pudo obtener el usuario', error?.message);
      return null;
    }
    return data.user.id;
  }

  async tieneEncuesta(): Promise<boolean> {
    const userId = await this.getUserId();
    if (!userId) return false;

    const { data, error } = await supabase
      .from('encuestas')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { 
      console.error('Error al buscar encuesta:', error.message);
      return false;
    }

    return !!data;
  }

  async guardarEncuesta(encuesta: any): Promise<string | null> {
    const userId = await this.getUserId();
    if (!userId) return 'Usuario no autenticado';

    const yaTiene = await this.tieneEncuesta();
    if (yaTiene) return 'Ya existe una encuesta para este usuario';

    const encuestaConUserId = {
      ...encuesta,
      user_id: userId
    };

    const { error } = await supabase
      .from('encuestas')
      .insert([encuestaConUserId]);

    return error ? error.message : null;
  }

  async esAdmin(): Promise<boolean> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return false;
    console.log(user.email)
    return user.email == 'admin1@admin.com';
  }

  async obtenerEncuestas(): Promise<{ data: any[]; error: any }> {
    const { data, error } = await supabase.from('encuestas').select('*');
    return { data: data ?? [], error };
  }
}
