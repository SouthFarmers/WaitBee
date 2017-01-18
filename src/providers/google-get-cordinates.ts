import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GoogleGetCordinates {

  data: any;
  constructor(public http: Http) {
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


}
