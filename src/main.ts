// import { Component } from '@angular/core';
// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideRouter, RouterOutlet } from '@angular/router';
// import { LoginComponent } from './app/components/login/login.component';
// import { SignupComponent } from './app/components/signup/signup.component';
// import { AuthGuard } from './app/guards/auth.guard';
// import { provideHttpClient } from '@angular/common/http';
// import { AuthService } from './app/services/auth.service';


// @Component({
//   selector: 'app-root',
//   template: `<router-outlet></router-outlet>`,
//   standalone: true,
//   imports: [RouterOutlet]
// })
// export class App {}

// bootstrapApplication(App, {
//   providers: [
//     provideRouter([
//       { path: '', redirectTo: 'login', pathMatch: 'full' }, 
//       { path: 'login', component: LoginComponent },
//       { path: 'signup', component: SignupComponent },
//       {
//         path: 'employee',
//         loadComponent: () => import('./app/components/employee-dashboard/employee-dashboard.component')
//           .then(m => m.EmployeeDashboardComponent),
//         canActivate: [AuthGuard]
//       },
//       {
//         path: 'manager',
//         loadComponent: () => import('./app/components/manager-dashboard/manager-dashboard.component')
//           .then(m => m.ManagerDashboardComponent),
//         canActivate: [AuthGuard]
//       }
//     ]),
//     provideHttpClient() 
//   ]
// }).catch(err => console.error(err));
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { auth, db } from './app/firebase.config';


import { LoginComponent } from './app/components/login/login.component';
import { SignupComponent } from './app/components/signup/signup.component';
import { EmployeeDashboardComponent } from './app/components/employee-dashboard/employee-dashboard.component';
import { ManagerDashboardComponent } from './app/components/manager-dashboard/manager-dashboard.component';
import { AuthGuard } from './app/guards/auth.guard';
import { AuthService } from './app/services/auth.service';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  standalone: true,
  imports: [RouterOutlet]
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter([
      { path: '', redirectTo: 'login', pathMatch: 'full' }, 
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      {
        path: 'employee',
        component: EmployeeDashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'manager',
        component: ManagerDashboardComponent,
        canActivate: [AuthGuard]
      }
    ]),
    provideHttpClient(),
    importProvidersFrom(AuthService) // 🔥 Ensure AuthService is provided
  ]
}).catch(err => console.error(err));(window as any).firebaseAuth = auth;
(window as any).firebaseDB = db;
