import { Component } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  amplify: AmplifyService;
  isSignedIn = false;

  constructor(public amplifyService: AmplifyService,
    public router: Router) {

    this.amplify = amplifyService;
    this.amplify.authStateChange$
      .subscribe(authState => {
        console.log(authState);
        if (authState.state === 'signedIn') {
          this.isSignedIn = true;
        //   this.router.navigate(['/gifs']);
        }
        // if (authState.state === 'signedOut') {
        //   this.router.navigate(['/landing']);
        // }
      });
  }

  async signOut() {
    console.log('signing out...');
    const result = await this.amplify.auth().signOut();
    console.log('signed out.');
    console.log(result);
    this.isSignedIn = false;
    this.router.navigate(['/landing']);
  }
}
