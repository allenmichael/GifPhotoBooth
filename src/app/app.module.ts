import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { CameraService } from './core/camera/camera.service';
// import { SocketService } from './core/socket/socket.service';

import { AppComponent } from './app.component';
import { GifMakerComponent } from './gif-maker/gif-maker.component';
import { GifListComponent } from './gif-list/gif-list.component';
import { LandingComponent } from './landing/landing.component';

import Amplify from 'aws-amplify';
import aws_exports from '../aws-exports';

Amplify.configure(aws_exports);

@NgModule({
  declarations: [
    AppComponent,
    GifMakerComponent,
    LandingComponent,
    GifListComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    AmplifyAngularModule
  ],
  providers: [AmplifyService, CameraService],
  bootstrap: [AppComponent]
})
export class AppModule { }
