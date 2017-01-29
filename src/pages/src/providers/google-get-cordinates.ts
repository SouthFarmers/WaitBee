import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Storage} from '@ionic/storage';
import {Locations} from "./locations";

@Injectable()
export class GoogleGetCordinates {

  data: any;
  constructor(public http: Http, public storage: Storage, public location : Locations) {
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

      this.http.get('http://ws.geonames.org/countryCodeJSON?lat=41.7&lng=-85.0&username=demo').map(res => res.json()).subscribe(data => {
        this.storage.set('countrycode', data.countryCode);
        if(data.countryCode == "US"){
          this.storage.set('scale', 'miles');
          this.location.scale = 'miles';
        }else{
          this.storage.set('scale', 'KM');
          this.location.scale = 'km';
        }
        resolve(this.data);
      });

    });

  }

}
