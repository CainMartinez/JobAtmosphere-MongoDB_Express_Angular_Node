import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models/user.model';
import { RefreshToken } from '../models/refreshToken.model';
import { map, distinctUntilChanged, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private currentUserSubject = new BehaviorSubject<User>({} as User);
    public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

    private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
    public isAuthenticated = this.isAuthenticatedSubject.asObservable();

    constructor(
        private apiService: ApiService,
        private jwtService: JwtService
    ) { }

    // Verify JWT in localstorage with server & load user's info.
    // This runs once on application startup.
    populate() {
        const token = this.jwtService.getToken();
        if (token) {
            this.apiService.get("/user").pipe(
                map(data => this.setAuth({ ...data.user, token })),
                catchError(err => {
                    this.purgeAuth();
                    return throwError(err);
                })
            ).subscribe();
        } else {
            this.purgeAuth();
        }
    }

    setAuth(user: User) {
        this.jwtService.saveToken(user.token);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
    }

    purgeAuth() {
        this.jwtService.destroyToken();
        this.jwtService.destroyRefreshToken();
        this.currentUserSubject.next({} as User);
        this.isAuthenticatedSubject.next(false);
    }

    attemptAuth(type: string, credentials: any): Observable<{ user: User, refreshToken: string }> {
        const route = (type === 'login') ? '/login' : '/register';
        return this.apiService.post(`/users${route}`, { user: credentials })
            .pipe(map(
                (data: { user: User, refreshToken: string }) => {
                    this.setAuth(data.user);
                    this.jwtService.saveRefreshToken(data.refreshToken);
                    return data;
                }
            ));
    }

    getCurrentUser(): User {
        return this.currentUserSubject.value;
    }

    refreshToken(): Observable<any> {
        const refreshToken = this.jwtService.getRefreshToken();
        return this.apiService.post('/refresh-token', { refreshToken })
            .pipe(map(
                (data: { accessToken: string, refreshToken: string }) => {
                    this.jwtService.saveToken(data.accessToken);
                    this.jwtService.saveRefreshToken(data.refreshToken);
                    return data;
                })
            );
    }

    update(user: any): Observable<User> {
        return this.apiService.put('/user', { user }).pipe(map(
            (data: any) => {
                this.currentUserSubject.next(data.user);
                return data.user;
            }));
    }
}