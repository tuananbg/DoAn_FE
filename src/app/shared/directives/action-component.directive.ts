import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';
import { LoginService } from '../../service/login.service';

@Directive({
  selector: '[appCheckAuthorize]'
})
export class ActionComponentDirective implements OnInit, AfterViewInit {

  @Input('appCheckAuthorize') allowedRoles: string[] = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private loginService: LoginService,
  ) { }

  ngAfterViewInit(): void {
    // optional logic
  }

  ngOnInit(): void {
    this.checkAuthorize();
  }

  checkAuthorize() {
    const rawRoles = this.loginService.getUserRole(); // "ADMIN,USER"
    const userRoles = rawRoles.split(',').map(r => r.trim());

    const isAuthorized = userRoles.some(role => this.allowedRoles.includes(role));

    if (isAuthorized) {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
      this.el.nativeElement.hidden = false;
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
      this.el.nativeElement.hidden = true;
    }
  }
}
