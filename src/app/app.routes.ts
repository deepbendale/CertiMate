import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GenerateComponent } from './pages/generate/generate.component';
import { VerifyComponent } from './pages/verify/verify.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {path: '', redirectTo:'/home', pathMatch:'full'},
    {path: 'home', component:HomeComponent},
    {path:'generate', component:GenerateComponent},
    {path:'verify/:code', component:VerifyComponent},
    {path:'admin/templates', component: AdminComponent},
    {path:'**', redirectTo:'/home'}

];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports:[RouterModule]
})
export class AppRoutingModule{ }
