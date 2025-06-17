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

const getAllDetailsByRun = async (request, response) => {
    var items = await getTestCasesByRun(request.params.run_id);
    response.status(200).json(items);
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
    addTestCaseDetail
}