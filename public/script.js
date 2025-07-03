const socket = io();

const form = document.getElementById('formComanda');
const listaComande = document.getElementById('listaComande');

form.addEventListener('submit', e => {
  e.preventDefault();

  const numeroOrdine = Number(document.getElementById('numeroOrdine').value);
  const descrizione = document.getElementById('descrizione').value.trim();

  if (!numeroOrdine || descrizione === '') {
    alert('Compila tutti i campi');
    return;
  }

  const comanda = { numeroOrdine, descrizione };

  socket.emit('aggiungi_comanda', comanda);

  form.reset();
});

socket.on('comande_aggiornate', comande => {
  listaComande.innerHTML = '';
  comande.forEach(c => {
    const li = document.createElement('li');
    li.textContent = `Ordine #${c.numeroOrdine}: ${c.descrizione}`;

    const btnCompleta = document.createElement('button');
    btnCompleta.textContent = 'Completa';
    btnCompleta.className = 'completa';
    btnCompleta.onclick = () => {
      socket.emit('completa_comanda', c.numeroOrdine);
    };

    li.appendChild(btnCompleta);
    listaComande.appendChild(li);
  });
});
