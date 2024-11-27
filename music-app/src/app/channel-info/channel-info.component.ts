import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService, CountSubscribesChannel, GetInfoChannelResponse, GetUserResponse } from '../auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { UUID } from 'node:crypto';
import { ChannelService } from '../channel.service';

@Component({
  selector: 'app-channel-info',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './channel-info.component.html',
  styleUrl: './channel-info.component.css'
})
export class ChannelInfoComponent implements OnInit{

  channelInfo: GetInfoChannelResponse | null = null
  channelName: string = '';
  userId: UUID | null = null
  isSubscribed: boolean = false
  count: CountSubscribesChannel | null = null


  constructor (
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        window.scrollTo(0,0);
        this.channelName = this.route.snapshot.paramMap.get('channelName') || ''
        this.loadChannel()
      }
    })
  }

  channelId: string = ''

  ngOnInit(): void {
    this.channelName = this.route.snapshot.paramMap.get('channelName') || ''
      this.loadChannel()

      this.getUserId()
      
      const storedSubscriptionStatus = localStorage.getItem('isSubscribed');
      if (storedSubscriptionStatus) {
        this.isSubscribed = JSON.parse(storedSubscriptionStatus);
      } 

      this.getCountSubscribers()

  }

  getUserId(): void {
    const token = localStorage.getItem('token')
    if (token) {
      this.authService.getUserById().subscribe({
        next: (response) => {
          if (response && response.id) {
            this.userId = response.id;
            this.checkIfSubscribed()
          }
          
        },
        error: (err) => {
          console.error("Error fetching user data:", err);
        }
      })
    }
  }

  isLoading: boolean = false;


  checkIfSubscribed(): void {
    if (this.userId && this.channelInfo) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. User needs to log in.');
        return;
      }
      this.isLoading = true;
  
      this.authService.checkSubscription(this.userId, this.channelInfo.id).subscribe(
        (response) => {
          this.isSubscribed = response.isSubscribed;
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


  getCountSubscribers(): void {
    console.log('getCountSubscribers called');
    if (this.channelInfo) {
      console.log('Channel ID:', this.channelInfo.id);
      this.authService.countSubscribes(this.channelInfo.id).subscribe({
        next: (response: CountSubscribesChannel) => {
          console.log('Response:', response); 
          this.count = response;  
          console.log('Number of subscribers:', this.count.countSubscribe);
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching subscribers:', err);
        }
      });
    } else {
      console.log('No channel info available');
    }
  }
  
  

  subscribeToChannel(): void {
    if (this.userId && this.channelInfo) {
      const channelId = this.channelInfo.id;
      this.authService.subscribeFromChannel(this.userId, channelId).subscribe(
        response => {
          console.log(response); 
          console.log('You have successfully subscribed to the channel!');
          this.isSubscribed = true
          localStorage.setItem('isSubscribed', JSON.stringify(this.isSubscribed));
          this.getCountSubscribers()
        },
        error => {
          console.error('Error subscribing to channel', error);
        }
      );
    } else {
      console.log('You must be logged in to subscribe!');
    }
  }

  unsubscribeToChannel(): void {
    if (this.userId && this.channelInfo) {
      const channelId = this.channelInfo.id;
      this.authService.unSubscribeFromChannel(this.userId, channelId).subscribe(
        response => {
          console.log(response); 
          console.log('You have successfully unsubscribed to the channel!');
          this.isSubscribed = false
          localStorage.setItem('isSubscribed', JSON.stringify(this.isSubscribed));
          this.getCountSubscribers()
        },
        error => {
          console.error('Error unsubscribing to channel', error);
        }
      );
    } else {
      console.log('You must be logged in to unsubscribe!');
    }
  }

  loadChannel(): void {
    //const token = localStorage.getItem('token');
    //if(token) {
      this.authService.getChannel(this.channelName).subscribe(
        (data: GetInfoChannelResponse) => {
          this.channelInfo = data
          this.imageProfile()
          this.channelInfo.video.forEach((vid) => {
            this.videoName(vid.videoName)
          })
          this.startUPdateingElapsedTime()
          this.checkIfSubscribed()
          this.getCountSubscribers()
        },  error => {
          console.error('Error fetching channel info', error);
        }); 
    //} else {
      //console.error('Token not found');
    // }
  }

  userPictureUrl: string | null = null

  imageProfile(): void {
    //const token = localStorage.getItem('token')
  
      if(this.channelInfo?.picture) {
        this.authService.getPicture(this.channelInfo.picture).subscribe({
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
    //}
    
  }

  videoUrls: { [key: string]: { url: string | null, loading: boolean } } = {};
  
  videoName(videoName: string): void {
    if (videoName) {
      this.videoUrls[videoName] = { url: null, loading: true };

      this.authService.getVideo(videoName).subscribe(
        (blob) => {
          const videoUrl = window.URL.createObjectURL(blob);
          this.videoUrls[videoName] = { url: videoUrl, loading: false };
        
          this.setDurationVideo(videoUrl, videoName)
        },
        (error) => {
          console.error('Error fetching video', error);
          this.videoUrls[videoName] = { url: null, loading: false };
        }
      );
    } else {
      this.videoUrls[videoName] = { url: null, loading: false };  
    }
  }
   
  // Video Element

  videoDurations: { [key: string]: { remainingTime: number, duration: number } } = {};



  @ViewChild('videoElement') videoElement: any;
  targetTime: number = 0;
  activeVideoName: string | null = null; 
  isMouseOverVideo: boolean = false; 
  isPlaying: boolean = false; 

  playVideo(event: MouseEvent, videoName: string) {
    const videoElement = (event.target as HTMLVideoElement).querySelector('video');
    if(videoElement) {
      this.activeVideoName = videoName;
      this.isMouseOverVideo = true;
      videoElement.currentTime = 0;
      videoElement.play().catch((error) => {
        console.error('Error playing video:', error);
      });
      this.isPlaying = true;
    }
    
  }

  pauseAndResetVideo(event: MouseEvent, videoName: string) {
    const videoElement = (event.target as HTMLVideoElement).querySelector('video');
    if (videoElement) {
      videoElement.pause();
      this.isMouseOverVideo = false;
      this.isPlaying = false;
      this.activeVideoName = null;
      this.onMetadataLoaded(videoElement);
    }
  }

  onMetadataLoaded(videoElement: HTMLVideoElement) {
    const totalDuration = videoElement.duration;
    this.targetTime = totalDuration / 2; 
    videoElement.currentTime = this.targetTime; 
  }

  onTimeUpdate(videoElement: HTMLVideoElement, videoName: string) {
    if (this.isMouseOverVideo && this.activeVideoName === videoName) {
      
      const currentTime = videoElement.currentTime;
      const duration = videoElement.duration;
      
      const remainingTime = duration - currentTime

      this.videoDurations[videoName] = {remainingTime, duration}
      
      
      if (videoElement.currentTime >= this.targetTime && this.isPlaying) {
        videoElement.pause(); 
        this.isPlaying = false;
      }
    }
  }

  getRemainingTime(videoName: string): string {
    const videoData = this.videoDurations[videoName];
    if (videoData) {
      const remainingTime = videoData.remainingTime;

      const minutes = Math.floor(remainingTime / 60);
      const seconds = Math.floor(remainingTime % 60);
      const formattedTime = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

      return formattedTime;
    }
    return '00:00';
  }


  getActiveVideoName(): string | null {
    return this.activeVideoName;
  }



  // Video data of create
  interval: any;

  startUPdateingElapsedTime(): void {
    this.interval = setInterval(() => {
      this.channelInfo?.video.forEach((video) => {
      video.elapsedTime = this.calculateElapsedTime(video.dateOfCreation)
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


  // Duration Video
  setDurationVideo(videoUrl: string, videoName: string): void {
    const videoElement = document.createElement('video');
    videoElement.src = videoUrl;

    videoElement.onloadedmetadata = () => {
      const duration = videoElement.duration;

      const minutes = Math.floor(duration / 60)
      const seconds = Math.floor(duration % 60)
      const fomrattedDuration = `${minutes}:${seconds}`
      const video = this.channelInfo?.video.find(vid => vid.videoName === videoName)
      if(video) {
        video.durationVideo = fomrattedDuration
      }
    }
  }


  // Navigation to video
  navigationToVideo(videoId: string): void {
    this.router.navigate(["/youtube/watch"], {queryParams: {v: videoId}})
  }

}
