import { Component } from '@angular/core';
import { AlertController, NavController, NavParams,FabContainer, ModalController  } from 'ionic-angular';
import { Locations } from '../../providers/locations';
import {Geolocation} from 'ionic-native';
import {PropertyDetailsPage} from "../property-details/property-details";
import { ModalAutocompleteItems } from '../modal-autocomplete-items/modal-autocomplete-items';
import {GoogleGetCordinates} from "../../providers/google-get-cordinates";
import {Filters} from "../filters/filters";
import {Storage} from "@ionic/storage";
/*
  Generated class for the List page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})

export class ListPage {

  fabcolor:any;
  rest:any;
  theater:any;
  airport:any;
  mall:any;
  proptype:any = 'restaurant';
  searchTerm: string = '';
  newlocation:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public locations: Locations, public alertCtrl: AlertController,
              public modalCtrl: ModalController,public getcordinates : GoogleGetCordinates, public storage: Storage) {}

  ionViewDidLoad() {
    this.storage.set('radius', 5*1609.344);
    this.storage.set('sort','distance');
    this.rest = document.getElementById('rest');
    this.theater = document.getElementById('theater');
    this.airport = document.getElementById('airport');
    this.mall = document.getElementById('mall');

    Geolocation.getCurrentPosition().then((position) => {
      this.locations.userlat = position.coords.latitude;
      this.locations.userlng = position.coords.longitude;
      this.locations.load(this.proptype);
    });

  }

  doRefresh(refresher) {

    setTimeout(() => {
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

    this.locations.load(this.proptype);
  }

  resetfabcolor(){
    this.rest.style.backgroundColor= 'none';
    this.theater.style.backgroundColor = 'none';
    this.airport.style.backgroundColor = 'none';
    this.mall.style.backgroundColor = 'none';
  }

  changeLocation(){
    let modal = this.modalCtrl.create(ModalAutocompleteItems);
    modal.onDidDismiss(data => {
      if(data){
        this.getcordinates.getcordinates(data.description)
          .then(data => {
            this.locations.userlat = data[0].geometry.location.lat;
            this.locations.userlng = data[0].geometry.location.lng;
            this.locations.load(this.proptype);
          });
      }
    })
    modal.present();
  }

  filterlocations() {
    this.locations.filterItems(this.searchTerm);
  }

  OpenSettings(){
    let modal2 = this.modalCtrl.create(Filters);
    modal2.onDidDismiss(data => {
      this.storage.get('sort').then((val) => {
        this.locations.load(this.proptype);
        console.log(val);
      })
    })
    modal2.present();
  }
}
