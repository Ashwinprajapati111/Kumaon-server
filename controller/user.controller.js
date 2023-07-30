const db = require("../model");
var bcrypt = require("bcryptjs");
const User = db.user;
const Role = db.role;
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
const { body } = require('express-validator/check')
const { validationResult } = require('express-validator/check');


exports.validate = (method) => {
  switch (method) {
    case 'signup': {
     return [ 
        body('username', 'username doesnt exists').exists(),
        body('email', 'Invalid email').exists().isEmail(),
        body('phone').optional().isInt(),
        body('status').optional().isIn(['enabled', 'disabled'])
       ]   
    }
  }
}

exports.signup = (req, res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
 

    const user = new User({
        username: req.body.username,
        lname: req.body.lname,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
      });

      user.save(user).then(y=> {

       

          if (req.body.roles) {

            Role.find({name: {$in : req.body.roles}}).then((roles) => {

              

                user.roles = roles.map(role => role._id);

                user.save(user).then(err => {
                    if (err) {
                      res.status(500).send({ message: err });
                      return;
                    }
        
                    res.send({ message: "User was registered successfully!" });
                  });

            })

          }

          
          else
          {
            Role.findOne({ name: "user" }).then((role) => {
                console.log(role);
                  user.roles = [role._id];

                  user.save().then(err => {
                    if (err) {
                      res.status(500).send({ message: err });
                      return;
                    }
          
                    res.send({ message: "User was registered successfully!" });
            })




          })

        }
        
        
    })


}

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec().then((user) => {
      

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};

exports.findAll = (req, res) => {
  User.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "some error occured while retriving tutorial",
      });
    });
  }


  exports.delete = (req, res) => {
    const id = req.params.id;
  
    User.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
          });
        } else {
          res.send({
            message: "Tutorial was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Tutorial with id=" + id
        });
      });
  };

 