const express = require('express');
const mongoose = require('mongoose');
const requireDir = require('require-dir');
require("dotenv-safe").config();

//iniciando app
const app = express();
app.use(express.json());

//iniciando BD
//local: mongodb://localhost/appDadosParaBmf
mongoose.connect(process.env.CONNECTION_STRING_BD, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('MongoDB is on!');

}).catch((err) => {
	console.log(`MongoDB: ${err}`);
})
mongoose.set('useFindAndModify', true);
mongoose.set('useUnifiedTopology', true);

//carregando todos os models
requireDir('./src/models');

//rotas
app.get('/', (req, res) => {
	res.send("<p align='center'>dados para bmf</p>");
});

//rotas
app.use('/v1', require('./src/routes'));

//porta
app.listen(8000, () => {
	console.log('Server is On (8000)!');
});