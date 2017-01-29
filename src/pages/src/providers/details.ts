import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
 Generated class for the Locations provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
@Injectable()
export class Details {

  data: any;
  userlat:any;
  userlng:any;
  constructor(public http: Http) {
    this.data = null;
  }

  loadPlaceDetails(placeid){
    this.data = null;
    if(this.data){
      return Promise.resolve(this.data);
    }

    return new Promise(resolve => {

      this.http.get('https://maps.googleapis.com/maps/api/place/details/json?placeid='+placeid+'&key=AIzaSyD_SjvE2iNaEE8gjynWk9KLDJPvXMDrvNc').map(res => res.json()).subscribe(data => {
        this.data = data.result;

        resolve(this.data);
      });

    });

  }


}
