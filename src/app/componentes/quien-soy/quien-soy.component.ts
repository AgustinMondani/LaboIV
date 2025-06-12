import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.prod';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey)



@Component({
  selector: 'app-quien-soy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quien-soy.component.html',
  styleUrls: ['./quien-soy.component.scss'],
})
export class QuienSoyComponent {
  fotoPerfilUrl: string = '';
  

  constructor() {
    this.cargarFotoPerfil();
  }

  async cargarFotoPerfil() {
    const { data} = await supabase.storage.from('assets').getPublicUrl('foto-pefil.png');

      this.fotoPerfilUrl = data.publicUrl;
      console.log('URL de imagen:', this.fotoPerfilUrl);
  }
}