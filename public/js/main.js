const socket = io();

const form = document.getElementById('formComanda');
const numeroOrdineInput = document.getElementById('numeroOrdine');
const tipoComandaSelect = document.getElementById('tipoComanda');
const carneSelect = document.getElementById('carne');

form.addEventListener('submit', e => {
  e.preventDefault();

  const numeroOrdine = parseInt(numeroOrdineInput.value);
  const tipo = tipoComandaSelect.value;
  const carne = carneSelect.value;

  const condimenti = Array.from(document.querySelectorAll('input[name="condimenti"]:checked')).map(el => el.value);
  const fritti = Array.from(document.querySelectorAll('input[name="fritti"]:checked')).map(el => el.value);

  if (!numeroOrdine || !tipo || !carne) {
    alert('Compila tutti i campi obbligatori');
    return;
  }

  const comanda = {
    numero: numeroOrdine,
    tipo,
    carne,
    condimenti,
    fritti
  };

  socket.emit('aggiungi_comanda', comanda);

  form.reset();
});