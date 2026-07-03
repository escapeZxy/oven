import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { map } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-auth-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent {
  private static readonly usernamePattern = /^[A-Za-z0-9](?:[A-Za-z0-9_-]{1,62}[A-Za-z0-9])?$/;
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly mode = toSignal(
    this.route.data.pipe(map((data) => (data['mode'] === 'register' ? 'register' : 'login'))),
    { initialValue: 'login' as AuthMode },
  );
  private readonly redirectTo = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('redirectTo') || '/workout-log')),
    { initialValue: '/workout-log' },
  );
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly loginForm = this.formBuilder.nonNullable.group({
    identifier: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  protected readonly registerForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(64),
        Validators.pattern(AuthPageComponent.usernamePattern),
      ],
    ],
    displayName: ['', [Validators.maxLength(64)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected async submitLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    try {
      await this.authService.login(this.loginForm.getRawValue());
      await this.router.navigateByUrl(this.redirectTo());
    } catch (error) {
      this.errorMessage.set(this.toErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected async submitRegister(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    try {
      const formValue = this.registerForm.getRawValue();
      await this.authService.register({
        ...formValue,
        displayName: formValue.displayName.trim() || undefined,
      });
      await this.router.navigateByUrl(this.redirectTo());
    } catch (error) {
      this.errorMessage.set(this.toErrorMessage(error));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private toErrorMessage(error: unknown): string {
    if (
      typeof error === 'object' &&
      error !== null &&
      'error' in error &&
      typeof error.error === 'object' &&
      error.error !== null &&
      'message' in error.error &&
      typeof error.error.message === 'string'
    ) {
      return error.error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return '请求失败，请稍后重试。';
  }
}
