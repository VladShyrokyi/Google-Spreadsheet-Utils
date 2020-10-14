class RequestToService {
    constructor() {
        this.service = getOAuthService();
        this.accessToken = this.service.getAccessToken();
    }
    checkAuthorized(Debug) {
        let check = this.service.hasAccess();
        if (check) {
            Debug(Debug, `Сервис подключен`);
            return check;
        }
    }
    CreateParam(method, para, Debug) {
        let headers = {
            'Authorization': Utilities.formatString('Bearer %s', this.accessToken)
        };
        let param = {
            'headers': headers,
            'method': method,
            'muteHttpExceptions': true,
        }
        if (param != false && isObject(param)) {
            param['contentType'] = 'application/json';
            param['payload'] = para;
        }
        if (Debug(Debug, param) == CANCEL) { return CANCEL};
    }
    CheckResponse(response) {
        let code = response.getResponseCode();
        // Success
        if (code >= 200 && code < 300) {
            return response.getContentText("utf-8");
            
            // Not fully authorized for this action.
        } else if (code == 401 || code == 403) {
            maybeAuthorized = false;
        } else {
            console.error("Backend server error (%s): %s", code.toString(), 
            resp.getContentText("utf-8"));
            throw ("Backend server error: " + code);
        }
    }
    Debug(numCheck = Number, message) {
        if (numCheck == 1) {
            let response = showMessageBox(`Debug`, message)
            return response;
        } else {
            return OK;
        }
    }
    Request(SERVICE, method, param, Debug) {
        let maybeAuthorized = this.checkAuthorized(Debug);
        let CheckContinue;
        if (!maybeAuthorized) {
            let authorizationUrl = this.service.getAuthorizationUrl();
            let response = showMessageBox(`Open the following URL and re-run the script: `,
            authorizationUrl);
            if (response == CANCEL) { 
                CheckContinue = false;
            } else if (response == OK){
                CheckContinue = true;
            }
        }
        if (CheckContinue) {
            if (this.CreateParam(method, param, Debug) == CANCEL) { return };
            let response = UrlFetchApp.fetch(SERVICE, param);
            return this.CheckResponse(response);
        }
    }
}