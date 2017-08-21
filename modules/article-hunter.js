/*
 * Module for the Article Hunter Stack Overflow API and RSS Feed Trawler.
 * Author: James Wallis
 */
'use static'
//Modules
var stack = require('./article-hunter-modules/stackoverflowModule.js');
var google = require('./article-hunter-modules/googleforumModule.js');
var io;

module.exports = {
  start: function(newio) {
    io = newio;
    io.on('connection', function(socket){
      io.emit('articles', discoveredArticles);
      io.emit('keywordList', userKeywordList);
      io.emit('googleForumFeeds', googleForumFeeds);
      socket.on('addKeyword', addKeyword);
      socket.on('editKeyword', editKeyword);
      socket.on('deleteKeyword', deleteKeyword);
      socket.on('addGoogleForum', addGoogleForum);
      socket.on('deleteGoogleFeed', deleteGoogleForum);
    });
  },

  showSettings: function() {
    console.log("Article-Hunter Settings:");
    console.log("    Feed Refresh: " + minutesTilRefresh + " minutes");
    console.log("    Amount of Articles on a page: " + amountOnPage + "\n");
  }
}

//Initialise userFeedList for use of automated and multiple feed search
var userFeedList = [];
//Initialise userKeywordList for use for multiple keyword searches
var userKeywordList = ["java", "swift", "javascript", "ibm", "node"];
//List of google forums feeds (RSS)
var googleForumFeeds  = [
              {'title': 'nodejs', 'source': 'https://groups.google.com/forum/feed/nodejs/topics/rss.xml'},
              {'title': 'Swift Language', 'source': 'https://groups.google.com/forum/feed/swift-language/topics/rss.xml'}
            ];
//Create a list of the data found from the API's and RSS
var discoveredArticles = {"stackoverflow": [], "googleforums": []};
//Set the refresh rate for the feeds (In minutes);
var minutesTilRefresh = 8;
//Set the amount of articles displayed on a page at any one time
var amountOnPage = 30;

//Function which runs all data collector functions
function getFeeds() {
  console.log("\nSearching Feeds...\n");
  stack.getItems(stackOverflowToList, userKeywordList);
  google.getItems(googleForumToList, googleForumFeeds, userKeywordList);
}
//Start feed collection and timer
function startFeedCollection() {
  getFeeds();
  var refreshRate = 10 * 6000 * minutesTilRefresh;
  setInterval(function() {
    getFeeds();
  }, refreshRate);
}

//Function used to add new items to the google forums list when they have been found
//If item is already in the list then it will ensure it is not duplicated
//If the list changes size then the new list will be sent to the clients using socket.io
function stackOverflowToList(list) {
  if(discoveredArticles.stackoverflow.length > 0) {
    var soList = discoveredArticles.stackoverflow;
    var previousListLength = discoveredArticles.stackoverflow.length;
    var numberSame = 0;
    for (var i = 0; i<soList.length; i++) {
      var found = false;
      var j = 0;
      while ((found === false) && (j < list.length)) {
        if (soList[i].id == list[j].id) {
          list.splice(j, 1);
          numberSame++;
          found = true;
        }
        j++;
      }
    }
    soList = soList.concat(list);
    console.log("previousListLength: " + previousListLength);
    console.log("soList: " + soList.length);
    discoveredArticles.stackoverflow = soList;
    //If new list is larger than previous list notify clients
    if (soList.length > previousListLength) {
      //Send new list to clients
      io.emit('articles', discoveredArticles);
    }
  } else {
    discoveredArticles.stackoverflow = list;
    io.emit('articles', discoveredArticles);
  }
  console.log("Stack Overflow List Length: " + discoveredArticles.stackoverflow.length);
}

function googleForumToList(list) {
  if(discoveredArticles.googleforums.length > 0) {
    var googleList = discoveredArticles.googleforums;
    var previousListLength = discoveredArticles.googleforums.length;
    var numberSame = 0;
    for (var i = 0; i<googleList.length; i++) {
      var found = false;
      var j = 0;
      while ((found === false) && (j < list.length)) {
        if (googleList[i].id == list[j].id) {
          list.splice(j, 1);
          numberSame++;
          found = true;
        }
        j++;
      }
    }
    googleList = googleList.concat(list);
    console.log("previousListLength: " + previousListLength);
    console.log("googleList: " + googleList.length);
    discoveredArticles.googleforums = googleList;
    //If new list is larger than previous list notify clients
    if (googleList.length > previousListLength) {
      //Send new list to clients
      io.emit('articles', discoveredArticles);
    }
  } else {
    discoveredArticles.googleforums = list;
    io.emit('articles', discoveredArticles);
  }
  console.log("Google Forum List Length: " + discoveredArticles.googleforums.length);
}








//Settings Page Functions
function addKeyword(keyword) {
  keyword = keyword.toLowerCase();
  if (keyword !== "" && keyword !== null && !(userKeywordList.indexOf(keyword) >= 0)) {
    userKeywordList.push(keyword);
  }
  io.emit('keywordList', userKeywordList);
}

function editKeyword(json) {
  var index = json.index;
  var keyword = json.edit;
  userKeywordList[index] = keyword;
  io.emit('keywordList', userKeywordList);
}

function deleteKeyword(index) {
  userKeywordList.splice(index, 1);
  io.emit('keywordList', userKeywordList);
}

function addGoogleForum(feed) {
  if (feed !== "" && feed !== null && !(googleForumFeeds.indexOf(feed) >= 0)) {
    googleForumFeeds.push(feed);
  }
  io.emit('googleForumFeeds', googleForumFeeds);
}

function deleteGoogleForum(index) {
  googleForumFeeds.splice(index, 1);
  io.emit('googleForumFeeds', googleForumFeeds);
}

startFeedCollection();
