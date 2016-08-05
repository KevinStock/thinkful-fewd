// Terms for skill list
var skillList = ['HTML','CSS','Javascript','jQuery','PHP','MySQL','Git'];

var skillListCount = -1;

// repo names that should not be displayed
var repoFilter = ['fizzbuzz', 'fizzbuzz-refactored', 'hello-world-jquery', 'arduino-environment-monitor', 'hello-world-with-ajax', 'Google-Clone', 'portfolio'];

var repoCommits;

$(document).ready(function() {
    var skillInterval = setInterval(function() {skillDisplay()}, 400);
    
    $('#skills').on('mouseenter', function() {
        clearInterval(skillInterval);
    })
    
    $('#skills').on('mouseleave', function() {
        skillInterval = setInterval(function() {skillDisplay()}, 400);
    })
    
    getRepos();
    
    
    $('#repoContainer').on('mouseenter', '.repo', function() {
        $(this).find('.repoDetails').show();
    })
    
    $('#repoContainer').on('mouseleave', '.repo', function() {
        $(this).find('.repoDetails').hide();
    })
})


/*
  This function displays the skill list and repeats the list forever  
*/
function skillDisplay() {
    if (skillListCount == skillList.length - 1) {
        skillListCount = 0;
    }
    else {
        skillListCount++;
    }
    $('.skill').text(skillList[skillListCount]);
}


/*
  This function gets all repos for a user, filters the list based on repo filter
  and calls createRepos to generate html for each repo  
*/
function getRepos() {
    var username = 'kevinstock';
    
	var request = {access_token: '8a5baccc4a904b12e75a447bd35803bc3358101b'};
	
	var result = $.ajax({
		url: 'http://api.github.com/users/' + username + '/repos',
		data: request,
		dataType: 'jsonp',
		type: 'GET',	
	})
	.done(function(result) {
		
		// get each repo object
		$.each(result.data, function(i, repo) {
    		
    		// check for repo name matches on the filter list
    		var matches = 0;
            for (var j = 0; j < repoFilter.length; j++) {
                if (repo.name == repoFilter[j]) {
                    matches++;                }
            }
            
            // if repo is not on the filter list then create the repo HTML
            if (matches == 0) {
                
                createRepos(repo);
            }
		})
		
	})
	.fail(function(jqXHR, error, errorThrown) {
		$('.error').append(error);
	});
};


/*
  This function creates individual html divs for each repo
  and pushes them to the page  
*/
function createRepos(repoData) {
    var thisRepo;
    
    var result = $.ajax({
        url: './repo.html',
        dataType: 'html',
        type: 'GET',
    })
    .done(function(result) {
        
        // clone the html template
        thisRepo = $(result).clone();
        
        // apply repo name to correct location
        var repoName = thisRepo.find('.repoName');
        repoName.append(repoData.name);
        
        // apply repo description correct location
        var repoDescription = thisRepo.find('.repoDescription');
        repoDescription.append(repoData.description);
        
        // apply preview image in correct location
        var repoPreview = thisRepo.find('.repoPreview img');
        repoPreview.attr('src', 'images/' + repoData.name + '.jpg');
        repoPreview.attr('alt', repoData.name + ' Preview Image');
        
        var repoActivity = thisRepo.find('.repoActivity');
        var time = new Date(repoData.pushed_at).toLocaleString();
        repoActivity.append(time);
        
        var repoLink = thisRepo.find('.remoteLink');
        repoLink.attr('href', repoData.homepage);
        
        var githubLink = thisRepo.find('.githubLink');
        githubLink.attr('href', repoData.svn_url);
        githubLink.append('Project on Github');
        
        // apply modified html template to page
        $('#repoContainer').append(thisRepo);
    })
    .fail(function(jqXHR, error, errorThrown) {
        $('.error').append(error);
    });
};