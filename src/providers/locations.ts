import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {LoadingController} from "ionic-angular";
import {Storage} from '@ionic/storage';

/*
  Generated class for the Locations provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Locations {

  data: any;
  userlat:any;
  userlng:any;
  radius:any;
  sortby:any;
  constructor(public http: Http, public loadingCtrl: LoadingController, public storage: Storage) {


  }

  load(type){
    this.data = null;
    this.storage.get('sort').then((val) => {
      this.sortby = val;
    })
    this.storage.get('radius').then((val) => {
      this.radius = val;

    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();


      console.log("location");
      return new Promise(resolve => {
        console.log(this.radius);
        this.http.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+this.userlat+','+this.userlng+'&radius='+this.radius+'&type='+type+'&key=AIzaSyD_SjvE2iNaEE8gjynWk9KLDJPvXMDrvNc').map(res => res.json()).subscribe(data => {

          this.data = this.applyHaversine(data.results);

          if(this.sortby == 'distance'){
            this.data.sort((locationA, locationB) => {
              return locationA.distance - locationB.distance;
            });
          }else{
            this.data.sort((locationA, locationB) => {
              return locationB.rating - locationA.rating;
            });
          }

          resolve(this.data);
          loader.dismissAll();
        },
          (err) =>{
            loader.dismissAll();
          });

      });
    })
    if(this.data){

      return Promise.resolve(this.data);

    }
  }

  applyHaversine(locations){

    let usersLocation = {
      lat: this.userlat,
      lng:this.userlng
    };

    locations.map((loc) => {

      let placeLocation = {
        lat: loc.geometry.location.lat,
        lng: loc.geometry.location.lng
      };

      loc.distance = this.getDistanceBetweenPoints(
        usersLocation,
        placeLocation,
        'miles'
      ).toFixed(2);
    });

    return locations;
  }

  getDistanceBetweenPoints(start, end, units){

    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

  }

  toRad(x){
    return x * Math.PI / 180;
  }

  filterItems(searchTerm){
    return this.data.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}
