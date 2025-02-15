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

  checkAuthorize(){
    const optionalRole = this.loginService.getListRolesMenuItem();
    if (optionalRole && optionalRole.length > 0) {
      for(let index = 0; index <optionalRole.length; index++ ){
        this.userComponent = optionalRole[index];
        if (this.userComponent.roleName !== "ADMIN") {
          this.el.nativeElement.hidden = true;  //ẩn đi
          this.el.nativeElement.style.display = 'none';
        } else {
          this.el.nativeElement.hidden = false;  //hiển thị
          this.el.nativeElement.style.display = 'block';
          break;
        }
      }
    } else {
      console.error('No roles found');
      this.el.nativeElement.hidden = false; // Hoặc hành động mặc định khác
    }

  }

}
