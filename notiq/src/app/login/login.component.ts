import { AfterViewInit, Component, computed, ElementRef, Inject, OnDestroy, PLATFORM_ID, QueryList, Signal, signal, ViewChild, ViewChildren, WritableSignal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { catchError, map, of } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faCheck, faEye, faEyeSlash, faWarning } from '@fortawesome/free-solid-svg-icons';
import { animate } from 'animejs';
import { isPlatformBrowser } from '@angular/common';
import { take } from 'rxjs/operators';
import { InfoService } from '../services/info.service';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector : 'app-login',
  imports : [
    ReactiveFormsModule,
    TranslatePipe,
    FontAwesomeModule
  ],
  templateUrl : './login.component.html',
  styleUrl : './login.component.scss',
})
export class LoginComponent implements OnDestroy, AfterViewInit {
  private readonly maxAttempts = 3;

  protected numberOfAttempts = signal(0);
  protected showPassword = signal(false);
  protected statusNumber : WritableSignal<number | undefined> = signal(undefined);
  protected isLoggingIn = signal(false);


  protected readonly faEyeSlash = faEyeSlash;
  protected readonly faEye = faEye;
  protected readonly faWarning = faWarning;
  protected readonly faCheck = faCheck;

  protected loginForm = new FormGroup({
    username : new FormControl(null, [Validators.required]),
    password : new FormControl(null, [Validators.required]),
    rememberMe : new FormControl(false)
  });

  @ViewChild('main') main! : ElementRef;
  @ViewChildren('error') errorElements! : QueryList<ElementRef>;

  constructor(
    @Inject(PLATFORM_ID) private platformId : object,
    private authService : AuthService,
    private translate : TranslateService,
    private info : InfoService,
    private router : Router) {
    this.translate.get('title.login').pipe(take(1)).subscribe(title => this.info.setTitle(title));

    if (isPlatformBrowser(platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.authService.checkSession().pipe(
          map((res : HttpResponse<object>) => res.status === 200),
          take(1),
          catchError(() => [false])
        ).subscribe(isLoggedIn => {
          if (isLoggedIn) this.router.navigate(['']).then();
        });
      }
    }

    this.authService.checkLoginStatus().pipe(
      takeUntilDestroyed(),
      map((res) => res.status === 200),
      catchError(() => [false])
    ).subscribe(canLogIn => {
      if (canLogIn)
        this.loginForm.enable();
      else
        this.loginForm.disable();
      this.loginForm.reset({
        username : null,
        password : null,
        rememberMe : false
      })
    })
  }

  protected updatePasswordVisibility() : void {
    this.showPassword.set(!this.showPassword());
  }

  protected isUsernameInvalid() : boolean {
    return !!this.loginForm.get('username')?.invalid && !!this.loginForm.get('username')?.touched;
  }

  protected isPasswordInvalid() : boolean {
    return !!this.loginForm.get('password')?.invalid && !!this.loginForm.get('password')?.touched;
  }

  protected login() : void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid || this.isLoggingIn()) return;

    const { username, password, rememberMe } = this.loginForm.value;

    if (!username || !password || rememberMe === undefined || rememberMe === null) {
      this.loginForm.updateValueAndValidity();
      return;
    }


    this.isLoggingIn.set(true);
    this.authService.login(username, password, rememberMe).pipe(
      map((res) => {
        this.statusNumber.set(res.status);
        if (res.status !== 200) throw new Error('Unexpected status code', { cause : res });
        this.numberOfAttempts.set(0);
        this.router.navigate(['']).then();
      }),
      catchError(error => {
        this.statusNumber.set(error.status);
        this.isLoggingIn.set(false);
        this.numberOfAttempts.update(value => value + 1);
        if (this.numberOfAttempts() >= this.maxAttempts) {
          this.loginForm.disable();
          this.authService.rejectLogin().pipe(
            take(1),
            catchError(() => of(false))
          ).subscribe();
        }
        return of(false);
      }),
    ).subscribe()
  }

  public ngAfterViewInit() : void {
    if (!isPlatformBrowser(this.platformId)) return;
    animate(this.main.nativeElement!, {
      y : [100, 0],
      opacity : [0, 1],
      duration : 750,
      delay : 50,
      easing : 'easeInOutQuad',
    });
    const previousErrorElements : ElementRef[] = [];
    this.errorElements.changes.subscribe(() => {
      const errorElements = this.errorElements.toArray();
      errorElements.forEach((element) => {
        if (previousErrorElements.includes(element)) return;
        animate(element.nativeElement, {
          opacity : [0, 1],
          x : [
            { to : -10, duration : 50 },
            { to : 10, duration : 100 },
            { to : -10, duration : 100 },
            { to : 10, duration : 100 },
            { to : 0, duration : 50 }
          ],
          duration : 500,
          easing : 'easeInOutQuad',
        });
        previousErrorElements.push(element);
      });
    })
  }

  public ngOnDestroy() : void {
    if (this.statusNumber() !== 200) this.statusNumber.set(undefined);
    this.isLoggingIn.set(false);
    this.loginForm.reset();
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
    this.loginForm.updateValueAndValidity();
  }
}
