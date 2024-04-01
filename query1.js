import runResult from './printQuery.js';
import { MongoClient } from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$match': {
      'retweeted_status': null,
      'in_reply_to_status_id': null
    }
  }
];

const client = await MongoClient.connect(
  'mongodb://localhost:27017/'
);
const coll = client.db('ieeevisTweets').collection('tweet');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
console.log("QUERY 1: TWEETS NOT REPLY OR RETWEET");
runResult(result);
await client.close();