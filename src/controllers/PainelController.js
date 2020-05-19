const mongoose = require('mongoose');
const Dolfut = mongoose.model('Dolfut');

module.exports = {
	async index(req, res){
		try {

			return res.json(
				await Dolfut.findOne().sort({
					dia: -1
				})
			)

		} catch(err) {
			return res.status(400).json({
				msg: err
			})
		}
	}
}