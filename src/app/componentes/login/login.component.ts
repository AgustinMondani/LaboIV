import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  mensaje = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onLogin() {
    const { email, password } = this.loginForm.value;
    const { error } = await this.auth.login(email, password);
    if (error) {
      this.mensaje = 'Credenciales incorrectas o usuario no existente.';
    } else {
      this.mensaje = 'Login exitoso';
      this.router.navigate(['/home']);
    }
  }

  cargarUsuarioRapido(email: string, password: string) {
  this.loginForm.patchValue({ email, password });
}
}