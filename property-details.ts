import { Component, ViewChild, ElementRef } from '@angular/core';
import {NavController, NavParams, PopoverController, ToastController} from 'ionic-angular';
import {Details} from "../../providers/details";
import {Locations} from "../../providers/locations";
import {UpdateWaitTime} from "../updateWaittime/updateWaittime";
import {Database} from '@ionic/cloud-angular';
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
  waittimeraw:any = "00:00";
  rush:any = '0';
  open247:boolean=false;
  updatedts:any="No updates today";
  sliderOptions = {
    autoplay:5000,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    autoplayDisableOnInteraction:true,
    pager: true
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public details : Details,
              public locations: Locations,
              public popoverCtrl: PopoverController,
              public db: Database,
              public toastCtrl: ToastController,) {
    this.db.connect();
    this.placeID = navParams.get('placeid');
    this.day = new Date().getDay();
   this.loadinfo();
  }

  loadinfo(){

    this.db.collection('waittimes').find(this.placeID).fetch().defaultIfEmpty().subscribe(data => {
      if(data){
        this.rush = data.rush;
        this.waittimeraw = data.time;
        this.waittime = data.time.split(":")[0]+" hours : "+data.time.split(":")[1]+" minutes";
        this.updatedts = moment(data.updatedts).fromNow();
      }
    });

    this.details.loadPlaceDetails(this.placeID)
      .then(data => {
        this.placedetails = data;
        this.placename = data.name;
        this.photourl = [];
        for(let j = 0; j < data.photos.length; j++){
          this.photourl.push('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+data.photos[j].photo_reference+'&key=AIzaSyD_SjvE2iNaEE8gjynWk9KLDJPvXMDrvNc');
        }
        this.rating = data.rating;
        this.reviews = data.reviews;
        this.address = data.formatted_address;
        this.phonenumber = data.formatted_phone_number;
        this.website = data.website;
        this.placelat = data.geometry.location.lat;
        this.placelng = data.geometry.location.lng;
        this.loadmap();
        if(data.opening_hours) {
          this.open247 = false;
          this.todayhours = data.opening_hours.weekday_text.toString().split(',').join('\n');
          this.openstatus = data.opening_hours.open_now;
          if (this.openstatus) {
            if(data.opening_hours.periods.length > 1){
              this.closesnow = this.convertMilitaryTime(data.opening_hours.periods[this.day].close.time);
            }else{
              this.open247 = true;
            }

          } else {
            let hhnow = new Date().getHours();
            try {
              let openingtimetemp = (data.opening_hours.periods[this.day].open.time).substring(0, 2);
              if (hhnow < openingtimetemp) {
                this.opensnow = this.convertMilitaryTime(data.opening_hours.periods[this.day].open.time);
              } else {
                this.opensnow = this.convertMilitaryTime(data.opening_hours.periods[this.day + 1].open.time);
              }
            } catch (ex) {
            }
            this.waittime = "00:00";
            this.rush = '0';
            this.updatedts = 'Closed now'
          }
        }else{
          this.open247 = true;
        }


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
    wtime: this.waittimeraw,
    rush: this.rush
  });
  popover.present();
  popover.onDidDismiss(data => {
    if (data) {
      this.db.collection('waittimes').store({
        id:this.placeID,
        time: data.waittime,
        rush: data.rush,
        updatedts: new Date().valueOf()
      })
      this.waittimeraw = data.waittime;
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
