const socket = io();

const form = document.getElementById('form-comanda');
const feedback = document.getElementById('feedback');

form.addEventListener('submit', e => {
  e.preventDefault();

  const numero = parseInt(document.getElementById('numero').value);
  const tipo = document.getElementById('tipo').value;
  const carne = document.getElementById('carne').value;
  const mozzarella = document.getElementById('mozzarella').checked;
  const scamorza = document.getElementById('scamorza').checked;

  const condimenti = [...document.querySelectorAll('.condimento:checked')].map(i => i.value);
  const fritti = [...document.querySelectorAll('.fritto:checked')].map(i => i.value);

  const comanda = {
    numero,
    tipo,
    carne,
    mozzarella,
    scamorza,
    condimenti,
    fritti
  };

  socket.emit('aggiungi_comanda', comanda);
  feedback.textContent = `Comanda #${numero} aggiunta!`;

  form.reset();
});