import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from "@ngx-translate/core";
import { Subject, takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faCheck, faEye, faEyeSlash, faWarning } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector : 'app-login',
  imports : [
    ReactiveFormsModule,
    TranslatePipe,
    FontAwesomeModule
  ],
  templateUrl : './login.component.html',
  styleUrl : './login.component.scss'
})
export class LoginComponent implements OnDestroy {
  private destroy$ : Subject<void> = new Subject<void>();


  protected showPassword = false;
  protected statusNumber : number | undefined;
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
    const { username, password, rememberMe } = this.loginForm.value;
    this.authService.login(username!, password!, rememberMe!).pipe(takeUntil(this.destroy$)).subscribe({
      next : (response) => {
        this.isLoggingIn = false;
        this.statusNumber = response.status;
      },
      error : (error) => {
        this.isLoggingIn = false;
        this.statusNumber = error.status;
      }
    });
  }


  public ngOnDestroy() : void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.statusNumber !== 200) {
      this.statusNumber = undefined;
    }
    this.isLoggingIn = false;
    this.loginForm.reset();
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
    this.loginForm.updateValueAndValidity();
  }

  protected readonly faEyeSlash = faEyeSlash;
  protected readonly faEye = faEye;
  protected readonly faWarning = faWarning;
  protected readonly faCheck = faCheck;
}
