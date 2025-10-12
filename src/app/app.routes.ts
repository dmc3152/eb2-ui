import { Routes } from '@angular/router';

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
        loadComponent: () => import('./pages/authentication/authentication').then(m => m.AuthenticationPage),
        children: [
            {
                path: 'login',
                loadComponent: () => import('./pages/login/login').then(m => m.LoginPage)
            },
            {
                path: 'logout',
                loadComponent: () => import('./pages/logout/logout').then(m => m.LogoutPage)
            },
            {
                path: 'signup',
                loadComponent: () => import('./pages/signup/signup').then(m => m.SignupPage)
            },
            {
                path: 'forgotPassword',
                loadComponent: () => import('./pages/forgot-password/forgot-password').then(m => m.ForgotPasswordPage)
            },
            {
                path: 'resetPassword',
                loadComponent: () => import('./pages/reset-password/reset-password').then(m => m.ResetPasswordPage)
            },
            {
                path: 'resendEmail',
                loadComponent: () => import('./pages/resend-email/resend-email').then(m => m.ResendEmailPage)
            },
            {
                path: 'verifyEmail',
                loadComponent: () => import('./pages/verify-email/verify-email').then(m => m.VerifyEmailPage)
            },
        ]
    },
    {
        path: 'nav',
        loadComponent: () => import('./pages/navigation/navigation.component').then(m => m.NavigationComponent),
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                loadComponent: () => import('./pages/home/home').then(m => m.HomePage)
            },
            {
                path: 'interviews',
                loadComponent: () => import('./pages/interviews/interviews').then(m => m.InterviewsPage)
            },
            {
                path: 'interviewSuccess',
                loadComponent: () => import('./pages/interview-success/interview-success').then(m => m.InterviewSuccessPage)
            }
        ]
    },
];
