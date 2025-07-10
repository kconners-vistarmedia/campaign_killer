const {default: axios, head} = require('axios');
const envData = require('../../env.json');
const array = require('../../support/array');

const clearOrders = async (request, response) => {
    let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${envData[request.query.env].domain}/order/`,
            headers: { 
                'Authorization': `Bearer ${request.query.auth}`
              },
        }

        axios.request(config)
        .then((response) => {
            let items = response.data;
            let flushSubstring = request.query.matchOnString ?? "Must supply a substring";
            let deleteable = items.filter((plan) => plan.name.toLowerCase().includes(flushSubstring.toLowerCase()))
            //ShuffleArray so that we aren't trying to clear the same items over and over again.
            console.log(deleteable.length)
            array.shuffleArray(deleteable) 
            //build array of items to delete
            let smokethem = []
            //pull number of Items from route
            for(i = 0; i<= request.query.numberToSmoke ?? 10; i++) {
                let item = deleteable[i]
                smokethem.push(item)
            }
            
            let configDel = {
                method: 'delete',
                maxBodyLength: Infinity,
                //Todo, create a variable here.
                url: `${envData[request.query.env].domain}/order/`,
                headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${request.query.auth}`
                },
                data : smokethem
            }
            //console.log(JSON.stringify(smokethem))
            axios.request(configDel)
            .then((response) => {
                //log response if you want it.
            })
            .catch((error) => {
                //Show error
                console.log(error);
              });
        })
    response.sendStatus(200)
}

module.exports = {
    clearOrders
}