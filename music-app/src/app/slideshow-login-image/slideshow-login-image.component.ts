import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgFor } from '@angular/common';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css'

@Component({
  selector: 'app-slideshow-login-image',
  standalone: true,
  imports: [NgFor],
  templateUrl: './slideshow-login-image.component.html',
  styleUrl: './slideshow-login-image.component.css',
  schemas: []
})
export class SlideshowLoginImageComponent implements AfterViewInit{
  
  
  slides = [
    {
      url: '../../assets/images/login-slideshow/eminem.jpg',
      alt: 'eminem',
      nameSinger: 'Eminem' 
    },
    {
      url: '../../assets/images/login-slideshow/post_malone.jpg',
      alt: 'post malone',
      nameSinger: 'Post Malone' 
    },
    {
      url: '../../assets/images/login-slideshow/alan_walker.jpg',
      alt: 'alan walker',
      nameSinger: 'Alan Walker' 
    },
    {
      url: '../../assets/images/login-slideshow/billie_eilish.jpg',
      alt: 'billie eilish',
      nameSinger: 'Billie Eilish' 
    },
    {
      url: '../../assets/images/login-slideshow/ariana_grande.jpg',
      alt: 'ariana grande',
      nameSinger: 'Ariana Grande' 
    },
    {
      url: '../../assets/images/login-slideshow/fall_out_boy.webp',
      alt: 'fall out boy',
      nameSinger: 'Fall Out Boy' 
    },
    {
      url: '../../assets/images/login-slideshow/ed_sheeran.jpg',
      alt: 'ed sheeran',
      nameSinger: 'Ed Sheeran' 
    },
    {
      url: '../../assets/images/login-slideshow/farruko.jpg',
      alt: 'farruko',
      nameSinger: 'Farruko' 
    },
    {
      url: '../../assets/images/login-slideshow/imagine_dragons.jpg',
      alt: 'imagine dragons',
      nameSinger: 'Imagine Dragons' 
    },
    {
      url: '../../assets/images/login-slideshow/kehlani.jpg',
      alt: 'kehlani',
      nameSinger: 'Kehlani' 
    },
    {
      url: '../../assets/images/login-slideshow/dr_dre.jpg',
      alt: 'dr dre',
      nameSinger: 'Dr. Dre' 
    },
    {
      url: '../../assets/images/login-slideshow/dua_lipa.jpg',
      alt: 'dua lipa',
      nameSinger: 'Dua Lipa' 
    },
    {
      url: '../../assets/images/login-slideshow/g_eazy.jpg',
      alt: 'g-eazy',
      nameSinger: 'G-Eazy' 
    },
    {
      url: '../../assets/images/login-slideshow/katy_perry.jpg',
      alt: 'katy perry',
      nameSinger: 'Kety Perry' 
    },
    {
      url: '../../assets/images/login-slideshow/j_balvin.webp',
      alt: 'j balvin',
      nameSinger: 'J Balvin' 
    },
    {
      url: '../../assets/images/login-slideshow/ragnbone_man.jpg',
      alt: 'rag\'n\'bone man',
      nameSinger: 'Rag\'n\'Bone Man' 
    },
    {
      url: '../../assets/images/login-slideshow/shakira.webp',
      alt: 'shakira',
      nameSinger: 'Shakira' 
    },
    {
      url: '../../assets/images/login-slideshow/ava_max.webp',
      alt: 'ava max',
      nameSinger: 'Ava Max' 
    },
    {
      url: '../../assets/images/login-slideshow/rihanna.jpg',
      alt: 'rihanna',
      nameSinger: 'Rihanna' 
    },
    {
      url: '../../assets/images/login-slideshow/skillet.jpg',
      alt: 'skillet',
      nameSinger: 'Skillet' 
    },
    {
      url: '../../assets/images/login-slideshow/wiz_khalifa.jpg',
      alt: 'wiz khalifa',
      nameSinger: 'Wiz Khalifa' 
    },
    {
      url: '../../assets/images/login-slideshow/twenty_one_pilots.jpg',
      alt: 'twenty one pilots',
      nameSinger: 'Twenty one Pilots' 
    },
    {
      url: '../../assets/images/login-slideshow/marshmello.png',
      alt: 'marshmello',
      nameSinger: 'Marshmello' 
    },
    {
      url: '../../assets/images/login-slideshow/nf.jpg',
      alt: 'nf',
      nameSinger: 'NF' 
    },
    {
      url: '../../assets/images/login-slideshow/selena_gomez.jpg',
      alt: 'selena gomez',
      nameSinger: 'Selena Gomez' 
    },
    {
      url: '../../assets/images/login-slideshow/the_score.jpg',
      alt: 'the score',
      nameSinger: 'The Score' 
    },
    {
      url: '../../assets/images/login-slideshow/the_weeknd.jpg',
      alt: 'the weeknd',
      nameSinger: 'The Weeknd' 
    },
    {
      url: '../../assets/images/login-slideshow/neffex.jpg',
      alt: 'neffex',
      nameSinger: 'NEFFEX' 
    },
    {
      url: '../../assets/images/login-slideshow/daddy_yankee.jpg',
      alt: 'daddy yankee',
      nameSinger: 'Daddy Yankee' 
    },
    {
      url: '../../assets/images/login-slideshow/coldplay.jpg',
      alt: 'coldplay',
      nameSinger: 'Coldplay' 
    },
    {
      url: '../../assets/images/login-slideshow/ozuna.jpg',
      alt: 'ozuna',
      nameSinger: 'Ozuna' 
    },
    {
      url: '../../assets/images/login-slideshow/linkin_park.jpg',
      alt: 'linkin park',
      nameSinger: 'Linkin Park' 
    },
    {
      url: '../../assets/images/login-slideshow/maroon_5.jpg',
      alt: 'maroon 5',
      nameSinger: 'Maroon 5' 
    },
    {
      url: '../../assets/images/login-slideshow/calum_scott.jpg',
      alt: 'calum scott',
      nameSinger: 'Calum Scott' 
    },
    {
      url: '../../assets/images/login-slideshow/avicii.jpg',
      alt: 'avicii',
      nameSinger: 'Avicii' 
    },
    {
      url: '../../assets/images/login-slideshow/bad_bunny.jpg',
      alt: 'bad bunny',
      nameSinger: 'Bad Bunny' 
    },
  ]

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
     //if (typeof document !== 'undefined') {
    if(isPlatformBrowser(this.platformId)){
      const swiper = new Swiper('.swiper-container', {
        loop: true,
        speed: 1000,
        effect: 'fade',
        //pagination: {
          //el: '.swiper-pagination',
          //clickable: true,
        //},
        //navigation: {
          //nextEl: '.swiper-button-next',
          //prevEl: '.swiper-button-prev',
        //},
        autoplay: {
          delay: 1000,
          disableOnInteraction: false,
        },
      });
    }
  }

}

