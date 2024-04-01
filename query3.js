import runResult from './printQuery.js';
import { MongoClient } from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$group': {
      '_id': '$user.id', 
      'name': {
        '$first': '$user.name'
      }, 
      'Tweets': {
        '$sum': 1
      }
    }
  }, {
    '$sort': {
      'Tweets': -1
    }
  }, {
    '$limit': 1
  }
];

const client = await MongoClient.connect(
  'mongodb://localhost:27017/'
);
const coll = client.db('ieeevisTweets').collection('tweet');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
console.log("QUERY 3: FIND USER WITH MOST TWEETS:");
runResult(result);
await client.close();
