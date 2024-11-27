import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {

  constructor() { }

  private isSidebarCollapsed = new BehaviorSubject<boolean>(false)
  sidebarCollapsed$ = this.isSidebarCollapsed.asObservable()

  toggleSidebar(){
    this.isSidebarCollapsed.next(!this.isSidebarCollapsed.value)
  }

  private sidebarVisibilitySubject = new BehaviorSubject<boolean>(true);
  sidebarVisibility$ = this.sidebarVisibilitySubject.asObservable();

  //constructor() {}

  toggleSidebarShow(): void {
    this.sidebarVisibilitySubject.next(!this.sidebarVisibilitySubject.value);
  }

  hideSidebar(): void {
    this.sidebarVisibilitySubject.next(false);
  }

  showSidebar(): void {
    this.sidebarVisibilitySubject.next(true);
  }

}
