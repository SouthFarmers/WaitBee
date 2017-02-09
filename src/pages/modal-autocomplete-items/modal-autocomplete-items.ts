import { Component, OnInit } from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';
import {Storage} from '@ionic/storage';

declare var google: any;

@Component({
  selector: 'page-modal-autocomplete-items',
  templateUrl: 'modal-autocomplete-items.html'
})
export class ModalAutocompleteItems implements OnInit{

  autocompleteItems: any;
  autocomplete: any;
  acService:any;
  placesService: any;
  currentaddr:any;
  currentlocation:any;
  countrycode:string="";

  constructor(public viewCtrl: ViewController, public navParams: NavParams, public storage: Storage) {
    this.currentlocation = navParams.get('currlocation');
  }

  ngOnInit() {
    this.storage.get('countrycode').then((val) => {
      this.countrycode = val;
    })
    this.acService = new google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    this.currentlocation = item.description;
    this.viewCtrl.dismiss(item);
  }

  updateSearch() {
    if (this.autocomplete.query == '') {
      console.log('empty serch');
      this.autocompleteItems = [];
      return;
    }
    let self = this;
    let config = {
      types:  ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
      input: this.autocomplete.query,
      componentRestrictions: { country: this.countrycode }
    }
    this.acService.getPlacePredictions(config, function (predictions, status) {
      console.log('search');
      console.log(predictions);
      self.autocompleteItems = [];
      if(predictions != null) {
        predictions.forEach(function (prediction) {
          self.autocompleteItems.push(prediction);
        });
      }
    });
  }

  getCurrentLocation(){
    let data = {revert:"current"};
    this.viewCtrl.dismiss(data);
  }

}
