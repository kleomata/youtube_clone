import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AddCommentRequest, AuthService, CountDislikeResponse, CountLikeResponse, CountSubscribesChannel, CountUserViewDto, GetCommentResponse, GetCommentVideoResponse, GetReplayResponse, GetReplayVideoResponse, GetSimilarHashtagVideosDto, GetUserPictureReponseInVideo, GetUserResponseInNav, GetVideoByIDResponse } from '../auth.service';
import { UUID } from 'crypto';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { error } from 'console';

@Component({
  selector: 'app-watch',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule, ReactiveFormsModule],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.css'
})
export class WatchComponent implements OnInit, AfterViewInit{

  video: GetVideoByIDResponse | null = null
  videoId: string | null = null

  isSubscribed: boolean = false
  userId: UUID | null = null

  count: CountSubscribesChannel | null = null

  isExpanded: boolean = false


  expandOnly(event: MouseEvent) {
     const target = event.target as HTMLElement;
     if (target.closest('.more')) {
       this.isExpanded = true;
     }
  }

  toggleExpand(event: MouseEvent) {
    event.stopPropagation()
    this.isExpanded = !this.isExpanded
  }

  commentForm: FormGroup
  replayCommentForm: { [key: string]: FormGroup} = {}

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    //this.router.events.subscribe(event => {
      //if (event instanceof NavigationEnd) {
        //window.scrollTo(0,0)
        //this.videoId = this.route.snapshot.paramMap.get('videoId') || ''
        //this.loadVideoId()
      //}
    //})
    this.commentForm = this.fb.group({
      commentContent: ['', [Validators.required]]
    })

