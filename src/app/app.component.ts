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

	strTest = "\n tester \n";
	currentPlayerID = 1;
	currNumOfMoves = 0;

	boardTwoIsInit = false;

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

	ngAfterViewInit() {
		//		console.log("ngAfterViewInit iframe1: " + this.iframe1);
		//		console.log("ngAfterViewInit iframe2: " + this.iframe2);
		this.onLoad();
		// 	let content = '<button id="button" class="button" >My button </button>';
		// 	let doc = this.iframe1.nativeElement.contentDocument || this.iframe1.nativeElement.contentWindow;
		// 	doc.open();
		// 	doc.write(content);
		// 	doc.close();
		if (!this.boardTwoIsInit) {
			this.createNewGame();
			if (localStorage.getItem("numOfMoves") != null) {
				// replay old moves
				var numOfMoves = Number(localStorage.getItem("numOfMoves"));
				for (var i = 1; i <= numOfMoves; i++) {
					var moveStr = localStorage.getItem("move" + i);

					window.postMessage({ "to_player": 1, "move": moveStr });
					window.postMessage({ "to_player": 2, "move": moveStr });
				}
				// calculate whos turn
				if (numOfMoves % 2 == 0) {
					this.currentPlayerID = 2;

				} else {
					this.currentPlayerID = 1;
				}
				this.currNumOfMoves = numOfMoves;
				this.switchPlayer();
			}
		}
		window.addEventListener('message', event => {
			console.log("parent: received msg");
			console.table(event.data);

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

				// store total numOfMoves to local storage
				this.currNumOfMoves++;
				localStorage.setItem("numOfMoves", String(this.currNumOfMoves));
				localStorage.setItem("move" + this.currNumOfMoves, event.data[0].data.move);


				window.postMessage({ "to_player": otherPlayerID, "move": event.data[0].data.move });
				if (event.data[0].data.checkmate) {
					console.log("parent detects checkmate!!");
					alert('Checkmate Detected, click on Create New Game Button to reset');

					return;
				}
				// switch player after a move

				this.switchPlayer();
			}
		});
	}

	switchPlayer() {
		if (this.currentPlayerID == 1) {
			window.postMessage({ "to_player": 1, "enable": 0 });
			window.postMessage({ "to_player": 2, "enable": 1 });
			this.currentPlayerID = 2;
		}
		else {
			window.postMessage({ "to_player": 1, "enable": 1 });
			window.postMessage({ "to_player": 2, "enable": 0 });
			this.currentPlayerID = 1;
		}
	}

	createNewGame() {
		window.postMessage({ "to_player": 2, "rotate": 1 });
		this.boardTwoIsInit = true;

		window.postMessage({ "to_player": 1, "enable": 1 });
		window.postMessage({ "to_player": 2, "enable": 0 });

		this.currentPlayerID = 1;
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

	public reset(): void {
		alert('Resetting board');

		(<DynamicComponent>this.compRef1.instance).reset();
		(<DynamicComponent>this.compRef2.instance).reset();

		// reset history
		localStorage.clear();
		this.createNewGame();

	}

}

