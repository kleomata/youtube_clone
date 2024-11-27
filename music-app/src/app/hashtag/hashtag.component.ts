import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService, GetHashtagResponse } from '../auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-hashtag',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './hashtag.component.html',
  styleUrl: './hashtag.component.css'
})
export class HashtagComponent implements OnInit{

  hashtagVideo: GetHashtagResponse[] = [] 
  hashtag: string = ''
  uniqueChannelCount: number = 0;

  userPictureUrl: { [key: string]: { url: string | null } } = {};
  
  videoUrls: { [key: string]: { url: string | null, loading: boolean } } = {};

  videoDurations: { [key: string]: { remainingTime: number, duration: number } } = {};


  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd)
        window.scrollTo(0,0)
      //this.hashtag = this.route.snapshot.paramMap.get('hashtag') || ''
      //this.loadHashtaagVideo()
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.hashtag = params['hashtag']
      if (this.hashtag && !this.hashtag.startsWith('#')) {
        this.hashtag = `#${this.hashtag}`;
      }
      this.loadHashtagVideo()  
    })
  }

  loadHashtagVideo(): void {
    this.authService.getVideoHashtag(encodeURIComponent(this.hashtag)).subscribe(
      (data: GetHashtagResponse[]) => {
        this.hashtagVideo = data
        this.countUniqueChannels()
        this.hashtagVideo.forEach((video) =>{
          this.loadVideo(video.videoName)
        })
        this.hashtagVideo.forEach((image) => {
          this.imageProfile(image.imageProfile)
        })
        this.startUPdateingElapsedTime()
      }, error => {
        console.error('Error fetching hashtag', error);
      }
    )
  }

  // Counter channel
  countUniqueChannels(): void {
    const uniqueChannels = new Set<string>();
    this.hashtagVideo.forEach(video => {
      uniqueChannels.add(video.channelName);
    })
    this.uniqueChannelCount = uniqueChannels.size
  }


  // Image Profile
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


  // Video 
  loadVideo(videoName: string): void {
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

  /// Video Comnamd ......
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
      this.hashtagVideo.forEach((video) => {
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
      const video = this.hashtagVideo.find(vid => vid.videoName === videoName)
      if(video) {
        video.durationVideo = fomrattedDuration
      }
    }
  }



  // Go to Channel    
  navigationChannelUser(channelName: string): void {
    this.router.navigate(["/youtube/channel", channelName])
  }

  navgationToVideo(videoId: string): void {
    this.router.navigate(["/youtube/watch"], {queryParams: {v: videoId}})
  }

}
