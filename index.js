const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let comande = [];

io.on('connection', (socket) => {
  console.log('Nuovo client connesso');

  // Mando comande attuali al client che si connette
  socket.emit('comande_aggiornate', comande);

  // Quando arriva una nuova comanda
  socket.on('aggiungi_comanda', (comanda) => {
    comande.push(comanda);
    io.emit('comande_aggiornate', comande);
  });

  // Quando una comanda viene completata (rimossa)
  socket.on('completa_comanda', (numero) => {
    comande = comande.filter(c => c.numero !== numero);
    io.emit('comande_aggiornate', comande);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnesso');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server attivo su porta ${PORT}`);
});