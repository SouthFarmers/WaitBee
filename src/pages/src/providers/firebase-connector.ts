import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';


@Injectable()
export class FirebaseConnector {

  public waittimedb: any;
  public accountinfo: any;
  wait:any;
  constructor(public http: Http) {}

  init() {
    const fbConf = {
      apiKey: "AIzaSyBLgPWw1X2prBa-D99ME63O-bmz0PGA7IU",
      authDomain: "ionic-59245.firebaseapp.com",
      databaseURL: "https://ionic-59245.firebaseio.com",
      storageBucket: "ionic-59245.appspot.com",
      messagingSenderId: "855817323388"
    };
    firebase.initializeApp(fbConf);
    this.waittimedb = firebase.database().ref('/waittimes');
    this.accountinfo = firebase.database().ref('/accountinfo');
  }

  setWaitTime(placeid, time,rush, updatedago){
    this.waittimedb.child(placeid).set({
      time: time,
      rush: rush,
      updatedts: updatedago
    });
  }

  setAccountInfo(userid, name, email, fullname, points){
    this.accountinfo.child(userid).set({
      name: name,
      email: email,
      fullname:fullname,
      points:points
    });
  }

  getWaitTime(placeid){
    return new Promise(resolve => {
        this.waittimedb.child(placeid).on('value', snap => {
          this.wait = snap.val();
          resolve(this.wait);
        },
          (err) =>{
            console.log("");
          });

    });
  }
}
