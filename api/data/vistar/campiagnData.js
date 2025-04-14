const {default: axios, head} = require('axios');

//found on SO, dont hate
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const clearCampaign = async (request, response) => {
    let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://localhost.vistarmedia.com:5555/campaign',
            headers: { 
                'Authorization': `Bearer ${request.query.auth}`
              },
        }

        axios.request(config)
        .then((response) => {
            let items = response.data;
            //Find deletable campaigns(The only pattern I saw was could not be active)
            let deleteable = items.filter((cam) => cam.active == false)
            //ShuffleArray so that we aren't trying to clear the same items over and over again.
            shuffleArray(deleteable) 
          

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
                url: 'http://localhost.vistarmedia.com:5555/campaign/',
                headers: { 
                  'Content-Type': 'application/json', 
                  'Authorization': `Bearer ${request.query.auth}`
                },
                data : smokethem
            }
              
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
    clearCampaign
}