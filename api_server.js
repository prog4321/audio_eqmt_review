import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 10000;

const db = new pg.Client({
  user: "aer_user",
  host: "dpg-d050fcmuk2gs73e4h7d0-a",
  database: "audio_eqmt_review",
  password: "aer",
  port: 5432
});
db.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT review.id as id, " +
      "category.name as category_name, " +
      "subcategory.name as subcategory_name, " +
      "brand.name as brand_name, " +
      "product.name as product_name, " +
      "series.name as product_series, " +
      "product.link as product_link, " +
      "review.summary as summary, " +
      "review.link as link, " +
      "review.rating_id as rating, " +
      "review.reviewer as reviewer, " +
      "month.name as month, " +
      "review.year as year " +
      "FROM review " +
      "INNER JOIN product ON review.product_id = product.id " +
      "INNER JOIN brand ON product.brand_id = brand.id " +
      "INNER JOIN subcategory ON product.subcategory_id = subcategory.id " +
      "INNER JOIN category ON subcategory.category_id = category.id " +
      "INNER JOIN month ON review.month_id = month.id " +
      "LEFT JOIN series ON product.series_id = series.id " +
      "ORDER BY year DESC, " +
      "month.id DESC, " +
      "brand_name ASC, " +
      "product_name ASC;"
    );
    let reviews = [];
    result.rows.forEach((result) => {
      reviews.push({
                  id: result.id,
                  categoryName: result.category_name,
                  subcategoryName: result.subcategory_name,
                  brandName: result.brand_name,
                  productName: result.product_name,
                  productSeries: result.product_series,
                  productLink: result.product_link,
                  summary: result.summary,
                  link: result.link,
                  rating: result.rating,
                  reviewer: result.reviewer,
                  month: result.month,
                  year: result.year
                });
    });
    res.json(reviews);
  } catch (err) {
    console.log(err);
  };
});

app.get("/brand-with-product-entry", async (req, res) => {
  try{
    const result = await db.query(
      "SELECT DISTINCT product.brand_id as id, " +
      "brand.name as name FROM product " +
      "INNER JOIN brand " +
      "ON product.brand_id = brand.id " +
      "ORDER BY name ASC;"
    );
    let brands = [];
    result.rows.forEach((result) => {
      brands.push({
                  id: result.id,
                  name: result.name
                });
    });
    res.json(brands);
  } catch (err) {
    console.log(err);
  };
});

app.get("/rating", async (req, res) => {
  try{
    const result = await db.query(
      "SELECT id FROM rating " +
      "ORDER BY id DESC;"
    );
    let ratings = [];
    result.rows.forEach((result) => {
      ratings.push({
                  id: result.id,
                });
    });
    res.json(ratings);
  } catch (err) {
    console.log(err);
  };
});

app.get("/month", async (req, res) => {
  try{
    const result = await db.query(
      "SELECT id, name FROM month " +
      "ORDER BY id ASC;"
    );
    let months = [];
    result.rows.forEach((result) => {
      months.push({
                  id: result.id,
                  name: result.name
                });
    });
    res.json(months);
  } catch (err) {
    console.log(err);
  };
});

app.get("/data", async (req, res) => {
  try {
    const type = req.query.type;
    var sqlString = '';
    var results = Promise;
    var data = [];
    if (type==='load_subcategory') {
      sqlString = "SELECT DISTINCT product.subcategory_id as id, " +
                    "subcategory.name as name FROM product " +
                    "INNER JOIN subcategory " +
                    "ON product.subcategory_id = subcategory.id " +
                    "WHERE product.brand_id = $1 " +
                    "ORDER BY name ASC;"
      results = await db.query(sqlString, [req.query.brand]);
    } else if (type==='load_product'){
      sqlString = "SELECT id, name FROM product " +
                  "WHERE brand_id = $1 " + 
                  "AND subcategory_id = $2 " +
                  "ORDER BY name ASC;"
      results = await db.query(sqlString, [req.query.brand, req.query.subcategory]);
    } else if (type==='load_series'){
      sqlString = "SELECT product.series_id as id, " +
                  "series.name as name FROM product " +
                  "INNER JOIN series " +
                  "ON product.series_id = series.id " +
                  "WHERE product.id = $1;"
      results = await db.query(sqlString, [req.query.product]);
    };
    results.rows.forEach((result) => {
      data.push({
        id: result.id,
        name: result.name
      });
    });
    res.json(data);
  } catch (err) {
    console.log(err);
  };
});

