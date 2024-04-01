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
      'TweetCount': {
        '$sum': 1
      }, 
      'Retweets': {
        '$avg': '$retweet_count'
      }
    }
  }, {
    '$match': {
      'TweetCount': {
        '$gt': 3
      }
    }
  }, {
    '$project': {
      'name': '$name', 
      'Retweets': {
        '$round': [
          '$Retweets', 2
        ]
      }, 
      'TweetCount': '$TweetCount'
    }
  }, {
    '$sort': {
      'Retweets': -1
    }
  }, {
    '$limit': 10
  }
];

const client = await MongoClient.connect(
  'mongodb://localhost:27017/'
);
const coll = client.db('ieeevisTweets').collection('tweet');
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
console.log("QUERY 4: TOP 10 USERS WITH HIGHEST AVERAGE RETWEETS WITH MORE THAN 3 TWEETS: ");
runResult(result);
await client.close();
