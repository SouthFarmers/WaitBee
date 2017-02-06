import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {UserData} from "./user-data";

@Injectable()
export class GoogleGetCordinates {

  data: any;
  scale:any;
  constructor(public http: Http, public userdata : UserData) {
    this.data = null;
  }

  getcordinates(address){
    this.data = null;
    if(this.data){
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {

      this.http.get('https://maps.google.com/maps/api/geocode/json?address='+address+'&sensor=false').map(res => res.json()).subscribe(data => {
        this.data = data.results;
        resolve(this.data);
      });

    });

  }

  getCountryName(lat, lng){

    return new Promise(resolve => {

      this.http.get('http://ws.geonames.org/countryCodeJSON?lat='+lat+'&lng='+lng+'&username=demo').map(res => res.json()).subscribe(data => {
        if(data.countryCode == "US"){
          this.scale = 'miles';
        }else{
          this.scale = 'KM';
        }
        this.userdata.setCountryCode(data.countryCode);
        this.userdata.setUserPrefs(1,'distance',this.scale,false);
        resolve(this.data);
      });

    });

  }

}
