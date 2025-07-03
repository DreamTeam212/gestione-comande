const socket = io();

const listaCarne = document.getElementById('listaCarne');

socket.on('comande_aggiornate', comande => {
  listaCarne.innerHTML = '';
  comande.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `Ordine #${c.numero}: ${c.tipo} con carne ${c.carne}`;
    listaCarne.appendChild(li);
  });
});
