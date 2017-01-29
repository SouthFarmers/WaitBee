import { Component, ViewChild, ElementRef } from '@angular/core';
import {NavController, NavParams, PopoverController, ToastController} from 'ionic-angular';
import {Details} from "../../providers/details";
import {Locations} from "../../providers/locations";
import {UpdateWaitTime} from "../updateWaittime/updateWaittime";
import {FirebaseConnector} from "../../providers/firebase-connector";
import * as moment from "moment";

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
  todayhours:string;
  openstatus:any;
  opensnow:any;
  closesnow:any;
  showfullhours:boolean=false;
  day:number;
  placelat:any;
  placelng:any;
  photourl:any;
  reviews:any;
  rating:any;
  firebundle:any;
  waittime:any = "00:00";
  rush:any = '0';
  updatedts:any="No updates today";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public details : Details,
              public locations: Locations,
              public popoverCtrl: PopoverController,
              public firebase:FirebaseConnector,
              public toastCtrl: ToastController,) {
    this.placeID = navParams.get('placeid');
    this.day = new Date().getDay();
   this.loadinfo();
  }

  loadinfo(){

    // this.firebase.getWaitTime(this.placeID).then(data =>{
    //   this.firebundle = data;
    //   this.rush = this.firebundle.rush;
    //   this.waittime = this.firebundle.time.split(":")[0]+" hours : "+this.firebundle.time.split(":")[0]+" minutes";
    //   this.updatedts = moment(this.firebundle.updatedts).fromNow();
    // });

    this.details.loadPlaceDetails(this.placeID)
      .then(data => {
        this.reviews = data.reviews;
        this.placedetails = data;
        this.placename = data.name;
        this.address = data.formatted_address;
        this.phonenumber = data.formatted_phone_number;
        this.website = data.website;
        this.hours = data.opening_hours.weekday_text.toString().split(',').join('\n');
        this.openstatus = data.opening_hours.open_now;
        if(this.openstatus){
          this.closesnow = this.convertMilitaryTime(data.opening_hours.periods[this.day].close.time);
        }else{
          let hhnow = new Date().getHours();
          let openingtimetemp = (data.opening_hours.periods[this.day].open.time).substring(0,2);
          if(hhnow < openingtimetemp){
            this.opensnow = this.convertMilitaryTime(data.opening_hours.periods[this.day].open.time);
          }else{
            this.opensnow = this.convertMilitaryTime(data.opening_hours.periods[this.day+1].open.time);
          }
          this.waittime = "00:00";
          this.rush='0';
          this.updatedts='Closed now'
        }
        this.todayhours = this.hours;
        this.placelat = data.geometry.location.lat;
        this.placelng = data.geometry.location.lng;
        this.rating = data.rating;
        this.photourl = [];
        for(let j = 0; j < data.photos.length; j++){
          this.photourl.push('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+data.photos[j].photo_reference+'&key=AIzaSyD_SjvE2iNaEE8gjynWk9KLDJPvXMDrvNc');
        }
        this.loadmap();

      });
  }


  ionViewDidLoad() {

  }

  loadmap(){

  let pointA = new google.maps.LatLng(this.locations.userlat, this.locations.userlng);
  let  pointB = new google.maps.LatLng(this.placelat, this.placelng);
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

  AddWaitTime() {
if(this.openstatus) {
  let popover = this.popoverCtrl.create(UpdateWaitTime, {
    waittime: this.waittime,
    rush: this.rush
  });
  popover.present();
  popover.onDidDismiss(data => {
    if (data) {
      this.firebase.setWaitTime(this.placeID, data.waittime, data.rush, new Date().valueOf());
      this.waittime = data.waittime.split(":")[0] + " hours : " + data.waittime.split(":")[0] + " minutes";
      this.rush = data.rush;
      this.updatedts = moment(new Date().valueOf()).fromNow();
    }
  })
}else{
  let toast = this.toastCtrl.create({
    message: 'Can\'\t do that, closed now',
    duration: 2000,
    position: 'bottom'
  });
  toast.present(toast);
}
  }

  convertMilitaryTime(time){
    var hours24 = parseInt(time.substring(0, 2),10);
    var hours = ((hours24 + 11) % 12) + 1;
    var amPm = hours24 > 11 ? 'pm' : 'am';
    var minutes = time.substring(2);

    return hours + ':' + minutes + amPm;
  }

  showFullTimingList(){
    this.showfullhours = this.showfullhours ? false : true;
  }
}
