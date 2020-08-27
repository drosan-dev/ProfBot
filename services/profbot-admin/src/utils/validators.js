export const validateEmail = (email) => {
    const pattern = /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g;
    const result = pattern.test(email);
    
    return result === true;
}

export const validatePassword = (password) => {
    return password.length >= 6;
}

export const validateName = (name) => {
    return name.length >= 2;
}

export const validateSurname = (surname) => {
    return surname.length >= 2;
}