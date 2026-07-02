import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { User } from '@oven/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

interface AuthResponse {
  accessToken: string;
  expiresAt: string;
  user: User;
}

interface SessionResponse {
  expiresAt: string;
  user: User;
}

interface LoginInput {
  identifier: string;
  password: string;
}

interface RegisterInput {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

interface AuthSession {
  accessToken: string;
  expiresAt: string;
  user: User;
}

const ACCESS_TOKEN_STORAGE_KEY = 'oven.auth.access-token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly session = signal<AuthSession | null>(null);
  private readonly authState = signal<'checking' | 'authenticated' | 'anonymous'>('checking');
  private initializePromise: Promise<void> | null = null;
  private initialized = false;

  public readonly currentUser = computed(() => this.session()?.user ?? null);
  public readonly isAuthenticated = computed(() => this.authState() === 'authenticated');
  public readonly isChecking = computed(() => this.authState() === 'checking');
  public readonly expiresAt = computed(() => this.session()?.expiresAt ?? null);

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (this.initializePromise) {
      return this.initializePromise;
    }

    const accessToken = this.readStoredAccessToken();
    if (!accessToken) {
      this.authState.set('anonymous');
      this.initialized = true;
      return;
    }

    this.authState.set('checking');
    this.initializePromise = this.restoreSession(accessToken)
      .catch(() => {
        this.clearSession();
      })
      .finally(() => {
        this.initialized = true;
        this.initializePromise = null;
      });

    return this.initializePromise;
  }

  public async login(input: LoginInput): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/login`, {
        identifier: input.identifier,
        password: input.password,
      }),
    );
    this.applySession(response);
  }

  public async register(input: RegisterInput): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/register`, input),
    );
    this.applySession(response);
  }

  public async logout(): Promise<void> {
    try {
      if (this.getAccessToken()) {
        await firstValueFrom(this.http.post(`${this.apiBaseUrl}/auth/logout`, {}));
      }
    } finally {
      this.clearSession();
    }
  }

  public getAccessToken(): string | null {
    const currentSession = this.session();
    if (currentSession) {
      return currentSession.accessToken;
    }

    return this.readStoredAccessToken();
  }

  public clearSession(): void {
    this.session.set(null);
    this.authState.set('anonymous');
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  }

  private async restoreSession(accessToken: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.get<SessionResponse>(`${this.apiBaseUrl}/auth/session`),
    );
    this.session.set({
      accessToken,
      expiresAt: response.expiresAt,
      user: response.user,
    });
    this.authState.set('authenticated');
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
  }

  private applySession(response: AuthResponse): void {
    this.session.set({
      accessToken: response.accessToken,
      expiresAt: response.expiresAt,
      user: response.user,
    });
    this.authState.set('authenticated');
    this.initialized = true;
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, response.accessToken);
  }

  private readStoredAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  }
}
