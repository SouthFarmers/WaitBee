import { Component, ElementRef, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Locations } from '../../providers/locations';
import { GoogleMaps } from '../../providers/google-maps';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;

  constructor(public maps: GoogleMaps, public platform: Platform, public locations: Locations) {
    console.log("load2");
  }

  ionViewDidLoad(){
console.log("viewdidlolad");
    this.loadmap();

  }

  loadmap(){

    //this.platform.ready().then(() => {
    console.log("load map");
    let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement);


      for(let location of this.locations.data){
        this.maps.addMarker(location.geometry.location.lat, location.geometry.location.lng);

      }


    //});

  }

}
