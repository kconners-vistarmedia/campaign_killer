var router = require('express').Router({mergeParams:true})
const insertionOrderScripts = require('../../data/vistar/insertion_order')

router.post('/', insertionOrderScripts.clearInsertionOrders)

module.exports = router;