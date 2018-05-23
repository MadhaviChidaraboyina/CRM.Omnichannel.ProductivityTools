/* Wrapper for Accessibility test */


function RunAccessibilityTests(dataId) {
	if (axe && axe.a11yCheck) {
		axe.a11yCheck(dataId ? document.querySelectorAll("[data-id=\'".concat(dataId).concat("\']")): document, function (results) {
			// converts the "results" into a JSON string
			window.accResults = JSON.stringify(results);
		});
		return true;
	}
	else {
		return false;
	}
};

function GetAccessibilityTestResults() {
	return window.accResults;
};