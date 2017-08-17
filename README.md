# SocMeMa - Social Media Manager

## Setup

### Adding Credentials

* Create file named '.env' to store your keys and secrets for Twitter.

* Give it the content:
```
TWITTER_CONSUMER_KEY=XXXXXXXXXXXXXXXXXXXX
TWITTER_CONSUMER_SECRET=XXXXXXXXXXXXXXXXXXXX
TWITTER_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXX
TWITTER_ACCESS_SECRET=XXXXXXXXXXXXXXXXXXXX
```
When you start Social Media Manager it will automatically read the .env file and put them into
variables in the server.js file.
It does this by using the node package 'dotenv'.

### Installing Dependencies

* cd into the SocMeMa directory.

* Enter `npm install` into the terminal.

This will install all the dependencies required for Social Media Manager for function.

### Starting the server

* Enter `npm start` into the terminal to start the server.
* Default port is `8070`.
