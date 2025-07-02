const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

let comande = [];

io.on('connection', socket => {
  console.log('Nuovo client connesso');

  // Invia comande iniziali
  socket.emit('comande_aggiornate', comande);

  // Quando arriva una nuova comanda
  socket.on('aggiungi_comanda', comanda => {
    comande.push(comanda);
    io.emit('comande_aggiornate', comande); // invia a tutti
  });

  socket.on('completa_comanda', numeroOrdine => {
    comande = comande.filter(c => c.numeroOrdine !== numeroOrdine);
    io.emit('comande_aggiornate', comande);
  });
});

server.listen(3000, () => {
  console.log('Server in ascolto su porta 3000');
});
