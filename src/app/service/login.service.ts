import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  token: BehaviorSubject<any> = new BehaviorSubject<any>('');
  header: any;

  constructor(private router: Router) {
  }

  getHeader() {
    return this.header;
  }

  setToken() {
    const token = localStorage.getItem('token');
    if (token) {
      this.header = ['Authorization', `Bearer ${token}`];
    }
  }

  comeLogin() {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/auth/login']).then();
    }
  }

  /** ✅ Lưu token & thông tin user vào localStorage */
  setSession(authResult: any) {
    if (!authResult.token) return;

    localStorage.setItem('token', authResult.token);
    localStorage.setItem('fullName', authResult.fullName || '');
    localStorage.setItem('employeeCode', authResult.employeeCode || '');
    localStorage.setItem('roles', authResult.roles);
    localStorage.setItem('email', authResult.email);

    // ✅ Giải mã token để lấy thời gian hết hạn (exp)
    const decodedToken = this.parseJwt(authResult.token);
    if (decodedToken && decodedToken.exp) {
      localStorage.setItem('expireIn', decodedToken.exp.toString()); // Lưu timestamp của exp
    }
  }

  /** ✅ Kiểm tra xem user có đang đăng nhập hay không */
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const payload = this.parseJwt(token);
    const now = Math.floor(Date.now() / 1000); // 🕒 Lấy thời gian hiện tại (giây)

    return payload && payload.exp > now; // ✅ Token còn hạn thì trả về `true`
  }

  /** ✅ Đăng xuất và xóa dữ liệu */
  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']).then(() => {
      window.location.reload();
    });
  }

  /** ✅ Giải mã JWT để lấy thông tin user */
  parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')));
    } catch (error) {
      console.error("Lỗi khi giải mã JWT:", error);
      return null;
    }
  }

  getUserRole(): string {
    const role = localStorage.getItem('roles');
    return role ? role : "";  // ✅ Trả về "ADMIN" hoặc "" nếu không có role
  }
}
