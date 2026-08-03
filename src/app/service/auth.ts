import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

export interface RegisterRequest {
  userName: string;
  email: string;
  phone: string;
  password: string;
  profileImage?: File | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  jwt?: string;
  message?: string;
  profileImageUrl?: string;
  profileImage?: string;
  user?: AuthUser | null;
  profile?: AuthUser | null;
  data?: AuthUser | null;
}

export interface AuthUser {
  userName?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  profileImageUrl?: string;
  profileImagePath?: string;
  profilePicture?: string;
  photoUrl?: string;
  pictureUrl?: string;
  avatar?: string;
  image?: string;
  imageUrl?: string;
  avatarUrl?: string;
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly registerUrl = 'https://vorngsovannreach.setec24.uk/api/auth/register';
  private readonly loginUrl = 'https://vorngsovannreach.setec24.uk/api/auth/login';
  private readonly tokenKey = 'bookstore_token';
  private readonly userKey = 'bookstore_user';
  readonly currentUser = signal<AuthUser | null>(this.readStoredUser());

  constructor(private http: HttpClient) {}

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.registerUrl, this.buildRegisterFormData(payload));
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.loginUrl, payload);
  }

  storeToken(response: AuthResponse): void {
    const token = response.token ?? response.accessToken ?? response.jwt;

    if (!token || typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(this.tokenKey, token);
  }

  storeUser(user: AuthUser | null): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (!user) {
      window.localStorage.removeItem(this.userKey);
      this.currentUser.set(null);
      return;
    }

    const normalizedUser = this.normalizeUser(user);
    window.localStorage.setItem(this.userKey, JSON.stringify(normalizedUser));
    this.currentUser.set(normalizedUser);
  }

  storeAuth(response: AuthResponse, fallbackUser?: AuthUser | null): void {
    this.storeToken(response);
    this.storeUser(this.extractUser(response) ?? fallbackUser ?? null);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(this.tokenKey);
    window.localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
  }

  getDisplayName(): string {
    const user = this.currentUser();
    return user?.userName ?? user?.name ?? user?.email ?? 'Guest';
  }

  getAvatarUrl(): string {
    const user = this.currentUser();
    return (
      user?.profileImageUrl ??
      user?.profileImage ??
      user?.profileImagePath ??
      user?.profilePicture ??
      user?.photoUrl ??
      user?.pictureUrl ??
      user?.avatar ??
      user?.image ??
      user?.imageUrl ??
      user?.avatarUrl ??
      ''
    );
  }

  private buildRegisterFormData(payload: RegisterRequest): FormData {
    const formData = new FormData();
    formData.append('UserName', payload.userName ?? '');
    formData.append('Email', payload.email ?? '');
    formData.append('Phone', payload.phone ?? '');
    formData.append('Password', payload.password ?? '');

    if (payload.profileImage instanceof File) {
      formData.append('ProfileImage', payload.profileImage, payload.profileImage.name);
    }

    return formData;
  }

  private extractUser(response: AuthResponse): AuthUser | null {
    const directImageUrl = this.normalizeImageUrl(response.profileImageUrl ?? response.profileImage ?? '');
    const directName = this.getString((response as Record<string, unknown>)['userName']) || this.getString((response as Record<string, unknown>)['name']);

    if (directImageUrl || directName) {
      return this.normalizeUser({
        userName: directName,
        profileImageUrl: directImageUrl,
        profileImage: directImageUrl,
        imageUrl: directImageUrl,
      });
    }

    const candidate =
      this.findUserLikeObject(response.user) ??
      this.findUserLikeObject(response.profile) ??
      this.findUserLikeObject(response.data) ??
      this.findUserLikeObject(response);

    return this.normalizeUser(candidate);
  }

  private normalizeUser(user: AuthUser | null | undefined): AuthUser | null {
    if (!user) {
      return null;
    }

    const resolvedImage = this.normalizeImageUrl(
      user.profileImage ??
        user.profileImageUrl ??
        user.profileImagePath ??
        user.profilePicture ??
        user.photoUrl ??
        user.pictureUrl ??
        user.avatar ??
        user.image ??
        user.imageUrl ??
        user.avatarUrl ??
        '',
    );

    return {
      userName: user.userName ?? user.name ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      profileImage: resolvedImage,
      profileImageUrl: resolvedImage,
      profileImagePath: resolvedImage,
      profilePicture: resolvedImage,
      photoUrl: resolvedImage,
      pictureUrl: resolvedImage,
      avatar: resolvedImage,
      image: resolvedImage,
      imageUrl: resolvedImage,
      avatarUrl: resolvedImage,
      name: user.name ?? user.userName ?? '',
    };
  }

  private normalizeImageUrl(url: string): string {
    if (!url) {
      return '';
    }

    return url
      .replace(/^https?:\/\/localhost:7028/i, 'https://vorngsovannreach.setec24.uk')
      .replace(/^http:\/\/localhost:7028/i, 'https://vorngsovannreach.setec24.uk')
      .replace(/^\/+(?!\/)/, 'https://vorngsovannreach.setec24.uk/');
  }

  private findUserLikeObject(value: unknown): AuthUser | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        const found = this.findUserLikeObject(item);
        if (found) {
          return found;
        }
      }

      return null;
    }

    const record = value as Record<string, unknown>;
    const imageCandidate =
      this.getString(record['profileImage']) ||
      this.getString(record['profileImageUrl']) ||
      this.getString(record['profileImagePath']) ||
      this.getString(record['profilePicture']) ||
      this.getString(record['photoUrl']) ||
      this.getString(record['pictureUrl']) ||
      this.getString(record['avatar']) ||
      this.getString(record['image']) ||
      this.getString(record['imageUrl']) ||
      this.getString(record['avatarUrl']);
    const nameCandidate = this.getString(record['userName']) || this.getString(record['name']);

    if (imageCandidate || nameCandidate || this.getString(record['email']) || this.getString(record['phone'])) {
      return record as AuthUser;
    }

    for (const key of Object.keys(record)) {
      const found = this.findUserLikeObject(record[key]);
      if (found) {
        return found;
      }
    }

    return null;
  }

  private getString(value: unknown): string {
    return typeof value === 'string' ? value : '';
  }

  private readStoredUser(): AuthUser | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const rawUser = window.localStorage.getItem(this.userKey);
    if (!rawUser) {
      return null;
    }

    try {
      return this.normalizeUser(JSON.parse(rawUser) as AuthUser);
    } catch {
      window.localStorage.removeItem(this.userKey);
      return null;
    }
  }
}
