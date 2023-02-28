const recherche_controller = require('../controller/recherche')
const jwt = require('../helpers/jwt')
const limiter = require('../helpers/limiter')
const cache = require('../helpers/cache')



module.exports = (router) => {
    //recherche anonyme (sans authentification)
    router.get('/anonyme/recherche', cache.checkCache, recherche_controller.rechercheAnonyme)
    //recherche authentifier
    router.get('/recherche', jwt.isAuthorized, cache.checkCache, recherche_controller.rechercheAuth)

    
    router.get('/societe/:id', /* limiter.anonymeLimiter(), */ recherche_controller.detailsSociete)

    //retenue
    router.get('/retenue/recherche', limiter.retenueLimiter(), recherche_controller.rechercheRetenue)
}