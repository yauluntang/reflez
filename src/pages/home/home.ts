import {Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import * as Phaser from 'phaser-ce';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';
import {CommonService} from "../../app/common.service";
import {ClickerPage} from "../clicker/clicker";

declare var window:any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  games: any;
  constructor(public navCtrl: NavController, public com: CommonService) {

    this.games = [];

    this.games.push( {
      title: "Switch",
      gotoGame: ()=>{ this.navCtrl.push(ClickerPage) },
      logo: "assets/img/logo/switch.svg"
    });

    this.games.push( {
      title: "FIND DIFF",
      gotoGame: ()=>{ this.navCtrl.push(ClickerPage) },
      logo: "assets/img/logo/finddiff.svg"
    });
  }
  gotoGame(){
    this.navCtrl.push(ClickerPage);
  }

}
