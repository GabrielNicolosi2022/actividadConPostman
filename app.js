const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(8080, () => {
  console.log('Server listening on port 8080');
});

// Frase inicial
let fraseInicial = 'Frase inicial';
// GET '/api/frase': devuelve un objeto que como campo ‘frase’ contenga la frase completa
app.get('/api/frase', (req, res) => {
  // Objeto con la frase completa
  const frase = { frase: fraseInicial };

  if (!frase) {
    return res
      .status(500)
      .send({ status: 'error', message: 'Recurso no disponible' });
  }
  return res
    .json(frase)
    .send({ status: 'success', message: 'Frase inicial enviada' });
});

// GET '/api/palabras/:pos': devuelve un objeto que como campo ‘buscada’ contenga la palabra hallada en la frase en la posición dada
app.get('/api/palabras/:pos', (req, res) => {
  //Obtener la posición deseada de los parámetros de la URL
  let pos = parseInt(req.params.pos);
  //Divido la frase en palabras
  const palabras = fraseInicial.split(' ');
  //Valído la posición enviada por el cliente
  if (isNaN(pos) || pos <= 0 || pos > palabras.length) {
    return res
      .status(400)
      .send({ status: 'error', message: 'Posición fuera de rango' });
  }
  //En caso de no entrar en el if obtengo la palabra buscada en la posición requerida
  const palabraBuscada = palabras[pos - 1];
  const palabraObtenida = { buscada: palabraBuscada };
  res
    .json(palabraObtenida)
    .send({ status: 'success', message: 'Palabra enviada' });
});

// POST '/api/palabras': recibe un objeto con una palabra bajo el campo ‘palabra’ y la agrega al final de la frase.
app.post('/api/palabras', (req, res) => {
  let nuevaPalabra = req.body;
  if (!nuevaPalabra.palabra || nuevaPalabra.palabra === '') {
    return res
      .status(400)
      .send({ status: 'error', error: 'Incomplete values' });
  }

  const fraseActualizada = fraseInicial + ' ' + nuevaPalabra.palabra;
  const palabras = fraseActualizada.split(' ');
  //Obtengo la posición de la nueva palabra en la frase actualizada
  const pos = palabras.indexOf('actualizada') + 1; // Sumo 1 para obtener la posición real (la primera posición es 0)
  const palabraAgregada = {
    agregada: nuevaPalabra.palabra,
    pos: pos,
  };
  res.json(palabraAgregada).send({
    status: 'success',
    message: 'Palabra agregada con éxito',
  });
});

//PUT '/api/palabras/:pos': recibe un objeto con una palabra bajo el campo ‘palabra’ y reemplaza en la frase aquella hallada en la posición dada.
app.put('/api/palabras/:pos', (req, res) => {
  //Reemplazo una palabra de la frase inicial por la palabra actualizada en la pos dada por el cliente
  let pos = parseInt(req.params.pos); //Tomo el req.param.pos que enviará el usuario al momento de hacer la petición y lo convierto a entero
  let palabraActualizada = req.body.palabra; // Obtengo la nueva palabra del cuerpo de la petición
  //Divido la frase inicial en palabras
  const palabras = fraseInicial.split(' ');

  if (isNaN(pos) || pos < 0 || pos >= palabras.length) {
    res.status(404).send({ status: 'error', message: 'Invalid position' });
  }
  const palabraAnterior = palabras[pos]; // Guardo la palabra anterior para devolverla en la respuesta
  palabras[pos] = palabraActualizada; // Reemplazo la palabra en la posición dada con la palabra actualizada
  fraseInicial = palabras.join(' '); // Actualizo la frase inicial con la frase modificada

  // Armo la respuesta con la palabra actualizada y la palabra anterior
  const respuesta = {
    actualizada: palabraActualizada,
    anterior: palabraAnterior,
  };
  res
    .json(respuesta)
    .send({ status: 'succes', message: 'Frase actualizada correctamente' });
});
//DELETE '/api/palabras/:pos': elimina una palabra en la frase, según la posición dada 
app.delete('/api/palabras/:pos', (req, res) => {
  let pos = parseInt(req.params.pos); //Tomo el req.param.pos que enviará el usuario al momento de hacer la petición y lo convierto a entero
  //Divido la frase inicial en palabras
  const palabras = fraseInicial.split(' ');
  //Valido la posición dada por el usuario
  if (isNaN(pos) || pos < 0 || pos >= palabras.length) {
    res.status(404).send({ status: 'error', message: 'Invalid position' });
  }
  const palabraEliminada = palabras[pos]; // Guardo la palabra a eliminar para devolverla en la respuesta

  palabras.splice(pos, 1); //Elimino una palabra en la frase, según la posición dada.
  res.send({status:'succes', message:`La palabra ${palabraEliminada} ha sido eliminada exitosamente.`})
});