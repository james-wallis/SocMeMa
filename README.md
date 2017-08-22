# Social Media Manager (SocMeMa)

## Setup

### Installing SocMeMa

* cd into the SocMeMa directory.

* Enter `npm install` into the terminal.

This will install all the dependencies required for Social Media Manager for function.

### Adding Credentials

#### Twitter
* Create file named '.env' to store your keys and secrets for Twitter.
(It should be directly inside your SocMeMa Directory)

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

### Starting the server

* Enter `npm start` into the terminal to start the server.
* Default port is `8070`.

## Packages Used
* Express (For running the Web Application)
* Socket.io (For communicating between the server and client)
* Body Parser
* Feed-Read-Parser (For Reading RSS Feeds)
* Node-Fetch (For Reading the Stack Overflow API)
* Twitter (For using the Twitter API)
* Dotenv (For reading the .env file which contains the Access Keys for Twitter)
