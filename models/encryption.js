const crypto = require('crypto');

function encrypt(string) {
    const hash = crypto.createHash('sha256');
    string = "Tutee" + string + "Tutor";
    hash.update(string);
    return hash.digest('hex');
}

module.exports = encrypt;