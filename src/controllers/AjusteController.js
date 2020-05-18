const axios = require('axios');
const qs = require('querystring');

module.exports = {
	async getAjusteDol(req, res){
		try {

			// const dia = `${req.params.data[0]}${req.params.data[1]}/${req.params.data[2]}${req.params.data[3]}/${req.params.data[4]}${req.params.data[5]}${req.params.data[6]}${req.params.data[7]}`;
			const dataSolicitada = new Date(req.params.data)
			let mes = `${dataSolicitada.getMonth() + 1}`
			let dia = `${dataSolicitada.getDate()}`
			if (mes.length == 1) mes = `0${mes}`
			if (dia.length == 1) dia = `0${dia}`
			const dataParaBmf = `${dia}${mes}${dataSolicitada.getFullYear()}`

			const url = 'http://www2.bmf.com.br/pages/portal/bmfbovespa/lumis/lum-ajustes-do-pregao-ptBR.asp'
			const dados = {
				dData1: dataParaBmf
			}

			const requestAjusteBmf = await axios.post(url, qs.stringify(dados));

			// verifica se e' um dia valido
			const eDiaValido = requestAjusteBmf.data.indexOf('dados para a data consultada');
			if (eDiaValido != -1) {
				// console.log(eDiaValido);
				return res.status(400).json({
					msg: 'dia nao invalido'
				});
			}
			
			// extrai apenas valor do ajuste atual
			var ajuste = "";
			const inicio = requestAjusteBmf.data.indexOf('DOL ')+178;
			const fim = inicio+10
			
			for (var i = inicio; i < fim; i++) {
				ajuste += requestAjusteBmf.data[i];
			}

			res.json({ajusteDol: ajuste});
			// res.send(requestAjusteBmf.data);
		} catch(err) {
			return res.status(400).json({
				msg: err
			});
		}
	}
}