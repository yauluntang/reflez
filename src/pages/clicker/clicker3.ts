import {Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import * as Phaser from 'phaser-ce';
import {CommonService} from "../../app/common.service";


@Component({
  selector: 'page-clicker3',
  templateUrl: 'clicker.html'
})
export class Clicker3Page {
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
    this.instructions = 'Instruction: Click the numbers in order as fast as possible';
  }

  getRandomSeconds(){
    return Math.floor( Math.random() * 6000 )+ 4000;
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

    let shuffle = a => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };

    let array = (m,n)=>{
      let a = [];
      for ( let x = m ; x <= n; x ++ ){
        a.push(x);
      }
      return a;
    }

    let preload = () => {
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;;
    }
    let startTime = 0;
    let colorIndex = 0;

    let listOfColor = ['#000000','#e6194b','#3cb44b','#ffe119'];



    let marginTop = 0;
    let marginLeft = 0;
    let gameWidth = 0;

    let currentNumber = 1;
    let n = 2;
    let layers = 5;

    let max = n*n*layers;

    let boxes = [];

    let create = () => {
      this.title = 'Switch Color - '+ colorIndex + '/' + (listOfColor.length -1);
      this.game.time.advancedTiming = true;


      startTime = (new Date()).getTime();

      if ( gameCore.screenHeight > gameCore.screenWidth ){
        marginTop = ( gameCore.screenHeight - gameCore.screenWidth ) / 2
      }
      if ( gameCore.screenWidth > gameCore.screenHeight ){
        marginLeft = ( gameCore.screenWidth - gameCore.screenHeight ) / 2
      }
      gameWidth = Math.min(gameCore.screenHeight, gameCore.screenWidth);

      let numbers = [];

      for ( let l = 0; l < layers; l ++ ) {
        numbers.push(shuffle(array(n*n*l+1, n*n*(l+1))))
      }

      let final = [];
      for ( let u = 0; u < numbers[0].length; u ++ ) {
        let num = [];
        for ( let l = 0; l < layers; l ++ ) {
          num.push(numbers[l][u])
        }
        final.push(num);
      }

      let l = 0;
      for ( let i = 0; i < n; i ++ ){
        for ( let j = 0; j < n; j ++ ){
          boxes.push(addBox( '#ff0000',i,j,n,final[l] ));
          l++;
        }
      }
    }

    // Change Color Function
    let addBox = ( color: any, x, y, n, nums ) => {

      let bg = this.game.add.graphics();
      bg.beginFill( this.com.colorhexToNumber(color), 1.0);

      let pad = 10;

      let l = marginLeft + gameWidth / n * x + pad;
      let w = gameWidth / n - pad * 2;

      let t = marginTop + gameWidth / n * y + pad;
      let h = gameWidth / n - pad * 2;


      bg.drawRect(l, t, w, h);
      bg.drawRect(l+w, t, -w, h);
      bg.endFill();


      bg.inputEnabled = true;


      let fontSize = Math.round(w/2);
      let obj:any = {};

      let style = { font: "bold "+fontSize+"px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
      let text = this.game.add.text( l+w/2, t+h/2, "", style);

      let layer = 0;

      text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
      text.anchor.set(0.5);
      text.text = nums[layer];




      obj.nums = nums;
      obj.text = text;
      obj.box = bg;


      bg.events.onInputDown.add(()=>{
        if ( currentNumber === nums[layer] ) {
          layer++;
          if (layer < nums.length) {
            text.text = nums[layer];
          }
          else {
            text.text = '';
            bg.destroy();
          }

          if ( currentNumber === max ){
            this.score = ((new Date().getTime() - startTime)/1000);
            this.winGame();
          }
          currentNumber ++;
        }
        else {
          this.loseGame();
        }
      }, this.game);

      return obj;
    }

    // Active running function
    let update = () => {

    }
    let render = () => {
      this.game.debug.text(this.game.time.fps, 2, 14, "#00ff00");
    }

    let gameCore = this.com.commonGame({parent: 'drawingArea',preload: preload, create: create, update: update, render: render});
    this.gameCore = gameCore;
    this.game = this.gameCore.phaserGame;
  }
}
