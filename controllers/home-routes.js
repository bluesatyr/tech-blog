const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// GET ALL
router.get('/', (req, res) =>{
  console.log(req.session);  
  Post.findAll({
        attributes: [
          'id',
          'title',
          'text',
          'created_at',
        ],
        include: [
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: User,
              attributes: ['username']
            }
          },
          {
            model: User,
            attributes: ['username']
          }
        ]
    })
      .then(dbPostData => {
        // pass a single post object into the homepage template
        console.log(dbPostData[0]);
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('homepage', {
          posts,
          // loggedIn: req.session.loggedIn
        });
    })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET ONE by post_id
router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'title',
      'text',
      'created_at',
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });

      // pass data to template
      res.render('single-post', {
        post,
        //loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

/*
router.get('/login', (req, res) => {
  res.render('login');
});
*/

module.exports = router;