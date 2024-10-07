import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { JwtService } from '../services/jwt.service';
import { UserService } from '../services/user.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
    constructor(private jwtService: JwtService, private userService: UserService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const headersConfig = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': ''
        };

        const token = this.jwtService.getToken();

        if (token) {
            headersConfig['Authorization'] = `Bearer ${token}`;
        }

        const request = req.clone({ setHeaders: headersConfig });
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if ((error.status === 401 || error.status === 403) && !req.url.includes('/refresh-token')) {
                    return this.userService.refreshToken().pipe(
                        switchMap((data: any) => {
                            const newToken = this.jwtService.getToken();
                            const newRequest = req.clone({
                                setHeaders: {
                                    'Authorization': `Bearer ${newToken}`
                                }
                            });
                            return next.handle(newRequest);
                        }),
                        catchError(err => {
                            this.userService.purgeAuth();
                            return throwError(err);
                        })
                    );
                } else {
                    return throwError(error);
                }
            })
        );
    }
}