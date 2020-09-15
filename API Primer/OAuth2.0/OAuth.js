
/**
 * Attempts to access a non-Google API using a constructed service
 * object.
 *
 * If your add-on needs access to non-Google APIs that require OAuth,
 * you need to implement this method. You can use the OAuth1 and
 * OAuth2 Apps Script libraries to help implement it.
 *
 * @param {String} url         The URL to access.
 * @param {String} method_opt  The HTTP method. Defaults to GET.
 * @param {Object} headers_opt The HTTP headers. Defaults to an empty
 *                             object. The Authorization field is added
 *                             to the headers in this method.
 * @return {HttpResponse} the result from the UrlFetchApp.fetch() call.
 */
function accessProtectedResource(url, method_opt, headers_opt, POST_Object, Debug = 0) {
    let service = getOAuthService();
    let maybeAuthorized = service.hasAccess();

    if (Debug == 1) showMessageBox(`Сервис подключен`);
    
    if (maybeAuthorized) {
      
      if (Debug == 1) showMessageBox(`Авторизован`);

      let accessToken = service.getAccessToken();
      let method = method_opt || 'get';
      let headers = headers_opt || {};
      headers['Authorization'] = Utilities.formatString('Bearer %s', accessToken);
      let param = {
        'headers': headers,
        'method' : method,
        'muteHttpExceptions': true, // Prevents thrown HTTP exceptions.
      }
      if (POST_Object != false) {
        param['contentType'] = 'application/json';
        param['payload'] = JSON.stringify(POST_Object);
      }

      if (Debug == 1) showMessageBox(`Debug`, JSON.stringify(param));
      
      var resp = UrlFetchApp.fetch(url, param);
      var code = resp.getResponseCode();

      // Success
      if (code >= 200 && code < 300) {
        return resp.getContentText("utf-8");

      // Not fully authorized for this action.
      } else if (code == 401 || code == 403) {
        maybeAuthorized = false;
      } else {
        console.error("Backend server error (%s): %s", code.toString(), 
        resp.getContentText("utf-8"));
        throw ("Backend server error: " + code);
      }
    }
  
    if (!maybeAuthorized) {
        var authorizationUrl = service.getAuthorizationUrl();
        Logger.log('Open the following URL and re-run the script: %s', authorizationUrl);
        showMessageBox(`Open the following URL and re-run the script: `, authorizationUrl);
    }
}

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
  function getOAuthService() {
    return OAuth2.createService(SERVICE_NAME)
        .setAuthorizationBaseUrl(SERVICE_AUTH_URL)
        .setTokenUrl(SERVICE_AUTH_TOKEN_URL)
        .setClientId(CLIENT_ID)
        .setClientSecret(CLIENT_SECRET)
        .setScope(SERVICE_SCOPE_REQUESTS)
        .setCallbackFunction('authCallback')
        .setCache(CacheService.getUserCache())
        .setPropertyStore(PropertiesService.getUserProperties())
        .setParam('login_hint', Session.getActiveUser().getEmail())
        .setParam('access_type', 'offline')
        .setParam('approval_prompt', 'force');
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
  function authCallback(callbackRequest) {
    var authorized = getOAuthService().handleCallback(callbackRequest);
    if (authorized) {
      return HtmlService.createHtmlOutput(
        'Success! You can close this tab.');
    } else {
      return HtmlService.createHtmlOutput('Denied');
    }
  }
  
  /**
   * Unauthorizes the non-Google service. This is useful for OAuth
   * development/testing.  Run this method (Run > resetOAuth in the script
   * editor) to reset OAuth to re-prompt the user for OAuth.
   */
  function resetOAuth() {
    getOAuthService().reset();
  }