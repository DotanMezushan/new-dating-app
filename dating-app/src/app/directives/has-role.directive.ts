import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { UserResponse } from "../models/login.model";
import { AuthService } from "../services/auth.service";
import { take } from "rxjs";

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole!: string[];
  user!: UserResponse | null;

  constructor(
    private authService: AuthService,
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.setUI();
    });
  }

  ngOnInit(): void {
    this.setUI();
  }

  setUI(): void {
    // if (this.user == null) {
    //   this.user = JSON.parse(localStorage.getItem('user') as any);
    // }
  
    if (this.user == null || !this.user?.roles) {
      this.viewContainerRef.clear();
      return;
    }
  
    if (this.appHasRole && this.user?.roles.some(r => this.appHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
  
}
