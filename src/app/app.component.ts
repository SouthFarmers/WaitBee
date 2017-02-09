import {Component, ViewChild} from '@angular/core';
import {Platform, Nav, Events, MenuController, ModalController, ToastController} from 'ionic-angular';
import {StatusBar, Splashscreen, Geolocation} from 'ionic-native';
import {HomePage} from '../pages/home/home';
import {TutorialPage} from '../pages/tutorial/tutorial';
import {Rating} from '../pages/rating/rating';
import {UserData} from "../providers/user-data";
import {AboutPage} from "../pages/about/about";
import {GoogleGetCordinates} from "../providers/google-get-cordinates";
import {CheckDiagnostics} from "../providers/check-diagnostics";
import {AccountPage} from "../pages/account/account";
import {Database} from '@ionic/cloud-angular';
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
  UserName:string="Please Login";

  constructor(platform: Platform,
              public events: Events,
              public menu: MenuController,
              public userData: UserData,
              public modalCtrl: ModalController,
              public toastCtrl: ToastController,
              public getcordinates : GoogleGetCordinates,
              public checkdiagnostics: CheckDiagnostics,
              public db: Database) {


    platform.ready().then(() => {
      StatusBar.styleDefault();
      this.checkdiagnostics.checkNetwork();
      this.checkdiagnostics.getGPSavaialability();
      this.getUserLoginstatus();
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
        this.nav.setRoot(page.component, {tabIndex: page.index});
    }
  }

  openTutorial() {
    this.nav.setRoot(TutorialPage);
  }

  listenToLoginEvents() {

    this.events.subscribe('user:login', () => {
      console.log('in login events');
      this.enableMenu(true);
      this.getUserLoginstatus();
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
      this.usrimg = "assets/img/slide1.png";
      this.UserName="Please Login"
    });
  }

  enableMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  getUserLoginstatus(){
    console.log('in getuserlogin status method');
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      this.enableMenu(hasLoggedIn === true);
      console.log('in getuserlogin status method');
      if(hasLoggedIn){
        console.log('has logged in');
        this.userData.getuserData().then(data => {
          console.log(data.full_name);
          this.UserName = data.full_name;
          this.usrimg = data.profile_picture;
        })
      }
    });
  }

}
