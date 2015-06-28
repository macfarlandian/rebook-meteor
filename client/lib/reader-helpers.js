makeHighlight = function(targetEl, char_range){
	// TODO: this is a dirty hack because it relies on there being no inline code (ie no markdown)
    
    // clear any spans
    $(targetEl).text($(targetEl).text());
    $('.readbook .ui.message').remove();

    var text = targetEl.firstChild;
    var lastNode = text.splitText(char_range[1]);
    var highlight = text.splitText(char_range[0]);
    var span = document.createElement('span');
    span.appendChild(highlight);
    targetEl.insertBefore(span, lastNode);
    $(span).addClass('highlight');
    var jSpan = $(span);
    
    var shareThing = $('<div></div>')
    	.addClass("shareThing ui floating compact black message")
    	.append('<i class="close icon"></i>')
    	.appendTo('.readbook');
    
	$('.message .close').on('click', function() {
	  $(this).closest('.message').fadeOut();
	});

    shareThing.css({
    	position: "absolute",
    	top: jSpan.offset().top + jSpan.height(),
    	left: jSpan.offset().left,
    	zIndex: 100,
    });

    shareThing.append('<div class="header">Share This Quote</div>');
    shareThing.append('<p><a class="ui blue labeled icon button"><i class="twitter icon"></i>Twitter</a></p>');
    shareThing.append('<p><a class="ui labeled icon button"><i class="tumblr icon"></i>Tumblr</a></p>');
    shareThing.append('<p><a class="ui green labeled icon button"><i class="pied piper icon"></i>Pied Piper</a></p>');

    shareThing.find('.blue.button').on('click', function(e){
    	$('#shareModal').modal('show');
    })

}