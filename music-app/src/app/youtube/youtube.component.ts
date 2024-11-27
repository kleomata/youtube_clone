import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { NgIf } from '@angular/common';
import { RouterOutlet, ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import { filter } from 'rxjs/operators';
import { ResizeService } from '../resize.service';

@Component({
  selector: 'app-youtube',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, NgIf, SideBarComponent],
  templateUrl: './youtube.component.html',
  styleUrl: './youtube.component.css'
})
export class YoutubeComponent implements OnInit, AfterViewInit{
  isBaseRoute: boolean = true;
  isSideBarVisible: boolean = true;




  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private sideBarHideShow: ResizeService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit() {
    this.updateSidebarVisibility(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateSidebarVisibility(event.urlAfterRedirects);
    });

    this.sideBarHideShow.sidebarVisibility$.subscribe(visible => {
      this.isSideBarVisible = visible;
    });

    this.sideBarHideShow.sidebarCollapsed$.subscribe(collapsed => {
      this.isBaseRoute = collapsed
    })
  }

  ngAfterViewInit() {
    this.updateSidebarVisibility(this.router.url);
    this.cdr.detectChanges();
  }

  private updateSidebarVisibility(url: string) {
    if (url.includes('/youtube/settings') || url.includes('/youtube/watch')) {
      this.isSideBarVisible = false;
      this.sideBarHideShow.hideSidebar()
    } else {
      this.isSideBarVisible = true;
      this.sideBarHideShow.showSidebar()
    }
    this.cdr.detectChanges();
  }

  toggleSidebar() {
    if (this.isSideBarVisible) {
      this.sideBarHideShow.toggleSidebar()
    }
  }


}
