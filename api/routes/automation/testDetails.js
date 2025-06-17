var router = require('express').Router({mergeParams:true})
const testDetailsScripts = require('../../data/automation/testDetailsData')
const bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

router.get('/:run_id/', testDetailsScripts.getAllDetailsByRun)
router.post('/', jsonParser, testDetailsScripts.addTestCaseDetail)

module.exports = router;