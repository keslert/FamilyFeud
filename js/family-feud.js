
function FamilyFeud() {
	me = this;

	this.previousRounds = [];
	this.answers = [];

	this.points = 0;

	this.questionDOM = $('#question');
	this.sectionDOM = $('#answers');
  	this.scoreDOM = $('#score');

  	this.gameData = GameData['FamilyFeud'];

  	this.setUpBuzzers();
  	this.startRound();


  	this.sounds = {
  		'bell':new Audio('sound/bell.mp3'),
  		'buzzer':new Audio('sound/buzzer.mp3'),
  		'correct':new Audio('sound/ff-clang.wav')
  	}

  	$('#next').click(function() {
  		me.startRound();
  	})

  	$(document).keydown(function(e) {
  		me.keydown(e.which);
  	})
}

FamilyFeud.prototype.keydown	 = function(key) {
	if(key == 88) { // X
		this.strike();
	} else if(key == 39) {
		this.startRound();
	} else if(key == 37) {
		this.prevRound();
	} else {
		$('section#section_'+(key-49)).click();
	}
}

FamilyFeud.prototype.reset = function() {
	this.strikes = 0;
	$('#wrong').empty();
}

FamilyFeud.prototype.prevRound = function() {
	if(this.previousRounds.length > 1) {
		this.reset();
		this.previousRounds.pop();
		this.round = _.last(this.previousRounds);
		var roundData = this.gameData[this.round]
		this.createBoard(roundData);
	}
}

FamilyFeud.prototype.startRound = function() {
	this.reset();
	var roundData = this.getRoundData();
	this.createBoard(roundData);
}

FamilyFeud.prototype.getRoundData = function() {
	if(this.previousRounds.length == this.gameData.length)
		this.previousRounds = [];

	while(true) {
		this.round = Math.floor(Math.random() * this.gameData.length);
		if(_.indexOf(this.previousRounds, this.round) == -1)
			break;
	}
	this.previousRounds.push(this.round);
	return this.gameData[this.round];
}

FamilyFeud.prototype.createBoard = function(data) {
	var me = this;
	this.sectionDOM.empty();

	var answers = data['Answers'];
	var question = data['Question'];

	this.questionDOM.html('#'+this.round + ' ' + question);
	function helper(i) {
		if(i < answers.length) {
			return me.createSection(answers[i]['text'], answers[i]['points'], i);
		}
		return me.createSection(null, null, i);
	}

	for(var i = 0; i < 5; i++) {
		var row = $('<div class="row"></div>');
		row.append(helper(i));
		row.append(helper(i+5));
		this.sectionDOM.append(row);
	}
}

FamilyFeud.prototype.createSection = function(answer, points, i) {
	var section = $('<section class="col-xs-6" id="section_'+i+'"></section');
	var inner = $('<div></div>');
	section.append(inner);

	if(answer && points) {
		section.addClass('active');
		inner.addClass('answer');
		inner.append('<figure class="front"><span>'+(i+1)+'</span></figure>');
		inner.append('<figure class="back"><div class="left">'+answer+'</div><div class="right"><span>'+points+'</span></div></figure>');
		this.addClick(section);
	} else {
		inner.addClass('inactive');
	}

	return section;
}

FamilyFeud.prototype.playSound = function(sound) {
	var audio = this.sounds[sound];
	if(audio)
		audio.play();
}

FamilyFeud.prototype.addClick = function(section) {
  var me = this;
	section.click(function() {
		var answer = $(this).find('.answer');
		if (!answer.hasClass('flipped')) {
			answer.addClass('flipped');
			me.playSound('correct');
			me.addScore(parseInt(section.find('.back span').text()));
		}
	})
}

FamilyFeud.prototype.setUpBuzzers = function() {
	me = this;
	$('#strike').on('click', function() {
		me.strike();
	});
}

FamilyFeud.prototype.strike = function() {
	if (this.strikes < 3) {
		this.strikes++;
		$('#strike-count').text(this.strikes);
		var strike = $('<span class="wrongx">X</span>')
		var wrong = $('#wrong');
		wrong.append(strike);
		this.playSound('buzzer');
		wrong.fadeIn('fast');
		setTimeout(function() {wrong.fadeOut('fast');}, 1500);
	}
}

FamilyFeud.prototype.addScore = function(points) {
	this.points += points;
	this.scoreDOM.text(this.points);
}