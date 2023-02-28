const genericModel = require('./model');
let configuration = require('../config/config');

const name = 'Societe';
const tableName = 'societe';
const selectableProps = [
  'id',
  'mf',
  'rc',
  'nom_fr',
  'adresse_fr',
  'nom_ar',
  'adresse_ar',
  'type',
  'gerant',
  'to_update',
  'date_maj'
];

module.exports = (knex) => {
  const model = genericModel({
    knex,
    name,
    tableName,
    selectableProps,
  });

  const rechercheRetenue = async (mf) => {
    try {
      let recherche = mf.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '')
      let societe = await knex.select().from(tableName).where('mf', 'ILIKE', `%${recherche}%`).limit(20)

      return societe
    } catch (error) {
      console.log(error);
      throw (error);
    }
  }


  const rechercheAnonyme = async (search, preferences) => {
    try {
      let props = [
        "id",
        "mf",
        "nom_fr",
        "nom_ar"
      ]
      let societe
      let recherche = search.toLowerCase().replace(/[^a-zA-Z0-9ء-ي ]/g, '')
      let recherche_arr
      recherche_arr = recherche.split(' ')

      for (let i = 0; i < recherche_arr.length; i++){
        if (recherche_arr[i].length < configuration.recherche.word_length) {
          recherche_arr.splice(i, 1)
          i = i - 1
        }
      }
      

      if (recherche_arr && recherche_arr.length > 0) {
        let WG = '('
        societe = await knex.select(props).from(tableName).where((qb) => {
          for (let i = 0; i < recherche_arr.length; i++) {
            let word = recherche_arr[i]
            let WI = ''
            if (preferences.raison_sociale == 'true') {
              WI = ` lower(nom_fr)  like '%${word}%' or  lower(nom_ar) like '%${word}%' `
            }
            if (preferences.adresse == 'true') {
              if (WI !== '') {
                WI += ' OR  '
              }
              WI += ` lower(adresse_fr) like '%${word}%' or lower(adresse_ar) like '%${word}%' `
            }
            if (preferences.matricule_fiscal == 'true') {
              if (WI !== '') {
                WI += ' OR  '
              }
              WI += ` lower(mf) like '%${word}%' `
            }
            if (preferences.registre_de_commerce == 'true') {
              if (WI !== '') {
                WI += ' OR  '
              }
              WI += ` lower(rc) like '%${word}%' `
            }
            if (WG != '(') {
              WG += ' AND (  '
            }
            WG += WI + ')'

            qb.where(
              knex.raw(WG)
            )
          }
        }).limit(Number(configuration.anonyme.nbr_de_reponse_anonyme))
      }
      return societe

    } catch (error) {
      console.log(error);
      throw (error);
    }
  }

  const rechercheAuth = async (search, preferences, nbr_de_reponse) => {
    try {
      let props = [
        "id",
        "mf",
        "nom_fr",
        "nom_ar"
      ]
      let societe
      let recherche = search.toLowerCase().replace(/[^a-zA-Z0-9ء-ي ]/g, '')
      let recherche_arr
      recherche_arr = recherche.split(' ')

      for (let i = 0; i < recherche_arr.length; i++){
        if (recherche_arr[i].length < configuration.recherche.word_length) {
          recherche_arr.splice(i, 1)
          i = i - 1
        }
      }

      if (recherche_arr && recherche_arr.length > 0) {
        let WG = '('
        societe = await knex.select(props).from(tableName).where((qb) => {
          for (let i = 0; i < recherche_arr.length; i++) {
            let word = recherche_arr[i]
            let WI = ''
            if (preferences.raison_sociale == 'true') {
              WI = ` lower(nom_fr)  like '%${word}%' or  lower(nom_ar) like '%${word}%' `
            }
            if (preferences.adresse == 'true') {
              if (WI !== '') {
                WI += ' OR  '
              }
              WI += ` lower(adresse_fr) like '%${word}%' or lower(adresse_ar) like '%${word}%' `
            }
            if (preferences.matricule_fiscal == 'true') {
              if (WI !== '') {
                WI += ' OR  '
              }
              WI += ` lower(mf) like '%${word}%' `
            }
            if (preferences.registre_de_commerce == 'true') {
              if (WI !== '') {
                WI += ' OR  '
              }
              WI += ` lower(rc) like '%${word}%' `
            }
            if (preferences.gerant == 'true') {
              if (WI !== '') {
                WI += ' OR  '
              }
              WI += ` lower(gerant) like '%${word}%' `
            }
            if (WG != '(') {
              WG += ' AND (  '
            }
            WG += WI + ')'

            qb.where(
              knex.raw(WG)
            )
          }
        }).limit(nbr_de_reponse)
      }
      return societe

    } catch (error) {
      console.log(error);
      throw (error);
    }
  }


  return {
    ...model,
    rechercheAnonyme,
    rechercheAuth,
    rechercheRetenue
  };
};
