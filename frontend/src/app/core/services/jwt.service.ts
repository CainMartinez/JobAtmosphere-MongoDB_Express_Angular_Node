import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class JwtService {
    getToken(): string {
        return localStorage.getItem('accessToken') || '';
    }

    saveToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    destroyToken() {
        localStorage.removeItem('accessToken');
    }

    getRefreshToken(): string {
        return localStorage.getItem('refreshToken') || '';
    }

    saveRefreshToken(token: string) {
        localStorage.setItem('refreshToken', token);
    }

    destroyRefreshToken() {
        localStorage.removeItem('refreshToken');
    }
}