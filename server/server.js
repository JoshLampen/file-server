const net = require('net');
const fs = require('fs');

const server = net.createServer(socket => {
  console.log(`Connection from ${socket.remoteAddress}, port ${socket.remotePort}`);

  socket.on('data', buffer => {
    let request = './' + buffer.toString('utf-8').trim();
    console.log(`Request from client: ${request}`);
    if (fs.existsSync(request)) {
      socket.write(`'${request}' has been found in system... importing to client folder`);
      fs.readFile(request, 'utf8', (error, data) => {
        if (error) throw error;
        socket.write(`Data from ${request} is ${data}`);
      });
    } else {
      socket.write(`'${request}' not found in system... please try again, or 'ctrl + c' to exit`);
    }
  });

  socket.on('end', () => {
    console.log(`Closed ${socket.remoteAddress} port ${socket.remotePort}`);
    process.exit();
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000!');
});