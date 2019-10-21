const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '806659a2aff24347a97e11059f3af0f9'
});

const handleApiCall = (req, res) =>{
	app.models.predict(
			Clarifai.FACE_DETECT_MODEL,
		    // URL
		    req.body.input
		)
	.then(data => res.json(data))
	.catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
	const {id} = req.body;
	db('users').where('id','=',id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries =>{
		if (entries.length){
			res.json(entries[0]);
		} else {
			res.json('user not found');
		}
	})
	.catch(err => res.status(400).json('unable to get entries'))

}

module.exports = {
	handleImage,
	handleApiCall
}