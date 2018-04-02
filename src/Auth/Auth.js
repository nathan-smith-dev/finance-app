import auth0 from 'auth0-js';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'iah.auth0.com',
    clientID: 'JYAeVHWEmE6FggPEkWmhzKuN3QEhuFVU',
    redirectUri: 'http://localhost:3000/callback',
    audience: 'https://iah.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid'
  });

  login() {
    this.auth0.authorize();
  }
}