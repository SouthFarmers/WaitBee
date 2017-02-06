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
  mall:any;
  proptype:any = 'restaurant';
  searchTerm: string = '';
  properties:any;
  scale:any;
  currentaddr: string="Your Location";

  constructor(public navCtrl: NavController,
              public locations: Locations,
              public modalCtrl: ModalController,
              public getcordinates : GoogleGetCordinates,
              public userdata : UserData) {}

  ionViewDidLoad() {

    this.rest = document.getElementById('rest');
    this.theater = document.getElementById('theater');
    this.airport = document.getElementById('airport');
    this.mall = document.getElementById('mall');
    this.rest.style.backgroundColor = 'red';

    this.userdata.getUserPrefs().then(data => {
      this.scale = data[0].scale;
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
    this.properties = this.locations.filterItems(this.searchTerm);
  }

  OpenSettings(){
    let modal2 = this.modalCtrl.create(Filters);
    modal2.onDidDismiss(data => {
      this.loadLocationsCall();
    })
    modal2.present();
  }

  loadLocationsCall(){
    this.locations.load(this.proptype)
      .then(data => {
        this.properties = data;
      });
  }
}
