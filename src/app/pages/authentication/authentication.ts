import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbar } from "@angular/material/toolbar";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map, shareReplay } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-authentication',
  imports: [RouterOutlet, MatToolbar, AsyncPipe, RouterLink],
  templateUrl: './authentication.html',
  styleUrl: './authentication.scss'
})
export class AuthenticationPage {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}
