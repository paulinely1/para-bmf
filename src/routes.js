const express = require('express');
const router = express.Router();

const PtaxController = require('./controllers/PtaxController');

router.get('/', (req, res) => {
	res.send('dados ptax: /ptax/MM-DD-AAAA');
});

router.get('/ptax', PtaxController.index);
router.get('/ptax/:dia', PtaxController.show);
router.post('/ptax', PtaxController.coletar);
router.get('/ptax/medias/:data', PtaxController.medias);
// router.put('/ptax/:dia', PtaxController.update);
// router.delete('/ptax/:dia', PtaxController.destroy);

module.exports = router;