import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Locations} from "../../providers/locations";


@Component({
  selector: 'page-filters',
  templateUrl: 'filters.html'
})
export class Filters implements OnInit{


  distance: number = 5;
  sortby:string = "distance";
  local:any;
  scale:string='miles';

  constructor(public viewCtrl: ViewController, public storage: Storage, public location : Locations) {

    this.storage.get('radius').then((val) => {
      this.distance = val;
      console.log(val);
    })
    this.storage.get('sort').then((val) => {

      this.sortby = val;
    })

    this.storage.get('scale').then((val) => {

      this.scale = val;
    })
  }

  ngOnInit() {
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  save(){
    this.storage.set('radius', this.distance);
    this.storage.set('sort',this.sortby);
    this.storage.set('scale',this.scale);
    this.location.scale = this.scale;
    this.viewCtrl.dismiss();
  }

}
