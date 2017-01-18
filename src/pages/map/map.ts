import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Locations } from '../../providers/locations';
import { GoogleMaps } from '../../providers/google-maps';
import {Geolocation} from 'ionic-native';
/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  constructor(public navCtrl: NavController, public maps: GoogleMaps, public platform: Platform, public locations: Locations) {

  }

  ionViewDidLoad(){

    Geolocation.getCurrentPosition().then((position) => {
            this.locations.userlat = position.coords.latitude;
            this.locations.userlng = position.coords.longitude;
            this.loadmap();
          });



  }

  loadmap(){

    //this.platform.ready().then(() => {

    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);
    let locationsLoaded = this.locations.load('restaurant');

    Promise.all([
      locationsLoaded
    ]).then((result) => {
      let locations = result[0];

      for(let location of locations){
        console.log(location);
        this.maps.addMarker(location, location.geometry.location.lng);

      }

    });

    //});

  }

}
