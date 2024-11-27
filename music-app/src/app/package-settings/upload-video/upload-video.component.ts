import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService, GetChannelResponse, GetVideoResponse, UploaddVideoRequest } from '../../auth.service';
import { UUID } from 'crypto';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-upload-video',
  standalone: true,
  imports: [NgFor, FormsModule, NgClass, ReactiveFormsModule],
  templateUrl: './upload-video.component.html',
  styleUrl: './upload-video.component.css'
})

export class UploadVideoComponent implements OnInit {

  videoForm: FormGroup;
  videoSelectFile: File | null = null;
  selectedHashtags: string[] = [];
  predefinedHashtags: string[] = [ "#Pop", "#Rock", "#HipHop", "#R&B", "#Jazz", "#Blues", "#Classical", "#Electronic", "#Dance", "#Reggae", "#Country", "#Folk", "#Indie", "#Metal", "#Alternative", "#Ska", "#Gospel", "#Afrobeats", "#KPop", "#JPop", "#Celtic", "#NewAge", "#Soundtrack",
    "#Chill", "#Ambient", "#LoFi", "#Acoustic", "#Cover", "#Remix", "#LiveMusic", "#MusicVideo", "#LyricVideo", "#SingAlong", "#DanceChallenge", "#Hits", "#TopCharts", "#Underground", "#Throwback", "#ClassicHits", "#BestOf", "#NowPlaying", "#OnRepeat",
    "#Musicians", "#Songwriter", "#Producer", "#Band", "#Duo", "#SoloArtist", "#Debut", "#Collaboration", "#Festival", "#Tour", "#Concert", "#AcousticCover", "#Piano", "#Guitar", "#Violin", "#Drums", "#Bass", "#Vocalist", "#Rapper", "#Rap", "#DJ", "#Beatmaker",
    "#StudioSession", "#CreativeProcess", "#BehindTheScenes", "#SongOfTheDay", "#DailyMusic", "#MusicalJourney", "#Inspiration", "#Playlist", "#MoodMusic", "#FeelGoodMusic", "#ChillVibes", "#DanceVibes", "#PartyMusic", "#SummerVibes", "#WinterChill",
    "#RoadTripMusic", "#WorkoutMusic", "#StudyMusic", "#Relaxation", "#MeditationMusic", "#NatureSounds", "#Emotional", "#Heartfelt", "#Uplifting", "#Motivational", "#Nostalgia", "#Epic", "#Inspirational", "#CoversAndRemixes", "#Trending", "#Recommended", "#DiscoverNewMusic",
    "#SupportIndieArtists", "#60s", "#70s", "#80s", "#90s", "#2000s", "#2010s", "#2020s", "#Grunge", "#Emo", "#Dubstep", "#TripHop", "#Synthwave", "#Funk", "#Chanson", "#BossaNova", "#GlamRock", "#Salsa", "#Tango", "#Bluegrass", "#WorldMusic", "#Christian", "#Punk",
    "#Soul", "#Latin", "#House", "#Trance", "#OldMusic", "#NewMusic", "#Hit", "#HitSong", "#Lyrics", "#Music", "#Vlogs", "#Gaming", "#Tutorial", "#Comedy", "#TravelVlog", "#FoodVlog", "#DIY", "#Fitness", "#Subscribe", "#LikeAndShare", "#CommentBelow",
    "#FollowMe", "#JoinTheFun", "#Education", "#Motivation", "#Lifestyle", "#HealthTips", "#StudyTips", "#Trending", "#Viral", "#BreakingNews", "#CurrentEvents", "#News", "#Creative", "#Art", "#Photography", "#Filmmaking", "#Animation", "#Collab", "#Influencer", "#BehindTheScenes",
    "#SpecialGuest", "#Interview", "#MotivationalVideo", "#LifeHacks", "#Documentary", "#FunFacts", "#TechTalk"
  ];
  
  channelName: string | null = null;
  channelId: UUID | null = null;
  currentDate: string | null = null;

  ngOnInit(): void {
    this.sortHashtags();
    this.getChannelId();
  
    this.currentDate = this.getCurrentDate();
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.videoForm = this.fb.group({
      nameSong: ['', Validators.required],
      fullNameSong: ['', Validators.required],
      nameSinger: this.fb.array([this.fb.control('')], Validators.required),
      addHashtag: this.fb.array([this.fb.control('')]),
      selectHashtag: [[], Validators.required],
      lyrics: ['', Validators.required],
      descriptionVideo: ['', Validators.required]
    });
  }

  getChannelId(): void {
    this.authService.getChannelById().subscribe(
      (response: GetChannelResponse) => {
        console.log(response); 
        this.channelName = response.channel; 
        this.channelId = response.id;
        this.currentDate = new Date().toLocaleDateString(); 
      },
      error => {
        console.error('Gabim gjatë marrjes së kanalit:', error);
      }
    );
  }

  onFileVideoChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.videoSelectFile = file;
      this.videoForm.patchValue({ video: file });
      const reader = new FileReader();
      reader.onload = () => {
        console.log('File is valid and ready to be uploaded');
      };
      reader.onerror = () => {
        console.error('Error reading file');
        this.videoSelectFile = null;
        this.videoForm.patchValue({ video: null });
      };
      reader.readAsArrayBuffer(file);
    }
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  onSubmit(): void {
    if (!this.videoSelectFile || !this.channelId) {
      console.error('Video file dhe channelId janë të nevojshëm!');
      return;
    }

    const request: UploaddVideoRequest = {
      nameSong: this.videoForm.get('nameSong')?.value,
      fullNameSong: this.videoForm.get('fullNameSong')?.value,
      nameSinger: this.videoForm.get('nameSinger')?.value.join(', '),
      descriptionVideo: this.videoForm.get('descriptionVideo')?.value,
      lyrics: this.videoForm.get('lyrics')?.value,
      selectHashtag: this.selectedHashtags,
      addHashtag: this.videoForm.get('addHashtag')?.value.join(', '),
    };

    console.log('Kërkesa për ngarkim video:', request);

    if (this.videoSelectFile instanceof File && this.channelId) {
      this.authService.uploadVideo(request, this.videoSelectFile, this.channelId).subscribe(
        (response: GetVideoResponse) => {
          console.log('Video u ngarkua me sukses:', response);
        },
        (error) => {
          console.error('Gabim gjatë ngarkimit të videos:', error);
        }
      );
    } else {
      console.error('File i pavlefshëm ose channelId mungon');
    }
  }
 
  toggleHashtag(hashtag: string): void {
    if (this.selectedHashtags.includes(hashtag)) {
      this.selectedHashtags = this.selectedHashtags.filter(h => h !== hashtag);
    } else {
      this.selectedHashtags.push(hashtag);
    }
    this.videoForm.get('selectHashtag')?.setValue(this.selectedHashtags);
  }

  isChecked(hashtag: string): boolean {
    return this.selectedHashtags.includes(hashtag);
  }

  get newHashtags(): FormArray {
    return this.videoForm.get('addHashtag') as FormArray;
  }

  addHashtag(): void {
    this.newHashtags.push(this.fb.control(''));
  }

  removeHashtag(index: number): void {
    this.newHashtags.removeAt(index);
  }

  get nameSingers(): FormArray {
    return this.videoForm.get('nameSinger') as FormArray;
  }

  addSinger(): void {
    this.nameSingers.push(this.fb.control(''));
  }

  removeSinger(index: number): void {
    this.nameSingers.removeAt(index);
  }

  sortHashtags() {
    this.predefinedHashtags = this.predefinedHashtags.sort((a, b) => a.localeCompare(b));
  }
}