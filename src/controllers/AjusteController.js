const mongoose = require('mongoose');
const axios = require('axios');
const qs = require('querystring');

const Ajuste = mongoose.model('Ajuste');

module.exports = {
	async index(req, res){
		try {
			let ajuste = await Ajuste.find().sort({
				dia: -1
			});

			return res.json(ajuste);
		} catch(err) {
			return res.status(400).json({
				msg: err
			});
		}
	},
	async show(req, res){
		try {

			const dataSolicitada = new Date(req.params.data)

			let ajuste = await Ajuste.find({
				dia: dataSolicitada
			});

			ajuste.length > 0 ? res.json(ajuste) : res.status(400).json({msg: "dia inexistente"});
			
		} catch(err) {
			return res.status(400).json({
				msg: err
			});
		}
	},
	async coletar(req, res){
		try {

			// verifica se e' vazio
			if (req.body.data == null || req.body.data == '') {
				return res.status(400).json({
					msg: 'informar data'
				});
			}
			const dataSolicitada = new Date(req.body.data)

			//verifica se dia ja' existe
			const diaExiste = await Ajuste.find({
				dia: dataSolicitada
			});

			if (diaExiste.length > 0) {
				return res.status(400).json({
					msg: 'data ja existe'
				});
			}
			
			let mes = `${dataSolicitada.getMonth() + 1}`
			let dia = `${dataSolicitada.getDate()}`
			if (mes.length == 1) mes = `0${mes}`
			if (dia.length == 1) dia = `0${dia}`
			const dataParaBmf = `${dia}/${mes}/${dataSolicitada.getFullYear()}`

			const url = 'http://www2.bmf.com.br/pages/portal/bmfbovespa/lumis/lum-ajustes-do-pregao-ptBR.asp'
			const dados = {
				dData1: dataParaBmf
			}

			const requestAjusteBmf = await axios.post(url, qs.stringify(dados));

			// verifica se e' um dia valido
			const eDiaValido = requestAjusteBmf.data.indexOf('dados para a data consultada');
			if (eDiaValido != -1) {
				return res.status(400).json({
					msg: 'dia nao invalido'
				});
			}
			
			// extrai apenas valor do ajuste atual
			let ajusteFinal = "";
			const inicio = requestAjusteBmf.data.indexOf('DOL ')+178;
			const fim = inicio+10

			for (let i = inicio; i < fim; i++) {
				ajusteFinal += requestAjusteBmf.data[i];
			}

			//converte para float
			ajusteFinal = parseFloat(ajusteFinal.replace('.', '').replace(',', '.'))

			let novoAjuste = Ajuste.create({
				dia: dataSolicitada,
				ajuste: ajusteFinal
			})

			res.json(novoAjuste)
		} catch(err) {
			return res.status(400).json({
				msg: err
			})
		}
	}
}