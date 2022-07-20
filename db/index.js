const { Client } = require("pg");

const client = new Client("postgres://localhost:5432/juicebox-dev");

async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, username, name, location, active FROM users;`
  );

  return rows;
}

async function createUser({ username, password, name, location }) {
  try {
    const { rows: user } = await client.query(
      `
      INSERT INTO users(username, password, name, location)
      VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
  
      `,
      [username, password, name, location]
    );

    // return user
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
  console.log(setString)
  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
        UPDATE users
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
      Object.values(fields)
    );
    // console.log(Object.values(fields))
    return user;
  } catch (error) {
    throw error;
  }
}

async function createPost({ authorId, title, content }) {
  try {
    const { rows: post } = await client.query(
      `
    INSERT INTO post("authorId", title, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
      [authorId, title, content]
    );
  } catch (error) {
    throw error;
  }
}

async function updatePost(postsId, fields = {}) {
  
  const setString = Object.keys(fields)
    .map((key, idx) => 
      `"${key}"=$${idx + 1}`
    )
    .join(', ');
   
  if (setString.length === 0) return;
 
  try {
    await client.query(
      `
      UPDATE post
      SET ${setString}
      WHERE id=${postsId}
      RETURNING *;
      `, Object.values(fields));
    console.log("Finished updating post");
  } catch (error) {
    console.log("Error updating post");
    throw error;
  }
}

async function getAllPosts() {
  try {
    const { rows } = await client.query(`
      SELECT id, "authorId", title, content, active FROM post;
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getPostsByUser(userId) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM posts
      WHERE "authorId"=${userId};
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  console.log(["Starting to get users by ID"]);
  try {
    const { rows } = await client.query(`
      SELECT id, username, name, location, active
      WHERE id= ${userId};
    `);

    if (rows.length === 0) return null;

    const userPosts= await getPostsByUser(userId)
  } catch (error) {
    console.log("Error getting user by ID");
  }
}

module.exports = {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  getUserById
};
