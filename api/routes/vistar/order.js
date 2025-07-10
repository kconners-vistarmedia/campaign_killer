var router = require('express').Router({mergeParams:true})
const orderScripts = require('../../data/vistar/orders')

router.post('/', orderScripts.clearOrders)

module.exports = router;