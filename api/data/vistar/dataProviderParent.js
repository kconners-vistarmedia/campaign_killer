const {default: axios, head} = require('axios');
const envData = require('../../env.json');
const array = require('../../support/array');

const clearDataProviderParents = async (request, response) => {
    let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${envData[request.query.env].domain}/admin/data_provider_parents/`,
            headers: { 
                'Authorization': `Bearer ${request.query.auth}`
              },
        }

        axios.request(config)
        .then((response) => {
            let items = response.data.data_provider_parents;
            
            let flushSubstring = request.query.matchOnString ?? "Must supply a substring";
            let deleteable = items.filter((plan) => plan.name.toLowerCase().includes(flushSubstring.toLowerCase()))
            //ShuffleArray so that we aren't trying to clear the same items over and over again.
            array.shuffleArray(deleteable) 
            //build array of items to delete
           
            for(i = 0; i<= request.query.numberToSmoke ?? 10; i++) {
                let item = deleteable[i]
                let configDel = {
                    method: 'delete',
                    maxBodyLength: Infinity,
                    //Todo, create a variable here.
                    url: `${envData[request.query.env].domain}/admin/data_provider_parents/${item.id}`,
                    headers: { 
                      'Content-Type': 'application/json', 
                      'Authorization': `Bearer ${request.query.auth}`
                    },
                }
                axios.request(configDel)
                .then((response) => {
                    //log response if you want it.
                })
                .catch((error) => {
                    //Show error
                    console.log(error);
                  });
            }
        })
    response.sendStatus(200)
}

module.exports = {
    clearDataProviderParents
}