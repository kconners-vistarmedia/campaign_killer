const express = require('express')

const app = express()
const port = 3115

app.use('/api/campaigns', require('./api/routes/vistar/campaigns'))
app.use('/api/integratedPlan', require('./api/routes/vistar/integratedPlans'))
app.use('/api/insertionOrders', require('./api/routes/vistar/insertionOrders'))
app.use('/api/dataProviderParents', require('./api/routes/vistar/dataProviderParents'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})