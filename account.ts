import {Component} from '@angular/core';
import {NavController, Events, ToastController} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {HomePage} from "../home/home";
import {UserData} from "../../providers/user-data";
import {Database} from '@ionic/cloud-angular';
import {GoogleAuth, User, FacebookAuth} from '@ionic/cloud-angular';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {

  loggedin: any = false;
  USER_OBJ: string = 'user_data_obj';
  //levelpic:any = 'assets/img/baby.png';
  points: any = 100;
  nextlevel: any = 99;
  fblogin: boolean = false;
  glogin: boolean = false;
  userdataobj:any = [];

  constructor(public events: Events,
              public toastCtrl: ToastController,
              public navCtrl: NavController,
              public storage: Storage,
              public userData: UserData,
              public googleAuth: GoogleAuth,
              public facebookAuth: FacebookAuth,
              public user: User,
              public db: Database) {
    
    this.userData.getuserData().then(data => {
      if (data) {
        this.db.collection('users').find(data.id).fetch().defaultIfEmpty().subscribe(data2 => {
          if (data2) {
            this.userdataobj = {
              id: data2.uid,
              full_name: data2.full_name,
              profile_picture: data2.profile_picture,
              email: data2.email
            }
            this.enableDiv(true);
          }
        });
      }
    })

    // if (this.points < 100) {
    //   this.levelpic = 'assets/img/baby.png'
    //   this.nextlevel = 100 - this.points;
    // } else if (this.points >= 100 && this.points < 500) {
    //   this.levelpic = 'assets/img/young.png'
    //   this.nextlevel = 500 - this.points;
    // } else if (this.points >= 500 && this.points < 1000) {
    //   this.levelpic = 'assets/img/master.png'
    //   this.nextlevel = 1000 - this.points;
    // } else if (this.points >= 1000 && this.points < 2000) {
    //   this.levelpic = 'assets/img/king.png'
    //   this.nextlevel = 2000 - this.points;
    // }

  }

  ionViewDidLoad() {
  }

  dismiss() {
    this.navCtrl.push(HomePage);
    this.navCtrl.setRoot(HomePage);
  }

  logout() {
    this.storage.remove(this.USER_OBJ);
    this.events.publish('user:logout');
    this.enableDiv(false);
    if (this.glogin) {this.googleAuth.logout();}
    if (this.fblogin) {this.facebookAuth.logout();}
    let toast = this.toastCtrl.create({
      message: 'Logout Successful',
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
  }

  googleLogin() {

    this.googleAuth.login().then(data => {
      this.fblogin = false;
      this.glogin = true;
      this.afterLoginCycle(this.user.social.google);
    });
  }

  fbLogin() {
    this.facebookAuth.login().then(data => {
      this.fblogin = true;
      this.glogin = false;
      this.afterLoginCycle(this.user.social.facebook);
    });

  }

  enableDiv(logIn) {
    if (logIn) {
      this.loggedin = true;
    } else {
      this.loggedin = false;
    }
  }

  afterLoginCycle(obj) {
    this.userdataobj = {
      id: obj.uid,
      full_name: obj.data.full_name,
      profile_picture: obj.data.profile_picture,
      email: obj.data.email
    }
    this.enableDiv(true);
    this.userData.storeUserData(this.userdataobj);
    this.events.publish('user:login');
    this.db.collection('users').store(this.userdataobj);
    let toast = this.toastCtrl.create({
      message: 'Login Successful',
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
  }
}
