import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ResizeService } from '../resize.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, RouterLink],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit{

  isSidebarVisible: boolean = true;
  isCollapsed: boolean = false;

  constructor (
    private resizeService: ResizeService,
  ){}
  ngOnInit(): void {
    
    this.resizeService.sidebarVisibility$.subscribe(visible => {
      this.isSidebarVisible = visible
    })
    
    this.resizeService.sidebarCollapsed$.subscribe(collapsed => {
      this.isCollapsed = collapsed
    })
  }

   onLogout() {
    //this.authenticationService.logout();
  }

  

  navDataHead = [
    {
      icon: 'fas fa-home',
      label: 'Home',
    },
    {
      icon: 'fa-solid fa-podcast',
      label: 'Shorts'
    },
    {
      icon: 'fa-solid fa-video',
      label: 'Subscriptions'
    },
  ]

  navDataMain = [
    {
      icon: 'fa-solid fa-chalkboard-user',
      label: 'Your channel'
    },
    {
      icon: 'fa-solid fa-clock-rotate-left',
      label: 'History'
    },
    {
      icon: 'fa-solid fa-headphones-simple',
      label: 'Playlist'
    },
    {
      icon: 'fa-solid fa-headphones-simple',
      label: 'Your videos'
    },
    {
      icon: 'fa-solid fa-clock',
      label: 'Watch later'
    },
    {
      icon: 'fa-solid fa-thumbs-up',
      label: 'Liked videos'
    },
    {
      icon: 'fa-solid fa-list-ul',
      label: 'All Subsctriptions',
      routerLink: 'subsctriptions'
    }
  ]

  navDataExplore = [
    {
      icon: 'fa-solid fa-fire',
      label: 'Trending'
    },
    {
      icon: 'fas fa-home',
      label: 'Home'
    },
    {
      icon: 'fas fa-home',
      label: 'Home'
    },
    {
      icon: 'fas fa-home',
      label: 'Home'
    },
    {
      icon: 'fas fa-home',
      label: 'Home'
    },
    {
      icon: 'fas fa-home',
      label: 'Home'
    },
    {
      icon: 'fas fa-home',
      label: 'Home'
    },
    {
      icon: 'fas fa-home',
      label: 'Home'
    },
  ]

  navDataFoot = [
    {
      icon: 'fa-solid fa-gear',
      label: 'Settings',
      routerLink: 'settings'
    },
    {
      icon: 'fas fa-home',
      label: 'Home'
    },
    {
      icon: 'fas fa-home',
      label: 'Home'
    },
  ]

  navDataSideMin = [
    {
      icon: 'fas fa-home',
      label: 'Home'
    },
    {
      icon: 'fas fa-home',
      label: 'Home'
    },
    {
      icon: 'fas fa-home',
      label: 'Home'
    },
    {
      icon: 'fas fa-home',
      label: 'Home'
    },
  ]

}
