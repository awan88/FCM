const admin = require('firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Inisialisasi Firebase Admin SDK dengan kredensial Service Account
const serviceAccount = require('./serviceAccountKey.json'); // path ke file JSON kunci akun layanan

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware untuk memparsing body JSON
app.use(bodyParser.json());

// Endpoint untuk mengirim notifikasi push
app.post('/send-notification', async (req, res) => {
  const { deviceToken, title, body } = req.body;

  try {
    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: deviceToken, // Token perangkat dari aplikasi Android
    };

    const response = await admin.messaging().send(message);
    res.status(200).send({ success: true, messageId: response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send({ success: false, error: error.message });
  }
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
