// Imports the Google Cloud client library
const {BigQuery} = require('@google-cloud/bigquery');
const functions = require("firebase-functions");
const { canAccessTeacher } = require('../common/accessUtils')
const { canAccessObservation } = require('../common/accessUtils')

// Creates a client
const bigquery = new BigQuery();

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.funcChildACTrend = functions.https.onCall(async(data, context) => {
  console.log(context.auth.uid);
  console.log(data.teacherId);

  if (!await canAccessTeacher(data.teacherId, context.auth.uid)){
    return [];
  }else{
    console.log(`User ${context.auth.uid} can access teacher ${data.teacherId}`)
  }
  //SQL query to get child trends for AC
  const sqlQuery = `SELECT DATE(sessionStart) AS startDate,
                    COUNT(CASE WHEN (peopleType = 1) THEN 'noOpportunity' ELSE NULL END) AS noOpportunity,
                    COUNT(CASE WHEN (peopleType = 2 OR peopleType = 3 OR peopleType = 4) AND (checklist.child1 OR checklist.child2 OR checklist.child3 OR checklist.child4) THEN 'ac' ELSE NULL END) AS ac,
                    COUNT(CASE WHEN (peopleType = 2 OR peopleType = 3 OR peopleType = 4) AND checklist.child5 THEN 'noac' ELSE NULL END) as noac
                    FROM ${functions.config().env.bq_project}.${functions.config().env.bq_dataset}.ac
                    WHERE teacher = '/user/`+data.teacherId+`' AND observedBy = '/user/`+context.auth.uid+`'
                    GROUP BY startDate
                    ORDER BY startDate ASC;`;

  console.log(sqlQuery);

  const options = {
    query: sqlQuery,
    // Location must match that of the dataset(s) referenced in the query.
    location: 'US',
  };

  const [job] = await bigquery.createQueryJob(options);
  console.log(`Job ${job.id} started.`);

  const rows = await job.getQueryResults();
  console.log(rows);
  return rows;
});
