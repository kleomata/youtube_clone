import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { YoutubeComponent } from './youtube/youtube.component';
import { SettingsComponent } from './settings/settings.component';
import { ProfileComponent } from './package-settings/profile/profile.component';
import { UploadVideoComponent } from './package-settings/upload-video/upload-video.component';
import { AllVideoComponent } from './package-settings/all-video/all-video.component';
import { EditVideoComponent } from './package-settings/edit-video/edit-video.component';
import { DeleteVideoComponent } from './package-settings/delete-video/delete-video.component';


import { authGuard } from './auth.guard';
import { MainComponent } from './main/main.component';
import { CreateChannelComponent } from './create-channel/create-channel.component';
import { ChannelComponent } from './channel/channel.component';
import { ChannelInfoComponent } from './channel-info/channel-info.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { AllSubsctriptionsComponent } from './all-subsctriptions/all-subsctriptions.component';
import { WatchComponent } from './watch/watch.component';
import { HashtagComponent } from './hashtag/hashtag.component';

export const routes: Routes = [
    {
        path: '', 
        redirectTo: '/login', 
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'youtube',
        component: YoutubeComponent,
        canActivate: [authGuard],
        children: [
            { path: '', component: MainComponent },
            { path: 'settings', component: SettingsComponent, 
                children: [
                    { path: '', redirectTo: 'profile', pathMatch: 'full'},
                    { path: 'profile', component: ProfileComponent },
                    { path: 'create-channel', component: CreateChannelComponent},
                    { path: 'channel', component: ChannelComponent},
                    { path: 'channel/all-video', component: AllVideoComponent },
                    { path: 'channel/upload-video', component: UploadVideoComponent },
                    { path: 'channel/edit-video', component: EditVideoComponent },
                    { path: 'channel/delete-video', component: DeleteVideoComponent }
                ]
            },

            {
                path: 'subsctriptions', component: AllSubsctriptionsComponent
            },


            { path: 'channel/:channelName', component: ChannelInfoComponent},
            { path: 'search-results', component: SearchResultsComponent},


            { path: 'watch', component: WatchComponent},

            { path: 'hashtag/:hashtag', component: HashtagComponent}
            
        ]
    }, 
    
];


