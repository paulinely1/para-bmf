const axios = require('axios');
const qs = require('querystring');

module.exports = {
	async getAjusteDol(req, res){
		try {

			const dia = `${req.params.data[0]}${req.params.data[1]}/${req.params.data[2]}${req.params.data[3]}/${req.params.data[4]}${req.params.data[5]}${req.params.data[6]}${req.params.data[7]}`;
			const url = 'http://www2.bmf.com.br/pages/portal/bmfbovespa/lumis/lum-ajustes-do-pregao-ptBR.asp'
			const dados = {
				dData1: dia
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