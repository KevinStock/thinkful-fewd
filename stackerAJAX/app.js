$(document).ready( function() {
	$('.unanswered-getter').submit( function(event){
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		getUnanswered(tags);
	});
	
	$('.inspiration-getter').submit( function(event){
		$('.results').html('');
		var tag = $(this).find("input[name='answerers']").val();
		var period = $(this).find('select').val();
		getAnswerers(tag,period);
	});
});

// this function takes the question object returned by StackOverflow 
// and creates new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone();
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the #views for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" href=http://stackoverflow.com/users/' + question.owner.user_id + ' >' +
													question.owner.display_name +
												'</a>' +
							'</p>' +
 							'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};


var showUser = function(user) {

	// clone our result template code
	var result = $('.templates .answerers').clone();
	
	// Apply the user image in result
	var userImage = result.find('.userImage img');
	userImage.attr('src', user.user.profile_image);

	// Apply the Profile Link to result
	var userLinks = result.find('a');
	userLinks.attr('href', user.user.link);
	
	// Apply the user's display name in result
	var userName = result.find('.name');
	userName.text(user.user.display_name);	
	
	// Apply the user's reputation in result
	var userRep = result.find('.userReputation');
	userRep.text(numberWithCommas(user.user.reputation));
	
	// Apply the user's post count in result
	var userPosts = result.find('.userPostCount');
	userPosts.text(numberWithCommas(user.post_count));
	
	var userType = result.find('.userType');
	userType.text(user.user.user_type);
	
	var userScore = result.find('.userScore');
	userScore.text(numberWithCommas(user.score));
	
	var acceptRate = result.find('.acceptRate');
	console.log(user.user.accept_rate);
	if (!user.user.accept_rate) {
		acceptRate.text(0);
	}
	else {
		acceptRate.text(user.user.accept_rate);
	}
	
	return result;
};


// this function takes the results object from StackOverflow
// and creates info about search results to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query;
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {
	
	// the parameters we need to pass in our request to StackOverflow's API
	var request = {tagged: tags,
								site: 'stackoverflow',
								order: 'desc',
								sort: 'creation'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/questions/unanswered",
		data: request,
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(result){
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);

		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};


var getAnswerers = function(tag,period) {

	var request = {tag: tag,
					site: 'stackoverflow'};
	
	var result = $.ajax({
		url: "http://api.stackexchange.com/2.2/tags/" + tag + "/top-answerers/" + period,
		data: request,
		dataType: "jsonp",
		type: "GET",
	})
	.done(function(result){
		var searchResults = showSearchResults(request.tag, result.items.length);
		
		$('.search-results').html(searchResults);
		
		$.each(result.items, function(i, item) {
			var user = showUser(item);
			$('.results').append(user);	
		});
	})
	.fail(function(jqXHR, error, errorThrown){
	var errorElem = showError(error);
	$('.search-results').append(errorElem);
	});
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
