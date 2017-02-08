import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {Locations} from "../../providers/locations";
import {UserData} from "../../providers/user-data";


@Component({
  selector: 'page-filters',
  templateUrl: 'filters.html'
})
export class Filters implements OnInit{


  distance: number = 5;
  sortby:string = "distance";
  scale:string='miles';
  openonly:any = false;

  constructor(public viewCtrl: ViewController, public location : Locations, public userdata:UserData) {

    this.userdata.getUserPrefs().then(data => {

      this.distance = data[0].radius;
      this.sortby = data[0].sort;
      this.scale = data[0].scale;
      this.openonly = data[0].openonly;
    })
  }

  ngOnInit() {
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  save(){
    this.userdata.setUserPrefs(this.distance,this.sortby,this.scale,this.openonly);
    this.viewCtrl.dismiss();
  }

}
