import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ClickerPage } from '../pages/clicker/clicker';
import { CommonService } from "./common.service";
import { CommonProviderModule } from "../provider/common.module";
import {Clicker2Page} from "../pages/clicker/clicker2";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ClickerPage,
    Clicker2Page
  ],
  imports: [
    BrowserModule,
    CommonProviderModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ClickerPage,
    Clicker2Page
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CommonService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
