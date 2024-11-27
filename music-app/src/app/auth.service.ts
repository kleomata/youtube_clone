import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'console';
import { UUID } from 'crypto';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface GetUserResponseInNav {
  username: string,
  picture: string
}
export interface GetUserPictureReponseInVideo {
  picture: string
}

export interface GetUserResponse {
  id: UUID,
  fistName: string,
  lastName: string,
  email: string,
  phone: string,
  country: string,
  state: string,
  city: string,
  specificAddress: string,
  birthdate: string,
  gender: string,
  username: string,
  picture: string
}

export interface GetChannelResponse {
  id: UUID;
  channel: string;
  userId: UUID;
}

export interface CreateChannelRequest {
  channel: string;
}


export interface UploaddVideoRequest {
  nameSong: string;
  fullNameSong: string;
  nameSinger: string[];
  addHashtag: string[];
  selectHashtag: string[];
  lyrics: string;
  descriptionVideo: string;
}

export interface GetVideoResponse {
  id: string;
  nameSong: string;
  fullNameSong: string;
  dateOfCreation: string;
  videoName: string;
  nameSinger: string[];
  addHashtag: string[];
  selectHashtag: string[];
  lyrics: string;
  descriptionVideo: string;
  userId: string;
  channelId: string;
}

export interface GetAllVideoResponse {
  id: string;
  fullNameSong: string;
  dateOfCreation: string;
  videoName: string;
  descriptionVideo: string;
  userId: string;
  channelId: string; 
  imageProfile: string;
  channelName: string;
}
export interface GetAllVideoResponseAll extends GetAllVideoResponse {
  elapsedTime: string;
  durationVideo: string;
}


export interface GetInfoChannelResponse {
  id: UUID;
  firstName: string;
  lastName: string;
  picture: string;
  channelName: string;
  video: GetMoreVideoForChannelResponseAll[];
}
export interface GetMoreVideoForChannelResponse {
  videoId: string;
  fullNameSong: string;
  dateOfCreation: string;
  videoName: string;
}
export interface GetMoreVideoForChannelResponseAll extends GetMoreVideoForChannelResponse {
  elapsedTime: string;
  durationVideo: string;
}

// Video Search
export interface GetSearchResponse {
  id: UUID;
  nameSong: string;
  fullNameSong: string;
  descriptionVideo: string;
  nameSinger: string[];
  addHashtag: string[];
  selectHashtag: string[];
  dateOfCreation: string;
  videoName: string;
  imageProfile: string;
  channelName: string;
}

export interface GetSubscribeResponse {
  //id: UUID;
  firstName: string;
  lastName: string;
  picture: string;
  channelName: string;
  countSubscribe: number;
  userId: UUID;
  channelId: UUID;
  subscriptionDate: string;
}
export interface GetSubscribeForUserResponse extends GetSubscribeResponse{
  elapsedTime: string;
  isSubscribed: boolean
}

export interface GetSearchVideoResponse extends GetSearchResponse {
  elapsedTime: string;
  durationVideo: string;
}

export interface CountSubscribesChannel {
  countSubscribe: number
}

// Count Like
export interface CountLikeResponse {
  countLike: number
}

// Count dislike
export interface CountDislikeResponse {
  countDislike: number
}

/// Get Video BY Id
export interface GetVideoByIDResponseFromBack {
  id: string;
  nameSong: string;
  fullNameSong: string;
  dateOfCreation: string;
  videoName: string;
  nameSinger: string[];
  addHashtag: string[];
  selectHashtag: string[];
  lyrics: string;
  descriptionVideo: string;
  countSubscribe: number;
  channelName: string;
  firstName: string;
  lastName: string;
  picture: string;
  channelId: UUID;
}
export interface  GetVideoByIDResponse extends GetVideoByIDResponseFromBack {
  elapsedTime: string;
  durationVideo: string;
}
export interface GetHashtag {
  id: string;
  fullNameSong: string;
  dateOfCreation: string;
  videoName: string;
  imageProfile: string;
  channelName: string;
}

export interface GetHashtagResponse extends GetHashtag{
  elapsedTime: string;
  durationVideo: string;
}


export interface GetCommentResponse {
  id: string;
  commentContent: string;
  dateComment: string;
  userId: string;
  videoId: string;
  channelName: string;
}

