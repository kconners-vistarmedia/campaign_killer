var router = require('express').Router({mergeParams:true})
const providerParentScripts = require('../../data/vistar/dataProviderParent')

router.post('/', providerParentScripts.clearDataProviderParents)

module.exports = router;