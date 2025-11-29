import { inject } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { AuthService } from '@core/auth';
import { TriviaGameService } from '@core/trivia-game';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'nav',
        pathMatch: 'full'
    },
    {
        path: 'home',
        redirectTo: 'nav/home',
    },
    {
        path: 'interviews',
        redirectTo: 'nav/interviews',
    },
    {
        path: 'auth',
        loadComponent: () => import('./pages/auth/authentication').then(m => m.AuthenticationPage),
        children: [
            {
                path: 'login',
                loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginPage)
            },
            {
                path: 'logout',
                loadComponent: () => import('./pages/auth/logout/logout').then(m => m.LogoutPage)
            },
            {
                path: 'signup',
                loadComponent: () => import('./pages/auth/signup/signup').then(m => m.SignupPage)
            },
            {
                path: 'forgotPassword',
                loadComponent: () => import('./pages/auth/forgot-password/forgot-password').then(m => m.ForgotPasswordPage)
            },
            {
                path: 'resetPassword',
                loadComponent: () => import('./pages/auth/reset-password/reset-password').then(m => m.ResetPasswordPage)
            },
            {
                path: 'resendEmail',
                loadComponent: () => import('./pages/auth/resend-email/resend-email').then(m => m.ResendEmailPage)
            },
            {
                path: 'verifyEmail',
                loadComponent: () => import('./pages/auth/verify-email/verify-email').then(m => m.VerifyEmailPage)
            },
        ]
    },
    {
        path: 'christmas',
        loadComponent: () => import('./pages/christmas/christmas').then(m => m.ChristmasWrapper),
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'trivia-game'
            },
            {
                title: 'Trivia Game',
                path: 'trivia-game',
                loadComponent: () => import('./pages/christmas/trivia-game/trivia-game').then(m => m.TriviaGame),
                canActivate: [
                    async () => {
                        const router = inject(Router);
                        const triviaGame = inject(TriviaGameService);
                        const authenticatedUser = triviaGame.authenticatedUser();
                        if (authenticatedUser) return true;
                        return router.createUrlTree(['christmas/join-trivia-game']);
                    }
                ]
            },
            {
                title: "Join Trivia Game",
                path: 'join-trivia-game',
                loadComponent: () => import('./pages/christmas/join-trivia-game/join-trivia-game').then(m => m.JoinTriviaGame),
            },
            {
                title: 'Trivia Admin Panel',
                path: 'trivia-admin',
                loadComponent: () => import('./pages/christmas/trivia-admin/trivia-admin').then(m => m.TriviaAdmin),
                canActivate: [
                    async () => {
                        const authService = inject(AuthService);
                        const authenticatedUser = authService.authenticatedUser();
                        if (authenticatedUser?.isSiteAdmin) return true;
                        return false;
                    }
                ]
            },
            {
                title: 'Trivia Board',
                path: 'trivia-board',
                loadComponent: () => import('./pages/christmas/trivia-board/trivia-board').then(m => m.TriviaBoard),
                canActivate: [
                    async () => {
                        const authService = inject(AuthService);
                        const authenticatedUser = authService.authenticatedUser();
                        if (authenticatedUser?.isSiteAdmin) return true;
                        return false;
                    }
                ]
            },
        ]
    },
    {
        path: 'nav',
        loadComponent: () => import('./pages/nav/navigation.component').then(m => m.NavigationComponent),
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                loadComponent: () => import('./pages/nav/home/home').then(m => m.HomePage)
            },
            {
                path: 'interviews',
                loadComponent: () => import('./pages/nav/interviews/interviews').then(m => m.InterviewsPage)
            },
            {
                path: 'interviewSuccess',
                loadComponent: () => import('./pages/nav/interview-success/interview-success').then(m => m.InterviewSuccessPage)
            },
            {
                path: 'users',
                loadComponent: () => import('./pages/nav/users/users').then(m => m.UsersPage),
                canActivate: [
                    () => {
                        const authService = inject(AuthService);
                        return !!authService.authenticatedUser()?.isSiteAdmin;
                    }
                ]
            }
        ]
    },
];
