import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): boolean {
    console.log(localStorage)
    const token = localStorage.getItem('token'); // 🔥 Lấy token từ localStorage
    const expiration = localStorage.getItem('expireIn'); // 🔥 Lấy thời gian hết hạn

    if (token && expiration) {
      const now = new Date().getTime() / 1000; // 🕒 Lấy thời gian hiện tại (giây)
      if (now < Number(expiration)) {
        return true; // ✅ Nếu token còn hạn, cho phép truy cập
      }
    }

    // ❌ Nếu không có token hoặc token hết hạn => Đăng xuất và chuyển hướng về login
    this.handleLogout();
    return false;
  }

  private handleLogout() {
    localStorage.clear(); // 🗑 Xóa dữ liệu trên localStorage
    this.router.navigate(['/auth/login']).then(() => {
      window.location.reload(); // 🚀 Đảm bảo reload lại trang để áp dụng redirect
    });
  }
}
