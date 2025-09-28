import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home').then(m => m.HomePage)
    },
    {
        path: 'interviews',
        loadComponent: () => import('./interviews/interviews').then(m => m.InterviewsPage)
    }
];
