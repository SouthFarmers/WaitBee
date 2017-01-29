import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import {Storage} from '@ionic/storage'
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { ListPage } from '../pages/list/list';
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
import {AboutPage} from "../pages/about/about";
import {TutorialPage} from "../pages/tutorial/tutorial";
import {Rating} from "../pages/rating/rating";
import {UpdateWaitTime} from "../pages/updateWaittime/updateWaittime";
import {FirebaseConnector} from "../providers/firebase-connector";


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
    UpdateWaitTime
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      tabsPlacement: 'bottom',
      platforms: {
        ios: {
          tabsHideOnSubPages: true,
        }
      }
    })
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
    UpdateWaitTime
  ],
  providers: [Locations, GoogleMaps, Connectivity, Details, GoogleGetCordinates,Storage, UserData, FirebaseConnector]
})
export class AppModule {}
