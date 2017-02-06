import {Network} from 'ionic-native';
import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {AlertController} from "ionic-angular";
import { Diagnostic } from 'ionic-native';


@Injectable()
export class CheckDiagnostics {
  constructor(private http: Http,public alertCtrl: AlertController) {
  }

  checkNetwork() {
    Network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-( ');
      this.showNetworkAlert();
    });


    Network.onConnect().subscribe(() => {
      console.log('network connected!');
    });

  }

  showNetworkAlert() {
    let networkAlert = this.alertCtrl.create({
      title: 'No Internet Connection',
      message: 'Please check your internet connection.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {}
        },
        {
          text: 'Open Settings',
          handler: () => {
            networkAlert.dismiss().then(() => {
              //this.showSettings();
              Diagnostic.switchToWifiSettings();
            })
          }
        }
      ]
    });
    networkAlert.present();
  }

  getGPSavaialability() {
    let successLocationCallback = (isAvailable) => {
      if (isAvailable) {
      } else {
        let networkAlert = this.alertCtrl.create({
          title: 'GPS is turned off',
          message: 'Pleaseturn on your GPS.',
          buttons: [
            {
              text: 'Cancel',
              handler: () => {
              }
            },
            {
              text: 'Open Location Settings',
              handler: () => {
                networkAlert.dismiss().then(() => {
                  //this.showSettings();
                  Diagnostic.switchToLocationSettings();
                })
              }
            }
          ]
        });
        networkAlert.present();
      }
    }
    let errorCallback = (e) => console.error(e);

    Diagnostic.isGpsLocationAvailable().then(successLocationCallback, errorCallback);
  }
}
