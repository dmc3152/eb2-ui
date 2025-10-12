import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResendEmailPage } from './resend-email';

describe('VerifyEmail', () => {
  let component: ResendEmailPage;
  let fixture: ComponentFixture<ResendEmailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResendEmailPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResendEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
