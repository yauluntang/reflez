import {Injectable} from "@angular/core";
import * as Phaser from 'phaser-ce';
import * as $ from 'jquery';

@Injectable()
export class CommonService  {
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

  commonGame( properties ){

    function GameClass(){

      let gameObject: any = {};
      let parent = properties.parent;


      gameObject.navCtrl = properties.navCtrl;

      gameObject.screenWidth = $('#'+parent).innerWidth() * 2;
      gameObject.screenHeight = $('#'+parent).innerHeight() * 2;

      let preload = () => {
        if ( properties.preload ){
          properties.preload( gameObject.phaserGame );
        }
      };

      let create = () => {
        if ( properties.create ){
          properties.create( gameObject.phaserGame );
        }
      };

      let update = () => {
        if ( properties.update ){
          properties.update( gameObject.phaserGame );
        }
      };

      let render = () => {
        if ( properties.render ){
          properties.render( gameObject.phaserGame );
        }
      };

      gameObject.gameWon = false;
      gameObject.gameExit = false;
      gameObject.gameStarted = false;
      gameObject.gameLost = false;


      gameObject.phaserGame = new Phaser.Game( gameObject.screenWidth, gameObject.screenHeight, Phaser.AUTO, 'drawingArea', { preload: preload, create: create, update: update, render: render });

      let listener = () => { onWindowResize() };
      setTimeout(()=>{ onWindowResize()}, 100);

      window.addEventListener("resize", listener);

      let onWindowResize = () => {
        gameObject.screenWidth = $('#'+parent).innerWidth() * 2
        gameObject.screenHeight = $('#'+parent).innerHeight() * 2
        gameObject.phaserGame.scale.setGameSize( gameObject.screenWidth, gameObject.screenHeight );
      }

      gameObject.startTime = null;
      gameObject.futureTime = null;
      gameObject.setTimer = ( x ) => {
        gameObject.startTime = new Date().getTime();
        gameObject.futureTime = gameObject.startTime + x * 1000;
      }

      gameObject.interval = setInterval(()=>{
        if ( gameObject.futureTime ) {
          if ( !gameObject.gameWon && !gameObject.gameLost && gameObject.gameStarted ) {
            gameObject.timer = gameObject.futureTime - new Date().getTime()
            if (gameObject.timer <= 0) {
              gameObject.loseGame();
            }
          }
        }
        else {
          gameObject.timer = null;
        }
      },10);


      gameObject.destroy = () => {
        window.removeEventListener("resize", listener);
        if ( gameObject.interval ) {
          clearInterval(gameObject.interval);
        }
        gameObject.phaserGame.destroy();
        gameObject.phaserGame = null;
      };


      gameObject.winGame = () => {
        gameObject.gameWon = true;
      }

      gameObject.loseGame = () => {
        gameObject.gameLost = true;
      }

      gameObject.exitGame = () => {
        gameObject.gameExit = true;
        setTimeout(()=>{
          gameObject.navCtrl.pop();
        },100);

      }


      return gameObject;
    }

    let game = GameClass();
    return game;
  }
}
