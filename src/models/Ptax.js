const mongoose = require('mongoose');

const PtaxSchema = new mongoose.Schema({
	dia: {
		type: Date,
		required: true
	},
	ptax: {
		type: Number,
		required: true

	},
	previas: {
		p1: {
			type: Number,
			required: true

		},
		p2: {
			type: Number,
			required: true

		},
		p3: {
			type: Number,
			required: true

		},
		p4: {
			type: Number,
			required: true
		}	

	},
	volatilidade: {
		type: Number,
		required: true

	},
	createdAt: {
		type: Date,
		default: Date.now()
	}	
});

mongoose.model('Ptax', PtaxSchema);