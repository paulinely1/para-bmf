const mongoose = require('mongoose');

const DolfutSchema = new mongoose.Schema({
	data: {
		type: Date,
		required: true
	},

	contrato: {
		type: String,
		required: true
		
	},
	
	abertura: {
		type: Number,
		required: true

	},
	fechamento: {
		type: Number,
		required: true

	},
	maxima: {
		type: Number,
		required: true

	},
	minima: {
		type: Number,
		required: true

	},
	ptax_bacen: {
		type: Number,

	},

	ajuste: {
		type: Number,

	},
	vwap: {
		type: Number,

	},
	volume: {
		type: Number,
		required: true

	},
	delta: {
		type: Number,

	},
	createdAt: {
		type: Date,
		default: Date.now()
	}	
});

mongoose.model('Dolfut', DolfutSchema);