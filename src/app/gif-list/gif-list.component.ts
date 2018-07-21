import { Component, OnInit } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';

@Component({
  selector: 'app-gif-list',
  templateUrl: './gif-list.component.html',
  styleUrls: ['./gif-list.component.css']
})
export class GifListComponent implements OnInit {
  gifs = [];

  constructor(public amplify: AmplifyService) {
  }

  async ngOnInit() {
    try {
      const user = await this.amplify.auth().currentSession();
      const userId = user.idToken.payload.sub;
      const resp = await this.amplify.api().get('gifs', '/gifs',
        {
          response: true,
          queryStringParameters: {
            'userId': userId
          }
        });
      console.log(resp);
      resp.data.Items.forEach((i) => {
        console.log(i);
        this.gifs.push(i);
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getGif(gifUrl: string) {

    const url = gifUrl.slice(gifUrl.indexOf('/') + 1, gifUrl.length);
    const result = await this.amplify.storage().get(url, { level: 'public' });
    console.log(result);
    window.open(result.toString(), '_blank');
  }
}
