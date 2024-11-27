import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  private hasChannelSubject = new BehaviorSubject<boolean>(false)


  hasChannel$ = this.hasChannelSubject.asObservable();
  
  constructor() { }

  updateChannelStatus(status: boolean): void {
    this.hasChannelSubject.next(status)
  }

}
