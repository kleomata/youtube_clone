import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllVideoComponent } from './all-video.component';

describe('AllVideoComponent', () => {
  let component: AllVideoComponent;
  let fixture: ComponentFixture<AllVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
