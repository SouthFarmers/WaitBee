import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, Events, MenuController, ModalController, ToastController, NavController} from 'ionic-angular';
import {StatusBar, Splashscreen, Geolocation} from 'ionic-native';
import {HomePage} from '../pages/home/home';
import {TutorialPage} from '../pages/tutorial/tutorial';
import {Rating} from '../pages/rating/rating';
import {UserData} from "../providers/user-data";
import {AboutPage} from "../pages/about/about";
import {GoogleGetCordinates} from "../providers/google-get-cordinates";
import {CheckDiagnostics} from "../providers/check-diagnostics";
import {AccountPage} from "../pages/account/account";
import {SocialsharingPage} from "../pages/socialsharing/socialsharing";

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
    {title: 'Account', component: AccountPage, icon: 'person'},
    {title: 'About Us', component: AboutPage, icon: 'information-circle'},
    {title: 'Rate US', component: '', icon: 'star-half'},
    {title: 'Feed Back', component: Rating, icon: 'chatboxes'},
    {title: 'Show Love', component: SocialsharingPage, icon: 'heart'}
  ];
  loggedOutPages: PageInterface[] = [
    {title: 'Login', component: AccountPage, icon: 'log-in'},
    {title: 'About Us', component: AboutPage, icon: 'information-circle'},
    {title: 'Rate US', component: '', icon: 'star-half'},
    {title: 'Feed Back', component: Rating, icon: 'chatboxes'},
    {title: 'Show Love', component: SocialsharingPage, icon: 'heart'}
  ];
  rootPage: any;
  usrimg:string = "assets/img/slide1.png";
  UserName:string="Hello";

  constructor(platform: Platform,
              public events: Events,
              public menu: MenuController,
              public userData: UserData,
              public modalCtrl: ModalController,
              public toastCtrl: ToastController,
              public getcordinates : GoogleGetCordinates,
              public checkdiagnostics: CheckDiagnostics) {

    platform.ready().then(() => {
      StatusBar.styleDefault();
      this.checkdiagnostics.checkNetwork();
      this.checkdiagnostics.getGPSavaialability();
      this.greetUser();
      this.userData.checkHasSeenTutorial().then((hasSeenTutorial) => {
        if (hasSeenTutorial === null) {
          Geolocation.getCurrentPosition().then((position) => {
            this.getcordinates.getCountryName(position.coords.latitude,position.coords.longitude);
          })
          this.rootPage = TutorialPage;
        } else {
          this.rootPage = HomePage;
        }
      });
      Splashscreen.hide();
    });
    this.listenToLoginEvents();
  }

  openPage(page: PageInterface) {
    if(page.title == 'Rate US') {
      let toast = this.toastCtrl.create({
        message: 'This will goto App store/Play store after deployment',
        duration: 4000,
        position: 'bottom'
      });
      toast.present(toast);
    }else if(page.title == 'Show Love') {
      let modal = this.modalCtrl.create(SocialsharingPage);
      modal.present();
    }else{
        this.nav.push(page.component, {tabIndex: page.index});
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

  greetUser(){
    let hours = new Date().getHours();
    if(hours >= 0 && hours < 12){
      this.UserName = "Good Morning";
    }else if(hours >= 12 && hours < 17){
      this.UserName = "Good Afternoon";
    }else{
      this.UserName = "Good Evening";
    }

    this.userData.getuserData().then(data => {
      if (data) {
          this.enableMenu(true);
      }
    })
  }

}
