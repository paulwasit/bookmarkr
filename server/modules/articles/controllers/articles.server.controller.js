'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
	_ = require('lodash'),
	aws = require('aws-sdk'),
	multer = require('multer'),
	crypto = require('crypto'),
	config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./server/modules/core/controllers/errors.server.controller'));

//S3_BUCKET = process.env.S3_BUCKET,
var S3_BUCKET = "sebastienplat";
aws.config.update({
  signatureVersion: 'v4',
  region: 'eu-central-1'
});

/**
 * Create a article
 */
exports.create = function (req, res) {
  var article = new Article(req.body);
  article.user = req.user;

  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

/**
 * Show the current article
 */
exports.read = function (req, res) {
	
	var tags = req.article.tags;
	var id = req.article._id
	
	if (tags.length > 0) {
		var query = Article.find({ $and: [{tags: {$all: tags}}, {tags: {$size: tags.length}}, {_id: {$ne: id}}] })
											 .sort('index')
							         .populate('_id', 'title');;
		query.exec(function (err, related_articles) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} 
			else {
				res.json({article: req.article, related: related_articles});
			}
		});
	}
	else {
		res.json({article: req.article, related: []});
	}
	
};

/**
 * Update a article
 */
exports.update = function (req, res) {
	
	var updateQuery = [];
	
	// multi update: list page
	if (Object.getOwnPropertyNames(req.query).length > 0) {
		var items = JSON.parse(req.body.items);
		
		if (typeof req.query.set !== 'undefined') updateQuery.push({$set: JSON.parse(req.query.set)}); 
		if (typeof req.query.pull !== 'undefined') updateQuery.push({$pull: JSON.parse(req.query.pull)}); 
		if (typeof req.query.addToSet !== 'undefined') updateQuery.push({$addToSet: JSON.parse(req.query.addToSet)}); 
	}
	
	// single update: article page
	else {

		var items = [];
		items.push(req.body._id);
		
		var set = {
			title: req.body.title,
			postTitle: req.body.postTitle,
			imgUrl: req.body.imgUrl,
			content: req.body.content,
			tags: req.body.tags,
			index: req.body.index,
			isPublic: req.body.isPublic,
			isSlide: req.body.isSlide
		};
		
		updateQuery.push({$set: set});

	}
	
	var isError = false, errMsg = "";
	for (var i=0, len=updateQuery.length; i<len;i++) {
		Article.update(
			{ _id: { $in: items } }, 
			updateQuery[i],
			{ multi: true },
			function (err, numAffected) {
				//if (err) return next(err);
				if (err) {
					isError = true;
					errMsg = errMsg + '\n' + errorHandler.getErrorMessage(err);
				}
				console.log(numAffected.nModified + ' doc updated');
			}
		);
	}
	if (isError === true) return res.status(400).send({ message: errMsg });
	return res.status(200).json(req.body);
	
	/*
  article.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
	*/
	
};

/**
 * Delete an article
 */
exports.delete = function (req, res) {
	if (req.article) {
		var article = req.article;
		article.remove(function (err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			return res.status(200).json(article);
		});
	}
	else {
		var removeQuery = JSON.parse(req.query.fields);
		if (req.query.items) removeQuery._id = { $in: JSON.parse(req.query.items) };
		Article.find(removeQuery).remove(
		function (err, numAffected) {
			//if (err) return next(err);
			if (err) {
				console.log(err);
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}
			console.log(numAffected.result.n + ' doc deleted');
			return res.status(200).json(numAffected);
		});
	}
	
};

/**
 * List of Articles
 */
exports.list = function (req, res) {
	
	var queryFields = {};
	queryFields = JSON.parse(req.query.fields);
	
	var query = Article
							.find(queryFields)
							.or([{user: req.user}, {isPublic: true}])
							.sort('created')
							.populate('user', 'displayName');
	
  query.exec(function (err, articles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(articles);
    }
  });
	
};

/**
 * Article middleware
 */
exports.articleByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Article is invalid'
    });
  }
	
  Article.findById(id).populate('user', 'displayName').exec(function (err, article) {
    if (err) {
      return next(err);
    } else if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    }
    req.article = article;
    next();
  });
	
};


/**
 * Load picture
 */
exports.getSignedUrl = function (req, res) {
	
	var user = req.user;
	if (!user) return res.status(400).send({ message: 'User is not signed in' });
	
	const s3 = new aws.S3();
  //const fileName = req.query['file-name'];
	crypto.pseudoRandomBytes(16, function (err, raw) {
		
		const fileName = raw.toString('hex') + Date.now();
		const fileType = req.query['file-type'];
		const s3Params = {
			Bucket: S3_BUCKET,
			Key: fileName,
			Expires: 60,
			ContentType: fileType,
			ACL: 'public-read'
		};
		
		s3.getSignedUrl('putObject', s3Params, (err, data) => {
			if(err){
				console.log(err);
				return res.status(400).send({ message: 'Error occurred while uploading image' });
			}
			const returnData = {
				signedRequest: data,
				url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
			};
			return res.status(200).send(JSON.stringify(returnData));
		});
		
	});
  
};
 
exports.uploadImg = function (req, res) {
  var user = req.user,
			uploadInfo = config.uploads.imgUpload,
		  upload = multer(uploadInfo).single('newImg');
  var profileUploadFileFilter = require(path.resolve('./server/lib/multer')).profileUploadFileFilter;
  
  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

	// user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;
	
  if (user) {
    upload(req, res, function (uploadError) {
      if(uploadError) return res.status(400).send({ message: 'Error occurred while uploading image' });
			return res.status(200).send({ path: uploadInfo.dest + req.file.filename });
    });
  } else {
    return res.status(400).send({ message: 'User is not signed in' });
  }
	
};