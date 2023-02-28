exports.getHeaders = (headers, keyname) => {
    if (headers && keyname) {
        if (Array.isArray(headers)) {
            for (var i = 0; i < headers.length; i++) {
                if (headers[i].toLowerCase() === keyname.toLowerCase()) {
                    return headers[i + 1];
                }
            }
        } else if (typeof headers === "object") {
            for (var key in headers) {
                if (key.toLowerCase() == keyname.toLowerCase()) {
                    return headers[key]
                }
            }
        }
    }
}


exports.randomAlphabetic = async (length) => {
    var result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    var counter = 0
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}