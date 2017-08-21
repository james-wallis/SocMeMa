'use strict'
/**
 * The JavaScript scripts which dictate how the automated search page is run on Article-Hunter.
 * Author: James Wallis
 */


/**
 * Global Variables
 *    serverArticles:   The list of articles that are loaded from the
 *                      server using socket.io.
 *    amountOnPage:     The amount of articles that are displayed on each page.
 *    amountOfColumns:  The amount of columns on a each page.
 *    currentPage:      The current page that the user is on.
 *    activeFeed:       The feed that is currently been displayed.
 *    keywordList:      The list of keywords used as the keyword selector.
 *    showAll:          A Boolean variable which if true will show all keywords.
 *    currentKeyword:   If this is set and showAll is false, the only results on
 *                      the automated search page will be found using the specified
 *                      keyword.
 *    pageListIndex:    A list of index's of the last element printed to the page.
 */
var serverArticles = {};
var amountOnPage = 9;
var amountOfColumns = 3;
var currentPage = 1;
var activeFeed = null;
var keywordList = [];
var showAll = true;
var currentKeyword = '';
var pageListIndex = [0];


/**
 * Event Listeners
 * Onload:
 *    - loadDiscoveredArticles attatches the client to the server through socket.io.
 *    - changeButtonWidth modifies the button widths for next and previous so that they
 *                        dynamically fit the size of the side bar.
 * Resize:
 *    - changeButtonWidth modifies the button widths for next and previous when the
 *                        side bar size changes.
 * Onclick:
 *    - showStackOverflow when the user selects to see the stack overflow results
 *                        the function is run and it will display each element in the
 *                        stackoverflow array (serverArticles.stackoverflow)
 *    - showGoogleForums  when the user selects to see the google forum results,
 *                        this function is run and it displays each element in the
 *                        google forum array (serverArticles.googleforums)
 */
window.addEventListener('load', loadDiscoveredArticles);
window.addEventListener('load', changeButtonWidth);
window.addEventListener('resize', changeButtonWidth);
document.getElementById('stack-overflow-button').addEventListener('click', showNewFeed);
document.getElementById('google-forum-button').addEventListener('click', showNewFeed);
document.getElementById('setting-icon-list-item');

/**
 * Function to load the discovered articles from the server.
 * Sets up the socket.io so that it is listening for articles when they are sent.
 * Articles are only sent from the server if the list length is changed.
 * If there are already articles being displayed on the page it will refresh these
 *    adding the new articles to the page.
 */
function loadDiscoveredArticles() {
  socket.on('articles', function(articles){
    serverArticles = articles;
    console.log("refresh");
    console.log(activeFeed);
    if (activeFeed != null) {
      showFeed();
    }
  });
  socket.on('keywordList', function(list) {
    keywordList = list;
  });
}

/**
 * Function to change the active feed if a different feed is selected.
 */
function showNewFeed(event) {
  clearActive();
  if ((event.target.id).includes('stack')) {
    activeFeed = 'stackoverflow';
  } else if ((event.target.id).includes('google')) {
    activeFeed = 'googleforums';
  }
  showFeed();
}

/**
 * Function to display the correct feed on the article-hunter page
 */
function showFeed() {
  var tagsAvailable = false;
  var container = document.getElementById('search-results');
  container.innerHTML = '';
  console.log("Active Feed = " + activeFeed);
  if (activeFeed === 'stackoverflow') {
    document.getElementById('stack-overflow-button').classList.add('active-feed');
    var list = serverArticles.stackoverflow;
    activeFeed = 'stackoverflow';
    var feedName = "Stack Overflow";
    tagsAvailable = true;
  } else if (activeFeed === 'googleforums') {
    document.getElementById('google-forum-button').classList.add('active-feed');
    var list = serverArticles.googleforums;
    activeFeed = 'googleforums';
    var feedName = "Google Forums";
  }
  if (list.length <= 0) {
    var content = "Oops! It seems that there are no articles available for " + feedName + ".";
    container.appendChild(createParagraph(content, false, 'article-hunter-error'));
  } else {
    //Create keyword selector div
    createKeywordSelector(container);
    var amountInColumn = amountOnPage / amountOfColumns;
    //Round down for integer conversion
    //Article Hunter will display the closest amount of articles as the user has requested.
    amountInColumn = Math.floor(amountInColumn);
    var columnCounter = 0, articleCounter = 0, i = 0, index = 0;
    var column = createDiv('col-4');
    //Offset index for correct page display when displaying all
    if (showAll || pageListIndex.length === 1) {
      index = i+((currentPage-1) * amountOnPage);
    } else {
      index = pageListIndex[currentPage-1];
    }
    while (i<list.length && index<list.length) {
      if (list[index].keyword === currentKeyword || showAll) {
        //Create Article on HTML
        var div = createDiv('article-div');
        var a = createLink('', list[index].link);
        a.appendChild(createParagraph((index+1) + ": " + list[index].title, 'article-title'));
        if (tagsAvailable) {
          a.appendChild(createParagraph("Tags: " + list[index].tags.join(', '), 'article-tags'));
        }
        a.appendChild(createParagraph("Matched: " + list[index].keyword, 'article-matched'));
        div.appendChild(a);
        column.appendChild(div);
        articleCounter++;
        if (articleCounter == amountInColumn) {
          columnCounter++;
          if (columnCounter == amountOfColumns) {
            pageListIndex[currentPage] = (index+1);
            break;
          }
          container.appendChild(column);
          column = createDiv('col-4');
          articleCounter = 0;
        }
        container.appendChild(column);
      }
      i++;
      index++;
    }
  }
  //If soList has more elements than the amount allowed on the page, show page buttons
  determinePageButtonShow();
}

