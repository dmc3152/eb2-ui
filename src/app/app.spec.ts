import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: SwUpdate,
          useValue: {
            // Mock the properties/methods your app uses
            isEnabled: false, 
            versionUpdates: of(), 
            checkForUpdate: vi.fn().mockResolvedValue(false),
            activateUpdate: vi.fn().mockResolvedValue(false),
          }
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
