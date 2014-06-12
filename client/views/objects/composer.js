Template.composer.rendered = function() {
	jQuery("#object-composer-container").droppable({
		  drop: function( event, ui ) {
			  var fromOid = jQuery(ui.helper).attr("data-oid");
			  
		  }
	});
};

Template.composer.events(
{
	'keyup #search' : function(e) {
		Session.set("composer_autoComplete", jQuery(e.target).val());
	}
});

Template.composer.helpers(
{
	autocompleteEntries : function()
	{
		return autoComplete(Session.get("composer_autoComplete"), this.obj);
	}
});