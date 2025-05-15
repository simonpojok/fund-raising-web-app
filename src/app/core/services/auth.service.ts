import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  phone_number?: string;
  photo_url?: string;
  is_email_verified: boolean;
  created_at: string;
  last_login_at?: string;
  profile: {
    id: string;
    bio?: string;
    location?: string;
    date_of_birth?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  display_name: string;
  email: string;
  phone_number?: string;
  password: string;
  confirm_password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/users`;
  private readonly TOKEN_KEY = 'auth_tokens';
  private readonly USER_KEY = 'user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const tokensString = localStorage.getItem(this.TOKEN_KEY);
    const userString = localStorage.getItem(this.USER_KEY);

    if (tokensString && userString) {
      try {
        const tokens: AuthTokens = JSON.parse(tokensString);
        const user: User = JSON.parse(userString);

        // Check if token exists
        if (tokens.access) {
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }
      } catch (e) {
        // Invalid tokens or user data
        this.clearStorage();
      }
    }
  }

  login(credentials: LoginCredentials): Observable<{ user: User, tokens: AuthTokens }> {
    return this.http.post<{ user: User, refresh: string, access: string }>(`${this.API_URL}/auth/login/`, credentials)
      .pipe(
        tap(response => {
          const tokens: AuthTokens = {
            access: response.access,
            refresh: response.refresh
          };
          this.setTokensAndUser(tokens, response.user);
        }),
        map(response => ({
          user: response.user,
          tokens: {
            access: response.access,
            refresh: response.refresh
          }
        })),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  register(credentials: RegisterCredentials): Observable<{ user: User, tokens: AuthTokens }> {
    return this.http.post<{ user: User, refresh: string, access: string }>(`${this.API_URL}/auth/register/`, credentials)
      .pipe(
        tap(response => {
          const tokens: AuthTokens = {
            access: response.access,
            refresh: response.refresh
          };
          this.setTokensAndUser(tokens, response.user);
        }),
        map(response => ({
          user: response.user,
          tokens: {
            access: response.access,
            refresh: response.refresh
          }
        })),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    // Call logout endpoint first to blacklist the token
    const tokens = this.getTokensFromStorage();
    if (tokens?.refresh) {
      this.http.post(`${this.API_URL}/auth/logout/`, { refresh: tokens.refresh })
        .pipe(
          catchError(error => {
            console.error('Error during logout:', error);
            return of(null);
          })
        )
        .subscribe(() => {
          this.clearStorage();
          this.router.navigate(['/auth/login']);
        });
    } else {
      this.clearStorage();
      this.router.navigate(['/auth/login']);
    }
  }

  refreshToken(): Observable<AuthTokens> {
    const tokens = this.getTokensFromStorage();
    if (!tokens?.refresh) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<{ access: string }>(`${this.API_URL}/auth/refresh/`, { refresh: tokens.refresh })
      .pipe(
        tap(response => {
          // Update only the access token
          const updatedTokens: AuthTokens = {
            access: response.access,
            refresh: tokens.refresh
          };
          this.setTokens(updatedTokens);
        }),
        map(response => ({
          access: response.access,
          refresh: tokens.refresh
        })),
        catchError(error => {
          this.clearStorage();
          return throwError(() => error);
        })
      );
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/profile/`)
      .pipe(
        tap(user => {
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  getToken(): string | null {
    const tokens = this.getTokensFromStorage();
    return tokens?.access || null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setTokensAndUser(tokens: AuthTokens, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokens));
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokens));
  }

  private getTokensFromStorage(): AuthTokens | null {
    const tokensString = localStorage.getItem(this.TOKEN_KEY);
    if (tokensString) {
      try {
        return JSON.parse(tokensString);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  private clearStorage(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }
}
