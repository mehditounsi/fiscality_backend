var httpContext = require('express-http-context');

exports.getUser = ()=>{
    return httpContext.get('gUser')
}

exports.getUserId=()=>{
    return httpContext.get('gUserId')
}

exports.getUserUid=()=>{
    return httpContext.get('gUserUId')
}

exports.getUserIpAddress=()=>{
    return httpContext.get('gUserIP')
}

exports.getUserLogin= ()=>{
    return httpContext.get('gUserLogin')
}

exports.getToken = () =>{
    return httpContext.get('token')
}

exports.getNbrRequete = () =>{
    return httpContext.get('nbr_de_requete')
}