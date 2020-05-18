const mongoose = require('mongoose');

const AjusteSchema = new mongoose.Schema({
	dia: {
		type: Date,
		required: true
	},
	ajuste: {
		type: Number,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now()
	}	
});

mongoose.model('Ajuste', AjusteSchema);