import {Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import * as Phaser from 'phaser-ce';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';
import {CommonService} from "../../app/common.service";


declare var window:any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController, public com: CommonService) {

  }


}
