import {Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import * as Phaser from 'phaser-ce';
import {CommonService} from "../../app/common.service";


@Component({
  selector: 'page-clicker',
  templateUrl: 'clicker.html'
})
export class ClickerPage {
  private game: any;
  private gameCore: any;
  private instructions: any;

  constructor(public navCtrl: NavController, public com: CommonService) {
    this.instructions = 'Instruction: Click the screen when the screen color changes. You will get higher score if you click as soon as possible. You lose if you click too soon.';
  }

  getRandomSeconds(){
    return Math.floor( Math.random() * 6000 )+ 2000;
  }

  ionViewWillLeave(){
    this.gameCore.destroy();
  }

  startGame(){

    let preload = () => {
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;;
    }
    let startTime = 0;
    let colorIndex = 0;

    let listOfColor = ['#000000','#e6194b','#3cb44b','#ffe119'];

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

    let text = null;
    let bg = null;


    let listener = () =>{
      let now = (new Date()).getTime();
      if ( readyToClick ){
        duration = this.getRandomSeconds();
        colorTime = now;
        readyToChange = true;
        readyToClick = false;
        currentReactionTime = now - reactionStartTime;
        if ( currentReactionTime > 5000 ){
          this.game.loseGame();
          return;
        }
        reactionTimes.push( currentReactionTime );
        text.text = currentReactionTime;
        alpha = 0;

        this.gameCore.title = 'Switch Color - '+ colorIndex + '/' + (listOfColor.length -1)
        if ( colorIndex === listOfColor.length - 1 ){


          let total:number = 0;
          for ( let r of reactionTimes ){
            total += Math.min(100, 100/((r/100)**0.2) )
          }
          total /= listOfColor.length - 1;
          total = Math.round(total);
          this.gameCore.score = total;
          this.gameCore.winGame();
        }
      }
      else {
        this.gameCore.loseGame();
      }
    }

    let create = () => {
      this.gameCore.title = 'Switch Color - '+ colorIndex + '/' + (listOfColor.length -1)
      startTime = (new Date()).getTime();
      colorTime = (new Date()).getTime();
      bg = this.game.add.graphics();
      bg.inputEnabled = true;
      bg.events.onInputDown.add(listener, this.game);
      addBgBox( listOfColor[colorIndex] );
      var style = { font: "bold 144px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
      text = this.game.add.text(gameCore.screenWidth/2, gameCore.screenHeight/2, "", style);
      text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
      text.anchor.set(0.5);
      text.text = "";
    }

    // Change Color Function
    let addBgBox = ( color: any ) => {
      if ( text ) {
        text.text = "";
      }
      bg.beginFill( this.com.colorhexToNumber(color), 1.0);
      bg.drawRect(0, 0, gameCore.screenWidth, gameCore.screenHeight);
      bg.drawRect(gameCore.screenWidth, 0, -gameCore.screenWidth, gameCore.screenHeight);
      bg.endFill();
    }

    // Active running function
    let update = () => {
      let now = (new Date()).getTime();

      if (alpha < 1) {
        alpha = alpha + 0.1;
      }
      if (alpha > 1) {
        alpha = 1;
      }
      lastFrame = now;
      let timeElapsed = now - colorTime;
      if (timeElapsed > duration && readyToChange && !this.gameCore.gameWon && !this.gameCore.gameLost ) {
        if ( colorIndex < listOfColor.length - 1 ) {
          colorIndex++;
          addBgBox(listOfColor[colorIndex]);
          reactionStartTime = now;
          readyToClick = true;
          readyToChange = false;
        }
      }
      if ( timeElapsed > duration + 5000 && !this.gameCore.gameWon && !this.gameCore.gameLost  ){
        this.gameCore.loseGame();
      }

      text.alpha = alpha;
    }
    let render = () => {
    }

    let gameCore = this.com.commonGame({parent: 'drawingArea',preload: preload, create: create, update: update, render: render, navCtrl: this.navCtrl});
    this.gameCore = gameCore;
    this.gameCore.gameStarted = true;


    this.game = this.gameCore.phaserGame;
  }
}
