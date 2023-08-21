jQuery(document).ready(function($) {
	const bodyElement = $('body');
	const toggleButton = $('.dark-mode-toggle');
	let darkModeStorage = localStorage.getItem('darkMode');

	const applyDarkMode = () => {
		bodyElement.addClass('dark-mode');
		localStorage.setItem('darkMode', 'enabled');
	}

	const removeDarkMode = () => {
		bodyElement.removeClass('dark-mode');
		localStorage.setItem('darkMode', 'disabled');
	}

	const setButtonText = () => {
		if (bodyElement.hasClass('dark-mode')) {
			toggleButton.text(toggleButton.data('enabled-text'));
		} else {
			toggleButton.text(toggleButton.data('disabled-text'));
		}
	};

	toggleButton.on('click', function() {
		if (bodyElement.hasClass('dark-mode')) {
			removeDarkMode();
		} else {
			applyDarkMode();
		}
		setButtonText();
	});
	
	function updateLogoDisplay() {
		if ($('body').hasClass('dark-mode')) {
			$('.sdms-light-logo').hide();
			$('.sdms-dark-logo').show();
		} else {
			$('.sdms-dark-logo').hide();
			$('.sdms-light-logo').show();
		}
	}
	
	// Allows the user to select logo on the plugin settings page
	
	$('.upload_image_button').click(function(e) {
		e.preventDefault();
		var targetInputID = $(this).data('input-target');
		var targetInput = $('#' + targetInputID);
		var image = wp.media({ 
			title: 'Upload Image',
			multiple: false
		}).open().on('select', function(){
			var uploaded_image = image.state().get('selection').first();
			var image_url = uploaded_image.toJSON().url;
			targetInput.val(image_url);
		});
	});
	
	// Call this function whenever the mode changes
	updateLogoDisplay();
	$('.dark-mode-toggle').on('click', updateLogoDisplay);

	if (darkModeStorage === 'enabled') {
		console.log("Dark mode from local storage: enabled.");
		applyDarkMode();
	} else if (darkModeStorage === 'disabled') {
		console.log("Dark mode from local storage: disabled.");
		removeDarkMode();
	} else if (!bodyElement.hasClass('dark-mode')){
		console.log("Checking AJAX for default dark mode...");
		$.ajax({
			url: frontendajax.ajaxurl,
			method: 'POST',
			data: {
				action: 'get_sdms_default'
			},
			success: function(response) {
				console.log("Received AJAX response:", response);
				const data = JSON.parse(response);
				if (data.default === "1") {
					applyDarkMode();
				} else if (data.timezoneMode === "1" && isNightTimeInSiteTimeZone(data.siteTimeOffset)) {
					applyDarkMode();
				}
			}
		});
	}

	// Set initial button text on page load
	setButtonText();
});
