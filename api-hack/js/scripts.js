$(document).ready(function() {
	
	// hide the search elements
	$('#movie_search').hide();
	$('#television_search').hide();
	
	// get TMDB Config data
	getTMDBConfig();
	
	
	
	
	// watch for click on movie category and display movie search
	$('#movie_button').on('click', function() {
		// if television search is visible - hide it and show movie search
		if ($('#television_search').is(':visible')) {
			$('#television_search').fadeToggle('slow', function() {
				$('#movie_search').fadeToggle('slow', function() {
				});				
			});
		}
		else {
			$('#movie_search').fadeToggle('slow', function() {
			});
		}
		
		$('.movie_title').focus();
	});
	
	// watch for click on television category and display television search
	$('#tv_button').on('click', function() {
		// if movie search is already visible - hide it and show television search
		if ($('#movie_search').is(':visible')) {
			$('#movie_search').fadeToggle('slow', function() {
				$('#television_search').fadeToggle('slow', function() {
				});
			});
		}
		else {
			$('#television_search').fadeToggle('slow', function() {
			});
		}
	});
	
	
	
	$('#movie_title_search_term').on('click', function(event) {
		event.preventDefault();
		
		var movie_title = $(this).siblings('.movie_title').val();
		
		if (!movie_title) {
			alert('Please Enter a Movie Title');
		}
		else {
		
			$('#movie_search').fadeToggle('slow', function() {
				});
				
			$('#results').html('');
			$('.search_term').val('');
			
			getMovies(movie_title);
		}
	});
	
	
	
	
	$('body').on('click', '.movie', function(event) {
		getMovieDetail($(this).data('movie-id').id);
		
	});
	
	
	$('body').on('click', '.person', function(event) {
		getMoviesForActor($(this).data('person-id').id);
		
	});
	
	
	$('#results').on('click', '#back', function(event) {
		$('#results .movie_details').remove();
		$('.movie').show();
	});
	
	
});



// store api key for tmdb
var tmdb_api_key = '55ed738b60ef790a8416240c89a2f007';

// variable to store result of TMDB Config call
var TMDBConfig;

// variable to store the movie results
var movies;
var movie_detail;
var movie_credits;
var popular_movies;
var movie_videos;
var youtubePrefix = 'https://www.youtube.com/watch?v=';
var youtubeThumbnailPrefix = 'http://img.youtube.com/vi/';


// Get TMDB Configuration data
var getTMDBConfig = function() {
	var request = {api_key: tmdb_api_key};
	
	var result = $.ajax({
		url: "http://api.themoviedb.org/3/configuration",
		data: request,
		dataType: "json",
		type: "GET",	
	})
	.done(function(result) {
		TMDBConfig = result;
		getPopularMovies();
	})
	.fail(function(jqXHR, error, errorThrown) {
		$('.search-results').append(error);
	});
};


// create movie poster elements and return it for display
var showPosters = function(movie) {
	var result = $('#template .movie').clone();
	
	result.data('movie-id', { id: movie.id });
	
	var image = result.find('img');
	
	if (movie.poster_path !== null) {
		var posterImage = TMDBConfig.images.base_url + TMDBConfig.images.poster_sizes[2] + movie.poster_path;

		image.attr('src', posterImage);
	}
	else {
		image.attr('src', 'images/smiling-monkey.jpg');
		image.attr('width', '185px');
	}
	
	var movie_name = result.find('.movie_name');
	movie_name.text(movie.original_title);

	return result;
};



// create movie detail elements and return it for display
var createMovieDetail = function(movie_detail) {
	
	
	var result = $('#template .movie_details').clone();
	
	if (movie_detail.backdrop_path !== null) {
		var movieBackdrop = TMDBConfig.images.base_url + TMDBConfig.images.backdrop_sizes[2] + movie_detail.backdrop_path;
		result.find('.titleAndImageContainer').css('background-image', 'url(' + movieBackdrop + ')');
	}
	
	result.find('.movie_title').text(movie_detail.original_title);
	
	var image = result.find('.movie_poster_large img');
	
	if (movie_detail.poster_path !== null) {
		var posterImage = TMDBConfig.images.base_url + TMDBConfig.images.poster_sizes[3] + movie_detail.poster_path;

		image.attr('src', posterImage);
	}
	else {
		image.attr('src', 'images/smiling-monkey.jpg');
		image.attr('width', '185px');
	}
	
	var synopsis = result.find('.movie_synopsis');
	synopsis.text(movie_detail.overview);
	
	var releaseDate = result.find('.movie_release_date');
	releaseDate.text(movie_detail.release_date);
	
	var runtime = result.find('.movie_runtime');
	runtime.text(movie_detail.runtime + ' minutes');
	
	var movie_video_list = movie_videos.results;
	movie_video_list.sort(function(a, b) {
		var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});
	
	
	var videos = result.find('.movie_videos');
	$.each(movie_videos.results, function(i, video) {
		
		videos.append(createMovieVideos(video));
	});
	
	return result;
};



// create movie cast detail elements and return it for display
var createMovieCastDetail = function(person) {
	var result = $('#template .person').clone();

		result.data('person-id', { id: person.id });
		var person_image = result.find('.person_photo img');
		
		if (person.profile_path !== null) {
			var personImage = TMDBConfig.images.base_url + TMDBConfig.images.profile_sizes[0] + person.profile_path;

			person_image.attr('src', personImage);
		}
		else {
			person_image.attr('src', 'images/smiling-monkey.jpg');
			person_image.attr('width', '45px');
		}
		
		var person_name = result.find('.person_name');
		person_name.text(person.name);
		
		var characterName = result.find('.person_character_name');
		characterName.text('as ' + person.character);
	return result;
	
};



