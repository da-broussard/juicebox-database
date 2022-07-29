const express = require('express');
const tagsRouter= express.Router();
const {getAllTags, getPostsByTagName}= require('../db');

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");
  
    next(); // THIS IS DIFFERENT
  });
  
  tagsRouter.get('/',  async (req, res) => {
      const tags = await getAllTags();
    
        res.send({
      tags
    });
  });

  tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    // read the tagname from the params
    const {tagName}= req.params;
    console.log(tagName)
    try {
      // use our method to get posts by tag name from the db
      const post= await getPostsByTagName(tagName);
      console.log(post)

      // send out an object to the client { posts: // the posts }
      if(post){
      res.send({post})
      }

    } catch ({ name, message }) {
      // forward the name and message to the error handler
    }
  });

  module.exports= tagsRouter