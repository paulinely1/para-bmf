const express = require('express');
const router = express.Router();

const PtaxController = require('./controllers/PtaxController');
const AjusteController = require('./controllers/AjusteController');

router.get('/', (req, res) => {
	res.send('dados ptax: /ptax/MM-DD-AAAA<br>dados ajuste: /ajusteDolar/DDMMAAAA');
});


// rotas para ptax
router.get('/ptax', PtaxController.index);
router.get('/ptax/:dia', PtaxController.show);
router.post('/ptax', PtaxController.coletar);
router.get('/ptax/medias/:data', PtaxController.medias);

// rotas para ajustes
router.get('/ajusteDol/:data', AjusteController.getAjusteDol);

module.exports = router;