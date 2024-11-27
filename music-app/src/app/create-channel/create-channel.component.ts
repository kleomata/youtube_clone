import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, CreateChannelRequest } from '../auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { ChannelService } from '../channel.service';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.css'
})
export class CreateChannelComponent implements OnInit{

  constructor (private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private channelService: ChannelService
  ) {
    this.createChannel = this.fb.group({
      channel: ['', Validators.required]
    })
  }

  createChannel: FormGroup
  hasChannel: boolean = false;
  successMessage: string = '';
  errorMessage: string = ''

  ngOnInit(): void {
    this.checkIfUserHasChannel()
    this.createChannelBtn()
  }

  checkIfUserHasChannel(): void {
    this.authService.hasChannel().subscribe(
      (hasChannel: boolean) => {
        this.hasChannel = hasChannel;
        if(this.hasChannel) {
          this.successMessage = 'You already have a channel'
        } else {
          this.successMessage = 'Null'
        }
      }, (error) => {
        console.error("Error checking channel exixtence", error)
      }
    )

  }


  createChannelBtn(): void {
    if (this.createChannel.valid && !this.hasChannel) {
      const token = this.authService.getToken();
      const channelData: CreateChannelRequest = {
        ...this.createChannel.value
      }
  
      if(token) {
        this.authService.createChannel(channelData, token).subscribe({
          next: (request) => {
            console.log("Channnel created successfully!");
            this.router.navigate(['/youtube/settings/channel'])
            this.channelService.updateChannelStatus(true)
          },
          error: (error) => {
            console.error("Error adding channel: ", error);
          }
        })  
      } else {
        console.error("No token found"); 
      }
    } else {
      this.errorMessage = 'Please provide a valid channel name.';
    }
  }
}