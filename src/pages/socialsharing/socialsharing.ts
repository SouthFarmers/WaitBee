import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import { SocialSharing } from 'ionic-native';

@Component({
  selector: 'page-socialsharing',
  templateUrl: 'socialsharing.html'
})
export class SocialsharingPage {

  constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
  }

  facebookShare(){
    SocialSharing.shareViaFacebook("Hey check out this cool app",'assets/img/slide1.png',"http://waitbee.com");
  }

  whatsappShare(){
    SocialSharing.shareViaWhatsApp("Hey check out this cool app", 'assets/img/slide1.png',  "http://waitbee.com/" /* url */);
  }

  instagramShare(){
    SocialSharing.shareViaInstagram("Hey check out this cool app", 'assets/img/slide1.png');
  }

  twitterShare(){
    SocialSharing.shareViaTwitter("Hey check out this cool app",'assets/img/slide1.png',"http://waitbee.com");
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
}
