import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, PLATFORM_ID, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { finalize, Subject, takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { faCheck, faEye, faEyeSlash, faWarning } from '@fortawesome/free-solid-svg-icons';
import { animate } from 'animejs';
import { isPlatformBrowser } from '@angular/common';
import { take } from 'rxjs/operators';
import { InfoService } from '../services/info.service';

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
  private destroy$ : Subject<void> = new Subject<void>();

  protected readonly faEyeSlash = faEyeSlash;
  protected readonly faEye = faEye;
  protected readonly faWarning = faWarning;
  protected readonly faCheck = faCheck;

  protected numberOfAttempts = 0;
  protected maxAttempts = 3;
  protected showPassword = false;
  protected statusNumber : number | undefined;
  protected isLoggingIn = false;

  protected loginForm = new FormGroup({
    username : new FormControl(null, [Validators.required]),
    password : new FormControl(null, [Validators.required]),
    rememberMe : new FormControl(false)
  });

  @ViewChild('main') main! : ElementRef;
  @ViewChildren('error') errorElements! : QueryList<ElementRef>;

  constructor(
    @Inject(PLATFORM_ID) private platformId : Object,
    private authService : AuthService,
    private translate : TranslateService,
    private info : InfoService) {
    this.translate.get('title.login').pipe(take(1)).subscribe(title => this.info.setTitle(title));
    this.authService.checkLoginStatus().pipe(takeUntil(this.destroy$)).subscribe({
      next : (response) => {
        if (response.status === 200)
          this.loginForm.enable();
      },
      error : (error) => {
        if (error.status === 403)
          this.loginForm.disable();
      }
    });
  }

  protected login() : void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid || this.isLoggingIn) return;
    this.isLoggingIn = true;
    const { username, password, rememberMe } = this.loginForm.value;
    this.authService.login(username!, password!, rememberMe!).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        this.isLoggingIn = false;
        this.numberOfAttempts++;
        if (this.numberOfAttempts < this.maxAttempts) return;
        this.loginForm.disable();
        this.authService.rejectLogin().pipe(takeUntil(this.destroy$)).subscribe({
          error : () => {
          }
        });
      })).subscribe({
      next : (response) => {
        this.statusNumber = response.status;
        this.numberOfAttempts = 0;
      },
      error : (error) => {
        this.statusNumber = error.status;
      },
    });
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
    let previousErrorElements : ElementRef[] = [];
    this.errorElements.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
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
}
