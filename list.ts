import {Component} from '@angular/core';
import { NavController,FabContainer, ModalController  } from 'ionic-angular';
import { Locations } from '../../providers/locations';
import {Geolocation} from 'ionic-native';
import {PropertyDetailsPage} from "../property-details/property-details";
import { ModalAutocompleteItems } from '../modal-autocomplete-items/modal-autocomplete-items';
import {GoogleGetCordinates} from "../../providers/google-get-cordinates";
import {Filters} from "../filters/filters";
import {UserData} from "../../providers/user-data";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

export class ListPage {

  rest:any;
  theater:any;
  airport:any;
  fun:any;
  proptype:any = 'restaurant';
  proptypenumber:any = 1;
  searchTerm: string = '';
  properties:any;
  tempproperties:any;
  scale:any;
  currentaddr: string="Your Location";
  radius:any;
  sortby:any;
  showopenonly:any;
  propcount:any;

  constructor(public navCtrl: NavController,
              public locations: Locations,
              public modalCtrl: ModalController,
              public getcordinates : GoogleGetCordinates,
              public userdata : UserData) {
    //GoogleAnalytics.trackView("List Page", "", true);

  }

  ionViewDidLoad() {

      this.rest = document.getElementById('rest');
      this.theater = document.getElementById('theater');
      this.airport = document.getElementById('airport');
      this.fun = document.getElementById('fun');
      this.rest.style.backgroundColor = 'red';

      this.userdata.getUserPrefs().then(data => {
        this.radius = data[0].radius;
        this.sortby = data[0].sort;
        this.scale = data[0].scale;
        this.showopenonly = data[0].openonly;
        Geolocation.getCurrentPosition().then((position) => {
          this.locations.userlat = position.coords.latitude;
          this.locations.userlng = position.coords.longitude;
          this.loadLocationsCall();
        });
      })

  }

  ionViewWillEnter(){
    this.properties = this.locations.data;
  }
  doRefresh(refresher) {
    setTimeout(() => {
      this.loadLocationsCall();
      refresher.complete();

    }, 2000);
  }

  itemTapped(event, item) {
    this.navCtrl.push(PropertyDetailsPage, {
      placeid: item.place_id
    });
  }


  changeProperty(fab: FabContainer, value) {
    //GoogleAnalytics.trackEvent("InPage", "ListPage-change-property", value, 1);
    if(value == 1) {
      fab.close();
      this.resetfabcolor();
      this.proptype = 'restaurant';
      this.rest.style.backgroundColor = 'red';
    }else if(value == 2){
      fab.close();
      this.resetfabcolor();
      this.proptype = 'movie_theater';
      this.theater.style.backgroundColor = 'red';
    }else if(value == 3){
      fab.close();
      this.resetfabcolor();
      this.proptype = 'international+airports';
      this.airport.style.backgroundColor = 'red';
    }else if(value == 4){
      fab.close();
      this.resetfabcolor()
      this.proptype = 'amusement_park|aquarium|bowling_alley|zoo';
      this.fun.style.backgroundColor = 'red';
    }
    this.proptypenumber = value;
    this.loadLocationsCall();
  }

  resetfabcolor(){
   this.rest.style.backgroundColor= '#2c3e50';
    this.theater.style.backgroundColor = '#2c3e50';
    this.airport.style.backgroundColor = '#2c3e50';
    this.fun.style.backgroundColor = '#2c3e50';
  }

  changeLocation(){

    let modal = this.modalCtrl.create(ModalAutocompleteItems,{
      currlocation:this.currentaddr
    });
    modal.onDidDismiss(data => {

      if(data && data.description){
        //GoogleAnalytics.trackEvent("InPage", "ListPage-change-location", data.description, 1);
        this.getcordinates.getcordinates(data.description)
          .then(data => {
            this.locations.userlat = data[0].geometry.location.lat;
            this.locations.userlng = data[0].geometry.location.lng;
            this.currentaddr = data[0].formatted_address;
            this.loadLocationsCall();
          });
      }else if(data && data.revert){
        Geolocation.getCurrentPosition().then((position) => {
          this.currentaddr = "Your Location";
          this.locations.userlat = position.coords.latitude;
          this.locations.userlng = position.coords.longitude;
          this.loadLocationsCall();
        });
      }

    })
    modal.present();
  }

  filterlocations() {
    //GoogleAnalytics.trackEvent("InPage", "ListPage-filter-locations", "", 1);
    // this.properties = this.locations.filterItems(this.searchTerm).then(data => {
    //   console.log(data);
    //   this.properties = data;
    //   if(data.length === 0){
    //     this.propcount = true;
    //   }else{this.propcount = false;}
    // });
    if (this.searchTerm) {
      this.locations.searchterm = this.searchTerm;
      this.locations.load(this.proptype, this.radius, this.sortby, this.scale, this.showopenonly, 5)
        .then(data => {
          this.properties = data;
          console.log(data);
          if (data.length === 0) {
            this.propcount = true;
          } else {
            this.propcount = false;
          }
        });
    }else{
      this.properties = this.tempproperties;
    }
  }

  OpenSettings(){
    //GoogleAnalytics.trackEvent("InPage", "ListPage-change-settings", "", 1);
    let modal2 = this.modalCtrl.create(Filters);
    modal2.onDidDismiss(data => {
      if(data){
      this.userdata.getUserPrefs().then(data => {
        this.radius = data[0].radius;
        this.sortby = data[0].sort;
        this.scale = data[0].scale;
        this.showopenonly = data[0].openonly;
        this.loadLocationsCall();
      })
      }
    })
    modal2.present();
  }

  loadLocationsCall(){

      this.locations.load(this.proptype, this.radius, this.sortby,this.scale, this.showopenonly, this.proptypenumber)
        .then(data => {
          this.properties = data;
          this.tempproperties = data;
          if(data.length === 0){
            this.propcount = true;
          }else{this.propcount = false;}
        });

  }
}
