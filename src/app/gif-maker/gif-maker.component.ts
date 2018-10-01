import { Component, OnInit, ViewChild, ElementRef, OnDestroy, EventEmitter } from '@angular/core';
import { CameraService } from '../core/camera/camera.service';
import { pipe } from 'rxjs';
import { AmplifyService } from 'aws-amplify-angular';

declare var MediaRecorder: any;

@Component({
  selector: 'app-gif-maker',
  templateUrl: './gif-maker.component.html',
  styleUrls: ['./gif-maker.component.css']
})
export class GifMakerComponent implements OnInit, OnDestroy {

  @ViewChild('videoRecorder')
  public recorder: ElementRef;
  @ViewChild('videoPlayer')
  public player: ElementRef;
  public isMediaPermissionGranted = false;
  public hasRecording = false;
  public videoBytes: any[];
  public video: Blob;
  public breakpoint: Number;
  public vidHeight = 350;
  public vidWidth = 450;

  constructor(private cam: CameraService, private amplify: AmplifyService) {
    this.amplify.storage().configure({ level: 'public' });
  }
  async ngOnInit() {
    this.breakpoint = (window.innerWidth <= 500) ? 1 : 2;
    this.vidHeight = (window.innerWidth <= 500) ? 250 : this.vidHeight;
    this.vidWidth = (window.innerWidth <= 500) ? 350 : this.vidWidth;
    const resp = await this.amplify.api().get('gifs', '/gifs', { response: true });
    console.log(resp);
    console.log(this.recorder);
    this.isMediaPermissionGranted = await this.cam.requestCameraAccess();
    if (this.isMediaPermissionGranted) {
      console.log('has access...');
      this.setRecorderSrc();
    } else {
      console.log('something happened');
    }
  }

  ngOnDestroy() {
    this.cam.closeCamera();
  }

  async openCamera() {
  }

  async startRecording() {
    this.videoBytes = [];
    console.log('Recording...');
    const timer = new EventEmitter<number>();
    this.cam.makeTimer(3, timer);
    if (this.isMediaPermissionGranted) {
      const track = this.cam.stream.getVideoTracks()[0];
      if (track.readyState === 'ended') {
        if (!await this.cam.refreshMediaStream()) {
          throw new Error('Couldn\'t access device');
        }
        this.setRecorderSrc();
      }
    }
    timer.subscribe(
      pipe(async n => {
        if (n === 0) {
          this.record();
          console.log('done!');
        }
      })
    );
  }

  async saveRecording() {
    const user = await this.amplify.auth().currentSession();
    let userId;
    try {
      userId = user.idToken.payload.sub;
    } catch (e) {
      userId = Math.random().toString().split('.')[1];
    }
    console.log(user.idToken.payload.sub);
    const datetime = Date.now();
    const result = await this.amplify.storage().put(`${userId}-${datetime}.webm`, this.video);
    const resp = await this.amplify.api().post('gifs', '/gifs',
      {
        response: true,
        body: {
          userId: user.idToken.payload.sub,
          gifFileName: `${userId}-${datetime}.webm`
        }
      });
    console.log(result);
    console.log(resp);
  }

  private setRecorderSrc() {
    this.recorder.nativeElement.srcObject = this.cam.stream;
    this.recorder.nativeElement.play();
  }

  private record() {
    const mediaRecorder = new MediaRecorder(this.cam.stream);
    mediaRecorder.start();
    mediaRecorder.ondataavailable = (e) => {
      console.log('data available...');
      if (e.data && e.data.size > 0) {
        console.log('adding data...');
        console.log(this);
        this.videoBytes.push(e.data);
      }
    };
    setTimeout(() => {
      console.log(mediaRecorder.state);
      console.log('requesting data...');
      mediaRecorder.stop();
      // const track = this.cam.stream.getVideoTracks()[0];
      // track.stop();
      console.log(this.cam.stream.getVideoTracks());
      this.convertRecording();
    }, 5000);
  }

  private convertRecording() {
    setTimeout(() => {
      const vb = new Blob(this.videoBytes, {
        type: 'video/webm'
      });
      this.video = vb;
      const recordedVideo = this.player;
      recordedVideo.nativeElement.src = window.URL.createObjectURL(vb);
    }, 2000);
  }

}
