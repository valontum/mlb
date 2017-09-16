const express = require('express');
const router = express.Router();
var fs = require('file-system');
var MongoClient = require('mongodb').MongoClient , assert = require('assert');
var randomstring = require("randomstring");
// Connection URL
var url = 'mongodb://hasan:Mitrovica12@ds161245.mlab.com:61245/ushtrimedb';

var mongodb;


MongoClient.connect(url, {
    poolSize: 10
    // other options can go here
  },function(err, db) {
    //assert.equal(null, err); to fix it later
    mongodb=db;
  }
)




var auth = function(req, res, next) {





  var query = { session: req.session.id, id: req.session.user};
  mongodb.collection("sessions").find(query).toArray(function(err, result) {
    if (err) throw err;
    if(result.length == 1)
    {
      return next();
    }
    else
    {
      return res.sendStatus(401);
    }

  });

};




var setNotifications = function(publisher_id, publisher_name, type, source_id, target_id, target_publisher_id) {


  var id = randomstring.generate();

















if(target_publisher_id != publisher_id) {


  mongodb.collection("users").update({id: parseInt(target_publisher_id)}, {
    $push: {
      notifications: {
        $each: [{
          id: id,
          publisher_id: publisher_id,
          publisher_name: publisher_name,
          publish_date: new Date().toJSON(),
          type: type,
          source_id: source_id,
          target_id: target_id,
          open: false
        }], $position: 0
      }
    }
  }, function (err, object) {
    if (err) {
      console.log(err);
      // returns error if no matching object found
    } else {

      mongodb.collection("users").update({id: parseInt(target_publisher_id)}, {"$set": {openNotifications: true}}, {"upsert": true}, function (err, object) {
        if (err) {
          console.log(err);
          // returns error if no matching object found
        } else {

          console.log("notifications");

        }
      });

    }
  });


}










};


var getPublisherId = function(postId) {



  return  mongodb.collection("challenges").find({id : postId}, {'publisher_id' : true});



};







/* GET api listing. */
router.get('/', (req, res) => {
  res.send('api works');
});





function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}



router.get('/notificationsstatus/:id',upload.single('pict'), (req, res, next) => {


  mongodb.collection("users").find({id : parseInt(req.params.id)}, {"openNotifications" : true, "notifications": true}).toArray(function (err, result) {

    res.json(result);

});




});








router.post('/register',upload.single('pict'), (req, res, next) => {




  var newUserId = getRandomInt(10000000, 100000000000);




let formData = req.body;

console.log(formData);

var query = { email: formData.email };
mongodb.collection("users").find(query).toArray(function(err, result) {

  if(result.length!=0)
  {

    res.json({status:"User exists"});


  }else
  {

    if (req.file != null) {
      var tmp_path = req.file.path;




      var src = fs.createReadStream(tmp_path);
      var dest = fs.createWriteStream('public/images/avatar/' + newUserId + '.jpg');
      src.pipe(dest);
      src.on('end', function () {
      });
      src.on('error', function (err) {

      });
    }else
    {
      var src = fs.createReadStream('uploads/default.jpg');
      var dest = fs.createWriteStream('public/images/avatar/' + newUserId + '.jpg');
      src.pipe(dest);
      src.on('end', function () {
      });
      src.on('error', function (err) {

      });
    }

    var myobj = { id: newUserId , email: formData.email, password: formData.password, description : formData.description, name: formData.name};
    mongodb.collection("users").insertOne(myobj, function(err, res) {
      if (err) throw err;

    });

    var myobj = {session: req.session.id , id: newUserId};

    mongodb.collection("sessions").insertOne(myobj, function (err, res) {
      if (err) throw err;

    });

    req.session.user = newUserId;
    req.session.name = formData.name;

    var token = randomstring.generate();
    res.json({status:"User created!", user:{id: newUserId, name: formData.name, email:formData.email, token: token}});



  }

});




});





