import { Component } from '@angular/core';
import { NavController, NavParams,FabContainer } from 'ionic-angular';
import { Locations } from '../../providers/locations';
import {Geolocation} from 'ionic-native';
import {PropertyDetailsPage} from "../property-details/property-details";
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
  constructor(public navCtrl: NavController, public navParams: NavParams,public locations: Locations) {}

  ionViewDidLoad() {
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

  }

  filterlocations() {
    this.locations.filterItems(this.searchTerm);
  }
}
