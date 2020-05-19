const mongoose = require('mongoose');
const axios = require('axios');

const Ptax = mongoose.model('Ptax');

module.exports = {
	async index(req, res){
		try {
			let ptax = await Ptax.find().sort({
				dia: -1
			})

			return res.json(ptax);
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
				})
			}

			const dataSolicitada = new Date(req.params.data)

			let ptax = await Ptax.find({
				dia: dataSolicitada
			})

			ptax.length > 0 ? res.json(ptax) : res.status(400).json({msg: "dia inexistente"})
			
		} catch(err) {
			return res.status(400).json({
				msg: err
			})
		}
	},
	//coleta o dia atraves da api do bc e salva no bd
	async coletar(req, res){
		try {

			// verifica se e' vazio
			if (req.body.data == null || req.body.data == '') {
				return res.status(400).json({
					msg: 'informar data'
				})
			}

			const dataParaBd = new Date(req.body.data)

			//verifica se dia ja' existe
			const diaExiste = await Ptax.find({
				dia: dataParaBd
			})

			if (diaExiste.length > 0) {
				return res.status(400).json({
					msg: 'data ja existe'
				})
			}

			//request bacen api
			let mes = `${dataParaBd.getMonth() + 1}`
			let dia = `${dataParaBd.getDate()}`
			
			if (mes.length == 1) mes = `0${mes}`
			if (dia.length == 1) dia = `0${dia}`

			const dataParaBacen = `${mes}${dia}${dataParaBd.getFullYear()}`
			const urlBacen = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='USD'&@dataCotacao='${dataParaBacen}'&$top=100&$format=json&$select=cotacaoVenda,dataHoraCotacao,tipoBoletim`
			const dadosBacen = await axios.get(urlBacen)

			//caso seja fim de semana ou feriado
			if (dadosBacen.data.value.length == 0) {
				return res.status(400).json({
					msg: 'dia nao valido'
				})
			}
			
			//definir maior e menor
			let maior = 0.0
			let menor = 99999.9

			for (let i = 0; i < 4; i++) {
				if (dadosBacen.data.value[i].cotacaoVenda > maior) maior = dadosBacen.data.value[i].cotacaoVenda
				if (dadosBacen.data.value[i].cotacaoVenda < menor) menor = dadosBacen.data.value[i].cotacaoVenda
			}

			let novaPtax = await Ptax.create({
				dia: dataParaBd,
				previas: {
					p1: dadosBacen.data.value[0].cotacaoVenda,
					p2: dadosBacen.data.value[1].cotacaoVenda,
					p3: dadosBacen.data.value[2].cotacaoVenda,
					p4: dadosBacen.data.value[3].cotacaoVenda

				},
				ptax: dadosBacen.data.value[4].cotacaoVenda,
				volatilidade: (maior-menor)*1000
			})

			res.json(novaPtax);
		} catch(err) {
			return res.status(400).json({
				msg: err
			})
		}		

	},
	async media(req, res){
		try {

			const diasSolicitados = isNaN(req.params.dias) ? 0 : parseInt(req.params.dias)

			// verifica se e' vazio
			if ( diasSolicitados < 1) {
				return res.status(400).json({
					msg: 'informar quantidade de dias'
				});
			}

			const dataFinal = new Date(Date.now())
			const dataInicial = new Date(Date.now())
			
			dataInicial.setDate(dataFinal.getDate() - diasSolicitados)

			let ptax = await Ptax.find({
				dia: {
					$gt: dataInicial, $lt: dataFinal
				}
			}).sort({
				dia: -1
			})

			let tempMaiorVlt = 0.0
			let tempMenorVlt = 99999.9
			let vlts = []

			// media
			let tempMediaVlt = ptax.reduce((total, num) => {
				vlts.push([num.dia ,num.volatilidade])
				if (num.volatilidade >= tempMaiorVlt) tempMaiorVlt = num.volatilidade
				if (num.volatilidade <= tempMenorVlt) tempMenorVlt = num.volatilidade
				return total + num.volatilidade
			}, 0)
			tempMediaVlt /= ptax.length

			// desvio padrao
			let desvioPadraoTemp = ptax.reduce((total, num) => {
				return total + Math.pow(num.volatilidade - tempMediaVlt, 2)
			}, 0)
			desvioPadraoTemp = Math.sqrt(desvioPadraoTemp/ptax.length)
			
			let dados = {
				days_found: ptax.length,
				avg_vlts: tempMediaVlt,
				stdev_vlts: desvioPadraoTemp,
				max_vlt: tempMaiorVlt,
				min_vlt: tempMenorVlt,
				vlts 
			}

			return res.json(dados);
		} catch(err) {
			return res.status(400).json({
				msg: err
			})
		}
	},
}