import {AfterViewInit, Directive, DoCheck, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {LoginService} from "../../service/login.service";

@Directive({
  selector: '[appCheckAuthorize]'
})
export class ActionComponentDirective implements OnInit, AfterViewInit{

  // @Input() jhiActionComponent!: string;

  userComponent: any;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private loginService:LoginService,
  ) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.checkAuthorize();
  }

  checkAuthorize() {
    const optionalRole = this.loginService.getListRolesMenuItem();
    console.log("Roles from localStorage:", optionalRole);

    if (optionalRole && optionalRole.length > 0) {
      const userRole = optionalRole[0]?.roleName || optionalRole;  // Tránh lỗi undefined
      console.log("Checking role:", userRole);

      if (userRole === "ADMIN") {
        this.el.nativeElement.hidden = false;
        this.el.nativeElement.style.display = 'block';
      } else {
        this.el.nativeElement.hidden = true;
        this.el.nativeElement.style.display = 'none';
      }
    } else {
      this.el.nativeElement.hidden = true;
    }
  }




}
