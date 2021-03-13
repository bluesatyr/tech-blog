const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment.js');

// create associations
User.hasMany(Post, {
    foreignKey: 'user_id' // points to user_id in the Post model
});

Post.belongsTo(User, {
    foreignKey: 'user_id' // points to user_id in itself
});

Comment.belongsTo(User, {
    foreignKey: 'user_id'
  });
  
  Comment.belongsTo(Post, {
    foreignKey: 'post_id'
  });
  
  User.hasMany(Comment, {
    foreignKey: 'user_id'
  });
  
  Post.hasMany(Comment, {
    foreignKey: 'post_id'
  });

module.exports ={ User, Post, Comment };