import { Component, OnInit } from '@angular/core';
import { ResizeService } from '../resize.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService, GetSearchVideoResponse, GetUserResponseInNav } from '../auth.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, FormsModule, NgFor],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  icons: string = 'fas fa-bars'

  constructor(private resizeService: ResizeService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.getUserProfile();
    this.onSearchSuggestions();
    this.onSearch();
  }

  toggleSidebar() {
    this.resizeService.toggleSidebar();
  }

  showSideBar() {
    this.resizeService.showSidebar()
  }

  userProfile: GetUserResponseInNav | null = null

  getUserProfile(): void {
    const token = localStorage.getItem('token')
    if (token) {
      this.authService.getUserByIdInNav().subscribe({
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

  query: string = ''
  searchVideo: GetSearchVideoResponse[] = []
  search: GetSearchVideoResponse[] = []
  selectedOption: string = ''

  // Search Video
  onSearchSuggestions(): void {
    if(this.query.length >= 2) {
      this.authService.getSearchSuggestions(this.query).subscribe(
        (data) => {
          this.searchVideo = data
        }, 
        (error) => {
          console.error('Error fetching search suggestions', error);
        }
      )
    } else {
      this.searchVideo = [];
    }
  }

  matchText(text: string): boolean {
    if (this.query && text){
      return text.toLowerCase().includes(this.query.toLowerCase());
    }
    return false
  }

  highlightText(text: string): string {
    if (this.query) {
      return text; 
    }
    const regex = new RegExp(`(${this.query})`, 'gi'); 
    return text.replace(regex, '<span class="highlight">$1</span>');
}

  onSearch(): void {
    if(this.query.trim().length > 0) {
      this.authService.getSearchResults(this.query).subscribe(
        (data) => {
          this.search = data
          this.searchVideo = []
          this.navigationToPathSearch();
        }, 
        (error) => {
          console.error('Error fetching search suggestions', error);
        }
      )
    } else {
      this.searchVideo = [];
    }
  }

  navigationToPathSearch(): void {
    this.router.navigate(['/youtube/search-results'], { queryParams: {search_query: this.query}})
  }

  selectSuggestions(suggestion: string): void {
    this.query = suggestion.toLowerCase()
    this.onSearch();
  }
  

}
