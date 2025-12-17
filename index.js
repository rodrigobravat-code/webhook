const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Ruta principal para verificar que el servidor está vivo
app.get('/', (req, res) => {
  res.send('El Webhook está activo y funcionando! 🚀');
});

// Ruta para la verificación del Webhook de Meta (Facebook/WhatsApp)
app.get('/webhook', (req, res) => {
  const verify_token = process.env.VERIFY_TOKEN || 'TU_TOKEN_SECRETO'; // Configura esto en Render luego

  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === verify_token) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400); // Bad Request si faltan parámetros
  }
});

// Ruta para recibir los mensajes (POST)
app.post('/webhook', (req, res) => {
  let body = req.body;

  console.log('Evento recibido:', JSON.stringify(body, null, 2));

  // Aquí procesarás los mensajes luego
  if (body.object) {
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
