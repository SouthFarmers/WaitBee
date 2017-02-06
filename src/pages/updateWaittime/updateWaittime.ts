import {ViewController, NavParams} from "ionic-angular";
import {Component} from "@angular/core";
@Component({
  template: `
<ion-header>
<ion-title>Update WaitTimes</ion-title>
</ion-header>
    <ion-list class = "waittimecss">
      
      <ion-item class = "waittimecss">
      <ion-label>Update Time</ion-label>
      <ion-datetime displayFormat="HH:mm" pickerFormat="HH mm" [(ngModel)]="waittime"></ion-datetime>
      </ion-item>
      
      <ion-item class = "waittimecss">
      <ion-label>Update Rush level</ion-label>
      <ion-range min="0" max="10" pin="true" step="1" snaps="true" [(ngModel)]="rush" color="secondary">
          <ion-icon range-left  name="person"></ion-icon>
          <ion-icon range-right name="people"></ion-icon>
        </ion-range>
        </ion-item>
    </ion-list>
    <ion-footer>
  <ion-toolbar>
    <ion-buttons >
        <button ion-button color="dark" round (click)="close()">Close</button>
</ion-buttons>
        <ion-buttons end>
        <button ion-button color="dark" round (click)="save()">Done</button>
</ion-buttons>
  </ion-toolbar>
</ion-footer>
  `
})
export class UpdateWaitTime {
  waittime:any;
  rush:number = 0;
  data:any;
  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.waittime = navParams.get('waittime');
    this.rush = navParams.get('rush');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  save(){
    //this.split = this.waittime.split(":");

    this.data = {waittime:this.waittime,rush:this.rush};
    this.viewCtrl.dismiss(this.data);
  }
}
