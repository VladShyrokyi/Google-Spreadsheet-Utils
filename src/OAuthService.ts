class OAuthService {
	/**
	 * Create a new OAuth service to facilitate accessing an API.
	 * This example assumes there is a single service that the add-on needs to
	 * access. Its name is used when persisting the authorized token, so ensure
	 * it is unique within the scope of the property store. You must set the
	 * client secret and client ID, which are obtained when registering your
	 * add-on with the API.
	 *
	 * See the Apps Script OAuth2 Library documentation for more
	 * information:
	 *   https://github.com/googlesamples/apps-script-oauth2#1-create-the-oauth2-service
	 *
	 *  @return A configured OAuth2 service object.
	 */
	static get service(): GoogleAppsScriptOAuth2.OAuth2Service {
		return OAuth2.createService(SERVICE_NAME)
			.setAuthorizationBaseUrl(SERVICE_AUTH_URL)
			.setTokenUrl(SERVICE_AUTH_TOKEN_URL)
			.setClientId(CLIENT_ID)
			.setClientSecret(CLIENT_SECRET)
			.setCallbackFunction(`authCallback`)
			.setCache(CacheService.getUserCache()!)
			.setPropertyStore(PropertiesService.getUserProperties())
			.setScope(SERVICE_SCOPE_REQUESTS)
			.setParam(`login_hint`, Session.getActiveUser().getEmail())
			.setParam(`access_type`, `offline`)
			.setParam(`approval_prompt`, `force`);
	}
	static get isAuthorized(): Boolean {
		return this.service.hasAccess();
	}
	static get token(): string {
		return this.service.getAccessToken();
	}

	/**
	 * Attempts to access a non-Google API using a constructed service
	 * object.
	 *
	 * If your add-on needs access to non-Google APIs that require OAuth,
	 * you need to implement this method. You can use the OAuth1 and
	 * OAuth2 Apps Script libraries to help implement it.
	 *
	 * @param {String} url         The URL to access.
	 * @param {String} method  The HTTP method. Defaults to GET.
	 * @param {Object} params The UrlFetchApp.fetch params.
	 *                        Default to Header with Authorization and muteHttpExceptions.
	 * @return {HttpResponse} the result from the UrlFetchApp.fetch() call.
	 */
	static Request(
		url: string,
		method: GoogleAppsScript.URL_Fetch.HttpMethod,
		params?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions
	): string | void {
		let maybeAuth = this.isAuthorized;
		if (maybeAuth) {
			CustomUI.showMessageBox(`Confirm!`, `Authorized!`);
			let _params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {};

			let headers = params?.headers || {};
			headers[`Authorization`] = Utilities.formatString(
				`Bearer %s`,
				this.token
			);
			_params[`headers`] = headers;

			let methodFromParams = params?.method || `get`;
			_params[`method`] = method || methodFromParams;

			let muteHttpExceptions = params?.muteHttpExceptions || true;
			_params[`muteHttpExceptions`] = muteHttpExceptions || true;

			let res = UrlFetchApp.fetch(url, _params);
			let code = res.getResponseCode();

			if (code >= 200 && code < 300) {
				return res.getContentText();
			} else if (code == 401 || code == 403) {
				maybeAuth = false;
			} else {
				console.error(
					"Backend server error (%s): %s",
					code.toString(),
					res.getContentText("utf-8")
				);
				throw "Backend server error: " + code;
			}
		}
		if (maybeAuth == false) {
			let AuthorizationURL = this.service.getAuthorizationUrl();
			//need redirect
			let template = HtmlService.createTemplate(
				`<a href=<?= AuthorizationURL ?> target="_blank">Authorize</a>. 
				Reopen the sidebar when the authorization is complete.`
			);
			template.AuthorizationURL = AuthorizationURL;
			let page = template.evaluate();
			return SpreadsheetApp.getUi().showSidebar(page);
			// CustomUI.showMessageBox(
			// 	`Open the following URL and re-run the script: `,
			// 	AuthorizationURL
			// );
		}
	}
	/**
	 * Unauthorized the non-Google service. This is useful for OAuth
	 * development/testing.  Run this method (Run > resetOAuth in the script
	 * editor) to reset OAuth to re-prompt the user for OAuth.
	 */
	static Reset(): void {
		this.service.reset();
	}
}

/**
 * Boilerplate code to determine if a request is authorized and returns
 * a corresponding HTML message. When the user completes the OAuth2 flow
 * on the service provider's website, this function is invoked from the
 * service. In order for authorization to succeed you must make sure that
 * the service knows how to call this function by setting the correct
 * redirect URL.
 *
 * The redirect URL to enter is:
 * https://script.google.com/macros/d/<Apps Script ID>/usercallback
 *
 * See the Apps Script OAuth2 Library documentation for more
 * information:
 *   https://github.com/googlesamples/apps-script-oauth2#1-create-the-oauth2-service
 *
 *  @param {Object} callbackRequest The request data received from the
 *                  callback function. Pass it to the service's
 *                  handleCallback() method to complete the
 *                  authorization process.
 *  @return {HtmlOutput} a success or denied HTML message to display to
 *          the user. Also sets a timer to close the window
 *          automatically.
 */
function authCallback(
	callBackRequest: object
): GoogleAppsScript.HTML.HtmlOutput {
	let isAuthorized = OAuthService.service.handleCallback(callBackRequest);
	if (isAuthorized) {
		//need redirect
		return HtmlService.createHtmlOutput(`Success! You can close this tab.`);
	} else {
		return HtmlService.createHtmlOutput(`Denied`);
	}
}
//1UuU0MuJoE4yb-eaWzpBnywur22JwpkR5mdo5ySRnjnrVUweIzexzYFcK
//1LhxZcQHFV8OH3FQL7pQYwqyuxBTO4DmUxkYaOueNh0Vzy7Lff9AoNTth
//https://script.google.com/macros/d/{SCRIPT ID}/usercallback
//https://script.google.com/macros/d/1UuU0MuJoE4yb-eaWzpBnywur22JwpkR5mdo5ySRnjnrVUweIzexzYFcK/usercallback
//https://script.google.com/macros/d/1LhxZcQHFV8OH3FQL7pQYwqyuxBTO4DmUxkYaOueNh0Vzy7Lff9AoNTth/usercallback
