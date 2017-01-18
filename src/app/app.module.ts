import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
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

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    MapPage,
    PropertyDetailsPage,
    ParallaxHeader,
    ModalAutocompleteItems,
    Filters
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
    Filters
  ],
  providers: [Locations, GoogleMaps, Connectivity, Details, GoogleGetCordinates,Storage]
})
export class AppModule {}
