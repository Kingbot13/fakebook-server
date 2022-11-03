# fakebook-server

This is the backend to my fakebook-client project. It is an api only express server.

## Routes

Since this is an api only backend, remember to prepend the routes with '**api**'. 

- /posts (get, post) 
- /posts/:postId (put, delete)
- /posts/:postId/reactions (put)
- /posts/:postId/comments (post)
- /posts/:postId/comments/:commentId (put, delete)