/**
 * Function to add the keyword selector to the page in order to enable the
 * ability to only see results which matched a particular keyword.
 */
function createKeywordSelector(cont) {
  var keywordSelect = document.createElement('div');
  keywordSelect.classList.add('col-12');
  keywordSelect.style.padding = '5px 0px';
  var arr = keywordList;
  if (!!arr.indexOf('all')) arr.unshift('all');
  var ul = createList(arr, 'keyword-select-li', arr, 'keyword-select-ul');
  keywordSelect.appendChild(ul);
  cont.appendChild(keywordSelect);
  //Add Event Listeners
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]==='all') {
      document.getElementById('all').addEventListener('click', function() {
        showAll = true;
        currentKeyword = '';
        pageListIndex = [0];
        currentPage = 1;
        showFeed();
      });
    } else {
      document.getElementById(arr[i]).addEventListener('click', function() {
        currentKeyword =  this.id;
        showAll = false;
        pageListIndex = [0];
        currentPage = 1;
        showFeed();
      });
    }
  }
}

/**
 * Function to clear the active feed when the user selects another.
 * Begins by ensuring that no other element has the active-feed class
 *      which is used to show the user which feed they are currently viewing.
 * Then sets the activeFeed variable to null so that it doesn't load anymore of
 *      the previous feed.
 */
function clearActive() {
  document.getElementById('setting-icon-list-item').classList.remove('active-feed');
  document.getElementById('stack-overflow-button').classList.remove('active-feed');
  document.getElementById('google-forum-button').classList.remove('active-feed');
  activeFeed = null;
}


/**
 * Function to change the width of the next and previous button's container
 * This helps to ensure that the UI displays correctly no matter the size or
 *    aspect ratio of the screen.
 */
function changeButtonWidth() {
  var feedSelectorWidth = document.getElementById('feed-selector-div').clientWidth;
  var pageSelectorDiv = document.getElementById('page-select');
  pageSelectorDiv.style.width = feedSelectorWidth + "px";
}

//Function to determine whether to show page buttons
function determinePageButtonShow() {
  var list;
  if (activeFeed === 'stackoverflow') {
    list = serverArticles.stackoverflow;
  } else if (activeFeed === 'googleforums') {
    list = serverArticles.googleforums;
  }
  var tempList = [];
  if (currentKeyword) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].keyword === currentKeyword) {
        tempList.push(list[i]);
      }
    }
    list = tempList;
  }
  var pageSelectorDiv = document.getElementById('page-select');
  if (list.length > amountOnPage) {
    pageSelectorDiv.style.display = "block";
    document.getElementById('display-page-number').textContent = currentPage;
    if (currentPage === 1) {
      showNextButton(true);
    } else if (list.length < (currentPage*amountOnPage)) {
      showPreviousButton(true);
    } else {
      showNextButton();
      showPreviousButton();
    }
  } else if (list.length <= amountOnPage){
    pageSelectorDiv.style.display = "none";
    hideNextButton();
    hidePreviousButton();
  }
}

//Functions to show and hide page selection buttons
//If only button, hide the other one.
function showNextButton(onlyButton = false) {
  var nextPage = document.getElementById('next-page');
  nextPage.classList.add('display');
  nextPage.addEventListener('click', incrementPageNumber);
  if (onlyButton) {
    hidePreviousButton();
  }
}
function showPreviousButton(onlyButton = false) {
  var previousPage = document.getElementById('previous-page');
  previousPage.classList.add('display');
  previousPage.addEventListener('click', decrementPageNumber);
  if (onlyButton) {
    hideNextButton();
  }
}
function hideNextButton() {
  var nextPage = document.getElementById('next-page');
  nextPage.classList.remove('display');
  nextPage.removeEventListener('click', incrementPageNumber);
}
function hidePreviousButton() {
  var previousPage = document.getElementById('previous-page');
  previousPage.classList.remove('display');
  previousPage.removeEventListener('click', decrementPageNumber);
}

//Functions to increase and decrease pageNumbers
function incrementPageNumber() {
  currentPage++;
  updatePage();
}
function decrementPageNumber() {
  currentPage--;
  updatePage();
}
function goToPage(number) {
  currentPage = number;
  updatePage();

}
function updatePage() {
  document.getElementById('display-page-number').textContent = currentPage;
  determinePageButtonShow();
  console.log(currentPage);
  showFeed();
}
