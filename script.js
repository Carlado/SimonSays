var game = {
	score: 0,
	active: false,
	strict: false,
	sequence: [],
	userInput: [],
	//Pick a random color and assign to sequence
	pickField: function() {
		var pick = Math.floor(Math.random() * 4 + 1);

		switch(pick) {
			case 1:
			this.sequence.push("green")
			break;
			case 2:
			this.sequence.push("red")
			break;
			case 3:
			this.sequence.push("blue")
			break;
			case 4:
			this.sequence.push("yellow")
			break;			

		}

		
	},
	//Capture user clicks and assign to array
	captureInput: function(id) { 
		this.userInput.push(id);
		console.log(this.userInput);
	},
	//Move on to next round
	nextRound: function() {
			game.active = false;
			game.lockGame();
		setTimeout(function() {			
			game.clearInput();
			game.score++;
			$("#stage p").text(game.score);
			
			game.pickField();
			game.animate(game.sequence);

		}, 2000)
		
		
	}, 
	//Repeat last round when not in strict mode
	repeatRound: function()	{
			game.active = false;
			game.lockGame();
		setTimeout(function() {			
			$("#stage p").text(game.score);
			game.clearInput();
			game.animate(game.sequence);

		}, 2000)

			
	},
	//Animate the sequence
	animate: function(sequence) {
		var i = 0;
		var interval = setInterval(function() {
			game.lightUp(sequence[i]); 
			i++;
			if (i >= sequence.length) {
				clearInterval(interval);
				game.active = true;
				game.lockGame();
			}

		}, 800);
	},
	//Light up effect and sound
	lightUp: function(color) {
		var $block =  $("#" + color);	
		this.playSound(color);
		$block.addClass("light");
		setTimeout(function() {
			$block.removeClass("light");	
		}, 400)


	}, 
	//Assign autoplay sound to each tile
	playSound: function(color){
		var audio = $('<audio autoplay></audio>');
		switch(color) {
			case "green" : 
			audio.append('<source src="https://s3.amazonaws.com/freecodecamp/simonSound1.mp3">')
			break;
			case "red" : 
			audio.append('<source src="https://s3.amazonaws.com/freecodecamp/simonSound2.mp3">')
			break;
			case "blue" : 
			audio.append('<source src="https://s3.amazonaws.com/freecodecamp/simonSound3.mp3">')
			break;
			case "yellow" : 
			audio.append('<source src="https://s3.amazonaws.com/freecodecamp/simonSound4.mp3">')
			break;
		}

		$('[data-action=sound]').html(audio);
	},
	//Compare user input to sequence
	compare: function() {
		var inputLength = this.userInput.length - 1;
		if (_.isEqual(this.sequence[inputLength], this.userInput[inputLength])) {
			
			if (this.sequence.length === this.userInput.length) {
				game.nextRound(); //Start next round when input complete and correct
			} 
		} else if (!this.strict) { //Repeat animation sequence when user guessed wrong	
			$("#stage p").text("! !");
			this.repeatRound(); 
		} else { //Start new game if strict mode
			$("#stage p").text("! !");
			this.newGame(); 
		}
	},
	//Lock buttons during animation
	lockGame: function() {
		var $tile = $(".gamebutton");
		//Disable click listener when game not active
		if (!this.active) { 
			$tile.off("click");
			if (this.score > 0) {
				$("#start").attr("disabled", true);
			}			
			//Else add listeners
		}	else { 
			$tile.on("click", function() {
				var color = this.id;
				game.lightUp(color);
				game.captureInput(color);
				game.compare();
			});
			$("#start").attr("disabled", false);	

		}

	},
	//Clear user input between rounds
	clearInput: function() {
		this.userInput = [];
	},
	//Clear arrays and start new game
	newGame: function() {
		game.clearInput();
		game.sequence = [];
		game.score = 0; 
		game.nextRound();
	}

};	




$(document).ready(function(){
	//Lock tiles on page load
	game.lockGame();

	
	//Start new game button
	$("#start").on("click", function() {
		game.active = false;
		game.lockGame();
		game.newGame();
	});

	//Strict mode button
	$('.toggle').toggles({drag:false});
	$('.toggle').on('toggle', function(e, active) {
		if (active) {
			game.strict = true;
		} else {
			game.strict = false;
		}
	});

});

