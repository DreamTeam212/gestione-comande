const socket = io();
const listaCondimenti = document.getElementById('lista-condimenti');

socket.on('comande_aggiornate', comande => {
  listaCondimenti.innerHTML = '';

  comande.forEach(c => {
    if (c.condimenti.length > 0) {
      const li = document.createElement('li');
      li.textContent = `#${c.numero} - ${c.condimenti.join(', ')}`;

      const btnCompleta = document.createElement('button');
      btnCompleta.textContent = 'Completa';
      btnCompleta.onclick = () => {
        socket.emit('completa_comanda', c.numero);
      };

      li.appendChild(btnCompleta);
      listaCondimenti.appendChild(li);
    }
  });
});