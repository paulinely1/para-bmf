const mongoose = require('mongoose');

const PontosDolfutSchema = new mongoose.Schema({
	data_base: {
		type: Date,
		required: true

	},
	contrato: {
		type: String,
		required: true

	},
	pontos_fechamento: [
		Number

	],
	pontos_ajuste: [
		Number

	],
	pontos_vwap: [
		Number

	],
	escada: [
		Number

	],
	createdAt: {
		type: Date,
		default: Date.now()
	}	
});

mongoose.model('PontosDolfut', PontosDolfutSchema);