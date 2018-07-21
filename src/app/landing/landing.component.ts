import { Component, OnInit } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  isSignedIn = false;
  constructor(public amplify: AmplifyService) {
    amplify.authStateChange$
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

  ngOnInit() {
  }

}
