$(document).ready(function() {
	
	// set focus to item input
	$('.item_input').focus();
	
	// watch for enter key in input fields and process validation and result
	$('.item_input, .qty_input').on('keyup', function(e) {
	validate(e, $(this));
	});

	
	// watch for click on button and process validation and result
	$('.add').on('click', function(e){
        validate(e, $(this));	
	});

    // watch for click on remove button and remove item
	$('#items').on('click', '#remove', function(){
        $(this).parent().fadeOut(1000, function(){
            $(this).prevAll('.item_container').animate({
                'top': '-=50'
                }, 1000);
            $(this).remove();
        });
	});

    // watch for click on check button and striketrhough item
	$('#items').on('click', '#check', function(){
		$(this).parent().find('.item').toggleClass('check');
		$(this).parent().find('.qty').toggleClass('check');
	});
});



// validate input fields and process result

function validate(e, element) {
	var code = e.which;
	
	// set variable for item and quantity elements
	var item = element.parent().find('.item_input');
	var qty = element.parent().find('.qty_input');
	
	// if enter is pressed error check and display result if appropriate
	if(code==13 || code==1) {

		// validate item field
		if (item.val() === '') {
            item.addClass('error');
            item.focus();
        }
        else {
            item.removeClass('error');
        }

        // validate qty field
		if (qty.val() === '' || qty.val() <= 0) {
            qty.addClass('error');
            qty.focus();
        }
        else {
            qty.removeClass('error');
        }

        // item and qty field validate. process item.
		if (item.val() !== '' && qty.val() > 0) {

			addItem(item, qty);
		}
	}
}



// add provided item and qty to item listing

function addItem(item, qty) {
	
	// set input borders to initial state color
	item.removeClass('error');
	qty.removeClass('error');
	
	// create new divs for stored item and quantity
	$('#items').append('<div class="item_container"><div class="item">' + item.val() + '</div><div class="qty">' + qty.val() + '</div><button id="remove">&#x2717;</button><button id="check">&#x2713;</button></div>');
	
	// animate newly created divs to fade in and move down
	$('.item_container').animate({
		'top': '+=50',
		'opacity': 1
		}, 1000)
		.fadeIn(10);

	// reset input fields and set focus
	$('.item_input').val('').focus();		
	$('.qty_input').val('1');    
}