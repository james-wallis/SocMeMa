/**
 * JavaScript functions for the settings 'page'.
 * It is in a seperate document from the feeds on the same page for readability
 * Author: James Wallis
 */
'use strict'
/**
 * Global Variables
 *    keywordList:    The list of keywords which is used when editing
 *                    or deleting a keyword.
 *    successColour:  The colour that text will be in a success message.
 *    errorColour:    The colour text will be in an error message.
 *    googleFeeds:    The feeds that are being used for the google forums page.
 */
var keywordList = [];
var successColour = '#ACFFA1';
var errorColour = '#FF6262';
var googleFeeds;
/**
 * Event Listeners
 * On Click:
 *      - showSettings  This function will run when the setting icon is clicked on
 *                      the main side bar in the automated search page. It runs the
 *                      function which is responsible for dynamically creating the
 *                      content for the setings page.
 * Mouse Over:
 *      - rotateCog     This function rotates the cog which represents settings in
 *                      the sidebar. (Styling purpose only)
 * Mouse Leave:
 *      - unrotateCog   This function rotates the settings cog in the opposite
 *                      direction to the rotateCog function. (Styling purpose only)
 *
 */
document.getElementById('setting-icon-list-item').addEventListener('click', showSettings);
document.getElementById('setting-icon-list-item').addEventListener('mouseover', rotateCog);
document.getElementById('setting-icon-list-item').addEventListener('mouseleave', unrotateCog);

/**
 * Socket.IO Listeners
 *
 */
socket.on('keywordList', displayKeywords);
socket.on('googleForumFeeds', function(list) {
  googleFeeds = list;
  var currentFeeds = document.getElementById('show-google-feed');
  if (currentFeeds != null) {
    showGoogleFeed();
  }
});

/**
 * Function to rotate the settings cog in the sidebar.
 * Run on mouseOver.
 */
function rotateCog() {
  var cog = document.getElementById('setting-icon');
  cog.style.cssText = 'transform: rotate(90deg) scale(1.2); color: #F7F9F9;';
}

/**
 * Function to rotate the settings cog in the sidebar.
 * Run on mouseLeave.
 */
function unrotateCog() {
  var cog = document.getElementById('setting-icon');
  cog.style.cssText = 'transform: ; color: #868784;';
}

/**
 * Function to clear the 'active-feed' class from each of the menu items
 *    in the side bar.
 * Also sets activeFeed variable from automated-search.js to false.
 *      This stops the feeds being refreshed and loaded into the
 *      search-results div.
 */
function clearActiveClass() {
  document.getElementById('setting-icon-list-item').classList.remove('active-feed');
  document.getElementById('stack-overflow-button').classList.remove('active-feed');
  document.getElementById('google-forum-button').classList.remove('active-feed');
  activeFeed = null;
}

/**
 * Function to display the current keywordList in the sidebar.
 */
function displayKeywords(list) {
  keywordList = list;
  var cont = document.getElementById('keyword-div');
  cont.textContent = '';
  cont = createHeaderAndAppend(cont, 3, "Current Keywords");
  for (var i = 0; i < list.length; i++) {
    cont = createParagraphAndAppend(cont, list[i]);
  }
}

/**
 * Function to create the settings page.
 * Creates divs and other elements which function as the settings page.
 * Runs populateSettings so that the forms are shown on the settings page.
 */
function showSettings() {
  clearActiveClass();
  document.getElementById('setting-icon-list-item').classList.add('active-feed');
  var container = document.getElementById('search-results');
  container.innerHTML = '';

  var div = createDiv('col-12');
  var header = createHeaderAndAppend(div, 2, "Automated Search Settings", "search-settings-header");
  container.appendChild(div);

  //Create 6 divs for settings - each has an id
  var divIDs = ['add-keyword', 'edit-keyword', 'delete-keyword', 'change-sources', 'run-times', 'amount-to-display'];
  var index = 0;
  for (var i = 0; i < 2; i++) {
    var rowCont = createDiv('col-12');
    rowCont.style.borderBottom ='1px solid #333';
    for (var j = 0; j < 3; j++) {
      rowCont = createDivAndAppend(rowCont, 'col-4 automated-settings', divIDs[index]);
      index++;
    }
    container.appendChild(rowCont);
  }
  var googleDiv = createDiv('col-12 google-settings-page');
  googleDiv = createHeaderAndAppend(googleDiv, 3, "Google Forums Specific");
  googleDiv = createDivAndAppend(googleDiv, 'col-4 google-settings', 'show-google-feed');
  googleDiv = createDivAndAppend(googleDiv, 'col-4 google-settings', 'add-google-feed');
  googleDiv = createDivAndAppend(googleDiv, 'col-4 google-settings', 'remove-google-feed');
  container.appendChild(googleDiv);
  populateSettings();
}

