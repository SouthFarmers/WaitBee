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
  openonly:any = false;
  userpref:any;

  constructor(public viewCtrl: ViewController, public storage: Storage, public location : Locations) {

    this.storage.get('userpref').then((val) => {
      this.distance = val[0].radius;
      this.sortby = val[0].sort;
      this.scale = val[0].scale;
      this.openonly = val[0].openonly;
    })
  }

  ngOnInit() {
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  save(){
    this.userpref.push({
      scale:this.scale,
      radius:this.distance,
      sort:this.sortby,
      openonly:this.openonly
    });
    this.storage.set('userpref', this.userpref);
    this.viewCtrl.dismiss('save');
  }

}
