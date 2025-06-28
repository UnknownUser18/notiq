import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector : 'app-login',
  imports : [
    ReactiveFormsModule
  ],
  templateUrl : './login.component.html',
  styleUrl : './login.component.scss'
})
export class LoginComponent {
  protected isLoggingIn = false;

  protected loginForm = new FormGroup({
    username : new FormControl(null, [Validators.required]),
    password : new FormControl(null, [Validators.required]),
    rememberMe : new FormControl(false)
  });


  constructor(private authService : AuthService) {
  }

  protected login() : void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;
    this.isLoggingIn = true;
    const loginForm = this.loginForm.value;
    console.log('Dane logowania:', loginForm);
    this.authService.login(loginForm.username!, loginForm.password!).subscribe({
      next : (response) => {
        console.log('Odpowiedź backendu:', response);
      },
      error : (err) => {
        console.error('Błąd logowania:', err);
      }
    });
  }
}
