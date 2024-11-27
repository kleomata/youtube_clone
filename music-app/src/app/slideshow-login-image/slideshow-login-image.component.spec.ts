import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideshowLoginImageComponent } from './slideshow-login-image.component';

describe('SlideshowLoginImageComponent', () => {
  let component: SlideshowLoginImageComponent;
  let fixture: ComponentFixture<SlideshowLoginImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideshowLoginImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideshowLoginImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
