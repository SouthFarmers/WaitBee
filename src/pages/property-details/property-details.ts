import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Details} from "../../providers/details";
import {Locations} from "../../providers/locations";

/*
  Generated class for the PropertyDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
declare var google;
@Component({
  selector: 'page-property-details',
  templateUrl: 'property-details.html'
})
export class PropertyDetailsPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  placeID:any;
  placedetails:any;
  placename:any;
  placephotourl:any;
  address:any;
  phonenumber:any;
  website:any;
  hours:any;
  todayhours:any;
  day:number;
  placelat:any;
  placelng:any;
  photourl:any;
  reviews:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public details : Details, public locations: Locations) {
    this.placeID = navParams.get('placeid');
    this.day = new Date().getDay();
   this.loadinfo();
  }

  loadinfo(){
    this.details.loadPlaceDetails(this.placeID)
      .then(data => {
        console.log(data);
        this.reviews = data.reviews;
        this.placedetails = data;
        this.placename = data.name;
        this.address = data.formatted_address;
        this.phonenumber = data.formatted_phone_number;
        this.website = data.website;
        this.hours = data.opening_hours.weekday_text;
        this.todayhours = this.hours[this.day-1];
        this.placelat = data.geometry.location.lat;
        this.placelng = data.geometry.location.lng;
        this.photourl = [];
        for(let j = 0; j < data.photos.length; j++){
          this.photourl.push('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+data.photos[j].photo_reference+'&key=AIzaSyD_SjvE2iNaEE8gjynWk9KLDJPvXMDrvNc');
        }
        console.log(data);
        // this.placephotourl = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+data.photos[0].photo_reference+'&key=AIzaSyD_SjvE2iNaEE8gjynWk9KLDJPvXMDrvNc';
        // document.getElementById('header').style.backgroundImage = 'url('+this.placephotourl+')';
        this.loadmap();

      });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PropertyDetailsPage');
  }

  loadmap(){

  let pointA = new google.maps.LatLng(this.locations.userlat, this.locations.userlng);
   // let pointA = {lat: this.locations.userlat, lng: this.locations.userlng};
  let  pointB = new google.maps.LatLng(this.placelat, this.placelng);
   // let pointB = {lat: this.placelat, lng: this.placelng};
  let  myOptions = {
      zoom: 15,
      center: pointA,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, myOptions);

    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer({
      map: this.map
    });
  this.calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
}



  calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
  directionsService.route({
    origin: pointA,
    destination: pointB,
    avoidTolls: true,
    avoidHighways: false,
    travelMode: google.maps.TravelMode.DRIVING
  }, function (response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
}
