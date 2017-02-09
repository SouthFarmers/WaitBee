import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import {Storage} from '@ionic/storage'
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { ListPage } from '../pages/list/list';
import { AccountPage } from '../pages/account/account';
import { Locations } from '../providers/locations';
import { GoogleMaps } from '../providers/google-maps';
import { Connectivity } from '../providers/connectivity';
import { Details } from '../providers/details';
import { ParallaxHeader } from '../components/parallax-header/parallax-header';
import {PropertyDetailsPage} from "../pages/property-details/property-details";
import {Filters} from "../pages/filters/filters";
import { ModalAutocompleteItems } from '../pages/modal-autocomplete-items/modal-autocomplete-items';
import {GoogleGetCordinates} from "../providers/google-get-cordinates";
import { Ionic2Rating  } from 'ionic2-rating';
import {UserData} from "../providers/user-data";
import {CheckDiagnostics} from "../providers/check-diagnostics";
import {AboutPage} from "../pages/about/about";
import {TutorialPage} from "../pages/tutorial/tutorial";
import {Rating} from "../pages/rating/rating";
import {UpdateWaitTime} from "../pages/updateWaittime/updateWaittime";
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import {SocialsharingPage} from "../pages/socialsharing/socialsharing";


const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'bfc00986'
  },
  'auth': {
    'google': {
      'webClientId': '499436940184-3th52gfe7i6pteeroopsmm4vnf6seabb.apps.googleusercontent.com'
    }
  }
};


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    MapPage,
    PropertyDetailsPage,
    ParallaxHeader,
    Ionic2Rating,
    ModalAutocompleteItems,
    Filters,
    AboutPage,
    TutorialPage,
    Rating,
    UpdateWaitTime,
    AccountPage,
    SocialsharingPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'bottom',
      platforms: {
        ios: {
          tabsHideOnSubPages: true,
        }
      }
    }),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    PropertyDetailsPage,
    MapPage,
    ModalAutocompleteItems,
    Filters,
    AboutPage,
    TutorialPage,
    Rating,
    UpdateWaitTime,
    AccountPage,
    SocialsharingPage
  ],
  providers: [Locations, GoogleMaps, Connectivity, Details, GoogleGetCordinates,Storage, UserData, CheckDiagnostics
  ]
})
export class AppModule {}
