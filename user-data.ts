import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserData {
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  HAS_RADIUS_SET = 'radius';
  SCALE_FLAG:string = 'scale';
  SORT_FLAG:string = 'sort';
  RADIUS_FLAG:string = 'radius';
  userpref:any = [];
  USER_PREF:string = 'user_pref';
  USER_OBJ:string = 'user_data_obj';
  COUNTRY_CODE:string = 'country_code';
  userobj:any = [];

  constructor(public events: Events, public storage: Storage) {}

  getuserData(){
    return this.storage.get(this.USER_OBJ).then((value) => {
      return value;
    });
  }

  storeUserData(data){
    this.storage.set(this.USER_OBJ, data);
  }

  checkHasSeenTutorial() {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    })
  };

  setCountryCode(code){
    this.storage.set(this.COUNTRY_CODE, code);
  }

  getCountryCode(){
    return this.storage.get(this.COUNTRY_CODE).then((value) => {
      return value;
    })
  }

  setUserPrefs(radius, sortby, scale, openonly){
    this.userpref = [];
    this.userpref.push({
      scale:scale,
      radius:radius,
      sort:sortby,
      openonly:openonly
    });
    this.storage.set(this.USER_PREF, this.userpref);
  }

  getUserPrefs(){
    return this.storage.get(this.USER_PREF).then((value) => {
      return value;
    })
  }
}
