socket.on('users', function(users){
  showTwitterUsers(users);
});

function showTwitterUsers(users) {
  var container = document.getElementById('main');
  container.innerHTML = "";
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    showUser(container, user);
  }
}

function showUser(container, user) {
  var outer = createOuterContainer(container);
  var inner = createInnerContainer(outer);
  var header = createHeader(inner, user);
  var content = createContent(inner, user);
}

function createOuterContainer(cont) {
  var div = document.createElement('div');
  div.classList.add('col-4');
  div.classList.add('profile-container-outer');
  cont.appendChild(div);
  return div;
}

function createInnerContainer(cont) {
  var div = document.createElement('div');
  div.classList.add('col-12');
  div.classList.add('profile-container-inner');
  cont.appendChild(div);
  return div;
}

function createHeader(cont, user) {
  var div = document.createElement('div');
  div.classList.add('col-12');
  div.classList.add('profile-header');
  var picture = user.profile_image_url_https;
  var name = user.name;
  var username = user.screen_name;
  headerPicture(div, picture);
  headerName(div, name);
  headerUsername(div, username);

  cont.appendChild(div);
  return div;
}

function createContent(cont, user) {
  var div = document.createElement('div');
  div.classList.add('col-12');
  div.classList.add('profile-content');
  var tweetCount = user.statuses_count;
  var followingCount = user.friends_count;
  var followersCount = user.followers_count;
  var likesCount = user.favourites_count;
  var arr = [{'no': tweetCount, 'class': 'tweet-count', 'text': 'Tweets'},
            {'no': followingCount, 'class': 'following-count', 'text': 'Following'},
            {'no': followersCount, 'class': 'followers-count', 'text': 'Followers'},
            {'no': likesCount, 'class': 'likes-count', 'text': 'Likes'}]
  for (var i = 0; i < 4; i++) {
    var el = showContainer(div);
    showStats(el, arr[i]);
  }
  cont.appendChild(div);
}

function headerName(cont, name) {
  var h = document.createElement('h2');
  h.textContent = name;
  cont.appendChild(h);
}

function headerUsername(cont, username) {
  var p = document.createElement('p');
  p.textContent = '@'+username;
  cont.appendChild(p);
}

function headerPicture(cont, picture) {
  var div = document.createElement('div');
  div.classList.add('profile-picture');
  picture = picture.replace("normal", "400x400");
  div.style.backgroundImage = 'url('+picture+')';
  cont.appendChild(div);
}

function showContainer(cont) {
  var div = document.createElement('div');
  div.classList.add('col-3');
  div.classList.add('stats-container');
  cont.append(div);
  return div;
}

function showStats(cont, json) {
  var p = document.createElement('p');
  var titleClass = json.class+'-title';
  p.classList.add(titleClass);
  p.textContent = json.text;
  cont.appendChild(p);

  p = document.createElement('p');
  p.classList.add(json.class);
  p.textContent = json.no;
  cont.appendChild(p);
}
