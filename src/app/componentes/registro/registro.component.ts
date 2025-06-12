import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent {
  registroForm: FormGroup;
  mensaje: string = '';

  constructor(private fb: FormBuilder, private auth: AuthService,  private router: Router) {
    this.registroForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsIguales });
  }

  passwordsIguales(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { noCoinciden: true };
  }

 async onRegistro() {
  if (this.registroForm.valid) {
    const { username, email, password } = this.registroForm.value;

    try {
      const { data, error } = await this.auth.register(email, password, username);

      if (error) {
        console.error('Error al registrar:', error.message);
        if (error.message.includes('User already registered')) {
          this.mensaje = 'Este correo ya está registrado. Por favor, usá otro.';
        } else {
          this.mensaje = 'Hubo un problema: ' + error.message;
        }
        return;
      }

      console.log('Usuario registrado:', data);
      this.registroForm.reset();
      this.router.navigate(['/home']);

    } catch (err: any) {
      console.error('Error inesperado:', err);
      this.mensaje = 'Error inesperado al registrar.';
    }
  } else {
    this.mensaje = 'Verificá que todos los campos estén bien completados.';
  }
}
}