    //this.replayCommentForm = this.fb.group({
      //commentContent: ['', [Validators.required]]
    //})
    this.replayCommentForm = {}
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.videoId = params['v']
        if (this.videoId) {
          this.loadVideoId(this.videoId)
       
          window.scrollTo(0,0)

          this.loadVideoUrl()

          this.getUserId()
          this.getCountSubscribers()
          this.onTimeUpdate()
          if (this.videoPlayer) {
            this.videoPlayer.nativeElement.onloadedmetadata = this.onMetadataLoaded.bind(this);
            this.videoPlayer.nativeElement.ontimeupdate = this.onTimeUpdate.bind(this)
          
          }

          /// Show All Comment for Video
          this.loadAllCommentForVideo()
          this.getImageOnlyComment()

          // Replay for Comment
          //this.loadReplayForComment()
          this.getTotalReplay()

          //this.videoPlayer.nativeElement.addEventListener('play', () => {
            //this.startTrackingVideoView();
          //});

          // Get ALL View 
          this.getTotalViewCount()
          this.getgetViewCountForUserInVideo()

          // Similar hashtag videos
          this.onLoadSimilarHashtagVideos()
        
          window.addEventListener('scroll', this.handleScroll);

        }
      }
    )
  }

  loadVideoId(videoId: string): void {
    this.authService.getVideoById(videoId).subscribe(
      (data: GetVideoByIDResponse) => {
        this.video = data
        this.loadPictureUser()
        this.loadVideoUrl()
        this.checkIfSubscribed()
        this.getCountSubscribers()
        this.startUPdateingElapsedTime()
        ////
        //this.isAutoPlayEnabled = true
        //this.onTimeUpdate()

        // check for like
        this.checkForLikeVideo()
        this.getCountLikeVideo()

        // check for dislike
        this.checkForDislikeVideo()
        this.getCountDislikeVideo()

      },
      (error) => {
        console.error('Error fetching search results', error);
      }
    )
  }

  // Image Profile for User channel
  userPicture: string | null = null
  loadPictureUser(): void {
    if(this.video?.picture) {
      this.authService.getPicture(this.video.picture).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          this.userPicture = url
        },
        error: (error) => {
          console.error("Error fetching image:", error);
          this.userPicture = null
        }
      })
    } else {
      this.userPicture = null
    }
  }

  // Get Video
  videoUrl: string | null = null
  loading: boolean = false
  loadVideoUrl(): void {
    if(this.video?.videoName) {
      this.loading = true
      this.authService.getVideo(this.video.videoName).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob)
          this.videoUrl = url
          //////////////////////
          //if(this.isAutoPlayEnabled) {
            //this.playVideo()
          //}
          this.enableAutoPlay()

          this.loading = false
        },
        error: (error) => {
          console.error("Error fetching video:", error);
          this.videoUrl = null
          this.loading = false
        }
      })
    } else {
      this.videoUrl = null
      this.loading = false
    }
  }


  // Navigation to channel name
  navigationToChannel(channelName: string): void {
    this.router.navigate(["/youtube/channel/", channelName])
  }

  // SUbscribe and UNsubscribe btn for channel
  getUserId(): void {
    const token = localStorage.getItem('token')
    if (token) {
      this.authService.getUserById().subscribe({
        next: (response) => {
          if (response && response.id) {
            this.userId = response.id;
            this.checkIfSubscribed()
            this.checkForLikeVideo()
          }
          
        },
        error: (err) => {
          console.error("Error fetching user data:", err);
        }
      })
    }
  }
  
  subscribeToChannel(): void {
    if (this.userId && this.video) {
      const channelId = this.video.channelId;
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
    if (this.userId && this.video) {
      const channelId = this.video.channelId;
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

  isLoading: boolean = false;

  checkIfSubscribed(): void {
    if (this.userId && this.video) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. User needs to log in.');
        return;
      }
      this.isLoading = true;
  
      this.authService.checkSubscription(this.userId, this.video.channelId).subscribe(
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
    if (this.video) {
      console.log('Channel ID:', this.video.channelId);
      this.authService.countSubscribes(this.video.channelId).subscribe({
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


  // Format data 
  formatDate(dateOfCreation: string): string {

    const date = new Date(dateOfCreation)
    const months = ["Jan", "Feb", "Mar", 
      "Apr", "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec"]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const years = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    return `${month} ${day}, ${years} 
    - ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0'+seconds : seconds}`
  }

  interval: any;

  startUPdateingElapsedTime(): void {
    this.interval = setInterval(() => {
      if(this.video) {
        this.video.elapsedTime = this.calculateElapsedTime(this.video.dateOfCreation)
      }
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

  // Navigation to hashtag
  navigationToHashtag(hashtag: string): void {
    this.router.navigate(["/youtube/hashtag/", hashtag])
  }

  //////////////////////////////
  // Video Command 
  /////////////////////////
  showCommand: boolean = false


  ngOnDestroy() {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      this.videoPlayer.nativeElement.pause();
    }
  }
  
  // Play / Pause Video
  isPlaying: boolean = false;
  isAutoPlayEnabled: boolean = false

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('progressBar') progressBar!: ElementRef<HTMLDivElement>;
  @ViewChild('dragHandle') dragHandle!: ElementRef<HTMLDivElement>;
  
  onVideoPlay(): void {
    this.isPlaying = true;
  }
  onVideoPause(): void {
    this.isPlaying = false;
  }
  enableAutoPlay(): void {
    this.isAutoPlayEnabled = true;
  }
  disableAutoPlay(): void {
    this.isAutoPlayEnabled = false;
  }
  
  
  togglePlayPauseOnVideo(): void {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      const videoElement = this.videoPlayer.nativeElement;
      
      if (videoElement.paused) {
        videoElement.play();
        this.isPlaying = true;
      } else {
        videoElement.pause();
        this.isPlaying = false;
      }
    }
  }

  togglePlayPause(event: MouseEvent): void {
    event.stopPropagation();
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      const videoElement = this.videoPlayer.nativeElement;
      
      if (videoElement.paused) {
        videoElement.play();
        this.isPlaying = true;
      } else {
        videoElement.pause();
        this.isPlaying = false;
      }
    }
  }

  // Time Current / Time Duration

  timeCurrent: number = 0
  timeDuration: number = 0
  progressWidth: number = 0
  dragPosition: number = 0
  isDragging: boolean = false

  onMetadataLoaded(): void {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      const videoElement = this.videoPlayer.nativeElement;
      this.timeDuration = videoElement.duration;
      this.volume = videoElement.volume * 100
      this.updateVolumeIcon()
    }
  }

  onTimeUpdate(): void {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      const videoElement = this.videoPlayer.nativeElement;
      this.timeCurrent = videoElement.currentTime;
      this.timeDuration = videoElement.duration
    
       if (this.timeCurrent >= 10 && !this.hasSentViewData) {
        console.log('Attempting to send view data for video ID:', this.videoId, 'Time Viewed:', this.timeCurrent);
        this.sendViewData();
        this.hasSentViewData = true;
        this.getTotalViewCount()
      }
  
      if (this.timeCurrent >= 10 && !this.hasSentViewData) {
        console.log('Stopped monitoring after 10 seconds');
        videoElement.removeEventListener('timeupdate', this.onTimeUpdate);
        this.getTotalViewCount()
      }
    }
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}:${minutes % 60}:${seconds < 10 ? '0' + seconds : seconds}`;
    } else {
      return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }
  }  

  onProgressChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.timeCurrent = parseInt(inputElement.value, 10);
    
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      this.videoPlayer.nativeElement.currentTime = this.timeCurrent;
    }
  }


  // Voluume Video
  volume: number = 0
  volumeIcon: string = 'fa-volume-high'
  showVolumeSlider: boolean = false
  isMuted: boolean = false
  previousVolume: number = 0

  onVolumeChange(event: Event): void {
    if(this.videoPlayer && this.videoPlayer.nativeElement) {
      const volumeValue = (event.target as HTMLInputElement).value;
      this.videoPlayer.nativeElement.volume = parseInt(volumeValue, 10) / 100
    
      this.previousVolume = this.volume

      this.updateVolumeIcon()
    }
  }

  updateVolumeIcon(): void {
    if (this.volume === 0) {
      this.volumeIcon = 'fa-volume-xmark';
    } else if (this.volume > 0 && this.volume <= 50) {
      this.volumeIcon = 'fa-volume-low';
    } else {
      this.volumeIcon = 'fa-volume-high';
    }
  }

  toggleMute(): void {
    if (this.isMuted) {
      this.volume = this.previousVolume;
      this.videoPlayer.nativeElement.volume = this.volume / 100
      this.volumeIcon = 'fa-volume-high';
    } else {
      this.previousVolume = this.volume
      this.volume = 0
      this.videoPlayer.nativeElement.volume = 0
      this.volumeIcon = 'fa-volume-xmark';
    }
    this.updateVolumeIcon()
    this.isMuted = !this.isMuted
  }


  ////////////////////////////
  //// Command Settings
  //////////////
  isCommandSettings: boolean = false


  toggleCommandSettings(): void {
    this.isCommandSettings = !this.isCommandSettings
  }

  /// Play Speed
  playSpeed: number = 1;
  playSpeedOptions: number[] = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3]

  isOptionsVisible: boolean = false;

  toggleSettings(): void {
    this.isOptionsVisible = !this.isOptionsVisible;
  }

  onPlaybackSpeedChange(speed: number): void {
    //const selectElement = event.target as HTMLSelectElement
    //this.playSpeed = parseFloat(selectElement.value)
    this.playSpeed = speed;
    this.isOptionsVisible = false; 
    if(this.videoPlayer && this.videoPlayer.nativeElement) {
      this.videoPlayer.nativeElement.playbackRate = this.playSpeed
    }
  }

  //////////////////////////////
  // Like Button
  //////////////////////////////
  isLike: boolean = false
  addLikeButton(): void {
    const videoId = this.videoId
    if (videoId) {
      this.authService.addLike(videoId).subscribe(
        response => {
          console.log(response); 
          console.log('You have successfully like to the video!');
          this.isLike = true
          this.getCountLikeVideo()
        },
        error => {
          console.error('Error like to video', error);
        }
      )
    } else {
      console.log('You must be logged in to like!');  
    }
  }
  removeLikeButton(): void {
    const videoId = this.videoId
    if (videoId) {
      this.authService.removeLike(videoId).subscribe(
        response => {
          console.log(response); 
          console.log('You have successfully remove like to the video!');
          this.isLike = false
          this.getCountLikeVideo()
        },
        error => {
          console.error('Error remove like to video', error);
        }
      )
    } else {
      console.log('You must be logged in to remove like!');  
    }
  }

  checkForLikeVideo(): void {
    const videoId = this.videoId
    const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. User needs to log in.');
        return;
      }
    if (videoId)  {
      this.authService.checkLikeForVideo(videoId).subscribe(
        (response) => {
          this.isLike = response.isLike
        },
        (error) => {
          // Hide loading state on error
          //this.isLoading = false;
          console.error('Error checking subscription status');
            if (error.status === 401) {
            console.error('Unauthorized: Token may be invalid or expired.');
          } else {
            console.error('An error occurred:', error.message);
          }          
        }
      )
    }
  }

  countLike: CountLikeResponse | null = null

  getCountLikeVideo(): void {
    const videoId = this.videoId
    if(videoId) {
      this.authService.countLikeVideo(videoId).subscribe({
        next: (response: CountLikeResponse) => {
          this.countLike = response
        },
        error: (err) => {
          console.error('Error fetching likes:', err);
        }
      })
    } else {
      console.log('No video available');
    }
  }


  ////////////////////////////
  ///// Dislike button
  ///////////////////////////
  isDisLike: boolean = false
  addDisLikeButton(): void {
    const videoId = this.videoId
    if (videoId) {
      this.authService.addDislike(videoId).subscribe(
        response => {
          console.log(response); 
          console.log('You have successfully like to the video!');
          this.isDisLike = true
          this.getCountDislikeVideo()
        },
        error => {
          console.error('Error like to video', error);
        }
      )
    } else {
      console.log('You must be logged in to like!');  
    }
  }
  removeDislikeButton(): void {
    const videoId = this.videoId
    if (videoId) {
      this.authService.removeDislike(videoId).subscribe(
        response => {
          console.log(response); 
          console.log('You have successfully remove dislike to the video!');
          this.isDisLike = false
          this.getCountDislikeVideo()
        },
        error => {
          console.error('Error remove dislike to video', error);
        }
      )
    } else {
      console.log('You must be logged in to remove dislike!');  
    }
  }

  checkForDislikeVideo(): void {
    const videoId = this.videoId
    const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. User needs to log in.');
        return;
      }
    if (videoId)  {
      this.authService.checkDislikeForVideo(videoId).subscribe(
        (response) => {
          this.isDisLike = response.isDislike
        },
        (error) => {
          // Hide loading state on error
          //this.isLoading = false;
          console.error('Error checking subscription status');
            if (error.status === 401) {
            console.error('Unauthorized: Token may be invalid or expired.');
          } else {
            console.error('An error occurred:', error.message);
          }          
        }
      )
    }
  }

  countDisLike: CountDislikeResponse | null = null

  getCountDislikeVideo(): void {
    const videoId = this.videoId
    if(videoId) {
      this.authService.countDislikeVideo(videoId).subscribe({
        next: (response: CountDislikeResponse) => {
          this.countDisLike = response
        },
        error: (err) => {
          console.error('Error fetching dislikes:', err);
        }
      })
    } else {
      console.log('No video available');
    }
  }

  //////////////////////////////////////////////
  // Comment
  ///////////////////////////////
  comment: AddCommentRequest | null = null
  isButtonCommentVisible: boolean = false

  addComment(): void {
    if (this.commentForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const commentData = {
      commentContent: this.commentForm.get('commentContent')?.value,
      videoId: this.videoId,
      channelName: this.video?.channelName
    }
    console.log(commentData)
    if(commentData) {
      this.authService.addComment(commentData).subscribe({
        next: (response: GetCommentResponse) => {
          console.log('Comment added successfully', response);
          this.loadAllCommentForVideo()
          this.resetFormComment()
          this.isButtonCommentVisible = false
        },
        error: (error) => {
          console.error('Error adding comment', error);
        }
      })

    }
  }
  onInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
  resetFormComment(): void {
    this.commentForm.reset()
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
    }
    this.isButtonCommentVisible = false
  }
  clickShowComment(): void {
    this.isButtonCommentVisible = true
  }

  /// All Comment

  allCommentForVideo: GetCommentVideoResponse[] = []

  loadAllCommentForVideo(): void {
    const videoId = this.videoId
    if (videoId) {
      this.authService.getAllCommentByVideo(videoId).subscribe(
        (comment: GetCommentVideoResponse[]) => {
          this.allCommentForVideo = comment
          this.allCommentForVideo.forEach((image) => {
            this.imageProfile(image.imageProfile)
          })
          this.allCommentForVideo = comment.sort((a,b) => {
            const dateA = new Date(a.dataComment);
            const dateB = new Date(b.dataComment);
            return dateB.getTime() - dateA.getTime()
          })
          this.startUPdateingElapsedTimeComment()

          this.allCommentForVideo.forEach(comment => {
            this.loadReplayForComment(comment.id);
          });
        },
        (error) => {
          console.error("Error fetching comment", error);
        }
      )
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

  actualUser: GetUserResponseInNav | null = null
  imageInComment: string | null = null
  loadImageInComment(): void {
    if(this.actualUser?.picture) {
      this.authService.getPicture(this.actualUser.picture).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          this.imageInComment = url
        },
        error: (error) => {
          console.error("Error fetching image:", error);
          this.imageInComment = null
        }
      })
    } else {
      this.imageInComment = null
    }
  }
  getImageOnlyComment(): void {
    const token = localStorage.getItem('token')
    if (token) {
      this.authService.getUserByIdInNav().subscribe({
        next: (response) => {
          this.actualUser = response;
          this.loadImageInComment();
        },
        error: (err) => {
          console.error("Error fetching user data:", err);
        }
      })
    }
  }
  
  intervalComment: any;

  startUPdateingElapsedTimeComment(): void {
    this.intervalComment = setInterval(() => {
      this.allCommentForVideo.forEach((commentTime) => {
        commentTime.elapsedTime = this.calculateElapsedTime(commentTime.dataComment)
      })
    }) 
  }

  // Replay Comment
  addReplay(commentId: string): void {
    const form = this.replayCommentForm[commentId]
    if (form.invalid) {
      console.error('Form is invalid');
      return;
    }

    const commentData = {
      commentContent: form.get('commentContent')?.value,
      videoId: this.videoId,
      channelName: this.video?.channelName,
      commentId: commentId
    }
    console.log(commentData)
    if(commentData) {
      this.authService.addReplay(commentData).subscribe({
        next: (response: GetReplayResponse) => {
          console.log('Comment added successfully', response);
          //this.loadAllCommentForVideo()
          //this.resetFormComment()
          //this.isButtonCommentVisible = false
          this.loadReplayForComment(commentId)
          //form.reset();
          this.resetFormReplay(commentId)
          this.showAddReplay[commentId] = false
        },
        error: (error) => {
          console.error('Error adding comment', error);
        }
      })

    }
  }
  showAddReplay: { [key: string]: boolean} = {}
  fixedText: { [key: string]: string} = {};
  btnShowAddReplay(commentId: string): void {
    this.showAddReplay[commentId] = true
    
    if (!this.replayCommentForm[commentId]) {
      this.replayCommentForm[commentId] = this.fb.group({
        commentContent: ['', [Validators.required]]
      });
    } else {
      this.replayCommentForm[commentId].reset();
    }

    const comment = this.allCommentForVideo.find(c => c.id === commentId);
    if (comment) {
      const commentAuthor = `${comment.firstName}${comment.lastName}`;
      this.fixedText[commentId] = `@${commentAuthor} `;
      this.replayCommentForm[commentId].patchValue({
        commentContent: '' 
      });
    
    }
  }

  resetFormReplay(commentId: string): void {
    const form = this.replayCommentForm[commentId]
    form.reset()
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
    }
    //this.isButtonCommentVisible = false
  }


  //allReplayForComment: GetReplayVideoResponse[] = []
  //currentCommentId: string | null = null;
  loadReplayForComment(commentId: string): void {
    const videoId = this.videoId
    //this.currentCommentId = commentId

    if (videoId && commentId) {
      this.authService.getAllReplayForCommentInVideo(videoId, commentId).subscribe(
        (replay: GetReplayVideoResponse[]) => {
          this.allReplayForComment[commentId] = replay
          this.getTotalReplay()
          this.startUPdateingElapsedTimeReplay(commentId)
          
          this.allReplayForComment[commentId] = replay.sort((a,b) => {
            const dateA = new Date(a.dataComment);
            const dateB = new Date(b.dataComment);
            return dateB.getTime() - dateA.getTime()
          })
        
        },
        (error) => {
          console.error("Error fetching replay", error);
        }
      )

    }

  }

  repliesVisible: { [key: string]: boolean } = {};
  allReplayForComment: { [key: string]: GetReplayVideoResponse[] } = {};
  toggleReplies(commentId: string): void {
    this.repliesVisible[commentId] = !this.repliesVisible[commentId];

    if (this.repliesVisible[commentId]) {
      this.loadReplayForComment(commentId);
    }
  }

  getTotalReplay(): number{
    return Object.values(this.allReplayForComment).reduce((total, replay) => total + replay.length, 0)
  }

  intervalReplay: any;

  startUPdateingElapsedTimeReplay(commentId: string): void {
    this.intervalReplay = setInterval(() => {
      this.allReplayForComment[commentId].forEach((commentTime) => {
        commentTime.elapsedTime = this.calculateElapsedTime(commentTime.dataComment)
      })
    }) 
  }

  // View video
  timeViewedInSeconds: number = 0
  hasSentViewData: boolean = false;
  hasStartedTracking: boolean = false;



  ngAfterViewInit(): void {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      const videoElement = this.videoPlayer.nativeElement;
      this.getTotalViewCount()
      
      videoElement.ontimeupdate = () => {
        this.getTotalViewCount()
        this.onTimeUpdate();
      };
    }
  }

  sendViewData(): void {
    const videoId = this.videoId;
    const currentTime = Math.floor(this.timeCurrent);

    console.log('Attempting to send view data for video ID:', videoId, 'Time Viewed:', currentTime);

    if (videoId && currentTime === 10 && !this.hasSentViewData) {
      console.log('Conditions met, sending view data...');
      
      this.authService.increaseViewCount(videoId, currentTime).subscribe(
        (response) => {
          console.log('View count increased successfully:', response);
          this.hasSentViewData = true;
          this.getTotalViewCount()
        },
        (error) => {
          console.error('Error increasing view count:', error);
        }
      );
    } else {
      console.log('Conditions not met for sending view data');
    }
  }

  totalViewCount: number | null = null;
  getTotalViewCount(): void {
    const videoId = this.videoId;
    if(videoId) {
      this.authService.getTotalViewCountForVideo(videoId).subscribe(
        (totalViews) => {
          this.totalViewCount = totalViews;
          this.cdRef.detectChanges();
        },
        (error) => {
          console.error("No found numer video: ", error)
          this.totalViewCount = null;
        }
      )
    }
  }

  totalViewForUserInVideo: CountUserViewDto | null = null
  getgetViewCountForUserInVideo(): void {
    const videoId = this.videoId;
    if(videoId) {
      this.authService.getgetViewCountForUserInVideo(videoId).subscribe(
        (totalViews: CountUserViewDto) => {
          this.totalViewForUserInVideo = totalViews;
          this.cdRef.detectChanges();
        },
        (error) => {
          console.error("No found numer video: ", error)
          this.totalViewForUserInVideo = null;
        }
      )
    }
  }

  /// Get All video By hashtag video
  similarHashtagVideos: GetSimilarHashtagVideosDto[] = []
  filterSimilarHashtagVideos: GetSimilarHashtagVideosDto[] = []

  onLoadSimilarHashtagVideos(): void {
    const videoId= this.videoId;

    if(videoId) {
      this.authService.getSimilarHashtagVideos(videoId).subscribe(
        (response: GetSimilarHashtagVideosDto[]) => {
          this.similarHashtagVideos = response
          this.filterSimilarHashtagVideos = this.similarHashtagVideos.filter(video => video.id !== this.videoId)
          console.log(response)
          this.similarHashtagVideos.forEach((video) => 
            this.videoHashtag(video.videoName)
          )
          //this.onMetadataLoadedHashtag(this.videoElement)

          this.similarHashtagVideos.forEach((image) => {
            this.imageProfileVideoHashtag(image.imageProfile)
          })

          this.startUPdateingElapsedTimeVideoHashtag()

        },
        (error) => {
          console.error("No found video from hashtag: ", error)
        }
      )
    }
  }

  filterOnLoadSimilarHashtag(hashtag: string): void {
    const videoId = this.videoId;

    if (videoId && hashtag) {
      console.log('Filtering for hashtag:', hashtag);
        
      this.filterApplied = hashtag

      this.filterSimilarHashtagVideos = this.similarHashtagVideos.  filter(video => {
        const isInAddHashtag = video.addHashtag && video.addHashtag.includes(hashtag);
        const isInSelectHashtag = video.selectHashtag && video.selectHashtag.includes(hashtag);
            
        console.log('Video:', video);
        console.log('Is in addHashtag:', isInAddHashtag, 'Is in selectHashtag:', isInSelectHashtag);
            
        return (isInAddHashtag || isInSelectHashtag) && video.id !== this.videoId;
      });
        
      console.log('Filtered videos:', this.filterSimilarHashtagVideos);
    } else {
        this.filterApplied = ''
        this.filterSimilarHashtagVideos = this.similarHashtagVideos.filter(video => video.id !== this.videoId)    
    }
  }

  filterApplied: string = ''
  clearFilter(): void {
    this.filterApplied = ''
    this.filterSimilarHashtagVideos = this.similarHashtagVideos.filter(video => video.id !== this.videoId)
  }

  @ViewChild('filterItems') filterItems!: ElementRef;

  scrollLeft(): void {
    if(this.filterItems) {
      this.filterItems.nativeElement.scrollLeft -= 200;
    }
  }

  scrollRight(): void {
    if (this.filterItems) {
      this.filterItems.nativeElement.scrollLeft += 200
    }
  }

  @ViewChild('hashtagBox') hashtagBox!: ElementRef;
  handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 0) {
      this.hashtagBox.nativeElement.style.marginTop = '-25px';
    } else {
      this.hashtagBox.nativeElement.style.marginTop = '0';
    }
  };

  ///////////////////////////
  @ViewChild('videoElement') videoElement: any;

  
  videoUrls: { [key: string]: { url: string | null, loading: boolean } } = {};
  videoHashtag(videoName: string): void {
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

  targetTime: number = 0;
  onMetadataLoadedHashtag(videoElement: HTMLVideoElement) {
    const totalDuration = videoElement.duration;
    this.targetTime = totalDuration / 2; 
    videoElement.currentTime = this.targetTime; 
  }

  setDurationVideo(videoUrl: string, videoName: string) {
    const videoElement = document.createElement('video')
    videoElement.src = videoUrl;

    videoElement.onloadedmetadata = () => {
      const duration = videoElement.duration

      const minutes = Math.floor(duration / 60)
      const seconds = Math.floor(duration % 60)
      const fomrattedDuration = `${minutes}:${seconds}`

      const video = this.similarHashtagVideos.find(vid => vid.videoName === videoName)
      if(video) {
        video.durationVideo = fomrattedDuration
      }
    }
  }

  intervalVideoHashtag: any;

  startUPdateingElapsedTimeVideoHashtag(): void {
    this.intervalVideoHashtag = setInterval(() => {
      this.similarHashtagVideos.forEach((video) => {
      video.elapsedTime = this.calculateElapsedTime(video.dateOfCreation)
      })
    }) 
  }

  userPictureUrlVideoHashtag: { [key: string]: { url: string | null } } = {};

  imageProfileVideoHashtag(imageName: string): void {
    if(imageName) {
      this.userPictureUrlVideoHashtag[imageName] = {url : null};

      this.authService.getPicture(imageName).subscribe(
        (blob) => {
          const imageUrl = window.URL.createObjectURL(blob);
          this.userPictureUrlVideoHashtag[imageName] = {url: imageUrl};
        },
        (error) => {
          console.error('Error fetching video', error);
          this.userPictureUrlVideoHashtag[imageName] = { url: null };
        }
      )
    } else {
      this.userPictureUrlVideoHashtag[imageName] = { url: null };  
    }
  }

  truncateText(text: string, length:number): string {
    if(text.length > length) {
      return text.substring(0, length) + ' . . .'
    }
    return text
  }


  navigationToVideo(videoId: string): void {
    this.router.navigate(['/youtube/watch'], { queryParams: { v: videoId} }).then(() => {
      this.loadVideoId(videoId);
      this.loadVideoUrl();
      this.cdRef.detectChanges();
      window.location.reload();
    });
  }
}
