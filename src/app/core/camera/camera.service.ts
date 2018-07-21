import { Injectable, EventEmitter } from '@angular/core';
import { Boolean } from '../../../../node_modules/aws-sdk/clients/cloudtrail';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  stream: MediaStream;
  isMediaPermissionGranted: boolean;
  recorder: any;

  constructor() { }
  makeTimer(countdown: number, evt: EventEmitter<number>) {
    const timer = setInterval(function () {
      console.log(countdown);
      evt.emit(countdown);
      if (countdown === 0) {
        clearInterval(timer);
      }
      countdown--;
    }, 1000);
  }
  async requestCameraAccess(): Promise<boolean> {
    if (this.isMediaPermissionGranted) {
      return true;
    } else {
      try {
        console.log('requesting access...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
        this.stream = stream;
        this.isMediaPermissionGranted = true;
        console.log(stream);
        return true;
      } catch (e) {
        console.log('error');
        console.log(e);
        return false;
      }
    }
  }

  closeCamera() {
    const track = this.stream.getTracks()[0];
    track.stop();
  }

  async refreshMediaStream(): Promise<boolean> {
    try {
      console.log('requesting access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
      this.stream = stream;
      console.log(stream);
      return true;
    } catch (e) {
      console.log('error');
      console.log(e);
      return false;
    }
  }
}