router.post('/authenticate',upload.single('pict'), (req, res, next) => {


  let formData = req.body;


var query = {email: formData.email};
mongodb.collection("users").find(query).toArray(function (err, result) {
  if (err) throw err;

  if (result.length == 0) {
    res.json({status: "User dn"});


  } else {
    if (result[0].password == formData.password) {
      var token = randomstring.generate();

      var myobj = {session: req.session.id , id: result[0].id};

      mongodb.collection("sessions").insertOne(myobj, function (err, res) {
        if (err) throw err;

      });
      req.session.user = result[0].id;
      req.session.name = result[0].name;

      res.json({
        status: "Success",
        user: {id: result[0].id, name: result[0].name, email: formData.email, token: token}
      });


    } else {

      res.json({status: "Incorrect Email or Password"});
    }
  }


});


});



router.get('/logout', (req, res, next) => {

  req.session = null;
res.send("logout success!");


});







router.get('/challenges', (req, res, next) => {


mongodb.collection("challenges").find({},{'publisher_name' : true, 'title':true, 'id':true, 'description' : true, 'publisher_id' : true , 'likes': true, 'shares' : true, 'amount' : true, 'deadline' : true, 'publish_date' : true, 'ideas':true}).toArray(function (err, result) {
  if (err) throw err;

  res.json(result);

});


});



router.get('/popularchallenges', (req, res, next) => {


  mongodb.collection("challenges").find({},{ 'title':true, 'id':true, 'publish_date' : true}, { limit : 3 }).toArray(function (err, result) {
  if (err) throw err;

  res.json(result);

});


});





router.get('/challenge/:id', (req, res, next) => {

  var userID =req.params.id;




  mongodb.collection("challenges").find({id : userID}).sort({'ideas.publish_date': -1}).toArray(function (err, result) {
    if (err) throw err;



    res.json(result);

  });


});


router.put('/notifications',upload.single('pict'), (req, res, next) => {



mongodb.collection("users").update({id: req.session.user}, {"$set": {openNotifications: false}}, {"upsert": true}, function (err, object) {
  if (err) {
    console.log(err);
    // returns error if no matching object found
  } else {

    res.json({status: "success"});

  }
});




});



router.put('/ideas/:id',upload.single('pict'), (req, res, next) => {

  var userID =req.params.id;
  formData = req.body;

  var id = randomstring.generate();

  mongodb.collection("challenges").update({ id: req.params.id },{ $push: { ideas: {$each:[{id :id, description :  formData.solution, publisher_id: req.session.user, publisher_name : req.session.name, publish_date : new Date().toJSON(), likes: [] }],  $position: 0} } }, function(err, object) {
    if (err) {
      console.log(err);
       // returns error if no matching object found
    } else {


      console.log(formData);

      setNotifications(req.session.user, req.session.name, 6, id, req.params.id, formData.target_publisher_id);


      res.json({status: "success"});
    }
  }) ;




});



router.put('/question/:id',upload.single('pict'), (req, res, next) => {

  var userID =req.params.id;
formData = req.body;

console.log(formData);
var id = randomstring.generate();

mongodb.collection("challenges").update({ id: req.params.id },{ $push: { questions: {$each:[{id :id, description :  formData.question, publisher_id: req.session.user, publisher_name : req.session.name, publish_date : new Date().toJSON(), likes: [] }],  $position: 0} } }, function(err, object) {
  if (err) {
    console.log(err);
    // returns error if no matching object found
  } else {

    setNotifications(req.session.user, req.session.name, 5, id, req.params.id, formData.target_publisher_id);

    res.json({status: "success"});
  }
}) ;


});



router.put('/like/:id',upload.single('pict'), (req, res, next) => {

  var userID =req.params.id;
  let formData = req.body;

var id = randomstring.generate();

mongodb.collection("challenges").update({ id: req.params.id },{ $push: { likes: {id :id,publisher_id: req.session.user, publisher_name : req.session.name, publish_date : new Date().toJSON() } } }, function(err, object) {
  if (err) {
    console.log(err);
    // returns error if no matching object found
  } else {


    setNotifications(req.session.user, req.session.name, 2, id, req.params.id, formData.target_publisher_id);
    res.json({status: "success"});
  }
}) ;


});







