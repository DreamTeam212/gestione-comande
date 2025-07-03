const socket = io();

const listaCarne = document.getElementById('lista-carne');

socket.on('comande_aggiornate', comande => {
  listaCarne.innerHTML = '';

  comande.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `#${c.numero} - ${c.tipo} con ${c.carne} ${c.mozzarella ? '+ mozzarella' : ''} ${c.scamorza ? '+ scamorza' : ''}`;
    
    const btnCompleta = document.createElement('button');
    btnCompleta.textContent = 'Completa';
    btnCompleta.onclick = () => {
      socket.emit('completa_comanda', c.numero);
    };

    li.appendChild(btnCompleta);
    listaCarne.appendChild(li);
  });
});