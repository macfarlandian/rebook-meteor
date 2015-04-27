Template.newBook.helpers({
	foo: function () {
		// ...
	}
});

Template.newBook.events({
	'submit #nameBook': function (e) {
		e.preventDefault();

		// store this for the next step
		Session.set("bookName", e.target[0].value);

		$('.steps .step:first-child').removeClass('active');
		$('.steps .step:first-child').addClass('disabled');
		$('.steps .step:last-child').addClass('active')
		$('.segment.stepOne').hide();
		$('.segment.stepTwo').show();
	}
});