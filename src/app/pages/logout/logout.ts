import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-logout',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './logout.html',
  styleUrl: './logout.scss'
})
export class LogoutPage implements OnInit {
  private _auth = inject(AuthService);

  message = signal<string | null>(null);
  logoutSuccess = signal<boolean | null>(null);

  ngOnInit() {
    this.logout();
  }

  logout = async () => {
    const response = await this._auth.logout();
    this.logoutSuccess.set(response);
    const message = response ? "You have logged out successfully!" : "There was a problem with logging you out. Please try again.";
    this.message.set(message);
  }
}
