import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    if (!token) {
      this.handleLogout();
      return false;
    }

    // Giải mã token để kiểm tra thời gian hết hạn
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Giải mã JWT
      const now = Math.floor(Date.now() / 1000); //Lấy thời gian hiện tại (giây)

      if (payload.exp && now < payload.exp) {
        return true; //Token hợp lệ, cho phép truy cập
      }
    } catch (error) {
      console.error("JWT Decode Error:", error);
    }

    // Token hết hạn hoặc lỗi => Chuyển về Login
    this.handleLogout();
    return false;
  }

  private handleLogout() {
    localStorage.clear(); // 🗑 Xóa dữ liệu trên localStorage
    this.router.navigate(['/auth/login']).then(() => {
      window.location.reload(); // Đảm bảo reload lại trang để áp dụng redirect
    });
  }
}
