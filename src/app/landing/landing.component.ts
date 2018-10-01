import { Component } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {

  isSignedIn = false;
  constructor(public amplify: AmplifyService, 
    public router: Router, public route: ActivatedRoute) {
    amplify.authStateChange$
      .subscribe(authState => {
        console.log(authState);
        if (authState.state === 'signedIn') {
          this.isSignedIn = true;
          // this.router.navigate(['/gifs'], { relativeTo: this.route });
        }
        // if (authState.state === 'signedOut') {
        //   this.router.navigate(['/landing']);
        // }
      });
  }

}