export interface AddCommentRequest {
  id: string;
  commentContent: string;
  dateComment: string;
  userId: string;
  videoId: string;
  channelName: string;
}

export interface GetCommentVideoResponseBasic {
  id: string;
  firstName: string;
  lastName: string;
  imageProfile: string;
  channelName: string;
  commentContent: string;
  dataComment: string;
  channelNameComment: string
}
export interface GetCommentVideoResponse extends GetCommentVideoResponseBasic {
  elapsedTime: string;
}

export interface GetReplayResponse {
  id: string;
  commentContent: string;
  dateComment: string;
  userId: string;
  videoId: string;
  channelName: string;
  commentId: string
}

export interface GetReplayVideoResponseBasic {
  id: string;
  firstName: string;
  lastName: string;
  imageProfile: string;
  channelName: string;
  commentContent: string;
  dataComment: string;
  channelNameComment: string
}
export interface GetReplayVideoResponse extends GetReplayVideoResponseBasic {
  elapsedTime: string;
}

// 
export interface CountUserViewDto {
  countViewUser: number
}


// Video by hashtag from path video
export interface GetSimilarHashtagVideos {
  id: string;
  fullNameSong: string;
  dateOfCreation: string;
  videoName: string;
  viewCount: number;
  imageProfile: string;
  channelName: string;
  addHashtag: string[];
  selectHashtag: string[];
}
export interface GetSimilarHashtagVideosDto extends GetSimilarHashtagVideos{
  elapsedTime: string;
  durationVideo: string;
}




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //Api URL USER 
  private apiUrlUser = 'http://localhost:8080/api/user'
  //Api URL CHANNEL 
  private apiUrlChannel = 'http://localhost:8080/api/channel'
  //Api URL VIDEO
  private apiUrlChannelVideo = 'http://localhost:8080/api/channel/video'
  //Api URL Subscription
  private apiUrlSubscription = 'http://localhost:8080/api/subscription'
  //Api URL Comment
  private apiUrlComment = 'http://localhost:8080/api/comment'
  // Api URL Vote - Like / Dislike
  private apiUrlVote = 'http://localhost:8080/api/vote'
  // Api URL View
  private apiUrlView = 'http://localhost:8080/api/view'


  constructor(private http: HttpClient,
    private router: Router
  ) { }

  private tokenKey = 'token'

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): String | null {
    return localStorage.getItem(this.tokenKey);
  }


  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }


  // Show profile in Nav
  getUserByIdInNav(): Observable<GetUserResponseInNav> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${token}`
    });

    return this.http.get<GetUserResponseInNav>(`${this.apiUrlUser}/infoUser`, {headers})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching user profile:', error);
        return throwError(error);
      })
    )
  }


  // User

  registerUser(request: any, picture: File): Observable<any>{
    const formData = new FormData()

    for (const key in request) {
      if(request.hasOwnProperty(key)) {
        const value = request[key as keyof any];
      
        if(Array.isArray(value)) {
          value.forEach(item => formData.append(key, item));
        } else {
          formData.append(key, String(value));
        }
      }
    }

    if(picture) {
      formData.append('picture', picture, picture.name);
    }

    console.log("FormData contents:");
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    return this.http.post<any>(`${this.apiUrlUser}/registerUser`, formData)
      .pipe(
        tap((response) => {
          console.log("Register Success");
        }),
        //catchError((error) => {
          //console.error('Register error', error);
          //return throwError('Try again', error);
      //})
      catchError((error) => {
        console.error('Register error', error);
        return throwError('An error occurred: ' + error.message || 'Unknown error');
      })
      
    )
  }

  loginUser(username: string, password: string): Observable<any>{

    return this.http.post<any>(`${this.apiUrlUser}/loginUser`, {username, password})
    .pipe(
      tap(response => {
        if(response.token) {
          localStorage.setItem('token', response.token);
          console.log("Token save: ", response.token)
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login error: ',error);
        if(error.status === 401) {
          console.error("Kredencialet jane gabim")
        }
        return throwError(error);
      })
    )
  }

  getUserById(): Observable<GetUserResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${token}`
    });

    return this.http.get<GetUserResponse>(`${this.apiUrlUser}/infoUser`, {headers})
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching user profile:', error);
        return throwError(error);
      })
    )
  }

  getPicture(pictureName: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization' : `Bearer ${token}`
    });
  
    return this.http.get(`http://localhost:8080${pictureName}`, { headers, responseType: 'blob' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching image:', error);
          return throwError(error);
        })
      );
  }
  
  // Channel
  createChannel(createChannel: CreateChannelRequest, token: String): Observable<GetChannelResponse> {
    //const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<GetChannelResponse>(`${this.apiUrlChannel}/createChannel`, createChannel, {headers})
  }

  hasChannel(): Observable<boolean>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<boolean>(`${this.apiUrlChannel}/hasChannel`, {headers})
  }

  canActivate(route: any): Observable<boolean> {
    return this.hasChannel();
  }

  getChannelById(): Observable<GetChannelResponse>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<GetChannelResponse>(`${this.apiUrlChannel}/getChannelById`, {headers})
  }


  // Video
  uploadVideo(request: UploaddVideoRequest, videoName: File, channelId: UUID): Observable<GetVideoResponse> {
    const token = localStorage.getItem('token')

    const formData = new FormData();

    for (const key in request) {
      if(request.hasOwnProperty(key)) {
        const value = request[key as keyof UploaddVideoRequest]

        if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, item))
        } else {
          formData.append(key, String(value));
        }

      }
    }

    if (videoName) {
      formData.append('videoName', videoName, videoName.name)
    }

    formData.append('channelId', channelId);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this.http.post<GetVideoResponse>(`${this.apiUrlChannelVideo}/uploadVideo`, formData, {headers})

  }


  //All Video in Menu Component

  getAllVideo(): Observable<GetAllVideoResponseAll[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<GetAllVideoResponseAll[]>(`${this.apiUrlUser}/allVideos`, {headers})
  }

  getVideo(videoName: string): Observable<Blob> {
    const token = this.getToken();
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
    return this.http.get(`http://localhost:8080${videoName}`, { headers, responseType: 'blob' })
    .pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('There was an error!', error);
        return throwError(() => new Error('Something went wrong'));
      })
    )
  }

  // CHanne Path
  getChannel(channelName: string): Observable<GetInfoChannelResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<GetInfoChannelResponse>(`${this.apiUrlUser}/channel/${channelName}`, {headers})
  }


  // Search Video
  getSearchSuggestions(query: string): Observable<GetSearchVideoResponse[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<GetSearchVideoResponse[]>(`${this.apiUrlUser}/searchSuggestions/${query}`, {headers})
  }

  getSearchResults(query: string): Observable<GetSearchVideoResponse[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<GetSearchVideoResponse[]>(`${this.apiUrlUser}/searchResults/${query}`, {headers})
  }


  // Subscription
  subscribeFromChannel(userId: UUID, channelId: UUID): Observable<string> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const body = { userId, channelId }
    return this.http.post<string>(`${this.apiUrlSubscription}/subscribe`, body , {headers})
  }

  unSubscribeFromChannel(userId: UUID, channelId: UUID): Observable<string> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const body = { userId, channelId }
    return this.http.post<string>(`${this.apiUrlSubscription}/unsubscribe`, body , {headers})
  }

  
 /* checkSubscription(userId: string, channelId: string): Observable<{ isSubscribed: boolean }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<{ isSubscribed: boolean }>(`${this.apiUrlSubscription}/checkSu/${userId}/${channelId}`, {headers});
  }*/

  checkSubscription(userId: string, channelId: string): Observable<{ isSubscribed: boolean }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<{ isSubscribed: boolean }>(`${this.apiUrlSubscription}/checkSub/${userId}/${channelId}`, { headers })
      .pipe(
        catchError(error => {
        console.error('Error occurred while checking subscription. User ID and Channel ID are hidden for security reasons.');          
        return throwError('An error occurred while checking the subscription. Please try again later.');
      })
    );
  }

  countSubscribes(channelId: UUID): Observable<CountSubscribesChannel> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<CountSubscribesChannel>(`${this.apiUrlSubscription}/${channelId}/subscribers`, {headers})
  }

  // Get Sub for user
  getSubscribeForUser(): Observable<GetSubscribeForUserResponse[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<GetSubscribeForUserResponse[]>(`${this.apiUrlSubscription}/userSubChannel`, {headers})
  }


  // Get Video BY Id
  getVideoById(videoId: string): Observable<GetVideoByIDResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<GetVideoByIDResponse>(`${this.apiUrlChannelVideo}/watch/${videoId}`, {headers})
  }
  

  // Get video bt hashtag path
  getVideoHashtag(hashtag: string): Observable<GetHashtagResponse[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token is missing or invalid');
      return throwError(() => new Error('Authorization token is missing'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<GetHashtagResponse[]>(`${this.apiUrlChannelVideo}/hashtag/${hashtag}`, { headers })
      .pipe(
        catchError(error => {
          console.error('Error fetching hashtag:', error);
          return throwError(() => new Error('Error fetching hashtag'));
        })
      );
  }



  // Comment
  addComment(commentRequest: any): Observable<any> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Assuming you're storing the JWT token in localStorage
    });
    return this.http.post<any>(`${this.apiUrlComment}/addComment`, commentRequest, { headers });
  }
  
  getAllCommentByVideo(videoId: string): Observable<GetCommentVideoResponse[]> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<GetCommentVideoResponse[]>(`${this.apiUrlComment}/allVideoComments/${videoId}`, {headers})
  }

  // Comment Replay
  addReplay(replay: any): Observable<any>{
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrlComment}/addReplay`, replay, {headers})
  }

  getAllReplayForCommentInVideo(videoId: string, commentId: string): Observable<GetReplayVideoResponse[]>{
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<GetReplayVideoResponse[]>(`${this.apiUrlComment}/allReplayForComment/${videoId}/${commentId}`, {headers})
  } 
  

  // Like video Service
  addLike(videoId: string): Observable<string> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    const body = {
      videoId
    }

    return this.http.post<string>(`${this.apiUrlVote}/addLike`, body, {headers})
  }

  removeLike(videoId: string): Observable<string> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    const body = {
      videoId
    }

    return this.http.post<string>(`${this.apiUrlVote}/removeLike`, body, {headers})
  }

  checkLikeForVideo(videoId: string): Observable<{isLike: boolean}> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    return this.http.get<{isLike: boolean}>(`${this.apiUrlVote}/checkLike/${videoId}`, {headers})
  }

  countLikeVideo(videoId: string): Observable<CountLikeResponse>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<CountLikeResponse>(`${this.apiUrlVote}/${videoId}/likes`, {headers})
  }

  // Dislike Video Service
  addDislike(videoId: string): Observable<string> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    const body = {
      videoId
    }

    return this.http.post<string>(`${this.apiUrlVote}/addDislike`, body, {headers})
  }

  removeDislike(videoId: string): Observable<string> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    const body = {
      videoId
    }

    return this.http.post<string>(`${this.apiUrlVote}/removeDislike`, body, {headers})
  }

  checkDislikeForVideo(videoId: string): Observable<{isDislike: boolean}> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    return this.http.get<{isDislike: boolean}>(`${this.apiUrlVote}/checkDislike/${videoId}`, {headers})
  }

  countDislikeVideo(videoId: string): Observable<CountDislikeResponse>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<CountDislikeResponse>(`${this.apiUrlVote}/${videoId}/dislikes`, {headers})
  }


  // View 
  increaseViewCount(videoId: string, timeViewedInSeconds: number): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const body = {
      videoId,
      timeViewedInSeconds
    }

    return this.http.post<any>(`${this.apiUrlView}/increaseViewCount`, body, {headers})
  }

  getTotalViewCountForVideo(videoId: string): Observable<number>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<number>(`${this.apiUrlView}/${videoId}/total-views`, {headers})
  }


  getgetViewCountForUserInVideo(videoId: string): Observable<CountUserViewDto> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<CountUserViewDto>(`${this.apiUrlView}/${videoId}/user-views`, {headers})
  }




  /// Get All video By hashtag video
  getSimilarHashtagVideos(videoId: string): Observable<GetSimilarHashtagVideosDto[]>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<GetSimilarHashtagVideosDto[]>(`${this.apiUrlChannelVideo}/hashtag/similar/${videoId}`, {headers})
  }

}