/**
 * Function to call all 6 functions that add forms onto the settings page.
 */
function populateSettings() {
  addKeywordForm();
  editKeywordForm();
  deleteKeywordForm();
  changeSourcesForm();
  runTimesForm();
  amountToDisplayForm();
  showGoogleFeed();
  addGoogleFeed();
  removeGoogleFeed();
}

/**
 * Function to add the 'add keyword' form to the settings page.
 */
function addKeywordForm() {
  var cont = document.getElementById('add-keyword');
  cont.innerHTML = "";
  cont = createHeaderAndAppend(cont, 3, "Add Keyword");
  var form = createForm("add-keyword", "add-keyword-form", sendKeyword);
  form = createInputTextAndAppend(form, "keyword", "Enter Keyword", "add-keyword-form-keyword");
  form =  createSubmitButtonAndAppend(form, "submit-add-keyword");
  cont.appendChild(form);
  cont = createParagraphAndAppend(cont, '', '', 'add-keyword-message');
}

/**
 * Function to add the 'edit keyword' form to the settings page.
 * The select box will be filled using options from the server.
 * When the user selects a keyword to edit it will be put into the value
 *      of the input box.
 */
function editKeywordForm() {
  var currentKeywords = [];
  socket.on('keywordList', function(list){
    currentKeywords = list;
  });
  var cont = document.getElementById('edit-keyword');
  cont.innerHTML = "";
  cont = createHeaderAndAppend(cont, 3, 'Edit Keyword');
  var form = createForm("edit-keyword", "edit-keyword-form", editKeyword);
  var select = createSelect("edit", "Select Keyword", "edit-keyword-select");
  //Show all options
  var list  = keywordList;
  selectKeywordOptions(list, 'edit', select);
  form.appendChild(select);
  form = createInputTextAndAppend(form, "edit-keyword", "Keyword will appear here", "edit-keyword-input", true);
  form = createSubmitButtonAndAppend(form, "submit-edit-keyword");
  cont.appendChild(form);
  cont = createParagraphAndAppend(cont, '', '', 'edit-keyword-message');
  //Add Event Listeners
  document.getElementById('edit-keyword-select').addEventListener('change', updateEditInput);
}

/**
 * Function to add the 'delete keyword' form to the settings page.
 * The select box will be filled using options from the server.
 */
function deleteKeywordForm() {
  var cont = document.getElementById('delete-keyword');
  cont.innerHTML = "";
  cont = createHeaderAndAppend(cont, 3, 'Delete Keyword');
  var form = createForm("delete-keyword", "delete-keyword-form", deleteKeyword);
  var select = createSelect("delete", "Select Keyword", "delete-keyword-select");
  var list  = keywordList;
  selectKeywordOptions(list, 'delete', select);
  form.appendChild(select);
  form = createSubmitButtonAndAppend(form, "submit-delete-keyword", "Delete Keyword");
  cont.appendChild(form);
  cont = createParagraphAndAppend(cont, '', '', 'delete-keyword-message');
}

/**
 * Function to populate the options within the two keyword select forms.
 * Used when the page is loaded to populate and then run again after a change
 *      occurs to the keywordList.
 */
 function selectKeywordOptions(list, task, select) {
   //Loop through each unit
   list.forEach(function (item, index) {
     var option = document.createElement('option');
     if (task === 'edit') {
       option.value = item;
     } else if (task === 'delete') {
       option.value = index;
     }
     option.textContent = item;
     select.appendChild(option);
   });
 }


/**
 * Function to add the feedSources form to the settings page.
 * The different sources will be added using items from the server.
 * After a user checks or unchecks an option it will be sent straight to the server.
 */
function changeSourcesForm() {
  var cont = document.getElementById('change-sources');
  cont.innerHTML = "";
  cont = createHeaderAndAppend(cont, 3, 'Feed Sources');
  var form = createForm("change-sources", "change-source-form");
  var input = createInputChecked("feedsToUse", "stack-overflow", "checkbox", true);
  form.appendChild(input);
  var label = document.createElement('label');
  label.textContent = "Stack Overflow";
  label.for = "feedsToUse";
  form.appendChild(label);
  cont.appendChild(form);
}

/**
 * Function to add the selection of times that the server will attempt to find
 *    articles to the page.
 * These times will be sent to the server as soon as the user has entered them.
 */
function runTimesForm() {
  var cont = document.getElementById('run-times');
  cont.innerHTML = "";
  cont = createHeaderAndAppend(cont, 3, 'Run Frequency');
}

