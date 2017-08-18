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
 * Function to create a div and add it as a child to its parent html element
 * @param   container, the parent element in the html scope
 * @param   classes, the classes for the element
 * @param   id, the id of the element
 * @return  container, returns the container (parent element), but with the
 *          newly created element added to its children.
 */
function createDiv(classes = false, id = false) {
  var div = document.createElement('div');
  div = populateElement(div, '', classes, id);
  return div;
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
function createParagraph(content, classes = false, id = false) {
  var p = document.createElement('p');
  p = populateElement(p, content, classes, id);
  return p;
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
function createLink(content = '', href, classes = false, id = false, target = 'blank') {
  var a = document.createElement('a');
  a = populateElement(a, content, classes, id);
  a.setAttribute('href', href);
  a.setAttribute('target', target);
  a.style.cssText = "text-decoration: none";
  return a;
}
// var list = createList(['list', 'list2', 'list3'], 'class', ['id1', 'id2', 'id3']);
// document.getElementById('main').innerHTML = '';
// document.getElementById('main').appendChild(list);
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

function createListElement(content, classes = false, id = false) {
  var li = document.createElement('li');
  li = populateElement(li, content, classes, id);
  return li;
}
