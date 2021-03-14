const router = require('express').Router();
const { User, Post, Comment } = require("../../models");
//const withAuth = require('../../utils/auth');
// USAGE: app.put('/', withAuth, (req,res)... )

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll()
    User.findAll({
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password']},
        where: {
            id: req.params.id
        },
        include: [
            {
              model: Post,
              attributes: ['id', 'title', 'text', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                  model: Post,
                  attributes: ['title']
                }
            }
        ]
    })
      .then(dbUserData => {
          if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id' });
              return;
          }
          res.json(dbUserData)
      }).catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// POST /api/users
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password
    })
      .then(dbUserData => {
          /*req.session.save(() => {
            // declare session variables
            res.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true; 
            //res.json(dbUserData);
        }); */
        res.json(dbUserData);
    })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
    });
});

// POST /api/users/login
router.post('/login', (req, res) => {
    // expects {username: 'bluesatyr', password: 'password1234'}
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that username!'});
            return;
        }

        // Verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }
        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
      
            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
});

// POST api/users/logout
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
}); 

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', password: 'password1234'}
    // pass in req.body instead to only update what's passed through
    User.update(req.body, {
        individualHooks: true,
        where: {
          id: req.params.id
        }
    })
      .then(dbUserData => {
        req.session.save(() => {
          req.session.user_id = dbUserData.id;
          req.session.username = dbUserData.username;
          req.session.loggedIn = true;
      
          res.json(dbUserData);
        });
    })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    }).catch(err=> {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;