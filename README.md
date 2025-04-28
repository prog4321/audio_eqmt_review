## Audiophile Equipment Review

Please have a look at the deployed website for this repository:<br>
https://aer-lkl5.onrender.com/

Audio equipment used in high-fidelity sound reproduction can include components like turntables, amplifiers and loudspeakers etc. Such equipment can be costly. Prior to making a purchase, it's usual for hi-fi enthusiasts (aka audiophiles) to peruse the internet and read reviews on equipment they are considering.

But these reviews, especially the ones by professional reviewers, can be quite lengthy. The system I have developed here can be used to store concise summaries of these reviews (at no more than 600 characters), as well as the users' own notes. This allows for a quick grasp of the general consensus about a certain product. The system also includes links to the product page and the actual review, should the user require more information.

(I hope to include a search/filter function on the main page eventually, so that the user can search for reviews for a certain product/product series/category etc.)

The data is stored in a relational Postgres database, made accessible via a public <b>RESTful API</b> at https://audio-eqmt-review.onrender.com/. This API allows for CRUD operations (Create, Read, Update, Delete) by using POST, GET, PATCH and DELETE methods respectively. For more information on the API endpoints, please look at the "api_server.js" file.

The backend web server code can be found in the "index.js" file, with the frontend using the "index.ejs" and "modify.ejs" files in the "views" folder. Formatting is controlled via the "main.css" file in the "public/styles" folder. You can view the deployed website at https://aer-lkl5.onrender.com/

The database contains some sample data. I plan to add the SQL scripts for generating the tables, as well as an Entity Relationship Diagram (ERD) showing the relationships between the tables. An "aer_user" profile is granted SELECT, INSERT, UPDATE AND DELETE permissions to the "review" table, and SELECT acccess on all other tables in the database. This "aer_user" profile is used in the API to access the database.

#### Technologies used:
Backend: Node.js/Express.js/Axios/Javascript<br>
Frontend: HTML/CSS/Javascript<br>
Database: PostgreSQL<br>

The API server, backend web server and Postgres database are all hosted on render.com.
