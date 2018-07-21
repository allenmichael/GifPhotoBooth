import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GifMakerComponent } from './gif-maker/gif-maker.component';
import { AuthGuard } from './auth.guard';
import { LandingComponent } from './landing/landing.component';
import { GifListComponent } from './gif-list/gif-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'gif-list', component: GifListComponent, canActivate: [AuthGuard] },
  { path: 'gifs', component: GifMakerComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
