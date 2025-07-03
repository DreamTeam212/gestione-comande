const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.static(path.join(__dirname, 'public')));

let comande = [];

io.on('connection', socket => {
  console.log('Nuovo client connesso');

  socket.emit('comande_aggiornate', comande);

  socket.on('aggiungi_comanda', comanda => {
    comande.push(comanda);
    io.emit('comande_aggiornate', comande);
  });

  socket.on('completa_comanda', numeroOrdine => {
    comande = comande.filter(c => c.numero !== numeroOrdine);
    io.emit('comande_aggiornate', comande);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