router.put('/idealike/:id',upload.single('pict'), (req, res, next) => {

  var userID =req.params.id;
  let formData = req.body;

var id = randomstring.generate();

mongodb.collection("challenges").update({ id: userID, "ideas.id":formData.ideaId },{$push: { "ideas.$.likes": {id :id,publisher_id: req.session.user, publisher_name : req.session.name, publish_date : new Date().toJSON() } } }, function(err, object) {
  if (err) {
    console.log(err);
    // returns error if no matching object found
  } else {


    setNotifications(req.session.user, req.session.name, 3, id, req.params.id, formData.target_publisher_id);
    res.json({status: "success"});
  }
}) ;










});



router.put('/unlikeidea/:id',upload.single('pict'), (req, res, next) => {

  var userID =req.params.id;
let formData = req.body;

var id = randomstring.generate();

mongodb.collection("challenges").update({ id: userID, "ideas.id":formData.ideaId },{$pull: { "ideas.$.likes": {publisher_id: req.session.user} } }, function(err, object) {
  if (err) {
    console.log(err);
    // returns error if no matching object found
  } else {

    res.json({status: "success"});
  }
}) ;


});




router.put('/questionlike/:id',upload.single('pict'), (req, res, next) => {

  var userID =req.params.id;
let formData = req.body;

var id = randomstring.generate();

mongodb.collection("challenges").update({ id: userID, "questions.id":formData.questionId },{$push: { "questions.$.likes": {id :id,publisher_id: req.session.user, publisher_name : req.session.name, publish_date : new Date().toJSON() } } }, function(err, object) {
  if (err) {
    console.log(err);
    // returns error if no matching object found
  } else {


    setNotifications(req.session.user, req.session.name, 4, id, req.params.id, formData.target_publisher_id);
    res.json({status: "success"});
  }
}) ;








});



router.put('/unlikequestion/:id',upload.single('pict'), (req, res, next) => {

  var userID =req.params.id;
let formData = req.body;

var id = randomstring.generate();

mongodb.collection("challenges").update({ id: userID, "questions.id":formData.questionId },{$pull: { "questions.$.likes": {publisher_id: req.session.user} } }, function(err, object) {
  if (err) {
    console.log(err);
    // returns error if no matching object found
  } else {

    res.json({status: "success"});
  }
}) ;


});










router.put('/unlike/:id',upload.single('pict'), (req, res, next) => {

  var userID =req.params.id;
  let formData = req.body;


  console.log(userID);

mongodb.collection("challenges").update({id: userID}, {$pull: { "likes" : { publisher_id: req.session.user } }}, function(err, data){
  if(err) {
    return res.status(500).json({'error' : 'error in deleting address'});
  }


  res.json(data);

});




});





router.get('/profile/:id', (req, res, next) => {


  var userID = parseInt(req.params.id);

  console.log(userID);

  var profile = {
    bio : [],
    challenges : [],
    me : req.session.user == userID ? true : false

};



  mongodb.collection("challenges").find({publisher_id : userID}, {'publisher_name' : true, 'title':true, 'id':true, 'description' : true, 'publisher_id' : true , 'likes': true, 'shares' : true, 'amount' : true, 'deadline' : true, 'publish_date' : true, 'ideas':true}).toArray(function (err, result) {
  if (err) throw err;

  profile.challenges = result;


    mongodb.collection("users").find({id : userID},{'name' : true, 'description':true, 'id':true}).toArray(function (err, result) {
      if (err) throw err;

      profile.bio =result[0];
      console.log(result);

      res.json(profile);


});






});






});








router.post('/new-challenge',upload.single('pict'),  (req, res, next) => {



    let formData = req.body;

    console.log(formData);


    var challenge_id = randomstring.generate();


    var query = {publisher_name:formData.name, id:challenge_id, publisher_id: req.session.user, title: formData.title, description : formData.description, requirements : formData.requirements, reward : formData.reward, amount : formData.amount, deadline : formData.deadline, publish_date: new Date() , questions : [], final_solution : [], likes : [], shares : [], ideas:[] };



    mongodb.collection("challenges").insertOne(query, function(err, res) {
      if (err) throw err;

    });


    var tmp_path = req.file.path;




    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream('public/images/challenge_cover/' + challenge_id + '.jpg');
    src.pipe(dest);
    src.on('end', function () {
    });
    src.on('error', function (err) {

    });


    res.json({status:"Challenge Created", id : challenge_id});










});



















module.exports = router;
