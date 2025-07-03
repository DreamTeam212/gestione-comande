const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// Serve file statici dal frontend
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html all'accesso root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let comande = [];

io.on('connection', socket => {
  console.log('Nuovo client connesso');

  socket.emit('comande_aggiornate', comande);

  socket.on('aggiungi_comanda', comanda => {
    comande.push(comanda);
    io.emit('comande_aggiornate', comande);
  });

  socket.on('completa_comanda', numeroOrdine => {
    comande = comande.filter(c => c.numeroOrdine !== numeroOrdine);
    io.emit('comande_aggiornate', comande);
  });
});

// Porta dinamica per Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
