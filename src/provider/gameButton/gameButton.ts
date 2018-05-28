import {
    Component,
    ViewChild,
    AfterViewChecked,
    Input,
    OnChanges,
    SimpleChange,
    Output,
    EventEmitter, ApplicationRef
} from '@angular/core';

@Component({
    selector: 'game-button',
    templateUrl: 'gameButton.html'
})
export class GameButtonComponent{
    @Input('game') game;
    constructor(private app: ApplicationRef) {

    }


}
