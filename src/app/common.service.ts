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


      gameObject.phaserGame = new Phaser.Game( gameObject.screenWidth, gameObject.screenHeight, Phaser.AUTO, 'drawingArea', { preload: preload, create: create, update: update, render: render });
      window.addEventListener("resize", ()=>{ onWindowResize()});
      setTimeout(()=>{onWindowResize()},100);

      let onWindowResize = () => {
        gameObject.screenWidth = $('#'+parent).innerWidth() * 2
        gameObject.screenHeight = $('#'+parent).innerHeight() * 2
        gameObject.phaserGame.scale.setGameSize( gameObject.screenWidth, gameObject.screenHeight );
      }

      gameObject.destroy = () => {
        window.removeEventListener("resize");
      };

      return gameObject;
    }

    let game = GameClass();
    return game;
  }
}
