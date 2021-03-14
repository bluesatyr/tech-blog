const router = require('express').Router();
const { Post, User, Comment } = require("../../models");
const { route } = require('./user-routes');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

// GET /api/posts/  -get all posts
router.get('/', (req, res) => {
    console.log('==========');
    Post.findAll({
        order: [['created_at', 'DESC']],
        attributes: [
          'id',
          'title',
          'text',
          'created_at',
        ],
        include: [
          // include the Comment model here:
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
       }).then(dbPostData => res.json(dbPostData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// GET /api/posts/:id - get one post
router.get('/:id', (req, res) => {
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
        res.json(dbPostData);
    })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/posts/ - create a post
router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        text: req.body.text,
        user_id: req.session.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// PUT /api/posts/:id - update a post
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
     .then(dbPostData => {
         if (!dbPostData) {
             res.status(404).json({ message: 'No post found with this id'});
             return;
         }
         res.json(dbPostData);
     })
       .catch(err => {
           console.log(err);
           res.status(500).json(err);
    });
});

// DELETE /api/posts/:id - delete a post
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
      .then(dbPostData => {
          if (!dbPostData) {
              res.status(404).json({ message: 'No post found with this id'});
              return;
          }
          res.json(dbPostData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});



module.exports = router;