/**
 * JavaScript File with generic functions to create different HTML elements.
 * Author: James Wallis
 */
'use strict'
/**
 * Function to add text content, classes and id to an element
 * @param   element, the html element which was created in the calling function
 * @param   content, the text content of the element if any
 * @param   classes, the classes that the element will have after creation
 * @param   id, the id of the html element
 * @return  the element that was sent as a parameter but with the text content,
 *          classes and id added (if given).
 */
function populateElement(element, content = '', classes = false, id = false) {
  if (classes) {
    element.className = classes;
  }
  if (id) {
    element.id = id;
  }
  element.textContent = content;
  return element;
}

/**
 * Function to create a div and return it
 * @param   classes, the classes for the element
 * @param   id, the id of the element
 * @return  div, returns the created div
 */
function createDiv(classes = false, id = false) {
  var div = document.createElement('div');
  div = populateElement(div, '', classes, id);
  return div;
}

/**
 * Function to create a div and add it as a child to its parent html element
 * @param   container, the parent element in the html scope
 * @param   classes, the classes for the element
 * @param   id, the id of the element
 * @return  container, returns the container (parent element), but with the
 *          newly created element added to its children.
 */
function createDivAndAppend(container, classes = false, id = false) {
  var div = createDiv(classes, id);
  container.appendChild(div);
  return container;
}

/**
 * Function to create a paragraph and add return it
 * @param   content, the text content that the element will have
 * @param   classes, the classes for the element
 * @param   id, the id of the element
 * @return  p, returns the created p element
 */
function createParagraph(content, classes = false, id = false) {
  var p = document.createElement('p');
  p = populateElement(p, content, classes, id);
  return p;
}

/**
 * Function to create a paragraph and add it as a child to its parent html element
 * @param   container, the parent element in the html scope
 * @param   content, the text content that the element will have
 * @param   classes, the classes for the element
 * @param   id, the id of the element
 * @return  container, returns the container (parent element), but with the
 *          newly created element added to its children.
 */
function createParagraphAndAppend(container, content, classes = false, id = false) {
  var p = createParagraph(content, classes, id);
  container.appendChild(p);
  return container;
}

/**
 * Function to create a header (h1, h2, h3, h4, h5, h6) and return it
 * @param   header, the type of header that it is (A number between 1 to 6)
 * @param   content, the text content that the element will have
 * @param   classes, the classes for the element
 * @param   id, the id of the element
 * @return  h, returns the created header
 */
function createHeader(header, content, id = false, classes = false) {
  var headerList = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  var h = document.createElement(headerList[header-1]);
  h = populateElement(h, content, classes, id);
  return h;
}

/**
 * Function to create a header (h1, h2, h3, h4, h5, h6) and add it as a child to its parent html element
 * @param   header, the type of header that it is (A number between 1 to 6)
 * @param   content, the text content that the element will have
 * @param   classes, the classes for the element
 * @param   id, the id of the element
 * @return  container, returns the container (parent element), but with the
 *          newly created element added to its children.
 */
function createHeaderAndAppend(container, header, content, id = false, classes = false) {
  var h = createHeader(header, content, id, classes);
  container.appendChild(h);
  return container;
}

/**
 * Function to create an 'a' tag with a href and return it
 * @param   content, the text content that the element will have
 * @param   href, the href of the element
 * @param   classes, the classes for the element
 * @param   id, the id of the element
 * @param   target, the target for the link defaults to blank (new tab)
 * @return  a, returns newly created 'a' tag.
 */
function createLink(content = '', href, classes = false, id = false, target = 'blank') {
  var a = document.createElement('a');
  a = populateElement(a, content, classes, id);
  a.setAttribute('href', href);
  a.setAttribute('target', target);
  a.style.cssText = "text-decoration: none";
  return a;
}

/**
 * Function to create an 'a' tag with a href and add it as a child to its parent html element
 * @param   container, the parent element in the html scope
 * @param   content, the text content that the element will have
 * @param   href, the href of the element
 * @param   classes, the classes for the element
 * @param   id, the id of the element
 * @param   target, the target for the link defaults to blank (new tab)
 * @return  container, returns the container (parent element), but with the
 *          newly created element added to its children.
 */
function createLinkAndAppend(container, content = '', href, classes = false, id = false, target = 'blank') {
  var a = createLink(content, href, classes, id, target);
  container.appendChild(a);
  return container;
}





//List Creators
/**
 * Function to create an unordered list and return
 * @param   listElements, The text content for each list element, index 1 is for element 1
 * @param   listClasses, The class for each list element
 * @param   listIds, A list of ids, index 1 is for list element 1.
 * @param   classes, the classes for the ul element
 * @param   id, the id of the ul element
 * @return  ul, the newly created un-ordered list
 */
