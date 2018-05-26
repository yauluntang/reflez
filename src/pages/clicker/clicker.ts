import {Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import * as Phaser from 'phaser-ce';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';
import {CommonService} from "../../app/common.service";


declare var window:any;

@Component({
  selector: 'page-clicker',
  templateUrl: 'clicker.html'
})
export class ClickerPage {
  private game: any;
  private gameCore: any;
  private text: any;
  private bg:any;

  constructor(public navCtrl: NavController, public com: CommonService) {

  }

  getRandomSeconds(){
    return Math.floor( Math.random() * 6000 )+ 4000;
  }

  /*

  onWindowResize() {
    this.screenWidth = $('#drawingArea').innerWidth() * 2
    this.screenHeight = $('#drawingArea').innerHeight() * 2
    this.game.scale.setGameSize( this.screenWidth, this.screenHeight );

  }*/


  ionViewWillLeave(){
    this.gameCore.destroy();

  }


  ionViewDidLoad(){
  }

  ionViewWillEnter() {


    let preload = () => {
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;;
    }
    let startTime = 0;
    let colorIndex = 0;
    let listOfColor = ['#e6194b','#3cb44b','#ffe119','#0082c8','#f58231','#911eb4','#46f0f0','#f032e6','#d2f53c','#fabebe','#008080','#e6beff','#aa6e28','#fffac8','#800000'];
    let sprite;
    let counter = 0;
    let duration = 0;
    let colorTime = 0;
    let reactionStartTime = 0;
    let readyToChange = true;
    let readyToClick = false;
    let reactionTimes = [];
    let currentReactionTime = 0;
    let lastFrame = 0;
    let alpha = 0;
    duration = this.getRandomSeconds();



    let listener = () =>{
      let now = (new Date()).getTime();
      if ( readyToClick ){
        colorTime = now;
        readyToChange = true;
        readyToClick = false;
        currentReactionTime = now - reactionStartTime;
        reactionTimes.push( currentReactionTime );
        this.text.text = currentReactionTime;
        alpha = 0;
      }
      else {
        this.text.text = "Too Early";
      }
    }

    let create = () => {

      startTime = (new Date()).getTime();
      colorTime = (new Date()).getTime();
      this.bg = this.game.add.graphics();
      this.bg.inputEnabled = true;
      this.bg.events.onInputDown.add(listener, this.game);
      addBgBox( listOfColor[colorIndex] );
      var style = { font: "bold 144px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
      this.text = this.game.add.text(gameCore.screenWidth/2, gameCore.screenHeight/2, "", style);
      this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
      this.text.anchor.set(0.5);
      this.text.text = "3";
    }

    let addBgBox = ( color: any ) => {
      if ( this.text ) {
        this.text.text = "";
      }
      this.bg.beginFill( this.com.colorhexToNumber(color), 1.0);
      this.bg.drawRect(0, 0, gameCore.screenWidth, gameCore.screenHeight);
      this.bg.drawRect(gameCore.screenWidth, 0, -gameCore.screenWidth, gameCore.screenHeight);
      this.bg.endFill();
    }

    let update = () => {
      let now = (new Date()).getTime();

      if ( alpha < 1 ){
        alpha = alpha + 0.1;
      }
      if ( alpha > 1 ){
        alpha = 1;
      }
      lastFrame = now;
      let timeElapsed = now - colorTime;
      if ( timeElapsed > duration && readyToChange ){
        colorIndex++;
        addBgBox( listOfColor[colorIndex] );
        reactionStartTime = now;
        readyToClick = true;
        readyToChange = false;
      }
      this.text.alpha = alpha;
    }

    let render = () => {
    }

    let gameCore = this.com.commonGame({parent: 'drawingArea',preload: preload, create: create, update: update, render: render});
    this.gameCore = gameCore;
    this.game = this.gameCore.phaserGame;

  }
}
