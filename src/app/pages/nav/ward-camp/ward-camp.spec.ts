import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardCampPage } from './ward-camp';
import { provideRouter } from '@angular/router';

describe('WardCampPage', () => {
  let component: WardCampPage;
  let fixture: ComponentFixture<WardCampPage>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WardCampPage
      ],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardCampPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
