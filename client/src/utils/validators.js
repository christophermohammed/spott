import validator from 'validator';

export const isEmpty = (str) => {
    return (!str || str.length === 0 || !str.trim());
}

export const isValidEmail = (email) => {
    return validator.isEmail(email);
}

export const isGoodPassword = (password) => {
    return password && (password.length > 5);
}

export const isGoodPhoneNumber = (phoneNumber) => {
    var a = !isNaN(parseInt(phoneNumber));
    var b = validator.isMobilePhone(phoneNumber);
    return (phoneNumber && a && b); 
}