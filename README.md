## Hello World example, with more


1. Run the server:
```  
node server.js
``` 

2. Open `index.html` in your browser

You should not see aq flower. If not, your browser might still support binary websockets.

Server code is contained in `server.js`
Client side code is contained in `index.html`

You need buffertools, which needs node-gyp, which needs a major release of node.js and probably not one cloned from the repo.

index.html is modified from the example at https://github.com/binaryjs/binaryjs , an npm package which you also need.
