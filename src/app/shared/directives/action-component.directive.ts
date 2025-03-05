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
    const userRole = this.loginService.getUserRole();
    // console.log("User Role:", userRole);
    if (userRole === "ADMIN") {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
      this.el.nativeElement.hidden = false;
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
      this.el.nativeElement.hidden = true;
    }
  }




}
