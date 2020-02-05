const mongoose = require('mongoose');
// const fetch = require("node-fetch");
const axios = require('axios');

const Ptax = mongoose.model('Ptax');

module.exports = {
	async index(req, res){
		try {
			let ptax = await Ptax.find().sort({
				dia: -1
			});

			return res.json(ptax);
		} catch(err) {
			return res.status(400).json({
				msg: err
			});
		}
	},
	async show(req, res){
		try {
			let ptax = await Ptax.find({
				dia: req.params.dia
			});

			ptax.length > 0 ? res.json(ptax) : res.status(400).json({msg: "dia inexistente"});
			
		} catch(err) {
			return res.status(400).json({
				msg: err
			});
		}
	},

	//coleta o dia atraves da api do bc e salva no bd
	async coletar(req, res){
		try {

			// verifica se e' vazio
			if (req.body.dia == null || req.body.dia == '') {
				return res.status(400).json({
					msg: 'informar dia'
				});
			}

			//verifica se dia ja' existe
			const diaExiste = await Ptax.find({
				dia: req.body.dia
			});

			if (diaExiste.length > 0) {
				return res.status(400).json({
					msg: 'dia ja existe'
				});
			}

			//request bacen api
			let urlBacen = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='USD'&@dataCotacao='${req.body.dia}'&$top=100&$format=json&$select=cotacaoVenda,dataHoraCotacao,tipoBoletim`;
			let dadosBacen = await axios.get(urlBacen);
			// let dadosBacen = await fetch(urlBacen);
			
			//caso seja fim de semana ou feriado
			if (dadosBacen.data.value.length == 0) {
				return res.status(400).json({
					msg: 'dia nao valido'
				});
			}
			
			//definir maior e menor
			var maior = 0.0
			var menor = 99999.9;

			for (let i = 0; i < 4; i++) {
				if (dadosBacen.data.value[i].cotacaoVenda > maior) maior = dadosBacen.data.value[i].cotacaoVenda
				if (dadosBacen.data.value[i].cotacaoVenda < menor) menor = dadosBacen.data.value[i].cotacaoVenda
			}

			let novaPtax = await Ptax.create({
				dia: req.body.dia,
				previas: {
					p1: dadosBacen.data.value[0].cotacaoVenda,
					p2: dadosBacen.data.value[1].cotacaoVenda,
					p3: dadosBacen.data.value[2].cotacaoVenda,
					p4: dadosBacen.data.value[3].cotacaoVenda

				},
				ptax: dadosBacen.data.value[4].cotacaoVenda,
				volatilidade: (maior-menor)*1000
			});

			res.json(novaPtax);
		} catch(err) {
			return res.status(400).json({
				msg: err
			});
		}		

	},
	async medias(req, res){
		try {
			let ptax = await Ptax.find({
				dia: {
					$gt: req.params.data, $lt: Date.now()
				}
			}).sort({
				dia: -1
			});

			let tempMaiorVlt = 0.0
			let tempMenorVlt = 99999.9
			let vlts = []

			// media
			let tempMediaVlt = ptax.reduce((total, num) => {
				vlts.push(num.volatilidade)
				if (num.volatilidade >= tempMaiorVlt) tempMaiorVlt = num.volatilidade
				if (num.volatilidade <= tempMenorVlt) tempMenorVlt = num.volatilidade
				return total + num.volatilidade
			}, 0)
			tempMediaVlt /= ptax.length

			// desvio padrao
			let desvioPadraoTemp = ptax.reduce((total, num) => {
				return total + Math.pow(num.volatilidade - tempMediaVlt, 2)
			}, 0)
			desvioPadraoTemp /= ptax.length
			desvioPadraoTemp = Math.sqrt(desvioPadraoTemp)
			
			let dados = {
				days: ptax.length,
				avg_vol: tempMediaVlt,
				stdev_vol: desvioPadraoTemp,
				max_vol: tempMaiorVlt,
				min_vol: tempMenorVlt,
				vols: vlts 
			}

			return res.json(dados);
		} catch(err) {
			return res.status(400).json({
				msg: err
			});
		}
	},
}