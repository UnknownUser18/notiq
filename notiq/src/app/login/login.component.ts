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
  protected loginForm = new FormGroup({
    username : new FormControl('', [Validators.required]),
    password : new FormControl('', [Validators.required])
  });


  constructor(private authService : AuthService) {
  }

  protected login() : void {
    const loginForm = this.loginForm.value;
    this.authService.login(loginForm.username!, loginForm.password!).subscribe({
      next: (response) => {
        console.log('Odpowiedź backendu:', response);
      },
      error: (err) => {
        console.error('Błąd logowania:', err);
      }
    });
  }
}
