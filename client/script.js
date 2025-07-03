const socket = io("http://gestione-comande.com"); // Cambia con URL se server è online

let comande = [];

// Riferimenti DOM
const numeroInput = document.getElementById('numeroComanda');
const tipoPiattoSelect = document.getElementById('tipoPiatto');
const carneSelect = document.getElementById('carne');
const formaggioSelect = document.getElementById('formaggio');
const verdureSelect = document.getElementById('verdure');
const salseSelect = document.getElementById('salse');
const frittiSelect = document.getElementById('fritti');
const btnInserisci = document.getElementById('btnInserisci');

const listaCarne = document.getElementById('listaCarne');
const listaCondimenti = document.getElementById('listaCondimenti');
const listaFritti = document.getElementById('listaFritti');

// Ricevo aggiornamento comande dal server
socket.on("comande_aggiornate", nuoveComande => {
  comande = nuoveComande;
  aggiornaListe();
});

btnInserisci.addEventListener('click', () => {
  const numero = parseInt(numeroInput.value);
  if (isNaN(numero) || numero < 1) {
    Swal.fire('Errore', 'Inserisci un numero di comanda valido (>= 1).', 'error');
    return;
  }

  if (comande.find(c => c.numero === numero)) {
    Swal.fire('Errore', 'Numero di comanda già usato.', 'error');
    return;
  }

  const nuovaComanda = {
    numero: numero,
    tipoPiatto: tipoPiattoSelect.value,
    carne: carneSelect.value,
    formaggio: formaggioSelect.value,
    verdure: verdureSelect.value,
    salse: salseSelect.value,
    fritti: frittiSelect.value
  };

  // Invio nuova comanda al server
  socket.emit('aggiungi_comanda', nuovaComanda);

  // Reset form
  numeroInput.value = '';
  tipoPiattoSelect.value = 'niente';
  carneSelect.value = 'niente';
  formaggioSelect.value = 'niente';
  verdureSelect.value = 'niente';
  salseSelect.value = 'niente';
  frittiSelect.value = 'niente';

  // Animazione bottone
  btnInserisci.classList.add('animate__animated', 'animate__bounce');
  btnInserisci.addEventListener('animationend', () => {
    btnInserisci.classList.remove('animate__animated', 'animate__bounce');
  }, { once: true });
});

function aggiornaListe() {
  listaCarne.innerHTML = '';
  listaCondimenti.innerHTML = '';
  listaFritti.innerHTML = '';

  comande.forEach(comanda => {
    // Carne da cucinare
    if (comanda.tipoPiatto !== 'niente' && comanda.carne !== 'niente') {
      const liCarne = document.createElement('li');
      liCarne.className = 'comanda animate__animated animate__fadeInDown';
      liCarne.textContent = `#${comanda.numero} - ${capitalize(comanda.tipoPiatto)} con ${comanda.carne}`;

      if (comanda.formaggio === 'scamorza' || comanda.formaggio === 'mozzarella') {
        liCarne.textContent += ` + ${comanda.formaggio}`;
      }

      const btnElimina = creaBottoneElimina(comanda.numero, 'carne');
      liCarne.appendChild(btnElimina);

      listaCarne.appendChild(liCarne);
    }

    // Condimenti e salse
    if (comanda.tipoPiatto !== 'niente' && (comanda.salse !== 'niente' || comanda.formaggio !== 'niente' || comanda.verdure !== 'niente')) {
      const liCondimenti = document.createElement('li');
      liCondimenti.className = 'comanda animate__animated animate__fadeInDown';
      liCondimenti.textContent = `#${comanda.numero} - Condimenti: `;

      const condArr = [];
      if (comanda.formaggio !== 'niente') condArr.push(comanda.formaggio);
      if (comanda.verdure !== 'niente') condArr.push(comanda.verdure === 'melanzane_olio' ? "Melanzane sott'olio" : comanda.verdure);
      if (comanda.salse !== 'niente') condArr.push(comanda.salse);

      liCondimenti.textContent += condArr.join(", ");

      const btnElimina = creaBottoneElimina(comanda.numero, 'condimenti');
      liCondimenti.appendChild(btnElimina);

      listaCondimenti.appendChild(liCondimenti);
    }

    // Fritti da preparare
    if (comanda.fritti !== 'niente') {
      const liFritti = document.createElement('li');
      liFritti.className = 'comanda animate__animated animate__fadeInDown';
      liFritti.textContent = `#${comanda.numero} - ${comanda.fritti}`;

      const btnElimina = creaBottoneElimina(comanda.numero, 'fritti');
      liFritti.appendChild(btnElimina);

      listaFritti.appendChild(liFritti);
    }
  });
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function creaBottoneElimina(numeroComanda, sezione) {
  const btn = document.createElement('button');
  btn.textContent = 'Completa';
  btn.title = 'Rimuovi da questa lista';
  btn.dataset.sezione = sezione;

  btn.addEventListener('click', () => {
    Swal.fire({
      title: `Rimuovere la comanda #${numeroComanda} dalla sezione ${capitalize(sezione)}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sì, rimuovi',
      cancelButtonText: 'Annulla'
    }).then((result) => {
      if (result.isConfirmed) {
        // Aggiorna comande lato client
        const idx = comande.findIndex(c => c.numero === numeroComanda);
        if (idx !== -1) {
          switch (sezione) {
            case 'carne':
              comande[idx].carne = 'niente';
              break;
            case 'condimenti':
              comande[idx].formaggio = 'niente';
              comande[idx].verdure = 'niente';
              comande[idx].salse = 'niente';
              break;
            case 'fritti':
              comande[idx].fritti = 'niente';
              break;
          }
          // Se la comanda è vuota, rimuovila completamente
          const c = comande[idx];
          if (
            c.carne === 'niente' &&
            c.formaggio === 'niente' &&
            c.verdure === 'niente' &&
            c.salse === 'niente' &&
            c.fritti === 'niente'
          ) {
            comande.splice(idx, 1);
          }
        }

        // Aggiorno le liste localmente
        aggiornaListe();

        // Comunico al server di completare la comanda se è completamente vuota
        if (!comande.find(c => c.numero === numeroComanda)) {
          socket.emit('completa_comanda', numeroComanda);
        } else {
          // Se non è vuota, mando solo aggiornamento parziale (opzionale)
          socket.emit('aggiungi_comanda', comande.find(c => c.numero === numeroComanda));
        }

        Swal.fire('Rimosso!', `Comanda #${numeroComanda} aggiornata.`, 'success');
      }
    });
  });

  return btn;
}
