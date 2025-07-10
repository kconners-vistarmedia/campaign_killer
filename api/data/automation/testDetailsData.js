const { request, response } = require('express');
const {default: axios, head} = require('axios');
const pool = require('../../queries')

const addTestCaseDetail = async (request, response) => {
    const query = {
        text: 'INSERT INTO automation.test_details(commit_author_name, test_duration, project_name, spec, run_number, commit_branch, run_tags, test_status, error_message, test_detail_created_at, ci_build_id, test_replay_url, error_name, group_name, commit_sha, test_name, created_by, updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $17) Returning *;',
        values: [request.body.commit_author_name, request.body.test_duration, request.body.project_name, request.body.spec, request.body.run_number, request.body.commit_branch, request.body.run_tags, request.body.status, request.body.error_message, request.body.created_at, request.body.ci_build_id, request.body.test_replay_url, request.body.error_name, request.body.group_name, request.body.commit_sha, request.body.test_name, 'helperApp'            
        ]
    }
    pool.pool.query(query, (error, results) => {
        if(error) {
            throw error;
        }
         response.status(200).json(results.rows)
    })
}

async function addTestCaseDetailCall(detail) {
    var count = await checkForExistingRunDetail(detail.run_number, detail.spec, detail.test_name)
    if(count.length === 0) {
        const query = {
            text: 'INSERT INTO automation.test_details(commit_author_name, test_duration, project_name, spec, run_number, commit_branch, run_tags, test_status, error_message, test_detail_created_at, ci_build_id, test_replay_url, error_name, group_name, commit_sha, test_name, created_by, updated_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $17) Returning *;',
            values: [detail.commit_author_name, detail.test_duration, detail.project_name, detail.spec, detail.run_number, detail.commit_branch, detail.run_tags, detail.status, detail.error_message, detail.created_at, detail.ci_build_id, detail.test_replay_url, detail.error_name, detail.group_name, detail.commit_sha, detail.test_name, 'helperApp'            
            ]
        }
        pool.pool.query(query, (error, results) => {
            if(error) {
                console.log(JSON.stringify(detail))
                throw error;
            }
             return results.rows
        })
    }
}

const getAllDetailsByRun = async (request, response) => {
    var items = await getTestCasesByRun(request.params.run_id);
    response.status(200).json(items);
}

const syncTestResults = async (request, response) => {
    let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://cloud.cypress.io/enterprise-reporting/report?token=6c1605d0-9d0a-4ee4-8100-d1355ca78ce8&report_id=test-details&export_format=json&start_date=${request.body.start_date}&end_date=${request.body.end_date}`,
            headers: { 
              },
        }

        axios.request(config)
        .then((response) => {
            let items = response.data;
            let desiredResults = items.filter((result) => result.run_number === request.body.run_number)
            console.log(desiredResults.length)
            desiredResults.forEach(async element => {
                let data = {};
                data.commit_author_name = element.commit_author_name ;
                data.test_duration = element.test_duration ;
                data.project_name = element.project_name ;
                data.spec = element.spec ;
                data.run_number = element.run_number ;
                data.commit_branch = element.commit_branch ;
                data.run_tags = element.run_tags ;
                data.status = element.status ;
                data.error_message = element.error_message ;
                data.created_at = element.created_at ;
                data.ci_build_id = element.ci_build_id ;
                data.test_replay_url = element.test_replay_url ;
                data.error_name = element.error_name ;
                data.group_name = element.group_name ;
                data.commit_sha = element.commit_sha ;
                data.test_name = element.test_name;

                await addTestCaseDetailCall(data)
            });
           // axios.request(configDel)
          ///  .then((response) => {
                //log response if you want it.
          //  })
          //  .catch((error) => {
          //      //Show error
          //      console.log(error);
          //    });
            })
    response.sendStatus(200)
}
async function checkForExistingRunDetail(run_number, spec, test_name) {
    const queryStringStart = 'Select * from automation.test_details '
    const queryStringOrder = ' order by test_name;'
    const queryStringWhere = ' where status >= 1 and run_number = $1 and Lower(spec) = Lower($2) and Lower(test_name) = Lower($3)'
    
    let queryString = `${queryStringStart} ${queryStringWhere} ${queryStringOrder}`
    
    var query = {
        text: queryString,
        values: [run_number, spec, test_name]
    }
    
    try {
        const results = await pool.pool.query(query);
        return results.rows;
    }
    catch(err) {
        return err;
    }
}

async function getTestCasesByRun(run_number, searchType, searchValue) {
    const queryStringStart = 'Select * from automation.test_details '
    const queryStringOrder = ' order by test_name;'
    const queryStringWhere = ' where status >= 1 and run_number = $1 '
    
    if(searchType != undefined) {
        if(searchType.toLowerCase() == 'name') {
            queryString = `${queryStringStart} ${queryStringWhere} and Lower(test_name) = Lower($2) ${queryStringOrder}`    
        }
        else if(searchType.toLowerCase() == 'spec') {
            queryString = `${queryStringStart} ${queryStringWhere} and Lower(spec) = Lower($2) ${queryStringOrder}`    
        }
        else if(searchType.toLowerCase() == 'commit_branch') {
            queryString = `${queryStringStart} ${queryStringWhere} and Lower(commit_branch) = Lower($2) ${queryStringOrder}`    
        }
        else if(searchType.toLowerCase() == 'id') {
            queryString = `${queryStringStart} ${queryStringWhere} and id = $1 ${queryStringOrder}`    
        }
    }
    else {
        queryString = `${queryStringStart} ${queryStringWhere} ${queryStringOrder}`
    }
    
    var query = {};
    if(searchValue != null) {
        query = {
            text: queryString,
            values: [run_number,searchValue]
        }
    }
    else {
        query = {
            text: queryString,
            values: [run_number]
        }
    }
    
    try {
        const results = await pool.pool.query(query);
        return results.rows;
    }
    catch(err) {
        return err;
    }
}



module.exports = {
    getAllDetailsByRun,
    addTestCaseDetail,
    syncTestResults
}