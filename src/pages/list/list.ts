import {Component} from '@angular/core';
import { NavController,FabContainer, ModalController  } from 'ionic-angular';
import { Locations } from '../../providers/locations';
import {Geolocation, GoogleAnalytics} from 'ionic-native';
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
  mall:any;
  proptype:any = 'restaurant';
  searchTerm: string = '';
  properties:any;
  scale:any;
  currentaddr: string="Your Location";
  radius:any;
  sortby:any;
  showopenonly:any;

  constructor(public navCtrl: NavController,
              public locations: Locations,
              public modalCtrl: ModalController,
              public getcordinates : GoogleGetCordinates,
              public userdata : UserData) {
    GoogleAnalytics.trackView("List Page", "", true);
  }

  ionViewDidLoad() {

    this.rest = document.getElementById('rest');
    this.theater = document.getElementById('theater');
    this.airport = document.getElementById('airport');
    this.mall = document.getElementById('mall');
    this.rest.style.backgroundColor = 'red';

    this.userdata.getUserPrefs().then(data => {
      this.radius = data[0].radius;
      this.sortby = data[0].sort;
      this.scale = data[0].scale;
      this.showopenonly = data[0].openonly;
    })

    Geolocation.getCurrentPosition().then((position) => {
      this.locations.userlat = position.coords.latitude;
      this.locations.userlng = position.coords.longitude;
      this.loadLocationsCall();
    });

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
    GoogleAnalytics.trackEvent("InPage", "ListPage-change-property", value, 1);
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
      this.proptype = 'airport';
      this.airport.style.backgroundColor = 'red';
    }else if(value == 4){
      fab.close();
      this.resetfabcolor()
      this.proptype = 'shopping_mall';
      this.mall.style.backgroundColor = 'red';
    }
    this.loadLocationsCall();
  }

  resetfabcolor(){
   this.rest.style.backgroundColor= '#2c3e50';
    this.theater.style.backgroundColor = '#2c3e50';
    this.airport.style.backgroundColor = '#2c3e50';
    this.mall.style.backgroundColor = '#2c3e50';
  }

  changeLocation(){

    let modal = this.modalCtrl.create(ModalAutocompleteItems,{
      currlocation:this.currentaddr
    });
    modal.onDidDismiss(data => {

      if(data && data.description){
        GoogleAnalytics.trackEvent("InPage", "ListPage-change-location", data.description, 1);
        this.getcordinates.getcordinates(data.description)
          .then(data => {
            this.locations.userlat = data[0].geometry.location.lat;
            this.locations.userlng = data[0].geometry.location.lng;
            this.currentaddr = data[0].formatted_address;
          });
      }else if(data && data.revert){
        Geolocation.getCurrentPosition().then((position) => {
          this.currentaddr = "Your Location";
          this.locations.userlat = position.coords.latitude;
          this.locations.userlng = position.coords.longitude;
        });
      }
      this.loadLocationsCall();
    })
    modal.present();
  }

  filterlocations() {
    GoogleAnalytics.trackEvent("InPage", "ListPage-filter-locations", "", 1);
    this.properties = this.locations.filterItems(this.searchTerm);
  }

  OpenSettings(){
    GoogleAnalytics.trackEvent("InPage", "ListPage-change-settings", "", 1);
    let modal2 = this.modalCtrl.create(Filters);
    modal2.onDidDismiss(data => {
      this.userdata.getUserPrefs().then(data => {
        this.radius = data[0].radius;
        this.sortby = data[0].sort;
        this.scale = data[0].scale;
        this.showopenonly = data[0].openonly;
        this.loadLocationsCall();
      })
    })
    modal2.present();
  }

  loadLocationsCall(){
      this.locations.load(this.proptype, this.radius, this.sortby,this.scale, this.showopenonly)
        .then(data => {
          this.properties = data;
        });

  }
}
