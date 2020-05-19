const express = require('express');
const router = express.Router();

const PtaxController = require('./controllers/PtaxController');
const AjusteController = require('./controllers/AjusteController');
const PainelController = require('./controllers/PainelController');
const DolfutController = require('./controllers/DolfutController');

router.get('/', (req, res) => {
	res.send('dados ptax: /DOL/ptax/MM-DD-AAAA ou AA <br>dados ajuste: /DOL/ajusteDolar/MM-DD-AAAA');

});

const PrefixoDolar = "DOLFUT"

//
router.get(`/${PrefixoDolar}/painel`, PainelController.index)

// rotas dolfut
router.get(`/${PrefixoDolar}/tudo`, DolfutController.index);
router.get(`/${PrefixoDolar}/:data`, DolfutController.show);
router.post(`/${PrefixoDolar}`, DolfutController.create);

// rotas para ptax
router.get(`/${PrefixoDolar}/ptax/tudo`, PtaxController.index);
router.get(`/${PrefixoDolar}/ptax/:data`, PtaxController.show);
router.post(`/${PrefixoDolar}/ptax`, PtaxController.coletar);
router.get(`/${PrefixoDolar}/ptax/media/:dias`, PtaxController.media);

// rotas para ajustes
router.get(`/${PrefixoDolar}/ajuste/tudo`, AjusteController.index);
router.get(`/${PrefixoDolar}/ajuste/:data`, AjusteController.show);
router.post(`/${PrefixoDolar}/ajuste`, AjusteController.coletar);

module.exports = router;