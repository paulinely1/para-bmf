const axios = require('axios');
const qs = require('querystring');

module.exports = {
	async show(req, res){
		try {

			const dia = `${req.params.data[0]}${req.params.data[1]}/${req.params.data[2]}${req.params.data[3]}/${req.params.data[4]}${req.params.data[5]}${req.params.data[6]}${req.params.data[7]}`;
			const url = 'http://www2.bmf.com.br/pages/portal/bmfbovespa/lumis/lum-ajustes-do-pregao-ptBR.asp'
			const dados = {
				dData1: dia
			}

			const requestAjusteBmf = await axios.post(url, qs.stringify(dados));
			
			// extrai apenas valor do ajuste atual
			var ajuste = "";
			const inicio = requestAjusteBmf.data.indexOf('DOL ')+178;
			const fim = inicio+10
			
			for (var i = inicio; i < fim; i++) {
				ajuste += requestAjusteBmf.data[i];
			}

			res.send(ajuste);
		} catch(err) {
			return res.status(400).json({
				msg: err
			});
		}
	}
}