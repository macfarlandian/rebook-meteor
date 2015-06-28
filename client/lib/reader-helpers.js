makeHighlight = function(targetEl, char_range){
	// TODO: this is a dirty hack because it relies on there being no inline code (ie no markdown)
    
    // clear any spans
    $(targetEl).text($(targetEl).text());

    var text = targetEl.firstChild;
    var lastNode = text.splitText(char_range[1]);
    var highlight = text.splitText(char_range[0]);
    var span = document.createElement('span');
    span.appendChild(highlight);
    targetEl.insertBefore(span, lastNode);
    $(span).addClass('highlight');
}