var createMovieVideos = function(video) {
	var result = $('#template .video').clone();
	var youtubeThumbnail = youtubeThumbnailPrefix + video.key + '/1.jpg';

	var video_link = result.find('.video_link');
	video_link.attr('href', youtubePrefix + video.key);
	
	var video_thumb = result.find('.video_thumb img');
	video_thumb.attr('src', youtubeThumbnail);
	
	var video_name = result.find('.video_name');
	video_name.text(video.name);
	
	return result;
}



// Append the created elements for movie detail to the page
var showMovieDetail = function(movie_detail) {
	$('#results .movie').hide();
	$('#results .movie_details').remove();
	$('.movie_details').show();
	var movie_detail = createMovieDetail(movie_detail);

	$('#results').append(movie_detail);
	window.scrollTo(0, 0);
	
	$.each(movie_credits.cast, function(i, person) {
		var person = createMovieCastDetail(person);
		$('#results .cast').append(person);
	});
	

};



// Call the TMDB API to get movies from a search term
var getMovies = function(search_term) {
	
	// the parameters we need to pass in our request to TMDB's API
	var request = {api_key: tmdb_api_key,
					query: encodeURIComponent(search_term),
					search_type: 'ngram'};
	
	var result = $.ajax({
		url: "http://api.themoviedb.org/3/search/movie",
		data: request,
		dataType: "json",
		type: "GET",
		})
	.done(function(result){
    	$('#error').empty().hide();
		movies = result;
		
		if(movies.total_results === 0) {
            $('#error').text('Zero results found. Please try again.').show();
        }
        else {
		    displayMovieCovers(movies);
        }
	})
	.fail(function(jqXHR, error, errorThrown){
		$('#error').append(error).show();
	});
};






// Append the created elements for movie results to the page
var displayMovieCovers = function(movies) {
	if (movies.hasOwnProperty('results')) {	
		$('.movie_details').hide();
		$('.movie').show();
		$('#results').append('<div class="movies"></div>');
		$.each(movies.results, function(i, movie) {
			var image = showPosters(movie);
			$('#results .movies').append(image);
		});
	}
	else if (movies.hasOwnProperty('cast')) {
		$('.movies').remove();
		$('.movie_details').hide();
		$('.movie').show();
		$('#results').append('<div class="movies"></div>');
		$.each(movies.cast, function(i, movie) {
			var image = showPosters(movie);
			$('#results .movies').append(image);
		});		
	}
};




// Call the TMDB API and get Movie Detail
var getMovieDetail = function(movie_id) {
	
	// the parameters we need to pass in our request to TMDB's API
	var request = {api_key: tmdb_api_key};
	
	var result = $.ajax({
		url: "http://api.themoviedb.org/3/movie/" + movie_id,
		data: request,
		dataType: "json",
		type: "GET",
		})
	.done(function(result){
    	$('#error').empty().hide();
		movie_detail = result;
		getMovieCredits(movie_id);
		
	})
	.fail(function(jqXHR, error, errorThrown){
		$('#error').append(error).show();
	});
};





// Call the TMDB API and get cast information
var getMovieCredits = function(movie_id) {
	
	// the parameters we need to pass in our request to TMDB's API
	var request = {api_key: tmdb_api_key};
	
	var result = $.ajax({
		url: "http://api.themoviedb.org/3/movie/" + movie_id + "/credits",
		data: request,
		dataType: "json",
		type: "GET",
		})
	.done(function(result){
    	$('#error').empty().hide();
		movie_credits = result;
		getMovieVideos(movie_id);
	})
	.fail(function(jqXHR, error, errorThrown){
		$('#error').append(error).show();
	});
};


// Call the TMDB API and get cast information
var getMovieVideos = function(movie_id) {
	
	// the parameters we need to pass in our request to TMDB's API
	var request = {api_key: tmdb_api_key};
	
	var result = $.ajax({
		url: "http://api.themoviedb.org/3/movie/" + movie_id + "/videos",
		data: request,
		dataType: "json",
		type: "GET",
		})
	.done(function(result){
    	$('#error').empty().hide();
		movie_videos = result;
		showMovieDetail(movie_detail);
	})
	.fail(function(jqXHR, error, errorThrown){
		$('#error').append(error).show();
	});
};



// Call the TMDB API to get movies from a search term
var getPopularMovies = function() {
	
	// the parameters we need to pass in our request to TMDB's API
	var request = {api_key: tmdb_api_key};
	
	var result = $.ajax({
		url: "http://api.themoviedb.org/3/movie/popular",
		data: request,
		dataType: "json",
		type: "GET",
		})
	.done(function(result){
    	$('#error').empty().hide();
		popular_movies = result;
		displayMovieCovers(popular_movies);
	})
	.fail(function(jqXHR, error, errorThrown){
		$('#error').append(error).show();
	});
};




// Call the TMDB API to get movies from a search term
var getMoviesForActor = function(person_id) {
	
	// the parameters we need to pass in our request to TMDB's API
	var request = {api_key: tmdb_api_key};
	
	var result = $.ajax({
		url: "http://api.themoviedb.org/3/person/" + person_id + "/movie_credits",
		data: request,
		dataType: "json",
		type: "GET",
		})
	.done(function(result){
    	$('#error').empty().hide();
		movies = result;
		
		if(movies.total_results === 0) {
            $('#error').text('Zero results found. Please try again.').show();
        }
        else {
		    displayMovieCovers(movies);
        }
	})
	.fail(function(jqXHR, error, errorThrown){
		$('#error').append(error).show();
	});
};
