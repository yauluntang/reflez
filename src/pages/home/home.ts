import {Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import * as Phaser from 'phaser-ce';
import * as $ from 'jquery';


declare var window:any;
declare var $:any;
declare var jQuery: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private game: any;

  private startTime: any;
  private screenWidth: number;
  private screenHeight: number;


  private text: any;
  private bg:any;

  constructor(public navCtrl: NavController) {

  }

  getRandomSeconds(){
    return Math.floor( Math.random() * 6000 )+ 4000;
  }


  colorhexToNumber(rrggbb) {
    if ( !rrggbb ){
      return 0;
    }
    if ( typeof rrggbb !== 'string' ){
      return 0;
    }
    if ( rrggbb.length < 6 ){
      return 0;
    }
    if ( rrggbb[0] === '#' ){
      rrggbb = rrggbb.substr(1);
    }

    return parseInt(rrggbb, 16);
  }

  onWindowResize() {
    this.screenWidth = $('#drawingArea').innerWidth() * 2
    this.screenHeight = $('#drawingArea').innerHeight() * 2
    this.game.scale.setGameSize( this.screenWidth, this.screenHeight );

  }
  ionViewWillLeave(){
    window.removeEventListener("resize");
  }
  ionViewDidLoad(){
  }
  ionViewWillEnter() {
    this.screenWidth = $('#drawingArea').innerWidth() * 2;
    this.screenHeight = $('#drawingArea').innerHeight() * 2;
    window.addEventListener("resize", ()=>{this.onWindowResize()});

    setTimeout(()=>{this.onWindowResize()},100);

    let preload = () => {

      this.game.load.image('phaser', 'assets/imgs/ball.png');
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;;
    }
    let colorIndex = 0;



    let listOfColor = ['#e6194b','#3cb44b','#ffe119','#0082c8','#f58231','#911eb4','#46f0f0','#f032e6','#d2f53c','#fabebe','#008080','#e6beff','#aa6e28','#fffac8','#800000'];
    //let listOfColor = ['#ff0000','#00ff00','#0000ff'];
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
    duration = this.getRandomSeconds();
    let listener = () =>{
      let now = (new Date()).getTime();
      counter++;
      console.log( "You clicked " + counter + " times!");

      if ( readyToClick ){
        colorTime = now;
        readyToChange = true;
        readyToClick = false;
        currentReactionTime = now - reactionStartTime;
        reactionTimes.push( currentReactionTime );
        this.text.text = currentReactionTime;
      }
      else {
        this.text.text = "Too Early";
      }
    }
    let create = () => {

      this.startTime = (new Date()).getTime();
      colorTime = (new Date()).getTime();
      //  To make the sprite move we need to enable Arcade Physics
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'phaser');
      sprite.anchor.set(0.5);

      //  And enable the Sprite to have a physics body:
      this.game.physics.arcade.enable(sprite);
      this.bg = this.game.add.graphics();
      this.bg.inputEnabled = true;
      this.bg.events.onInputDown.add(listener, this.game);

      addBgBox( listOfColor[colorIndex] );

      var style = { font: "bold 144px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

      //  The Text is positioned at 0, 100
      this.text = this.game.add.text(0, 0, "", style);
      this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

      //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
      this.text.setTextBounds(0, 0, this.screenWidth, this.screenHeight);
    }

    let addBgBox = ( color: any ) => {
      if ( this.text ) {
        this.text.text = "";
      }
      this.bg.beginFill( this.colorhexToNumber(color), 1.0);
      this.bg.drawRect(0, 0, this.screenWidth, this.screenHeight);
      this.bg.drawRect(this.screenWidth, 0, -this.screenWidth, this.screenHeight);
      this.bg.endFill();
    }

    let update = () => {




      let now = (new Date()).getTime();
      //let frms = now - lastFrame;


      lastFrame = now;


      let timeElapsed = now - colorTime;

      if ( timeElapsed > duration && readyToChange ){
        colorIndex++;
        addBgBox( listOfColor[colorIndex] );
        reactionStartTime = now;
        readyToClick = true;
        readyToChange = false;
      }

      //this.text.text = (new Date()).getTime() - this.startTime;

    }

    let render = () => {

      //this.game.debug.inputInfo(32, 32);

    }
    this.game = new Phaser.Game( this.screenWidth, this.screenHeight, Phaser.AUTO, 'drawingArea', { preload: preload, create: create, update: update, render: render });



    //


  }
}
