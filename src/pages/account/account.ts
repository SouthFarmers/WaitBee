import {Component} from '@angular/core';
import {NavController, Events, ToastController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {HomePage} from "../home/home";
import {UserData} from "../../providers/user-data";
import {Database} from '@ionic/cloud-angular';
import { GoogleAuth, User ,FacebookAuth} from '@ionic/cloud-angular';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {

  userinfo:any;
  full_name:any;
  profile_picture:any;
  email:any;
  HAS_LOGGED_IN = 'hasLoggedIn';
  loggedin:any = false;
  USER_OBJ:string = 'user_data_obj';
  levelpic:any = 'assets/img/baby.png';
  points:any;
  nextlevel:any;
  fblogin:boolean = false;
  glogin:boolean = false;
  constructor(public events: Events,
              public toastCtrl: ToastController,
              public navCtrl: NavController,
              public storage: Storage,
              public userData: UserData,
              public googleAuth: GoogleAuth,
              public facebookAuth: FacebookAuth,
              public user: User,
              public db: Database) {

    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      if(hasLoggedIn) {
        this.userData.getuserData().then(data =>{
          this.db.collection('users').find(data.id).fetch().defaultIfEmpty().subscribe(data2 => {
            if(data2){
              this.full_name = data2.full_name;
              this.email = data2.email;
              this.profile_picture = data2.profile_picture;
            }
          });
        })
        this.enableDiv(true);
        this.points = 387;
    if (this.points < 100) {
      this.levelpic = 'assets/img/baby.png'
      this.nextlevel = 100 - this.points;
    } else if (this.points >= 100 && this.points < 500) {
      this.levelpic = 'assets/img/young.png'
      this.nextlevel = 500 - this.points;
    } else if (this.points >= 500 && this.points < 1000) {
      this.levelpic = 'assets/img/master.png'
      this.nextlevel = 1000 - this.points;
    } else if (this.points >= 1000 && this.points < 2000) {
      this.levelpic = 'assets/img/king.png'
      this.nextlevel = 2000 - this.points;
    }
      }
    });
  }

  ionViewDidLoad() {
  }

  dismiss(){
    this.navCtrl.push(HomePage);
    this.navCtrl.setRoot(HomePage);
  }

  logout(){
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove(this.USER_OBJ);
    this.events.publish('user:logout');
    this.enableDiv(false);
if(this.glogin){
    this.googleAuth.logout().then( data => {
      let toast = this.toastCtrl.create({
        message: 'Logout Successful',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);

    })
  }
  if(this.fblogin){
    this.facebookAuth.logout().then( data => {
      let toast = this.toastCtrl.create({
        message: 'Logout Successful',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
    });
   }
  }

  googleLogin(){

    this.googleAuth.login().then( data => {
      this.fblogin = false;
      this.glogin = true;
      this.afterLoginCycle(this.user.social.google);
    } );
  }

  fbLogin(){
    this.facebookAuth.login().then( data => {
      this.fblogin = true;
      this.glogin = false;
      this.afterLoginCycle(this.user.social.facebook);
    } );

  }

  enableDiv(logIn) {
    if(logIn){
      this.loggedin = true;
    }else{
      this.loggedin = false;
    }
  }

  afterLoginCycle(obj){

    this.full_name = obj.data.full_name;
    this.profile_picture = obj.data.profile_picture;
    this.email = obj.data.email;
    let userobj = {id:obj.uid,
                  full_name:this.full_name,
                  profile_picture:this.profile_picture,
                  email:this.email}
    this.enableDiv(true);
    this.userData.storeUserData(userobj);
    this.storage.set(this.HAS_LOGGED_IN, true).then(data => {
      this.events.publish('user:login');
    });
    this.db.collection('users').insert(userobj);
    let toast = this.toastCtrl.create({
      message: 'Login Successful',
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
  }
}
