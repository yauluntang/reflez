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
  private text: any;
  private bg:any;

  private gameStarted: boolean;
  private gameWon:boolean;
  private gameLost: boolean;

  private title: string;
  private score: number;
  private instructions: string;

  constructor(public navCtrl: NavController, public com: CommonService) {
    this.gameStarted = false;
    this.gameWon = false;
    this.gameLost = false;
    this.instructions = 'Instruction: Click the screen when the screen color changes. You will get higher score if you click as soon as possible. You lose if you click too soon.';
  }

  getRandomSeconds(){
    return Math.floor( Math.random() * 6000 )+ 2000;
  }
  winGame(){
    this.gameWon = true;
  }

  loseGame(){
    this.gameLost = true;
  }

  exitGame(){
    this.navCtrl.pop();
  }
  ionViewWillLeave(){
    this.gameCore.destroy();

  }

  startGame(){
    this.gameStarted = true;
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



    let listener = () =>{
      let now = (new Date()).getTime();
      if ( readyToClick ){
        duration = this.getRandomSeconds();
        colorTime = now;
        readyToChange = true;
        readyToClick = false;
        currentReactionTime = now - reactionStartTime;
        if ( currentReactionTime > 5000 ){
          this.loseGame();
          return;
        }
        reactionTimes.push( currentReactionTime );
        this.text.text = currentReactionTime;
        alpha = 0;

        this.title = 'Switch Color - '+ colorIndex + '/' + (listOfColor.length -1)
        if ( colorIndex === listOfColor.length - 1 ){


          let total:number = 0;
          for ( let r of reactionTimes ){
            total += Math.min(100, 100/((r/100)**0.2) )
          }
          total /= listOfColor.length - 1;
          total = Math.round(total);
          this.score = total;
          this.winGame();
        }
      }
      else {
        this.loseGame();
      }
    }

    let create = () => {
      this.title = 'Switch Color - '+ colorIndex + '/' + (listOfColor.length -1)
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
      this.text.text = "";
    }

    // Change Color Function
    let addBgBox = ( color: any ) => {
      if ( this.text ) {
        this.text.text = "";
      }
      this.bg.beginFill( this.com.colorhexToNumber(color), 1.0);
      this.bg.drawRect(0, 0, gameCore.screenWidth, gameCore.screenHeight);
      this.bg.drawRect(gameCore.screenWidth, 0, -gameCore.screenWidth, gameCore.screenHeight);
      this.bg.endFill();
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
      if (timeElapsed > duration && readyToChange && !this.gameWon && !this.gameLost ) {
        if ( colorIndex < listOfColor.length - 1 ) {
          colorIndex++;
          addBgBox(listOfColor[colorIndex]);
          reactionStartTime = now;
          readyToClick = true;
          readyToChange = false;
        }
      }
      if ( timeElapsed > duration + 5000 && !this.gameWon && !this.gameLost  ){
        this.loseGame();
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
