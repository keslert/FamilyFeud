
function FamilyFeud(questionDOM, sectionDOM, scoreDOM) {
	this.answers = [];

	this.points = 0;
	this.stikes = 0;

	this.questionDOM = questionDOM;
	this.sectionDOM = sectionDOM;
  	this.scoreDOM = scoreDOM;

  	this.ifr = document.getElementById('sound');
  	this.gameData = GameData['FamilyFeud'];

  	this.setUpBuzzers();
  	this.startRound();
}

FamilyFeud.prototype.startRound = function() {
	var roundData = this.getRoundData();
	this.createBoard(roundData);
}

FamilyFeud.prototype.getRoundData = function() {
	var index = Math.floor(Math.random() * this.gameData.length);

	var round = this.gameData.splice(index, 1);
	return round[0];
}

FamilyFeud.prototype.createBoard = function(data) {
	var me = this;
	this.sectionDOM.find('section').remove();

	var answers = data['Answers'];
	var question = data['Question'];

	this.questionDOM.text(question);
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
	var file;
	if(sound == 'bell') {
		file = 'ff-clang.wav';
	} else if(sound == 'buzzer') {
		file = 'buzzer.mp3';
	}

	if(file) {
		this.ifr.src = file;
	}
}

FamilyFeud.prototype.addClick = function(section) {
  var me = this;
	section.click(function() {
		var answer = $(this).find('.answer');
		if (!answer.hasClass('flipped')) {
			answer.addClass('flipped');
			me.playSound('bell');
			me.addScore(parseInt(section.find('.back span').text()));
		}
	})
}

FamilyFeud.prototype.setUpBuzzers = function() {
	$('#strike').on('click', function() {
		if (this.strikes < 3) {
			this.strikes++;
  			$('#strike-count').text(strikeCount);
			var strike = $('<span class="wrongx">X</span>')
			var wrong = $('#wrong');
			wrong.append(strike);
			playBuzzer();
			wrong.fadeIn('fast');
			setTimeout(function() {wrong.fadeOut('fast');}, 1500);
		}
	});
}

FamilyFeud.prototype.addScore = function(points) {
	this.points += points;
	this.scoreDOM.text(this.points);
}