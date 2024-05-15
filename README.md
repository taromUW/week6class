1. A description of the scenario your project is operating in.
    My project:  It is a note managing scenario where 
        1. Users can register, login, and manage their notes.  
        2. Users can add title, content and category of notes. 
        4. User role can add/update their notes.
        5. Admin role can add/update/delete a Category.
        6. can do a text search in note title.


2. A description of what problem your project seeks to solve.
    Providing a note management functionality for me and my family members to create, read, update, and delete notes.  It helps to organizing notes by category.
    I as Admin can maintain the category with add/update/delete.

3. A description of what the technical components of your project will be, including: the routes, the data models, any external data sources you'll use, etc.
    Routes:
        User.js
        Notes.js
        Category.js
    Data models:
        User
        Notes
        Category
    Daos
    Middleware for Authentication and Authorization with JWT
    Storing the data in MongoDB.
    Unit tests for routes

4. Clear and direct call-outs of how you will meet the various project requirements.
    • Your project will require an Express API using:
    • Authentication and Authorization
        • Will establish this with JWT
    • 2 sets of CRUD routes (not counting authentication)
        • CRUD for Notes
        • CRUD for Category
    • Indexes for performance and uniqueness when reasonable
        • Index to a field, date added, in Notes model
    • At least one of text search, aggregations, and lookups
        • Text search for title/content
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