app.get("/review/:id", async (req, res) => {
  try {
    var result = await db.query(
      "SELECT review.id as id, " +
      "category.name as category_name, " +
      "subcategory.name as subcategory_name, " +
      "brand.name as brand_name, " +
      "review.product_id as product_id, " +
      "product.name as product_name, " +
      "series.name as product_series, " +
      "product.link as product_link, " +
      "review.summary as summary, " +
      "review.link as link, " +
      "review.rating_id as rating, " +
      "review.reviewer as reviewer, " +
      "month.id as month_id, " +
      "month.name as month_name, " +
      "review.year as year " +
      "FROM review " +
      "INNER JOIN product ON review.product_id = product.id " +
      "INNER JOIN brand ON product.brand_id = brand.id " +
      "INNER JOIN subcategory ON product.subcategory_id = subcategory.id " +
      "INNER JOIN category ON subcategory.category_id = category.id " +
      "INNER JOIN month ON review.month_id = month.id " +
      "LEFT JOIN series ON product.series_id = series.id " +
      "WHERE review.id = $1;",
      [req.params.id]
    );
    result = result.rows[0];
    const review = {
                    id: result.id,
                    categoryName: result.category_name,
                    subcategoryName: result.subcategory_name,
                    brandName: result.brand_name,
                    productId: result.product_id,
                    productName: result.product_name,
                    productSeries: result.product_series,
                    productLink: result.product_link,
                    summary: result.summary,
                    link: result.link,
                    rating: result.rating,
                    reviewer: result.reviewer,
                    monthId: result.month_id,
                    monthName: result.month_name,
                    year: result.year
                  };
    res.json(review);
  } catch(err) {
    console.log(err);
  };
});

app.get("/validate-review", async (req, res) => {
  try {
    res.json(validateReview(req.query));
  } catch (err) {
    console.log(err);
  };
});

function validateReview(reqObj) {
// If this function is called from a GET request, the reqObj parameter will be a query string.
// If this function is called from a POST/PATCH request, the reqObj parameter will be a Request.body.
// In both cases, we parse through the reqObj parameter to get the values for validation.
  try {
    reqObj.productId = reqObj.productId.trim();
    reqObj.link = reqObj.link.trim();
    reqObj.summary = reqObj.summary.trim();
    reqObj.rating = reqObj.rating.trim();
    reqObj.reviewer = reqObj.reviewer.trim();
    reqObj.month = reqObj.month.trim();
    reqObj.year = reqObj.year.trim();

    const productId = reqObj.productId;
    const link = reqObj.link;
    const summary = reqObj.summary;
    const rating = reqObj.rating;
    const reviewer = reqObj.reviewer;
    const month = reqObj.month;
    const year = reqObj.year;

    var isValid = true;
    var error = '';

    const linkMaxLength = 150;
    const summaryMaxLength = 600;
    const minRating = 1;
    const maxRating = 5;
    const reviewerMaxLength = 50;
    const minMonth = 1;
    const maxMonth = 12;
    const minYear = 2000;
    var maxYear = new Date();
    maxYear = maxYear.getFullYear();

    if (productId === "") {
      return {isValid: false,
              error: "Product ID cannot be empty."};
    } else {
        if (isNaN(productId)) {
          return {isValid: false,
                  error: "Product ID must be a number."};
        };
    };
    if (link.length > linkMaxLength) {
      return {isValid: false,
              error: "Link cannot be more than " +
                      linkMaxLength + " characters."};
    };
    if (summary === "") {
      return {isValid: false,
              error: "Summary cannot be empty."};
    } else {
        if (summary.length > summaryMaxLength) {
          return {isValid: false,
                  error: "Summary cannot be more than " +
                          summaryMaxLength + " characters."};
        };
    };
    if (rating != "") {
      if (isNaN(rating)) {
        return {isValid: false,
                error: "Rating must be a number."};
      } else {
        if (rating < minRating || rating > maxRating) {
          return {isValid: false,
                  error: `Rating must be from ${minRating} to ${maxRating}.`};
        }
      };
    };
    if (reviewer === "") {
      return {isValid: false,
              error: "Reviewer name cannot be empty."};
    } else {
        if (reviewer.length > reviewerMaxLength) {
          return {isValid: false,
                  error: "Reviewer name cannot be more than " +
                          reviewerMaxLength + " characters."};
        };
    };
    if (month === "") {
      return {isValid: false,
              error: "Month cannot be empty."};
    } else {
      if (isNaN(month)) {
        return {isValid: false,
                error: "Month must be a number."};
      } else {
        if (month < minMonth || month > maxMonth) {
          return {isValid: false,
                  error: `Month must be from ${minMonth} to ${maxMonth}.`};
        }
      };
    };
    if (year === "") {
      return {isValid: false,
              error: "Year cannot be empty."};
    } else {
      if (isNaN(year)) {
        return {isValid: false,
                error: "Year must be a number."};
      } else {
        if (year < minYear || year > maxYear) {
          return {isValid: false,
                  error: `Year must be from ${minYear} to ${maxYear}.`};
        }
      };
    };
    return {isValid: isValid, error: error};
  } catch (err) {
    console.log(err);
  };
};

