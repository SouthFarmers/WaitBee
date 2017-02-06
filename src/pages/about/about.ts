import { Component } from '@angular/core';

import {NavController} from 'ionic-angular';
import {HomePage} from "../home/home";


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  conferenceDate = '2047-05-17';
  info: string = "deviceinfo";

  constructor(public navCtrl: NavController) { }
    goHome() {
    this.navCtrl.push(HomePage);
    this.navCtrl.setRoot(HomePage);

  }
}
