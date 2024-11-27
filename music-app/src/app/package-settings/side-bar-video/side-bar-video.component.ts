import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { ChannelService } from '../../channel.service';

@Component({
  selector: 'app-side-bar-video',
  standalone: true,
  imports: [NgFor, RouterLink, NgIf],
  templateUrl: './side-bar-video.component.html',
  styleUrl: './side-bar-video.component.css'
})
export class SideBarVideoComponent implements OnInit{

  constructor (private authService: AuthService,
    private channelService: ChannelService
  ) {}

  hasChannel: boolean = false


  ngOnInit(): void {
      this.channelService.hasChannel$.subscribe((status: boolean) => {
        this.hasChannel = status
      })

      this.checkIfUserHasChannel()
  }

  checkIfUserHasChannel(): void {
    this.authService.hasChannel().subscribe(
      (hasChannel: boolean) => {
        this.hasChannel = hasChannel;  
    },
      (error) => {
        console.error('Error checking channel', error);
      }
    );
  }


  settingsComponent = [
    {
      //icon: 'fas fa-home',
      label: 'Profile',
      routerLink: 'profile'
    },
    {
      //icon: 'fa-solid fa-podcast',
      label: 'Create Channel',
      routerLink: 'create-channel'
    },
  ]


   channelComponent = [
    {
      //icon: 'fas fa-home',
      label: 'Profile',
      routerLink: 'profile'
    },
    {
      label: 'Channel',
      routerLink: 'channel'
    },
    {
      //icon: 'fa-solid fa-podcast',
      label: 'Upload Video',
      routerLink: 'channel/upload-video'
    },
    {
      //icon: 'fa-solid fa-video',
      label: 'All Video',
      routerLink: 'channel/all-video'
    },
    {
      //icon: 'fa-solid fa-video',
      label: 'Edit Video',
      routerLink: 'channel/edit-video'
    },
    {
      //icon: 'fa-solid fa-video',
      label: 'Delete Video',
      routerLink: 'channel/delete-video'
    },
  ]

  updateChannelStatus(): void {
    this.checkIfUserHasChannel()
  }
}