/**
 * Function to add the input of amount of items to display on a single page.
 *    It also adds the input for amount of columns on each page.
 * This will be sent to the server as soon as it is changed. (No submit).
 */
function amountToDisplayForm() {
  var cont = document.getElementById('amount-to-display');
  cont.innerHTML = "";
  cont = createHeaderAndAppend(cont, 3, 'Layout of Articles');
  //Create Amount of Columns First
  var div = createDiv('display-input');
  var select = createSelect("columns", "Amount of Columns on page");
  //Show all options
  for (var i = 1; i < 5; i++) {
    var option = document.createElement('option');
    option.value = i;
    if (i === 1) {
      option.textContent = i + " Column";
    } else {
      option.textContent = i + " Columns";
    }
    select.appendChild(option);
  }
  div.appendChild(select);
  cont.appendChild(div);
  //Create amount of elements on a page
  var div = createDiv('display-input');
  var select = createSelect("Number on page", "Amount of Articles on Page");
  //Show all options
  for (var i = 0; i < 5; i++) {
    var option = document.createElement('option');
    option.value = i*3;
    option.textContent = i*3;
    select.appendChild(option);
  }
  div.appendChild(select);
  cont.appendChild(div);
}

/**
 * Function to update the input in the edit keyword field
 */
 function updateEditInput() {
   var select = document.getElementById('edit-keyword-select');
   var input = document.getElementById('edit-keyword-input');
   input.readOnly = false;
   input.value = select.value;
 }

/**
 * Function to show the current google feeds on the settings page
 */
 function showGoogleFeed(list = googleFeeds) {
   console.log(list);
   var cont = document.getElementById('show-google-feed');
   cont.innerHTML = '';
   cont = createHeaderAndAppend(cont, 4, 'Current Feeds');
   for (var i = 0; i < list.length; i++) {
     cont = createParagraphAndAppend(cont, list[i].title);
     cont = createLinkAndAppend(cont, googleFeeds[i].source, googleFeeds[i].source);
   }
 }

 /**
  * Function to add a form to the page which takes the inputs of a new google field
  */
 function addGoogleFeed() {
   var cont = document.getElementById('add-google-feed');
   cont = createHeaderAndAppend(cont, 4, "Add Feed");
   var form = createForm("add-google-feed", "add-google-feed-form", sendGoogleForums);
   form = createInputTextAndAppend(form, "google-form-title", "Enter Title", "add-google-feed-form-feed-title");
   form = createInputTextAndAppend(form, "google-form-url", "Enter URL", "add-google-feed-form-feed-url");
   cont.appendChild(form);
   cont = createSubmitButtonAndAppend(cont, "submit-add-google-feed");
   cont = createParagraphAndAppend(cont, '', '', 'add-google-form-message')
 }

 /**
  * Function to remove a google feed from article hunter
  */
 function removeGoogleFeed() {
   var cont = document.getElementById('remove-google-feed');
   cont = createHeaderAndAppend(cont, 4, "Remove Feed");
   var form = createForm("delete-google-feed", "delete-google-feed-form", deleteGoogleForums);
   var select = createSelect("delete-google-feed", "Select Feed", "delete-google-feed-select");
   var list  = googleFeeds;
   var titleList = [];
   for (var i = 0; i < list.length; i++) {
     titleList.push(list[i].title);
   }
   selectKeywordOptions(titleList, 'delete', select);
   form.appendChild(select);
   form = createSubmitButtonAndAppend(form, "submit-delete-google-feed", "Delete Google Feed");
   cont.appendChild(form);
   cont = createParagraphAndAppend(cont, '', '', 'delete-google-feed-message');
 }

//FUNCTIONS TO SEND FORMS TO SERVER
/**
 * Function to send a new keyword to the server to save and be implemented in the searches
 * @param event, the event that called the function, used to stop the form from submitting.
 */
function sendKeyword(event) {
  var eventId = event.target.id;
  event.preventDefault();
  var newWord = document.getElementById('add-keyword-form-keyword').value;
  var message = document.getElementById('add-keyword-message');
  if (newWord != "" && newWord != null) {
    newWord = newWord.toLowerCase();
    if (!(keywordList.indexOf(newWord) >= 0)) {
      message.textContent = "Success! '" + newWord + "' added to the list of keywords.";
      message.style.color = successColour;
      socket.emit('addKeyword', newWord);
    } else if (keywordList.indexOf(newWord) >= 0){
      message.textContent = "Error: The keyword is already in the list.";
      message.style.color = errorColour;
    } else {
      message.textContent = "Error";
      message.style.color = errorColour;
    }
  } else {
    message.textContent = "Error: Keyword field is blank.";
    message.style.color = errorColour;
  }
}

