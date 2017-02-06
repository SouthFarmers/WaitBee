import { Component } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {HomePage} from "../home/home";



export interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  slides: Slide[];
  showSkip = true;

  constructor(public navCtrl: NavController, public menu: MenuController, public storage: Storage) {
    this.slides = [
      {
        title: 'Welcome to <b>Wait Bee</b>',
        description: '<b>Wait Bee</b> helps you to wait less.',
        image: 'assets/img/slide1.png',
      },
      {
        title: 'How it works?',
        description: 'Home screen shows list of properties near your, it may be restaurants or bar or theater or airport.',
        image: 'assets/img/slide2.png',
      },
      {
        title: 'How to add wait time?',
        description: 'Click on clock and update wait time, simple!',
        image: 'assets/img/slide3.png',
      }
    ];
  }

  startApp() {
    this.navCtrl.push(HomePage);
    this.storage.set('hasSeenTutorial', 'true');
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd;
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
