import { Component, ElementRef, ViewChild } from '@angular/core';
import {Platform, NavController, Slides} from 'ionic-angular';
import { Locations } from '../../providers/locations';
import { GoogleMaps } from '../../providers/google-maps';
import {UserData} from "../../providers/user-data";
import {PropertyDetailsPage} from "../property-details/property-details";

declare var google;
@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('showSlider') slider: Slides;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  properties:any;
  markers: any = [];
  redhex:string='FF776B';
  bluehex:string='0000ff';
  scale:any;
  sliderOptions= {
    spaceBetween: 10,
    centeredSlides:true,
    slidesPerView:2
  };
  constructor(public maps: GoogleMaps, public navCtrl: NavController,public platform: Platform, public locations: Locations,public userdata : UserData) {
  }

  ionViewDidLoad(){

    this.userdata.getUserPrefs().then(data => {
      this.scale = data[0].scale;
    })
    this.properties = this.locations.data;
    this.loadmap();
  }


  loadmap(){

    //this.platform.ready().then(() => {
    this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement, this.properties[0].geometry.location.lat,  this.properties[0].geometry.location.lng);

      this.setmarkers();
    //});
  }

  setmarkers(){


    for(let location of this.properties){
      let latLng = {lat: location.geometry.location.lat, lng: location.geometry.location.lng};
       let iconnum = this.properties.indexOf(location) + 1;
       let markercolor;
       if(this.properties.indexOf(location) == 0){
         markercolor = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+iconnum+'|'+this.bluehex+'|000000';
       }else{
         markercolor = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+iconnum+'|'+this.redhex+'|000000';
       }

      let marker = new google.maps.Marker({
        map: this.maps.map,
        position: latLng,
        icon: markercolor,
        iconnum: this.properties.indexOf(location)
      });
      this.markers.push(marker);

      google.maps.event.addListener(marker, 'click', () => {
        this.slider.getSlider().update();
        this.slider.getSlider().slideTo(marker.iconnum, 0, true);
      });
    }
  }

  itemTapped(event, item) {
    this.navCtrl.push(PropertyDetailsPage, {
      placeid: item.place_id
    });
  }

  onSlideChange(){
    this.setmarkerColor();
  }

  setmarkerColor(){
    for(let i = 0; i<this.markers.length; i++){
      this.markers[i].setIcon('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+(i+1)+'|'+this.redhex+'|000000');
    }
    let newiconnumber = this.slider.getActiveIndex()+1;
    this.maps.map.panTo(this.markers[this.slider.getActiveIndex()].getPosition());
    this.markers[this.slider.getActiveIndex()].setIcon('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+newiconnumber+'|'+this.bluehex+'|000000');
  }
}