app.post("/add-review", async (req, res) => {
  try {
    if (validateReview(req.body).isValid) {
      var sqlString = '';
      var params = [];
      if (req.body.rating === "") {
        sqlString = "INSERT INTO review (product_id, link, summary, reviewer, month_id, year) " +
                    "VALUES ($1, $2, $3, $4, $5, $6)";
        params = [req.body.productId,
                req.body.link,
                req.body.summary,
                req.body.reviewer,
                req.body.month, 
                req.body.year];
      } else {
        sqlString = "INSERT INTO review (product_id, link, summary, rating_id, reviewer, month_id, year) " +
                    "VALUES ($1, $2, $3, $4, $5, $6, $7)",
        params = [req.body.productId,
                  req.body.link,
                  req.body.summary,
                  req.body.rating,
                  req.body.reviewer,
                  req.body.month,
                  req.body.year];
      };
      await db.query(sqlString, params);
      res.send({apiSuffix: "add-review", status: "completed"});
    } else {
      throw validateReview(req.body).error
    };
  } catch (err) {
    console.log(err);
  };
});

app.patch("/update-review", async (req, res) => {
  try {
    if (validateReview(req.body).isValid) {
      var sqlString = '';
      var params = [];
      if (req.body.rating === "") {
        sqlString = "UPDATE review " +
                    "SET link = $2, " +
                    "summary = $3, " +
                    "rating_id = NULL, " +
                    "reviewer = $4, " +
                    "month_id = $5, " +
                    "year = $6 "+
                    "WHERE id = $1";
        params = [req.body.id,
                  req.body.link,
                  req.body.summary,
                  req.body.reviewer,
                  req.body.month, 
                  req.body.year];
      } else {
        sqlString = "UPDATE review " +
                    "SET link = $2, " +
                    "summary = $3, " +
                    "rating_id = $4, " +
                    "reviewer = $5, " +
                    "month_id = $6, " +
                    "year = $7 "+
                    "WHERE id = $1";
        params = [req.body.id,
                  req.body.link,
                  req.body.summary,
                  req.body.rating,
                  req.body.reviewer,
                  req.body.month, 
                  req.body.year];
      };
      await db.query(sqlString, params);
      res.send({apiSuffix: "update-review", status: "completed"});
    } else {
      throw validateReview(req.body).error
    };
  } catch (err) {
    console.log(err);
  };
});

app.delete("/delete-review/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM review " +
              "WHERE id = $1", [req.params.id]);
    res.send({apiSuffix: "delete-review/:id", status: "completed"});
  } catch (err) {
    console.log(err);
  };
});

app.listen(port, () => {
  console.log(`API server is running at http://localhost:${port}`);
});