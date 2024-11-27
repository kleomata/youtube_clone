import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService, GetSubscribeForUserResponse } from '../auth.service';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { UUID } from 'crypto';

@Component({
  selector: 'app-all-subsctriptions',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './all-subsctriptions.component.html',
  styleUrl: './all-subsctriptions.component.css'
})
export class AllSubsctriptionsComponent implements OnInit{

  subscriptionUser: GetSubscribeForUserResponse[] = []
  userId: UUID | null = null
  subscriptionStatus: { [key: string]: boolean } = {};

  constructor (
    private authService: AuthService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    //const storedSubscriptionStatus = localStorage.getItem('isSubscribed');
    //if (storedSubscriptionStatus) {
      //this.isSubscribed = JSON.parse(storedSubscriptionStatus);
    //} 

    this.getSubscriptionUser()
    this.getUserId()
  }


  getSubscriptionUser(): void {
    const token = localStorage.getItem('token')
    if (token) {
      this.authService.getSubscribeForUser().subscribe({
        next: (subscribe: GetSubscribeForUserResponse[]) => {
          this.subscriptionUser = subscribe;
          this.subscriptionUser.forEach((image) => {
            this.imageProfile(image.picture)
          })
          this.startUPdateingElapsedTime()
          this.subscriptionUser.forEach((id) => {
            this.checkIfSubscribed(id.channelId)
          })
        },
        error: (err) => {
          console.error("Error fetching user data:", err);
        }
      })
    }
  }



  userPictureUrl: { [key: string]: { url: string | null } } = {};

  imageProfile(imageName: string): void {
    if(imageName) {
      this.userPictureUrl[imageName] = {url : null};

      this.authService.getPicture(imageName).subscribe(
        (blob) => {
          const imageUrl = window.URL.createObjectURL(blob);
          this.userPictureUrl[imageName] = {url: imageUrl};
        },
        (error) => {
          console.error('Error fetching video', error);
          this.userPictureUrl[imageName] = { url: null };
        }
      )
    } else {
      this.userPictureUrl[imageName] = { url: null };  
    }
  }


  // Subscribe button


  getUserId(): void {
    const token = localStorage.getItem('token')
    if (token) {
      this.authService.getUserById().subscribe({
        next: (response) => {
          if (response && response.id) {
            this.userId = response.id;
            this.subscriptionUser.forEach((id) => {
              this.checkIfSubscribed(id.channelId)
            })
          }
          
        },
        error: (err) => {
          console.error("Error fetching user data:", err);
        }
      })
    }
  }

  
  subscribeToChannel(channelId: UUID): void {
    if (this.userId && channelId) {
      this.authService.subscribeFromChannel(this.userId, channelId).subscribe(
        response => {
          console.log(response); 
          console.log('You have successfully subscribed to the channel!');
          this.subscriptionStatus[channelId] = true;
          //localStorage.setItem('isSubscribed', JSON.stringify(this.isSubscribed));
          //this.getCountSubscribers()

        },
        error => {
          console.error('Error subscribing to channel', error);
        }
      );
    } else {
      console.log('You must be logged in to subscribe!');
    }
  }

  unsubscribeToChannel(channelId: UUID): void {
    if (this.userId && channelId) {
      this.authService.unSubscribeFromChannel(this.userId, channelId).subscribe(
        response => {
          console.log(response); 
          console.log('You have successfully unsubscribed to the channel!');
          this.subscriptionStatus[channelId] = false;  // Set subscription status to false for this channel
          
          //localStorage.setItem('isSubscribed', JSON.stringify(this.isSubscribed));
          //this.getCountSubscribers()
        },
        error => {
          console.error('Error unsubscribing to channel', error);
        }
      );
    } else {
      console.log('You must be logged in to unsubscribe!');
    }
  }

  isLoading: boolean = false;

  checkIfSubscribed(channelId: UUID): void {
    if (this.userId && channelId) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. User needs to log in.');
        return;
      }
      this.isLoading = true;
  
      this.authService.checkSubscription(this.userId, channelId).subscribe(
        (response) => {
          this.subscriptionStatus[channelId] = response.isSubscribed;
          this.isLoading = false;
        },
        (error) => {
          // Hide loading state on error
          this.isLoading = false;
          console.error('Error checking subscription status');
            if (error.status === 401) {
            console.error('Unauthorized: Token may be invalid or expired.');
          } else {
            console.error('An error occurred:', error.message);
          }          
        }
      );
    } else {
      console.warn('User ID or channel information is missing.');
    }
  }





  // Subscription data of add
  interval: any;

  startUPdateingElapsedTime(): void {
    this.interval = setInterval(() => {
      this.subscriptionUser.forEach((subscribe) => {
      subscribe.elapsedTime = this.calculateElapsedTime(subscribe.subscriptionDate)
      })
    }) 
  }

  calculateElapsedTime(dateOfCreation: string): string {
    const videoTime = new Date(dateOfCreation);
    const currentTime = new Date();
    const elapsedMilliseconds = currentTime.getTime() - videoTime.getTime();

    const seconds = Math.floor(elapsedMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24);
    

    const years = currentTime.getFullYear() - videoTime.getFullYear(); 
    const months = currentTime.getMonth() - videoTime.getMonth();
  
    let finalMonths = months + (years * 12)
    if(finalMonths < 0) {
      finalMonths += 12;
    }

    if (seconds < 60) {
      return `${seconds} second${seconds === 1 ? '' : 's'}`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    } else if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'}`;
    } else if (days < 30) {
      return `${days} day${days === 1 ? '' : 's'}`;
    } else if (finalMonths < 12) {
      return `${finalMonths} month${finalMonths === 1 ? '' : 's'}`;
    } else {
      return `${years} year${years === 1 ? '' : 's'}`;
    }
  
  }
 
  navigationChannelUser(channelName: string): void {
    this.router.navigate(["/youtube/channel", channelName])
  }

}
