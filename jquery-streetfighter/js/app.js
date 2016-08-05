$(document).ready(function() {
	$('html').keydown(function(event) {
		if(event.which == 88) {
			$('.ryu-ready').hide();
			$('.ryu-throwing').hide();
			$('.ryu-still').hide();
			$('.ryu-cool').show();
		}
	})
	.keyup(function(event) {
		if(event.which == 88) {
			$('.ryu-ready').hide();
			$('.ryu-throwing').hide();
			$('.ryu-cool').hide();
			$('.ryu-still').show();
		}
	});
	
	$('.ryu').mouseenter(function() {
		if($('.ryu-cool').is(":hidden")) {
			$('.ryu-still').hide();
			$('.ryu-throwing').hide();
			$('.ryu-ready').show();
		}
	})
	.mouseleave(function() {
		if($('.ryu-cool').is(":hidden")) {
			$('.ryu-ready').hide();
			$('.ryu-still').show();
		}
	})
	.mousedown(function() {
		if($('.ryu-cool').is(":hidden")) {
			playHadouken();
			$('.ryu-ready').hide();
			$('.ryu-still').hide();
			$('.ryu-throwing').show();
			$('.hadouken').finish().show()
			.animate({'left': '400px'}, 500, function() {
            	$(this).hide();
				$(this).css('left', '-212px');
			});
		}
	})
	.mouseup(function() {
		if($('.ryu-cool').is(':hidden')) {
			$('.ryu-throwing').hide();
			$('.ryu-ready').show();
		}
	});
});

function playHadouken() {
	$('#hadouken-sound')[0].volume = 0.5;
	$('#hadouken-sound')[0].load();
	$('#hadouken-sound')[0].play();
}
