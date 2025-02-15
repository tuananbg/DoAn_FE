import {Injectable, Injector, Inject} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from '../../../../service/login.service';

@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(
    private loginService: LoginService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let url = req.url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = './' + url;
    }
    let newReq = req.clone({ url });
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expireIn');
    console.log('Interceptor - Token:', token);
    if(url.includes("/login") ||
      url.includes("/auth/change-password") ||
      url.includes("/auth/forgot-password") ||
      url.includes("/auth/getForgotCode")){
      return next.handle(newReq).pipe(
        catchError((error) => {
          console.log('Interceptor - Error:', error);
          return throwError(error);
        })
      );
    }
    if (token && expirationDate) {
      const now = new Date().getTime();
      const expirationTime = new Date(parseInt(expirationDate) * 1000).getTime();
      // Kiểm tra xem token đã hết hạn hay chưa
      if (now > expirationTime) {
        // Token đã hết hạn, xóa khỏi Local Storage
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
      }
    }
    if (token && expirationDate) {
      newReq = newReq.clone({
        headers: newReq.headers
          .append('Authorization', 'Bearer ' + token)
      });
    } else {
      this.loginService.comeLogin();
      return throwError('No token available');
    }
    return next.handle(newReq).pipe(
      catchError((error) => {
        console.log('Interceptor - Error:', error);
        return throwError(error);
      })
    );
  }
}
