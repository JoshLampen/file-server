const net = require('net');
const readline = require('readline');
const fs = require('fs');

const conn = new net.Socket();

conn.connect(3000, 'localhost', () => {
  console.log('Connected to server');
  console.log('Enter name of file you would like to download');
});

conn.on('data', data => {
  const dataArr = data.toString('utf-8').split(' ');
  if (dataArr[0] === 'Data') {
    const localPath = dataArr[2];
    const body = dataArr.slice(4).join(' ');
    fs.writeFile(localPath, body, error => {
      if (error) throw error;
      
      const stats = fs.statSync(localPath);
      const fileSize = stats.size;
  
      console.log(`Sucessfully downloaded and saved ${fileSize} bytes to '${localPath}'`);
      console.log("Enter another file name or 'ctrl + c' to exit");
    });
  } else {
    console.log(data.toString('utf-8'));
  }
});

conn.on('end', () => {
  console.log('Server has closed connection');
  process.exit();
});

const rl = readline.createInterface({ input: process.stdin });

rl.on('line', line => {
  conn.write(`${line}\n`);
});

rl.on('close', () => {
  conn.end();
});