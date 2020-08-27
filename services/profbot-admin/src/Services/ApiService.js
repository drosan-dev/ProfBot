import axios from "axios";
import AuthManager from './Auth'

class ApiService {
    baseUrl = "http://212.109.13.149";

    constructor() {
        this.auth = new AuthManager();
    }

    createStep(step, onSuccess, onError) {
        const access = this.auth.getAccessToken();
        const refresh = this.auth.getRefreshToken();

        axios.post(this.baseUrl + '/steps', {
            text: step.text,
            buttons: step.buttons,
        }, {
            headers: {
                Authorization: 'Bearer ' + access,
                'Content-Type': 'application/json',
            }
        }).then(response => {
            onSuccess(response);
        }).catch(error => {
            const status = error.response.status;
            if (status === 401) {
                this.refreshTokens(refresh, (response) => {
                    this.auth.signin(response.data.id, response.data.access_token, response.data.refresh_token);
                    this.createStep(step, onSuccess, onError);
                }, onError)
            } else {
                onError(error);
            }
        });
    }

    getStepsList(onSuccess, onError) {
        const access = this.auth.getAccessToken();
        const refresh = this.auth.getRefreshToken();

        axios.get(this.baseUrl + '/steps', {
            headers: {
                Authorization: 'Bearer ' + access,
            }
        }).then(response => {
            onSuccess(response)
        }).catch(error => {
            const status = error.response.status;
            if (status === 401) {
                this.refreshTokens(refresh, (response) => {
                    this.auth.signin(response.data.id, response.data.access_token, response.data.refresh_token)
                    this.getStepsList(onSuccess, onError)
                }, onError)
            } else {
                onError(error);
            }
        });
    }

    getStep(id, onSuccess, onError) {
        const access = this.auth.getAccessToken();
        const refresh = this.auth.getRefreshToken();

        axios.get(this.baseUrl + '/steps/' + id, {
            headers: {
                Authorization: 'Bearer ' + access,
            }
        }).then(response => {
            onSuccess(response)
        }).catch(error => {
            const status = error.response.status;
            if (status === 401) {
                this.refreshTokens(refresh, (response) => {
                    this.auth.signin(response.data.id, response.data.access_token, response.data.refresh_token)
                    this.getStep(id, onSuccess, onError)
                }, onError)
            } else {
                onError(error);
            }
        });
    }

    updateStep(step, onSuccess, onError) {
        const access = this.auth.getAccessToken();
        const refresh = this.auth.getRefreshToken();

        axios.put(this.baseUrl + '/steps/' + step.id, {
            text: step.text,
            buttons: step.buttons
        }, {
            headers: {
                Authorization: 'Bearer ' + access,
            }
        }).then(response => {
            onSuccess(response)
        }).catch(error => {
            const status = error.response.status;
            if (status === 401) {
                this.refreshTokens(refresh, (response) => {
                    this.auth.signin(response.data.id, response.data.access_token, response.data.refresh_token)
                    this.updateStep(step, onSuccess, onError)
                }, onError)
            } else {
                onError(error);
            }
        });
    }

    deleteStep(id, onSuccess, onError) {
        const access = this.auth.getAccessToken();
        const refresh = this.auth.getRefreshToken();

        axios.delete(this.baseUrl + '/steps/' + id, {
            headers: {
                Authorization: 'Bearer ' + access,
            }
        }).then(response => {
            onSuccess(response)
        }).catch(error => {
            const status = error.response.status;
            if (status === 401) {
                this.refreshTokens(refresh, (response) => {
                    this.auth.signin(response.data.id, response.data.access_token, response.data.refresh_token)
                    this.deleteStep(id, onSuccess, onError)
                }, onError)
            } else {
                onError(error);
            }
        });
    }

    getUsersList(onSuccess, onError) {
        const access = this.auth.getAccessToken();
        const refresh = this.auth.getRefreshToken();

        axios.get(this.baseUrl + '/users', {
            headers: {
                Authorization: 'Bearer ' + access,
            }
        }).then(response => {
            onSuccess(response)
        }).catch(error => {
            const status = error.response.status;
            if (status === 401) {
                this.refreshTokens(refresh, (response) => {
                    this.auth.signin(response.data.id, response.data.access_token, response.data.refresh_token)
                    this.getUsersList(onSuccess, onError)
                }, onError)
            } else {
                onError(error);
            }
        });
    }

    createUser(userData, onSuccess, onError) {
        const access = this.auth.getAccessToken();
        const refresh = this.auth.getRefreshToken();

        axios.post(this.baseUrl + '/users', userData, {
            headers: {
                Authorization: 'Bearer ' + access,
                'Content-Type': 'application/json',
            }
        }).then(response => {
            onSuccess(response);
        }).catch(error => {
            const status = error.response.status;
            if (status === 401) {
                this.refreshTokens(refresh, (response) => {
                    this.auth.signin(response.data.id, response.data.access_token, response.data.refresh_token);
                    this.createUser(userData, onSuccess, onError);
                }, onError)
            } else {
                onError(error);
            }
        });
    }

    deleteUser(id, onSuccess, onError) {
        const access = this.auth.getAccessToken();
        const refresh = this.auth.getRefreshToken();

        axios.delete(this.baseUrl + '/users/' + id, {
            headers: {
                Authorization: 'Bearer ' + access,
            }
        }).then(response => {
            onSuccess(response)
        }).catch(error => {
            const status = error.response.status;
            if (status === 401) {
                this.refreshTokens(refresh, (response) => {
                    this.auth.signin(response.data.id, response.data.access_token, response.data.refresh_token)
                    this.deleteUser(id, onSuccess, onError)
                }, onError)
            } else {
                onError(error);
            }
        });
    }

    updateUser(id, userData, onSuccess, onError) {
        const access = this.auth.getAccessToken();
        const refresh = this.auth.getRefreshToken();

        axios.put(this.baseUrl + '/users/' + id, userData, {
            headers: {
                Authorization: 'Bearer ' + access,
            }
        }).then(response => {
            onSuccess(response)
        }).catch(error => {
            const status = error.response.status;
            if (status === 401) {
                this.refreshTokens(refresh, (response) => {
                    this.auth.signin(response.data.id, response.data.access_token, response.data.refresh_token)
                    this.updateUser(id, userData, onSuccess, onError)
                }, onError)
            } else {
                onError(error);
            }
        });
    }

    getUser(id, onSuccess, onError) {
        const access = this.auth.getAccessToken();
        const refresh = this.auth.getRefreshToken();

        axios.get(this.baseUrl + '/users/' + id, {
            headers: {
                Authorization: 'Bearer ' + access,
            }
        }).then(response => {
            onSuccess(response)
        }).catch(error => {
            const status = error.response.status;
            if (status === 401) {
                this.refreshTokens(refresh, (response) => {
                    this.auth.signin(response.data.id, response.data.access_token, response.data.refresh_token)
                    this.getUser(id, onSuccess, onError)
                }, onError)
            } else {
                onError(error);
            }
        });
    }

    refreshTokens(refresh, onSuccess, onError) {
        axios.post(this.baseUrl + '/refresh', null, {
            headers: {
                Authorization: 'Bearer ' + refresh,
            }
        }).then(response => {
            onSuccess(response);
        }).catch(error => {
            onError(error);
        })
    }

    login(credentialsData, onSuccess, onError) {
        axios.post(this.baseUrl + '/login', credentialsData)
        .then(response => {
            onSuccess(response);
        }).catch(error => {
            onError(error);
        })
    }
}

export default ApiService;