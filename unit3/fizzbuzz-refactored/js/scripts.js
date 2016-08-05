$(document).ready(function() {
    
    $('.input').focus();
    
    var inputField = $('input');
    
    // watch for enter key
    $('input').on('keyup', function(e) {
	    var code = e.which;
    
	    // if enter key is pressed validate input
	    if (code == 13) {
    	    var userValue = inputField.val();
            
            // empty any previous fizzbuzz
            $('#fizzBuzz').empty();
    	    
    	    // validate user value
    	    validate(userValue);
	    }
	});
    
    // watch for submit button click
    $('.button').on('click', function(){
        var userValue = $('input').val();
        
        // empty any previous fizzbuzz
        $('#fizzBuzz').empty();
        
        // validate user input
        validate(userValue);
    });
    

// validate user input
var validate = function(userValue) {
    // if user input is empty provide error
    if (userValue === '') {
        $('#errorMessage').html('Please provide an integer');
        $('.input').addClass('error');
    }
    
    // if user input is not an integer provide error
    else if (isNaN(userValue)) {
        $('#errorMessage').html('Please provide an integer');
        $('.input').addclass('error');
    }
    
    // if user input is a negative number provide error
    else if (userValue <= 0) {
        $('#errorMessage').html('Please provide a positive integer');
        $('.input').addClass('error');
    }
    
    // if user input is not a whole number provide error
    else if (userValue % 1 != 0) {
        $('#errorMessage').html('Please provide a whole number');
        $('.input').addClass('error');
    }
    
    // user input must be valid. remove error and process fizzbuzz
    else {
        $('#errorMessage').empty();
        $('.input').removeClass('error');
        fizzBuzz(+userValue);
    }
};


    
// process FizzBuzz on user user value
var fizzBuzz = function(number) {
    
    // begin count from 1 to user input value
    for (var i = 1; i <= number; i++) {
        
        // if user value is divisible by 3
        if (i % 3 === 0) {
            
            // if user value is divisible by 3 and 5
            if (i % 5 === 0) {
                $('#fizzBuzz').append('fizzbuzz' + '<br />');
            }
            
            // user value is only divisible by 3
            else {
                $('#fizzBuzz').append('fizz' + '<br />');
            }
        }
        
        // if user value is only divisible by 5
        else if (i % 5 === 0) {
            $('#fizzBuzz').append('buzz' + '<br />');
        }
        
        // if user value is NOT divisible by 3 or 5
        else {
            $('#fizzBuzz').append(i + '<br />');
        }
    }
    
    $('.input').val('');
};
});

