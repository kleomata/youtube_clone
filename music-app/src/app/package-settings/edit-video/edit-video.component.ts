import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-video',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-video.component.html',
  styleUrl: './edit-video.component.css' 
})
export class EditVideoComponent{

}
