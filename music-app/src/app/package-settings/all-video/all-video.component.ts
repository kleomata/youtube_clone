import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgIf, NgFor } from '@angular/common';
import { CreateChannelComponent } from "../../create-channel/create-channel.component";
//import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-all-video',
  standalone: true,
  imports: [NgIf, CreateChannelComponent],
  templateUrl: './all-video.component.html',
  styleUrl: './all-video.component.css'
})
export class AllVideoComponent implements OnInit{
  userData: any;
  additionalUserData: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

 ngOnInit(): void {
  }
}
