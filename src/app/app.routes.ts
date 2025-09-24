import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path:'',
        component:Login
    },
    {
        path:'dashboard',
        component:Dashboard,
        canActivate:[authGuard]
    },
    {
        path:'**',
        redirectTo:'',
        pathMatch:'full'
    }
];
