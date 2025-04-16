var router = require('express').Router({mergeParams:true})
const plansScripts = require('../../data/vistar/integrated_plan')

router.post('/', plansScripts.clearIntegratedPlans)

module.exports = router;