/**
 * Function to send an edited keyword to the server to save and be implemented in the searches
 * @param event, the event that called the function, used to stop the form from submitting.
 */
function editKeyword(event) {
  var eventId = event.target.id;
  event.preventDefault();
  var message = document.getElementById('edit-keyword-message');
  var old = document.getElementById('edit-keyword-select').value;
  var edit = document.getElementById('edit-keyword-input').value;
  edit = edit.toLowerCase();
  console.log(edit);
  if (edit !== null && edit !== "" && old !== null && old !== "") {
    if (edit !== old) {
      var index = keywordList.indexOf(old);
      var json = {
        'index': index,
        'edit': edit
      }
      message.textContent = "Success! '" + old + "' has been replaced with '" +
                              edit + "' in the list of keywords.";
      message.style.color = successColour;
      var list = keywordList;
      list[index] = edit;
      var select = document.getElementById('edit-keyword-select');
      socket.emit('editKeyword', json);
      selectKeywordOptions(list, 'edit', select);
    } else {
      message.textContent = "Error: Old and New Keyword are the same.";
      message.style.color = errorColour;
    }
  } else {
    message.textContent = "Error: Keyword field is blank.";
    message.style.color = errorColour;
  }
}

/**
 * Function to send an index to the server with the purpose of removing a keyword from the
 *  list of keywords and remove it from the searches
 * @param event, the event that called the function, used to stop the form from submitting.
 */
function deleteKeyword(event) {
  var eventId = event.target.id;
  event.preventDefault();
  var message = document.getElementById('delete-keyword-message');
  var index = document.getElementById('delete-keyword-select').value;
  if (Number.isInteger(parseInt(index))) {
    message.textContent = "Success! The keyword has been removed from the list.";
    message.style.color = successColour;
    var list = keywordList;
    list.splice(index, 1);
    var select = document.getElementById('delete-keyword-select');
    socket.emit('deleteKeyword', index);
    selectKeywordOptions(list, 'delete', select);
  } else {
    message.textContent = "Error: Choose a keyword to delete.";
    message.style.color = errorColour;
  }
}

/**
 * Function to send a new Google forum link to the server to save it, allowing
 * it to be searched upon
 * @param event, the event that called the function, used to stop the form from submitting.
 */
function sendGoogleForums(event) {
  var eventId = event.target.id;
  event.preventDefault();
  var newTitle = document.getElementById('add-google-feed-form-feed-title').value;
  var newSource = document.getElementById('add-google-feed-form-feed-url').value;
  var message = document.getElementById('add-google-form-message');
  if (newSource != "" && newSource != null) {
    // newSource = newSource.toLowerCase();
    var list  = googleFeeds;
    var sourceList = [];
    for (var i = 0; i < list.length; i++) {
      sourceList.push(list[i].source);
    }
    if (!(sourceList.indexOf(newSource) >= 0)) {
      message.textContent = "Success! '" + newSource + "' added to the list of Google Forums.";
      message.style.color = successColour;
      var json = {'title': newTitle, 'source': newSource};
      socket.emit('addGoogleForum', json);
    } else if (sourceList.indexOf(newSource) >= 0) {
      message.textContent = "Error: The forum is already in the list.";
      message.style.color = errorColour;
    } else {
      message.textContent = "Error";
      message.style.color = errorColour;
      console.log(sourceList.indexOf(newSource) >= 0);
      console.log(newSource);
    }
  } else {
    message.textContent = "Error: input field is blank.";
    message.style.color = errorColour;
  }
}

/**
 * Function to send an index to the server to remove a google feed from the list.
 * @param event, the event that called the function, used to stop the form from submitting.
 */
function deleteGoogleForums(event) {
  var eventId = event.target.id;
  event.preventDefault();
  var message = document.getElementById('delete-google-feed-message');
  var index = document.getElementById('delete-google-feed-select').value;
  if (Number.isInteger(parseInt(index))) {
    message.textContent = "Success! The Google Feed has been removed from the list.";
    message.style.color = successColour;
    var list = googleFeeds;
    var titleList = [];
    var returnList = {};
    for (var i = 0; i < list.length; i++) {
      titleList.push(list[i].title);
    }
    titleList.splice(index, 1);
    var select = document.getElementById('delete-google-feed-select');
    socket.emit('deleteGoogleFeed', index);
    selectKeywordOptions(titleList, 'delete', select);
  } else {
    message.textContent = "Error: Choose a Google Feed to delete.";
    message.style.color = errorColour;
  }
}
