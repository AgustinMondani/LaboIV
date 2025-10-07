import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class EncuestaComponent {
  encuestaForm: FormGroup;
  enviado = false;
  rangoValor = 5;
  mensaje: string | null = null;
  esError: boolean = false;

  constructor(private fb: FormBuilder, private supabaseService: AuthService) {
    this.encuestaForm = this.fb.group({
      nombre: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$') // Solo números, 10 dígitos exactos
        ]
      ],
      gustoJuego: [],
      diversion: ['', Validators.required],
      dificultad: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
    });
  }

  get nombre() { return this.encuestaForm.get('nombre'); }
  get edad() { return this.encuestaForm.get('edad'); }
  get telefono() { return this.encuestaForm.get('telefono'); }
  get gustoJuego() { return this.encuestaForm.get('gustoJuego'); }
  get diversion() { return this.encuestaForm.get('diversion'); }
  get dificultad() { return this.encuestaForm.get('dificultad'); }

  async enviar() {
    this.enviado = true;
    this.mensaje = null;

    if (this.encuestaForm.invalid) return;

    const encuesta = this.encuestaForm.value;

    const error = await this.supabaseService.guardarEncuesta(encuesta);

    if (!error) {
      this.mensaje = 'Encuesta enviada con éxito.';
      this.esError = false;
      this.encuestaForm.reset();
      this.enviado = false;
    } else {
      this.mensaje = `${error}`;
      this.esError = true;
    }
  }
}
