import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as Phaser from 'phaser-ce';
import * as $ from 'jquery';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }
  ionViewDidLoad() {
    /*
    console.log($('#testP'));

    var config = {
      type: Phaser.AUTO,
      parent: 'drawingArea',
      width: $('#drawingArea').width(),
      height: $('#drawingArea').height(),
      scene: {
        preload: function preload ()
        {
          this.load.image('logo', 'assets/imgs/logo.png');
        },
        create: function create ()
        {
          var logo = this.add.image(400, 150, 'logo');

          this.tweens.add({
            targets: logo,
            y: 450,
            duration: 2000,
            ease: 'Power2',
            yoyo: true,
            loop: -1
          });

        }
      }
    };
    var game = new Phaser.Game(config);*/


    let game;

    setTimeout(()=>{
      game = new Phaser.Game($('#drawingArea').innerWidth(), $('#drawingArea').innerHeight(), Phaser.AUTO, 'drawingArea', { preload: preload, create: create, update: update, render: render });
    },1000);
    function preload() {

      //  You can fill the preloader with as many assets as your game requires

      //  Here we are loading an image. The first parameter is the unique
      //  string by which we'll identify the image later in our code.

      //  The second parameter is the URL of the image (relative)
      game.load.image('phaser', 'assets/imgs/ball.png');

    }

    var sprite;

    let create = () => {

      //  To make the sprite move we need to enable Arcade Physics
      game.physics.startSystem(Phaser.Physics.ARCADE);

      sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
      sprite.anchor.set(0.5);

      //  And enable the Sprite to have a physics body:
      game.physics.arcade.enable(sprite);

    }

    let update = () => {

      //  If the sprite is > 8px away from the pointer then let's move to it
      if (game.physics.arcade.distanceToPointer(sprite, game.input.activePointer) > 8)
      {
        //  Make the object seek to the active pointer (mouse or touch).
        game.physics.arcade.moveToPointer(sprite, 300);
      }
      else
      {
        //  Otherwise turn off velocity because we're close enough to the pointer
        sprite.body.velocity.set(0);
      }

    }

    let render = () => {

      game.debug.inputInfo(32, 32);

    }



  }
}
