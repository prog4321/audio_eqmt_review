import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

const runLocal = false; // NB: Set this to false if code needs to be deployed live

if (runLocal) {
  var apiURL = "http://localhost:10000";
} else {
  var apiURL = "https://aer-api.onrender.com";
};

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${apiURL}/`);
    res.render("index.ejs", { reviews: response.data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  };
});

app.get("/new", async (req, res) => {
  try {
    const brands = await axios.get(`${apiURL}/brand-with-product-entry`);
    const ratings = await axios.get(`${apiURL}/rating`);
    const months = await axios.get(`${apiURL}/month`);
    res.render("modify.ejs", {
                brands: brands.data,
                ratings: ratings.data,
                months: months.data,
                heading: "New Review",
                submit: "Submit" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  };
});

app.get("/edit/:id", async (req, res) => {
  try {
    const ratings = await axios.get(`${apiURL}/rating`);
    const months = await axios.get(`${apiURL}/month`);
    const review = await axios.get(`${apiURL}/review/${req.params.id}`);
    res.render("modify.ejs", {
                ratings: ratings.data,
                months: months.data,
                review: review.data,
                heading: "Edit Review",
                submit: "Update" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error });
  };
});

app.get("/data", async (req, res) => {
  try {
    var queryString = '';
    Object.entries(req.query).forEach(([key, value]) => {
      if (key === 'type') {
        queryString = '?type=' + value;
      } else {
        queryString = queryString + '&' + key + '=' + value;
      };
    });
    const result = await axios.get(`${apiURL}/data${queryString}`);
    res.json(result.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  };
});

app.post("/add-review", async (req, res) => {
  try {
    var queryString = '?';
    var initialKey = true;
    Object.entries(req.body).forEach(([key, value]) => {
      if (initialKey) {
        queryString = '?' + key + '=' + value;
        initialKey = false;
      } else {
        queryString = queryString + '&' + key + '=' + value;
      };
    });
    const result = await axios.get(`${apiURL}/validate-review${queryString}`);
    if (result.data.isValid) {
      await axios.post(`${apiURL}/add-review`, req.body);
      res.redirect("/");
    } else {
      throw result.data.error;
    };
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error });
  };
});

app.post("/update-review", async (req, res) => {
  try {
    var queryString = '?';
    var initialKey = true;
    Object.entries(req.body).forEach(([key, value]) => {
      if (initialKey) {
        queryString = '?' + key + '=' + value;
        initialKey = false;
      } else {
        queryString = queryString + '&' + key + '=' + value;
      };
    });
    const result = await axios.get(`${apiURL}/validate-review${queryString}`);
    if (result.data.isValid) {
      await axios.patch(`${apiURL}/update-review`, req.body);
      res.redirect("/");
    } else {
      throw result.data.error;
    };
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error });
  };
});

app.get("/delete-review/:id", async (req, res) => {
  try {
    axios.delete(`${apiURL}/delete-review/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error });
  };
});












// Partially update a post
app.post("/api/posts/:id", async (req, res) => {
  console.log("called");
  try {
    const response = await axios.patch(
      `${API_URL}/posts/${req.params.id}`,
      req.body
    );
    console.log(response.data);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.post(`${apiURL}/posts/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(port, () => {
  console.log(`Backend webserver is running on http://localhost:${port}`);
});
