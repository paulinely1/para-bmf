const mongoose = require('mongoose');
const Dolfut = mongoose.model('Dolfut');
const PontosDolfut = mongoose.model('PontosDolfut');

module.exports = {
	async index(req, res){
		try {

			const dolFut = await Dolfut.findOne().sort({
				dia: -1
			})
			
			//verifica se dia ja' existe
			const diaExiste = await PontosDolfut.findOne({
				data_base: dolFut.data
			})

			if (diaExiste.length > 0) {
				return res.json(diaExiste)
			}

			const quantidadePontos = 4 // qnt de pontos para cima e para baixo
			const incrementoFechamento = 0.005 // 0,5%
			const incrementoAjuste = 0.005 // 0,5%
			const incrementoVwap = 0.005 // 0,5%
			let pontosFechamento = []
			let pontosAjuste = []
			let pontosVwap = []
			let escadaPontos = [] // para todos os pontos ordenados

			pontosFechamento.push(dolFut.fechamento)
			pontosAjuste.push(dolFut.ajuste)
			pontosVwap.push(dolFut.vwap)

			//pontos positivos
			for (let i = 1; i < quantidadePontos+1; i++) {
				pontosFechamento[i] = pontosFechamento[i-1] * (1 + incrementoFechamento)
				pontosAjuste[i] = pontosAjuste[i-1] * (1 + incrementoAjuste)
				pontosVwap[i] = pontosVwap[i-1] * (1 + incrementoVwap)
			}

			//pontos negativos
			for (let i = 5; i < quantidadePontos+5; i++) {
				if (i === 5) {
					pontosFechamento[i] = pontosFechamento[0] * (1 - incrementoFechamento)
					pontosAjuste[i] = pontosAjuste[0] * (1 - incrementoAjuste)
					pontosVwap[i] = pontosVwap[0] * (1 - incrementoVwap)
				} else {
					pontosFechamento[i] = pontosFechamento[i-1] * (1 - incrementoFechamento)
					pontosAjuste[i] = pontosAjuste[i-1] * (1 - incrementoAjuste)
					pontosVwap[i] = pontosVwap[i-1] * (1 - incrementoVwap)
				}
			}

			// manda para escadaPontos
			for (let i = 0; i < pontosFechamento.length; i++) {
				escadaPontos.push(pontosFechamento[i])				
			}
			for (let i = 0; i < pontosAjuste.length; i++) {
				escadaPontos.push(pontosAjuste[i])				
			}
			for (let i = 0; i < pontosVwap.length; i++) {
				escadaPontos.push(pontosVwap[i])				
			}

			escadaPontos.sort((a, b) => b-a)

			let pontos = {
				data_base: dolFut.data,
				contrato: dolFut.contrato,
				pontos_fechamento: pontosFechamento,
				pontos_ajuste: pontosAjuste,
				pontos_vwap: pontosVwap,
				escada: escadaPontos
			}

			return res.json(await PontosDolfut.create(pontos))

		} catch(err) {
			return res.status(400).json({
				msg: err
			})
		}
	}
}