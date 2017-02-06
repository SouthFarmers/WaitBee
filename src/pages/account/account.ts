import {Component} from '@angular/core';
import {NavController, Events, ToastController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {HomePage} from "../home/home";
import {UserData} from "../../providers/user-data";
import { GoogleAuth, User } from '@ionic/cloud-angular';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {

  userinfo:any;
  HAS_LOGGED_IN = 'hasLoggedIn';
  loggedin:any = false;
  USER_OBJ:string = 'user_data_obj';
  constructor(public events: Events,
              public toastCtrl: ToastController,
              public navCtrl: NavController,
              public storage: Storage,
              public userData: UserData,
              public googleAuth: GoogleAuth,
              public user: User) {

    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      if(hasLoggedIn) {
        this.userData.getuserDate().then(data =>{
          this.userinfo = data;
        })
        this.enableDiv(true);
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

  dismiss(){
    this.navCtrl.push(HomePage);
    this.navCtrl.setRoot(HomePage);
  }

  logout(){

    this.googleAuth.logout().then( data => {
      let toast = this.toastCtrl.create({
        message: 'Logout Successful',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
      this.storage.remove(this.HAS_LOGGED_IN);
      this.storage.remove(this.USER_OBJ);
      this.events.publish('user:logout');
      this.enableDiv(false);
    })
  }

  googleLogin(){

    this.googleAuth.login().then( data => {
      this.userData.storeUserData(this.user.social.google.data);
      this.userinfo = this.user.social.google.data;
      this.storage.set(this.HAS_LOGGED_IN, true);
      this.events.publish('user:login');
      let toast = this.toastCtrl.create({
        message: 'Login Successful',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);

    } );




  }

  fbLogin(){

  }

  enableDiv(logIn) {
    if(logIn){
      this.loggedin = true;
    }else{
      this.loggedin = false;
    }
  }
}
