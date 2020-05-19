const mongoose = require('mongoose');
const Dolfut = mongoose.model('Dolfut');

module.exports = {
	async index(req, res){
		try {

			return res.json(
				await Dolfut.find().sort({
					dia: -1
				})
			)

		} catch(err) {
			return res.status(400).json({
				msg: err
			})
		}
	},
	async show(req, res){
		try {

			// verifica se e' vazio
			if (req.params.data == null || req.params.data == '') {
				return res.status(400).json({
					msg: 'informar data'
				});
			}
			
			const dataSolicitada = new Date(req.params.data)

			let dia = await Dolfut.find({
				data: dataSolicitada
			})

			dia.length > 0 ? res.json(dia) : res.status(400).json({msg: "dia inexistente"});
			
		} catch(err) {
			return res.status(400).json({
				msg: err
			})
		}
	},
	async create(req, res){
		try {

			// sao pelos menos 7 campos
			if (Object.keys(req.body).length < 7){
				return res.status(400).json({
					msg: 'preencha todos os campos'
				})
			}

			const data = new Date(req.body.data)

			//verifica se dia ja' existe
			const diaExiste = await Dolfut.find({
				data: data
			})

			if (diaExiste.length > 0) {
				return res.status(400).json({
					msg: 'dia ja existe'
				})
			}
			
			const novoDia = await Dolfut.create(req.body)
			
			res.json(novoDia)
		} catch(err) {
			return res.status(400).json({
				msg: err
			})
		}
	}
}