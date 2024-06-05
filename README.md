Self-evalutaion:
- I think this was a good starter project for me to build.  I was able to make the three routes(auth/notes/category) working.
The challenging part was setting up test sets, it took me a long time to figuer out.  
I'm hoping to keep adding functionality to this to make it better.
Overall, I learned a lot from this project and from this course as a whole.  Thank you.


Update as of 6/4:
- added search
- cleaned up, removed console.logs
- Jest test coverage: 84.5% lines

Update as of 6/2:
- added missing delete and update for note
- added authorization middleware
- added stats for aggregation
- more updated tests

Update as of 5/26:
Completed: initial set of models/routes/daos, user authentication, tested with postman, some jest tests, 

ToDos/Will need to work on:
- work on a few missing CRUD
- work on authorization
- work on aggregation
- testing with postman
- work on more test coverage with jest

1. A description of the scenario your project is operating in.
    My project:  It is a note managing scenario where 
        1. Users can register, login, and manage their notes.  
        2. Users can add text note and category associated with it. 
        3. User role can add/update their notes.
        4. Admin role can add/update/delete notes.
        5. can display a note count of an user.

2. A description of what problem your project seeks to solve.
    Providing a note management functionality for me and my family members to create, read, update, and delete notes.  It helps to organizing notes by category.
    I as Admin can maintain the notes with add/update/delete.

3. A description of what the technical components of your project will be, including: the routes, the data models, any external data sources you'll use, etc.
    Routes:
        Auth.js
        Notes.js
        Category.js
    Data models:
        Category
        Note
        Token
        User
    Daos
        Category
        Note
        Token
        User
    Middleware for Authentication and Authorization
    Storing the data in MongoDB.
    Unit tests for routes

4. Clear and direct call-outs of how you will meet the various project requirements.
    • Your project will require an Express API using:
    • Authentication and Authorization        
        • Will establish this with Tokenization with bcrypt

    • 2 sets of CRUD routes (not counting authentication)
        • Notes and Category

    • Indexes for performance and uniqueness when reasonable
        • Index to user id.

    • At least one of text search, aggregations, and lookups
        • Stats

    • You may use external data providers (APIs) if you can get yourself free trial/tier access
    • Routes should be fully tested (project test coverage > 80%)
        • Add jest tests

    • You’ll demo your project to the class in week 10 (5 minutes)
    • Demonstrate how to interact with your API through either
    • A saved Postman collection
    • A very simple front-end project
        • It will be a saved Postman collection

5. A timeline for what project components you plan to complete, week by week, for the remainder of the class. 

    Week7: design, setup repo and deployment, Start on user models and routes, authentication and authorization
    Week8: Continue to work on user/notes.  Work on category models$routes, authentication and authorizationAdd tests. 
    Week9: Continue to work on user/notes/category and authentication and authorization, Add tests.  Compile Postman outputs, presentation prep…