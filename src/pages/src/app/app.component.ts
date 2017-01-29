import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, Events, MenuController, ModalController} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {Storage} from '@ionic/storage';
import {HomePage} from '../pages/home/home';
import {TutorialPage} from '../pages/tutorial/tutorial';
import {Rating} from '../pages/rating/rating';
import {UserData} from "../providers/user-data";
import { ToastController } from 'ionic-angular';
import {AboutPage} from "../pages/about/about";
import {Filters} from "../pages/filters/filters";
import {Geolocation} from 'ionic-native';
import {GoogleGetCordinates} from "../providers/google-get-cordinates";
import {FirebaseConnector} from "../providers/firebase-connector";

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
}
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  loggedInPages: PageInterface[] = [
    {title: 'Filters', component: Filters, icon: 'funnel'},
    {title: 'About Us', component: AboutPage, icon: 'information-circle'},
    {title: 'Rate US', component: '', icon: 'star-half'},
    {title: 'Feed Back', component: Rating, icon: 'chatboxes'},
    {title: 'Logout', component: HomePage, icon: 'log-out', logsOut: true}
  ];
  loggedOutPages: PageInterface[] = [
    {title: 'Login', component: '', icon: 'log-in'},
    {title: 'Filters', component: Filters, icon: 'funnel'},
    {title: 'About Us', component: AboutPage, icon: 'information-circle'},
    {title: 'Rate US', component: '', icon: 'star-half'},
    {title: 'Feed Back', component: Rating, icon: 'chatboxes'}
  ];
  rootPage: any;
  usrimg:string = "assets/img/slide1.png";
  UserName:string="User";

  constructor(platform: Platform,
              public events: Events,
              public menu: MenuController,
              public userData: UserData,
              public storage: Storage,
              public modalCtrl: ModalController,
              public toastCtrl: ToastController,
              public getcordinates : GoogleGetCordinates,
              public firebase:FirebaseConnector) {


    //this.firebase.init();
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
    this.userData.checkHasRadiusSet().then((hasradiusset) => {
      if(hasradiusset === null){
        this.userData.setRadius(1);
        this.userData.setSort('distance');
      }
    })
    this.userData.checkHasSeenTutorial().then((hasSeenTutorial) => {
      if (hasSeenTutorial === null) {
        Geolocation.getCurrentPosition().then((position) => {
          this.getcordinates.getCountryName(position.coords.latitude,position.coords.longitude);
        })
        // User has not seen tutorial
        this.rootPage = TutorialPage;
      } else {
        // User has seen tutorial
        this.rootPage = HomePage;
      }
    });

    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
    });

    this.listenToLoginEvents();
  }

  openPage(page: PageInterface) {
    if(page.title == 'Login'){

      this.userData.login().then(res =>{
        this.usrimg = this.userData.userImg;
        this.UserName = this.userData.userName;

          let toast = this.toastCtrl.create({
            message: 'Login Successful',
            duration: 2000,
            position: 'bottom'
          });
          toast.present(toast);
      })
    }else if(page.title == 'Logout'){

        this.userData.logout();
          let toast = this.toastCtrl.create({
            message: 'Logout Successful',
            duration: 2000,
            position: 'bottom'
          });
          toast.present(toast);

    } else if(page.title == 'Filters') {
      let modal2 = this.modalCtrl.create(Filters);
      modal2.present();
    }else if(page.title == 'Rate US') {
      let toast = this.toastCtrl.create({
        message: 'This will goto App store/Play store after deployment',
        duration: 4000,
        position: 'bottom'
      });
      toast.present(toast);
    }else{
        this.nav.setRoot(page.component, {tabIndex: page.index});
    }
  }

  openTutorial() {
    this.nav.setRoot(TutorialPage);
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

}
