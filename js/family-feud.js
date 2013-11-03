
keslert.game.FamilyFeud = function(sectionDOM, scoreDOM) {
	this.answers = [];

	this.points = 0;
	this.stikes = 0;

	this.sectionDOM;
  	this.scoreDOM = scoreDOM;

	this.gameData = JSON.parse('data.json');
}

keslert.game.FamilyFeud.prototype.getRoundData = function() {
	var index = Math.floor(Math.random() * this.gameData['FamilyFeud'].length);

	var round = rounds.splice(index, 1);
	return round;
}

keslert.game.FamilyFeud.prototype.createBoard = function() {
	this.sectionDOM.find('section').remove();

	var roundData = getRoundData();
	var answers = roundData['answers'];
	var question = roundData['question'];

	for(var i = 0; i < 10; i++) {
		var section;
		if(i < answers.length) {
			section = createSection(answers[i]['text'], answers[i]['points'], i);
		} else {
			section = createSection(null, null, i);
		}
		this.sectionDOM.append(section);
	}
}

keslert.game.FamilyFeud.prototype.createSection = function(answer, points, i) {
	var section = $('<section id="section_'+i+'"></section');
	var inner = $('<div></div>');
	section.append(inner);

	if(answer && points) {
		section.addClass('active');
		inner.addClass('answer');
		inner.append('<figure class="front"><span>'+answer+'</span></figure>');
		inner.append('<figure class="back"><span>'+points+'</span></figure>');
		section.o
	} else {
		inner.addClass('inactive');
	}

	return section;
}


$(document).ready(function(){
	ifr = document.getElementById('sound');
	sum = 0;
	strikeCount = 0;
	
	setUpAnswers();
	setUpBuzzers();
});


keslert.game.FamilyFeud.prototype.playSound = function(sound) {
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

keslert.game.FamilyFeud.prototype.addClick = function(section) {
  var me = this;
	section.click(function() {
		var answer = $(this).find('.answer');
		if (!answer.hasClass('flipped')) {
			answer.addClass('flipped');
			me.playBell();
			me.addScore(section.find('.back span').val());
		}
	})
}

function setUpBuzzers() {
	$('#strike').on('click', 
			function() {
				if (strikeCount < 3){
					strikeCount++;
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

keslert.game.FamilyFeud.prototype.sumScores = function(points) {
	this.points += points;
	this.scoreDOM.text(sum);
}