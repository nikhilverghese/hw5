import runResult from './printQuery.js';
import { MongoClient } from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    '$group': {
      '_id': '$user.name', 
      'UserId': {
        '$first': '$user.id'
      }
    }
  }, {
    '$project': {
      '_id': '$_id', 
      'UserId': 1
    }
  }, {
    '$out': {
      'db': 'ieeevisTweets', 
      'coll': 'users'
    }
  }
];

const tweetAgg = [
    {
      '$addFields': {
        'user_id': '$user.id'
      }
    }, {
      '$project': {
        'user': 0
      }
    }, {
      '$out': {
        'db': 'ieeevisTweets', 
        'coll': 'Tweets_Only'
      }
    }
  ]  

const client = await MongoClient.connect(
  'mongodb://localhost:27017/'
);
const coll = client.db('ieeevisTweets').collection('tweet');
const cursor = await coll.aggregate(agg).toArray();
const tweetCursor = await coll.aggregate(tweetAgg).toArray();

const UserColl = client.db('ieeevisTweets').collection('users');
const userResult = await UserColl.find().toArray();

const tweetColl = client.db('ieeevisTweets').collection('Tweets_Only');
const tweetResult = await tweetColl.find().toArray();

console.log("QUERY 5 User Collection: Just Collection of Users");
runResult(userResult);
console.log("QUERY 5 Tweet Only Collection: Tweets Without Embedded User Info, Just Reference");
runResult(tweetResult);
await client.close();