var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);

var BinaryServer = require('binaryjs').BinaryServer;
var fs = require('fs');

require('buffertools'); // fromHex() and indexOf()


// Start Binary.js server
var server = BinaryServer({port: 9000});
// Wait for new user connections
server.on('connection', function(client){

var fileName = __dirname + '/tiny.jpg';
  
  fs.exists(fileName, function(exists) 
  {
    if (exists) {
      fs.stat(fileName, function(error, stats) 
      {
	fs.open(fileName, "r", function(error, fd) 
	{
	  var buffer = new Buffer(stats.size);
	  fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) 
	  {
	    var sos = new Buffer('ffda00');
	    //var eoi = new Buffer('ffd9')
	    //http://www.w3.org/Graphics/JPEG/itu-t81.pdf#36
	    //console.log(sos.fromHex());

	    function enumerate(i,j)
	    {
	      if (i < buffer.length)
	      {
		j = i;
		i++;
		i = buffer.indexOf(sos.fromHex(),i);
		if (i == -1)
		{
		  console.log('EOI ' + buffer.length); // Reached the end of the file. Last iteration.
		  i = buffer.length;
		}
		var block = i - j;
		console.log('block ' + block); // Talk about the length of each JPEG SOS segment in bytes
		var scan = new Buffer(block);

		function extract(i, j, dex)
		{
		  if (j < i)
		  { 
		    
		    scan.writeUInt8(buffer[j], dex);
		    j++;
		    dex++;
		    extract(i,j,dex)
		  }
		}
		extract(i,j,0) // Until we have pushed all the bytes between j and i to scan
		//console.log(scan); // Not slow; noisy.
		client.send(scan);
		enumerate(i)
	      }
	    }
	    enumerate(0,0) // Until we get -1 from buffer.indexOf
	    fs.close(fd);
	  });
	});
      });
    }
  });

// Stream a flower as a hello!
//  var file = new Buffer (fs.createReadStream(__dirname + '/flower.png'));
//  client.send(file); 
});



app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

//TO-DO
//peer review, feedback
//-- ganzuul @ freenode.net
