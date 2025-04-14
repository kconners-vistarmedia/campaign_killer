var router = require('express').Router({mergeParams:true})
const campaignScripts = require('../../data/vistar/campiagnData')

router.post('/', campaignScripts.clearCampaign)

module.exports = router;