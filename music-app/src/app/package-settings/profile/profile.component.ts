import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { AuthService, GetUserResponse } from '../../auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
      this.getUserProfile()
  }

  userProfile: GetUserResponse | null = null

  getUserProfile(): void {
    const token = localStorage.getItem('token')
    if (token) {
      this.authService.getUserById().subscribe({
        next: (response) => {
          this.userProfile = response;
          this.loadUserPicture();
        },
        error: (err) => {
          console.error("Error fetching user data:", err);
        }
      })
    }
  }

  userPictureUrl: string | null = null

  loadUserPicture(): void {
    if(this.userProfile?.picture) {
      this.authService.getPicture(this.userProfile.picture).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          this.userPictureUrl = url
        },
        error: (err) => {
          console.error("Error fetching image:", err);
          this.userPictureUrl = null;
      }
      })
    } else {
      this.userPictureUrl = null
    }
  }
  
  

}