function createList(listElements, listClasses = false, listIds = [], classes = false, id = false) {
  var ul = document.createElement('ul');
  if (classes) ul.className = classes;
  if (id) ul.id = id;
  for (var i = 0; i < listElements.length; i++) {
    var li = createListElement(listElements[i], listClasses, listIds[i]);
    ul.appendChild(li);
  }
  return ul;
}

/**
 * Function create an individual list item. Returns the list item
 * @param   content, The text content for the list item
 * @param   classes, the classes for the element
 * @param   id, the id of the element
 * @return  li, the newly created list item
 */
function createListElement(content, classes = false, id = false) {
  var li = document.createElement('li');
  li = populateElement(li, content, classes, id);
  return li;
}

//Form Creators
/**
 * Function to create a form element and return it
 * @param name, the name of the form
 * @param id, the id of the form
 * @param functionToCall, the function that should be called on form submit (eventListener)
 * @param method, the method that should be used - defaults to POST
 * @param action, the url that should be used on form submit - defaults to /#
 * @return form, the created form
 */
function createForm(name, id, functionToCall = false, method = "POST", action = "/#") {
  var form = document.createElement('form');
  form.name = name;
  form.id = id;
  form.method = method;
  form.action = action;
  if (!!functionToCall) {
    form.addEventListener("submit", functionToCall);
  }
  return form;
}

/**
 * Function to a text input box and return it
 * @param name, the name of the input box
 * @param placeholder, the placeholder for the input box
 * @param id, the id of the input box
 * @param readOnly, whether the input box can be typed in, defaults to false (can be used)
 * @return input, the created input
 */
function createInputText(name, placeholder, id = '', readOnly = false) {
  var input = document.createElement('input');
  input.type = "text";
  input.name = name;
  input.placeholder = placeholder;
  input.id = id;
  input.readOnly = readOnly;
  return input;
}

/**
 * Function to create an Input and append it to the Container
 * @param container, the container to append to
 * @param name, the name of the input box
 * @param placeholder, the placeholder for the input box
 * @param id, the id of the input box
 * @param readOnly, whether the input box can be typed in, defaults to false (can be used)
 * @return container, return the container that now includes the new input
 */
function createInputTextAndAppend(container, name, placeholder, id = '', readOnly = false) {
  var input = createInputText(name, placeholder, id, readOnly);
  container.appendChild(input);
  return container;
}

/**
 * Function to a checkbox input box and return it
 * @param name, the name of the input box
 * @param value, the value of the checkbox
 * @param classes, the class to add to the checkbox
 * @param checked, whether or not the checkbox is already ticked, defaults to false
 * @return input, the created input
 */
function createInputChecked(name, value, classes = '', checked = false) {
  var input = document.createElement('input');
  input.type = "checkbox";
  input.name = name;
  input.value = value;
  if (classes) {
    input.className = classes;
  }
  input.checked = checked;
  return input;
}

/**
 * Function to create a submit button and return it
 * @param name, the name of the submit button
 * @param value, the value of the submit (text on the submit box)
 * @return submit, the created submit button
 */
function createSubmitButton(name, value = "Submit") {
  var submit = document.createElement('input');
  submit.type = "submit";
  submit.name = name;
  submit.value = value;
  return submit;
}

/**
 * Function to add a submit button to a container and return the container
 * @param container, the container to append to
 * @param name, the name of the submit button
 * @param value, the value of the submit (text on the submit box)
 * @return container, the appended container with the submit button
 */
function createSubmitButtonAndAppend(container, name, value = "Submit") {
  var submit = createSubmitButton(name, value);
  container.appendChild(submit);
  return container;
}

/**
 * Function to create a select element and return it
 * @param name, the name of the select element
 * @param placeholder, the placeholder text to be shown before the select is clicked
 * @param id, the id of the select element
 * @return select, the created select element
 */
function createSelect(name, placeholder, id = '') {
  var select = document.createElement('select');
  select.name = name;
  select.id = id;
  select.innerHTML = "";
  //Create Placeholder
  var option = document.createElement('option');
  option.setAttribute("hidden", "");
  option.setAttribute("selected", "");
  option.setAttribute("disabled", "");
  option.textContent = placeholder;
  select.appendChild(option);
  return select;
}

/**
 * Function to add a select to a container and return the container
 * @param container, the container to append to
 * @param name, the name of the select element
 * @param placeholder, the placeholder text to be shown before the select is clicked
 * @param id, the id of the select element
 * @return container, the appended container with the select added
 */
function createSelectAndAppend(container, name, placeholder, id='') {
  var select = createSelect(name, placeholder, id = '');
  container.appendChild(select);
  return container;
}
