![Twizo](http://www.twizo.com/online/logo/logo.png) 


# Twizo Node.js API

Connect to the Twizo API using the Node.js library. This API includes functions to send verifications (2FA), SMS and Number Lookup.

## Requirements
* [Node.js 6.x.x+](https://nodejs.org/en/download/)
* [NPM](https://www.npmjs.com) / [yarn](https://yarnpkg.com/en/)

## Get application secret and api host
To use the Twizo API client, the following things are required:

* Create a [Twizo account](https://register.twizo.com/)
* Login on the Twizo portal
* Find your [application](https://portal.twizo.com/applications/) secret
* Find your nearest [api node](https://www.twizo.com/developers/documentation/#introduction_api-url)

## Installation ##

[npm < 5.x.x](https://www.npmjs.com/package/twizo) 

    $ npm install --save twizo
    
[npm => 5.x.x](https://www.npmjs.com/package/twizo)  

    $ npm install twizo
    
[yarn](https://yarnpkg.com/en/package/twizo)

    $ yarn add twizo
    
## Getting started ##

Initialize the Twizo API with your api host and api secret

``` javascript
const twizo = require("twizo");

twizo.config(<yourTwizoHost>, <YourApiKey>);
``` 
Or you could set `TWIZO_HOST` and `TWIZO_API_KEY` in your environmental variables (through `dotenv` or on your server).


Create a new verification

``` javascript
let verification;
twizo.verification.submit({
    recipient: "60123456789"
})
.then(response => verification = response);
```

Verify token

``` javascript
twizo.verification.verify(response.messageId, "012345");
```


Send sms

``` javascript
twizo.sms.submit({
    recipients: ["60123456789"],
    sender: "Bob",
    body: "Hey Alice, how are you doing?"
});
```

## Examples ##

In the examples directory you can find some examples of how to use the api.

## License ##
[The MIT License](https://opensource.org/licenses/mit-license.php).
Copyright (c) 2016-2017 Twizo

## Support ##
Contact: [www.twizo.com](http://www.twizo.com/) — support@twizo.com