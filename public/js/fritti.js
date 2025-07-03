const socket = io();

const listaFritti = document.getElementById('listaFritti');

socket.on('comande_aggiornate', comande => {
  listaFritti.innerHTML = '';
  comande.forEach(c => {
    if (c.fritti.length > 0) {
      const li = document.createElement('li');
      li.textContent = `Ordine #${c.numero}: ${c.fritti.join(', ')}`;
      listaFritti.appendChild(li);
    }
  });
});