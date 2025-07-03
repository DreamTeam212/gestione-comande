const socket = io();
const listaFritti = document.getElementById('lista-fritti');

socket.on('comande_aggiornate', comande => {
  listaFritti.innerHTML = '';

  comande.forEach(c => {
    if (c.fritti.length > 0) {
      const li = document.createElement('li');
      li.textContent = `#${c.numero} - ${c.fritti.join(', ')}`;

      const btnCompleta = document.createElement('button');
      btnCompleta.textContent = 'Completa';
      btnCompleta.onclick = () => {
        socket.emit('completa_comanda', c.numero);
      };

      li.appendChild(btnCompleta);
      listaFritti.appendChild(li);
    }
  });
});