'use strict';

app.directive('oauthButton', function () {
	return {
		scope: {
			providerName: '@'
		},
		restrict: 'E',
		templateUrl: '/js/common/directives/google-oauth-button/google-oauth.template.html'
	}
});