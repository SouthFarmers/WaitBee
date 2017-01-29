import { Component } from '@angular/core';
import {NavController, AlertController, App} from 'ionic-angular';
import {HomePage} from "../home/home";


@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html'
})
export class Rating {
  rating: number = 0;
  name:String = "";
  comments:String = "";
  constructor(private app: App, public navCtrl: NavController,public alertCtrl: AlertController) {

  }

  submitfeedback(){
    let alert = this.alertCtrl.create({
      title: 'Success!',
      subTitle: 'Thank you for your feedback',
      buttons: [{
        text: 'OK',
        handler: data => {
          this.goHome();
        }
      }]
    });
    alert.present();
  }

  goHome() {
    this.navCtrl.push(HomePage);
    this.navCtrl.setRoot(HomePage);

  }
}
