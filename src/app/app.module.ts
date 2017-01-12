import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
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

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    MapPage,
    PropertyDetailsPage,
    ParallaxHeader
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
    MapPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Locations, GoogleMaps, Connectivity, Details]
})
export class AppModule {}
