const fs = require('fs');
const promisify = require('util').promisify;
const {google} = require('googleapis');
const readFile = promisify(fs.readFile);

import * as CREDENTIALS_PATH from '../gmail-tools/send-mail-example/credentials.json';
import * as TOKEN_PATH from '../gmail-tools/send-mail-example/token.json';


export function getGmailClient() {
    const credentials = fs.readFileSync(CREDENTIALS_PATH);
    const token = fs.readFileSync(TOKEN_PATH);
    const oauthClient = getOAuthClient(makeCredentials(credentials, token));

    return google.gmail({version: 'v1', auth: oauthClient});
}

function makeCredentials(credentials: string, token: string) :any{
    return {
        params: JSON.parse(credentials).installed,
        token: JSON.parse(token),
    };
}

function getOAuthClient(credentials: any): any {
    const oAuth2Client = new google.auth.OAuth2(
        credentials.params.client_id,
        credentials.params.client_secret,
        credentials.params.redirect_uris[0]
    );
    oAuth2Client.setCredentials(credentials.token);
    return oAuth2Client;
}
  
