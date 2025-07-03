const socket = io();

const listaCondimenti = document.getElementById('listaCondimenti');

socket.on('comande_aggiornate', comande => {
  listaCondimenti.innerHTML = '';
  comande.forEach(c => {
    if (c.condimenti.length > 0) {
      const li = document.createElement('li');
      li.textContent = `Ordine #${c.numero}: ${c.condimenti.join(', ')}`;
      listaCondimenti.appendChild(li);
    }
  });
});