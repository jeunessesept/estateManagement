const password = (value, helpers) => {
    if (value.length < 8) {
        return helpers.message('password must be at least 8 characters');
    }
    if (!value.match(/\d/) || !value.match(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/)) {
        return helpers.message('password must contain at least 1 capital letter, 1 number, and 1 special character');
    }
    return value;
}


module.exports = password
