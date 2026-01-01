import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationPage } from './authentication';
import { provideRouter } from '@angular/router';

describe('Authentication', () => {
  let component: AuthenticationPage;
  let fixture: ComponentFixture<AuthenticationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticationPage],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthenticationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
