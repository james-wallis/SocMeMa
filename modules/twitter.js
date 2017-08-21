/*
 * Twitter Dashboard
 * Author: James Wallis
 */

'use static'

var io;

module.exports = {
  start: function(newio) {
    io = newio;
    io.on('connection', function(socket){
      getUser();
    });
  },

  showSettings: function() {
    console.log("Twitter Settings:");
    console.log("    Users: " + users + "\n");
  }
}

//Require Twitter Config
require('dotenv').config();
var twitter = require('twitter');


//Set up twitter api
var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET
});


// Global Variables
var users = ['work_hhellyer', 'tobescorbin', 'rnchamberlain', 'Nik_D_C'];





function getUser() {
  var dataList = [];
  for (var i = 0; i < users.length; i++) {
    client.get('users/lookup', {screen_name: users[i]}, function(error, data, response) {
      // console.log(data);
      // if (error) throw error;
      dataList.push(data[0]);
      // console.log(dataList);
      if (dataList.length === users.length) {
        reorderList(dataList);
      }
    });
  }
}

function reorderList(list) {
  var tempNameList = [];
  var tempList = list;
  for (var i = 0; i < list.length; i++) {
    tempNameList.push(list[i].name);
  }
  tempNameList.sort();
  var sortedList = [];
  for (var i = 0; i < tempNameList.length; i++) {
    for (var j = 0; j < tempNameList.length; j++) {
      if (tempNameList[i] === list[j].name) {
        sortedList.push(list[j]);
        // console.log(usersID);
      }
    }
  }
  if (sortedList.length === list.length) {
    io.emit('users', sortedList);
  }

}


// client.get('statuses/user_timeline', {screen_name: 'tobescorbin', count: '200'}, function(error, tweets, response) {
//    console.log(tweets.length);
//    var count = 0;
//    for (var i = 0; i < tweets.length; i++) {
//      count += tweets[i].retweet_count;
//    }
//    console.log(count);
// });


// client.get('statuses/show', {id: '879360637738135552'}, function(error, tweets, response) {
//    io.emit('tweet', tweets);
// });
