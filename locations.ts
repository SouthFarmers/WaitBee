import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {LoadingController} from "ionic-angular";
import {UserData} from "./user-data";

@Injectable()
export class Locations {

  data: any;
  userlat: any;
  userlng: any;
  pagetoken: any;
  type:any;
  scale: any;
  radius: any;
  sortby:any
  showopenonly:any;
  proptypenumber:any;
  searchterm:string='';
  textsearch:string= 'https://maps.googleapis.com/maps/api/place/textsearch/json?location=';
  neabysearch:string='https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=';
  key:string='&key=AIzaSyD_SjvE2iNaEE8gjynWk9KLDJPvXMDrvNc';

  constructor(public http: Http, public loadingCtrl: LoadingController, public userdata : UserData) {
    this.data = null;
  }

  load(type, radius, sortby,scale,showopenonly, proptypenumber) {
    this.type = type;
    this.radius = radius;
    this.sortby = sortby;
    this.scale = scale;
    this.showopenonly = showopenonly;
    this.proptypenumber = proptypenumber;

    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    this.data = null;
    loader.present();

    if (this.data) {
      return Promise.resolve(this.data);

    }

    return new Promise(resolve => {

      //let url2 = 'https://maps.googleapis.com/maps/api/place/textsearch/json?location='+this.userlat+','+this.userlng+'&radius='+radius+'&query='+type+'&key=AIzaSyD_SjvE2iNaEE8gjynWk9KLDJPvXMDrvNc';

      let url
      if(this.proptypenumber === 1 || this.proptypenumber === 4){
        if(this.showopenonly){
          url = this.neabysearch+this.userlat + ',' + this.userlng + '&rankby=distance&opennow=true&type=' + type +this.key;
        }else{
          url = this.neabysearch+this.userlat + ',' + this.userlng + '&rankby=distance&type=' + type +this.key;
        }

      }else if(this.proptypenumber === 3){
         url = this.textsearch+this.userlat + ',' + this.userlng + '&type=airport&query=' + type +this.key;
      }else if(this.proptypenumber === 5){

        url = this.textsearch+this.userlat + ',' + this.userlng + '&type='+this.type+'&query=' + this.searchterm+'&' +this.key;

      }else{
        if(this.showopenonly){
          url = this.textsearch+this.userlat + ',' + this.userlng + '&radius='+(this.radius*1609.34)+'&opennow=true&query=' + type +this.key;
        }else{
          url = this.textsearch+this.userlat + ',' + this.userlng + '&radius='+(this.radius*1609.34)+'&query=' + type +this.key;
        }

      }
      this.http.get(url).map(res => res.json()).subscribe(data => {
          this.data = data.results;
          // if (data.next_page_token) {
          //   let tokenurl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=' + data.next_page_token + '&key=AIzaSyD_SjvE2iNaEE8gjynWk9KLDJPvXMDrvNc';
          //   setTimeout(() => {
          //   this.http.get(tokenurl).map(res => res.json()).subscribe(data2 => {
          //     for(let i = 0; i < data2.results.length; i++){
          //       this.data.push(data2.results[i]);
          //     }
          //     this.refinedata(this.data, sortby);
          //     resolve(this.data);
          //     loader.dismissAll();
          //   })
          //   }, 2000);
          // } else {
          this.refinedata(data.results);
          resolve(this.data);
          loader.dismissAll();
          //}
        },
        (err) => {
          loader.dismissAll();
        });

    });
  }

  applyHaversine(locations) {
    let usersLocation = {
      lat: this.userlat,
      lng: this.userlng
    };

    locations.map((loc) => {

      let placeLocation = {
        lat: loc.geometry.location.lat,
        lng: loc.geometry.location.lng
      };

      loc.distance = this.getDistanceBetweenPoints(
        usersLocation,
        placeLocation,
        this.scale
      ).toFixed(2);
    });

    return locations;
  }

  getDistanceBetweenPoints(start, end, units) {

    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units];
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
    let d = (R * c);

    return d;
  }

  toRad(x) {
    return x * Math.PI / 180;
  }

  filterItems(searchTerm) {
    this.searchterm = searchTerm;
    return this.load(this.type, this.radius, this.sortby,this.scale,this.showopenonly, 5).then(data => {
      console.log(data);
      return data;
    });;
    // return this.data.filter((item) => {
    //   return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    // });
  }

  refinedata(data) {
      this.data = this.applyHaversine(data);
    let i = 0;
      if(this.proptypenumber == 3){
        while (i < data.length) {
          if (!data[i].types.includes("airport") || data[i].name.toLowerCase().includes("terminal") || data[i].name.toLowerCase().includes("parking") || data[i].distance > 50) {
            this.data.splice(i, 1);
          } else {
            i++;
          }
        }
      }else {
        while (i < data.length) {
          if (data[i].distance > this.radius || data[i].types.includes("gas_station") || data[i].name.includes("parking") || data[i].name.includes("convenience_store") ) {
            this.data.splice(i, 1);
          } else {
            i++;
          }
        }
      }
      if (this.sortby == 'distance') {
        this.data.sort((locationA, locationB) => {
          return locationA.distance - locationB.distance;
        });
      } else {
        this.data.sort((locationA, locationB) => {
          return locationB.rating - locationA.rating;
        });
      }
  }
}
