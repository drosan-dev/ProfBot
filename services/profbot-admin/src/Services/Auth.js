require('dotenv').config();
var CryptoJS = require("crypto-js");

class AuthManager {
    static instance;

    constructor() {
        if (this.instance) {
            return this.instance;
        }

        this.instance = this;
        this._secret = process.env.REACT_APP_SECRET;
    }

    _encode = (data) => {
        var encoded = CryptoJS.AES.encrypt(data, this._secret);
        return encoded
    }

    _decode = (cipher) => {
        var bytes  = CryptoJS.AES.decrypt(cipher.toString(), this._secret);
        var data = bytes.toString(CryptoJS.enc.Utf8);

        return data
    }

    getAccessToken = () => {
        return this._decode(localStorage.getItem('access_token'))
    }

    getRefreshToken = () => {
        return this._decode(localStorage.getItem('refresh_token'))
    }

    getId = () => {
        return this._decode(localStorage.getItem('id'))
    }

    isAuthorized = () => {
        return localStorage.getItem('id') && localStorage.getItem('access_token') && localStorage.getItem('refresh_token');
    }

    signout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }

    signin = (id, access, refresh) => { 
        localStorage.setItem('id', this._encode('' + id))
        localStorage.setItem('access_token', this._encode(access));
        localStorage.setItem('refresh_token', this._encode(refresh));
    }
}

export default AuthManager;