import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgIf } from '@angular/common';
import { ResizeService } from '../resize.service';
import { SideBarVideoComponent } from "../package-settings/side-bar-video/side-bar-video.component";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NgIf, SideBarVideoComponent, RouterOutlet],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit{

  isAuthenticated: boolean = false

  userData: any = {}

  constructor(){}

  ngOnInit(): void {
      
  }

}
