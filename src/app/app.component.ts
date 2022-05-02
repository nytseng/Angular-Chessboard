//import { Component, ViewChild } from '@angular/core';
//import { MoveChange, NgxChessBoardService, NgxChessBoardComponent } from 'ngx-chess-board';
//import { NgxChessBoardView } from 'ngx-chess-board';

import { Component, ElementRef, ViewChild, ComponentRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import {
	MoveChange,
	NgxChessBoardComponent,
	PieceIconInput
} from 'ngx-chess-board';

import {
	DynamicComponent
} from './dynamic/dynamic.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {
	//public pgn: string = '';
	@ViewChild('iframe1', { static: true, read: ElementRef }) iframe1: ElementRef;
	@ViewChild('iframe2', { static: true, read: ElementRef }) iframe2: ElementRef;

	title = 'angularDemo1';
	doc1: any;
	doc2: any;
	compRef1: ComponentRef<DynamicComponent>;
	compRef2: ComponentRef<DynamicComponent>;

	//constructor(private ngxChessBoardService: NgxChessBoardService) {

	//}

	//@ViewChild('board') boardManager: NgxChessBoardComponent;

	//@ViewChild('board', { static: false }) board: NgxChessBoardView;

	//public reset(): void {
	//	alert('Resetting board');
	// this.boardManager.reset();
	//}
	//public moveCallback(move: MoveChange): void {
	//	this.pgn = this.boardManager.getPGN();
	//	console.log(move);
	//}

	constructor(private vcRef: ViewContainerRef, private resolver: ComponentFactoryResolver) {
		console.log("constructor");
		console.log("iframe1: " + this.iframe1);
		console.log("iframe2: " + this.iframe2);
		//this.onLoad();
	}

	// constructor() {
	/** Trigger on data load from source in case html has embed.js. */
	//	iframely.load();
	//}


	firstInput = 5;

	@ViewChild('board')
	boardManager: NgxChessBoardComponent;

	public fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
	private currentStateIndex: number;
	manualMove = 'd2d4';
	icons: PieceIconInput = {
		blackBishopUrl: '',
		blackKingUrl: '',
		blackKnightUrl: '',
		blackPawnUrl: '',
		blackQueenUrl: '',
		blackRookUrl: '',
		whiteBishopUrl: '',
		whiteKingUrl: '',
		whiteKnightUrl: '',
		whitePawnUrl: '',
		whiteQueenUrl: '',
		whiteRookUrl: ''
	};

	public darkTileColor = 'rgb(97, 84, 61)';
	public lightTileColor = '#BAA378';
	public size = 400;
	public dragDisabled = false;
	public drawDisabled = false;
	public lightDisabled = false;
	public darkDisabled = false;
	public freeMode = false;
	public addPieceCoords: string = 'a4';
	public selectedPiece = '1';
	public selectedColor = '1';
	public pgn: string = '';

	public reset(): void {
		alert('Resetting board');
		this.boardManager.reset();
		this.fen = this.boardManager.getFEN();
		this.freeMode = false;
	}

	public reverse(): void {
		this.boardManager.reverse();
	}

	public undo(): void {
		this.boardManager.undo();
		this.fen = this.boardManager.getFEN();
	}

	public setFen(): void {
		if (this.fen) {
			this.boardManager.setFEN(this.fen);
		}
	}

	public moveCallback(move: MoveChange): void {
		this.fen = this.boardManager.getFEN();
		this.pgn = this.boardManager.getPGN();
		console.log(move);
	}

	public moveManual(): void {
		this.boardManager.move(this.manualMove);
	}

	getFEN() {
		let fen = this.boardManager.getFEN();
		alert(fen);
	}

	showMoveHistory() {
		alert(JSON.stringify(this.boardManager.getMoveHistory()));
	}

	switchDrag() {
		this.dragDisabled = !this.dragDisabled;
	}

	switchDraw() {
		this.drawDisabled = !this.drawDisabled;
	}

	switchDarkDisabled() {
		this.darkDisabled = !this.darkDisabled;
	}

	switchLightDisabled() {
		this.lightDisabled = !this.lightDisabled;
	}

	switchFreeMode() {
		this.freeMode = !this.freeMode;
	}

	public setPgn() {
		this.boardManager.setPGN(this.pgn);
	}

	loadDefaultPgn() {
		this.pgn = '1. c4 b5 2. cxb5 c6 3. bxc6 Nxc6 4. Qa4 a6\n' +
			'5. Qxa6 Rb8 6. b3 d5 7. f4 e5 8. fxe5 f6\n' +
			'9. exf6 gxf6 10. Nf3 f5 11. Ne5 Bb7 12. Qxb7 Na7\n' +
			'13. Qxb8 Qxb8 14. Kf2 Kd8 15. Nc3 Be7 16. Nc4 Bf6\n' +
			'17. Nb6 Nb5 18. Nbxd5 f4 19. Ne4 Na7 20. Nexf6';
		this.setPgn();
	}
	ngAfterViewInit() {
		console.log("ngAfterViewInit iframe1: " + this.iframe1);
		console.log("ngAfterViewInit iframe2: " + this.iframe2);
		this.onLoad();
		// 	let content = '<button id="button" class="button" >My button </button>';
		// 	let doc = this.iframe1.nativeElement.contentDocument || this.iframe1.nativeElement.contentWindow;
		// 	doc.open();
		// 	doc.write(content);
		// 	doc.close();

		window.addEventListener('message', event => {
			if (!event.data.hasOwnProperty("to_player")) {
				console.log(`Parent Received message: `);
				console.log(event);

				// pass move command from one iframe to the other
				let otherPlayerID: number = 1;

				if (event.data[0].playerID == 1) {
					otherPlayerID = 2;
				}
				console.log("playerID: " + event.data[0].playerID);
				console.log("otherPlayerID: " + otherPlayerID);
				
				window.postMessage({ "to_player": otherPlayerID, "move": event.data[0].data.move });
			}
		});
	}
	onLoad() {
		console.log("onload successful");
		console.log("iframe1: " + this.iframe1);
		console.log("iframe2: " + this.iframe2);

		this.doc1 = this.iframe1.nativeElement.contentDocument || this.iframe1.nativeElement.contentWindow;
		this.doc2 = this.iframe2.nativeElement.contentDocument || this.iframe2.nativeElement.contentWindow;
		this.createComponent();
	}

	createComponent() {
		console.log("component was created");
		const compFactory = this.resolver.resolveComponentFactory(DynamicComponent);
		this.compRef1 = this.vcRef.createComponent(compFactory);
		this.doc1.body.appendChild(this.compRef1.location.nativeElement);

		(<DynamicComponent>this.compRef1.instance).playerID = 1;
		// this.doc1.postMessage("player1");


		this.compRef2 = this.vcRef.createComponent(compFactory);
		this.doc2.body.appendChild(this.compRef2.location.nativeElement);
		(<DynamicComponent>this.compRef2.instance).playerID = 2;

		// this.doc2.postMessage("player2");
	}
}

