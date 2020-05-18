const express = require('express');
const router = express.Router();

const PtaxController = require('./controllers/PtaxController');
const AjusteController = require('./controllers/AjusteController');

router.get('/', (req, res) => {
	res.send('dados ptax: /DOL/ptax/MM-DD-AAAA ou AA <br>dados ajuste: /DOL/ajusteDolar/MM-DD-AAAA');
});

const PrefixoDolar = "DOL"

// rotas para ptax
router.get(`/${PrefixoDolar}/ptax`, PtaxController.index);
router.get(`/${PrefixoDolar}/ptax/:data`, PtaxController.show);
router.post(`/${PrefixoDolar}/ptax`, PtaxController.coletar);
router.get(`/${PrefixoDolar}/ptax/medias/:data`, PtaxController.medias);

// rotas para ajustes
router.get(`/${PrefixoDolar}/ajuste`, AjusteController.index);
router.get(`/${PrefixoDolar}/ajuste/:data`, AjusteController.show);
router.post(`/${PrefixoDolar}/ajuste`, AjusteController.coletar);

module.exports = router;