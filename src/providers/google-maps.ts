import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Connectivity } from './connectivity';

declare var google;

@Injectable()
export class GoogleMaps {

  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  mapLoadedObserver: any;
  apiKey: string;
  userlat:any;
  userlng:any;

  constructor(public connectivityService: Connectivity) {

  }

  init(mapElement: any, pleaseConnect: any, loc1lat:any, loc1lng:any): Promise<any> {

    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;
    this.userlat = loc1lat;
    this.userlng = loc1lng;

    return this.loadGoogleMaps();

  }

  loadGoogleMaps(): Promise<any> {

    return new Promise((resolve) => {

      if(typeof google == "undefined" || typeof google.maps == "undefined"){

        console.log("Google maps JavaScript needs to be loaded.");
        this.disableMap();

        if(this.connectivityService.isOnline()){

          window['mapInit'] = () => {

            this.initMap().then(() => {
              resolve(true);
            });

            this.enableMap();
          }

          let script = document.createElement("script");
          script.id = "googleMaps";

          if(this.apiKey){
            script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
          } else {
            script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
          }

          document.body.appendChild(script);

        }
      }
      else {

        if(this.connectivityService.isOnline()){
          this.initMap();
          this.enableMap();

        }
        else {
          this.disableMap();
        }

      }

      this.addConnectivityListeners();
    });

  }

  initMap(): Promise<any> {

    this.mapInitialised = true;

    return new Promise((resolve) => {

        let latLng = new google.maps.LatLng(this.userlat, this.userlng);
        let mapOptions = {
          center: latLng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER
          },
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
          },
          scaleControl: true,
          streetViewControl: true,
          streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
          }
        }

        this.map = new google.maps.Map(this.mapElement, mapOptions);
        resolve(true);

    });

  }

  disableMap(): void {

    if(this.pleaseConnect){
      this.pleaseConnect.style.display = "block";
    }

  }

  enableMap(): void {

    if(this.pleaseConnect){

      this.pleaseConnect.style.display = "none";
    }

  }

  addConnectivityListeners(): void {

    document.addEventListener('online', () => {

      console.log("online");

      setTimeout(() => {

        if(typeof google == "undefined" || typeof google.maps == "undefined"){
          this.loadGoogleMaps();
        }
        else {
          if(!this.mapInitialised){
            this.initMap();
          }

          this.enableMap();
        }

      }, 2000);

    }, false);

    document.addEventListener('offline', () => {

      console.log("offline");

      this.disableMap();

    }, false);

  }
}
