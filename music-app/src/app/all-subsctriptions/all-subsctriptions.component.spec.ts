import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSubsctriptionsComponent } from './all-subsctriptions.component';

describe('AllSubsctriptionsComponent', () => {
  let component: AllSubsctriptionsComponent;
  let fixture: ComponentFixture<AllSubsctriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllSubsctriptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllSubsctriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
