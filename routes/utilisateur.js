const utilisateur_controller = require('../controller/utilisateur')
const jwt = require('../helpers/jwt')


module.exports = (router) => {

//----------------------------utilisateur------------------------------------

router.post('/inscription',utilisateur_controller.inscription)
router.post('/connexion',utilisateur_controller.connexion)
// router.put('/deconnexion',jwt.isAuthorized,utilisateur_controller.deconnexion)
router.get('/profil',jwt.isAuthorized,utilisateur_controller.profil)
router.put('/profil',jwt.isAuthorized,utilisateur_controller.modifierProfil)


//----------------------token----------------------------------------------------
router.post('/token/creation',jwt.isAuthorized,utilisateur_controller.creationToken)
router.get('/token',jwt.isAuthorized,utilisateur_controller.listeToken)
router.get('/token/:id',jwt.isAuthorized,utilisateur_controller.getToken)
router.delete('/token/:id',jwt.isAuthorized,utilisateur_controller.supprimerToken)
router.put('/token/:id/activer',jwt.isAuthorized,utilisateur_controller.activerToken)
router.put('/token/:id/desactiver',jwt.isAuthorized,utilisateur_controller.desactiverToken)
router.put('/token/:id/suspendre',jwt.isAuthorized,utilisateur_controller.suspendreToken)
router.put('/token/:id/supprime',jwt.isAuthorized,utilisateur_controller.supprimerTokenStatut)
router.put('/token/:id/gerant',jwt.isAuthorized,utilisateur_controller.accesGerantToken)



//-----------------for superadmin------------------

router.get('/utilisateur',jwt.isAdmin,utilisateur_controller.listeUtilisateur)
router.get('/utilisateur/:id',jwt.isAdmin,utilisateur_controller.getUtilisateur)
router.put('/utilisateur/:id',jwt.isAdmin,utilisateur_controller.modifierUtilisateur)
router.put('/utilisateur/:id/activer',jwt.isAdmin,utilisateur_controller.activerUtilisateur)
router.put('/utilisateur/:id/desactiver',jwt.isAdmin,utilisateur_controller.desactiverUtilisateur)
router.put('/utilisateur/:id/suspendre',jwt.isAdmin,utilisateur_controller.suspendreUtilisateur)
router.put('/utilisateur/:id/supprime',jwt.isAdmin,utilisateur_controller.supprimerUtilisateur)
router.put('/utilisateur/:id/gerant',jwt.isAdmin,utilisateur_controller.accesGerantUtilisateur)
//get token avec user_id
router.get('/utilisateur/:id/token',jwt.isAdmin,utilisateur_controller.listeTokenUtilisateur)
router.get('/societe',jwt.isAdmin,utilisateur_controller.ListeSociete)
router.get('/admin/societe/:id',jwt.isAdmin,utilisateur_controller.getSociete)
router.put('/societe/:id',jwt.isAdmin,utilisateur_controller.modifierSociete)
router.delete('/societe/:id',jwt.isAdmin,utilisateur_controller.supprimerSociete)
router.get('/logs',jwt.isAdmin,utilisateur_controller.getLogs)

}