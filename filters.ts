import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';
import {UserData} from "../../providers/user-data";


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

  constructor(public viewCtrl: ViewController, public userdata: UserData) {

    this.userdata.getUserPrefs().then((val) => {
      console.log(val);
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
    this.userdata.setUserPrefs(this.distance,this.sortby,this.scale,this.openonly);
    this.viewCtrl.dismiss('save');
  }

}
