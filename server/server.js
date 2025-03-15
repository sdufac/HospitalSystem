const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '../client')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/connection', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/connection.html'));
});

app.listen(PORT, () => {
	console.log(`Serveur Express en ligne sur http://localhost:${PORT}`);
});
