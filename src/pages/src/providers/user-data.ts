import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {GooglePlus} from "ionic-native";


@Injectable()
export class UserData {
  _favorites = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  HAS_RADIUS_SET = 'radius';
  userName:string;
  userImg:string;
  userEmail:string;
  SCALE_FLAG:string = 'scale';
  SORT_FLAG:string = 'sort';
  RADIUS_FLAG:string = 'radius';

  constructor(public events: Events, public storage: Storage) {}


  login() {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.events.publish('user:login');
    let permissions =  {'webClientId':  "482761909765-2uid59kqkpel8r9nebbt5aha6praumpf.apps.googleusercontent.com" } ;
    return GooglePlus.login( permissions )
      .then( (res) => {
        this.userEmail = res.email;
        this.userImg = res.imageUrl;
        this.userName = res.displayName;
      });

  };

  logout() {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.events.publish('user:logout');
    GooglePlus.logout();
  };

  setUsername(username) {
    this.storage.set('username', username);
  };

  getUsername() {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };

  // return a promise
  hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial() {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    })
  };

  checkHasRadiusSet() {
    return this.storage.get(this.HAS_RADIUS_SET).then((value) => {
      return value;
    })
  };

  setRadius(radius){
    this.storage.set('radius', radius);
  }

  setSort(sort){
    this.storage.set('sort', sort);
  }

  getScale(){
    return this.storage.get(this.SCALE_FLAG).then((value) => {
      return value;
    })
  }

  getRadius(){
    return this.storage.get(this.RADIUS_FLAG).then((value) => {
      return value;
    })
  }

  getSortby(){
    return this.storage.get(this.SORT_FLAG).then((value) => {
      return value;
    })
  }
}
