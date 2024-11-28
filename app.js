require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const connection = require("./db/conn");
const User = require("./models/User");
const Recruiter = require("./models/Recruiter");
const Job = require("./models/Job");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();

// view engine setup
app.set("view engine", "ejs");

app.use(express.json());
app.use(cors());

//app configuration
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//bcrypt configuration
const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET_KEY;

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(cookieParser());

//Connection is setup to the databse
connection();

////////////////GET ROUTE//////////////////////////
app.get("/", async (req, res) => {
  const jobs = await Job.find();
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.render("home", {
        username: undefined,
        allJobs: jobs,
      });
    } else {
      const registerUser = await User.findOne({
        username: info.username,
      });
      if (registerUser) {
        res.render("home", {
          username: info.username,
          id: undefined,
          allJobs: jobs,
        });
      } else {
        res.render("home", {
          username: info.username,
          id: info.id,
          allJobs: jobs,
        });
      }
    }
  });
});

app.get("/about", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.render("about", {
        username: undefined,
      });
    } else {
      const registerUser = await User.findOne({
        username: info.username,
      });
      if (registerUser) {
        res.render("about", {
          username: info.username,
          id: undefined,
        });
      } else {
        res.render("about", {
          username: info.username,
          id: info.id,
        });
      }
    }
  });
});
app.get("/category", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.render("category", {
        username: undefined,
      });
    } else {
      const registerUser = await User.findOne({
        username: info.username,
      });
      if (registerUser) {
        res.render("category", {
          username: info.username,
          id: undefined,
        });
      } else {
        res.render("category", {
          username: info.username,
          id: info.id,
        });
      }
    }
  });
});
app.get("/contact", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.render("contact", {
        username: undefined,
      });
    } else {
      const registerUser = await User.findOne({
        username: info.username,
      });
      if (registerUser) {
        res.render("contact", {
          username: info.username,
          id: undefined,
        });
      } else {
        res.render("contact", {
          username: info.username,
          id: info.id,
        });
      }
    }
  });
});

app.get("/joblist", async (req, res) => {
  const { token } = req.cookies;
  const jobs = await Job.find();
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.render("joblist", {
        username: undefined,
        allJobs: jobs,
      });
    } else {
      const registerUser = await User.findOne({
        username: info.username,
      });

      if (registerUser) {
        res.render("joblist", {
          username: info.username,
          id: undefined,
          allJobs: jobs,
        });
      } else {
        res.render("joblist", {
          username: info.username,
          id: info.id,
          allJobs: jobs,
        });
      }
    }
  });
});
app.get("/login", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.render("login", {
        username: undefined,
      });
    } else {
      const registerUser = await User.findOne({
        username: info.username,
      });
      if (registerUser) {
        res.render("login", {
          username: info.username,
          id: undefined,
        });
      } else {
        res.render("login", {
          username: info.username,
          id: info.id,
        });
      }
    }
  });
});
app.get("/register", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.render("registration", {
        username: undefined,
      });
    } else {
      const registerUser = await User.findOne({
        username: info.username,
      });
      if (registerUser) {
        res.render("registration", {
          username: info.username,
          id: undefined,
        });
      } else {
        res.render("registration", {
          username: info.username,
          id: info.id,
        });
      }
    }
  });
});
app.get("/form", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      res.render("form", {
        username: undefined,
      });
    } else {
      const registerUser = await User.findOne({
        username: info.username,
      });
      if (registerUser) {
        res.render("form", {
          username: info.username,
          id: undefined,
        });
      } else {
        res.render("form", {
          username: info.username,
          id: info.id,
        });
      }
    }
  });
});
app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

////////////////POST ROUTE////////////////////////
app.post("/register", async (req, res) => {
  const { username, email, password, cPassword, contact, rdo } = req.body;
  const jobs = await Job.find();

  if (rdo === "jobSeeker") {
    const existingUser = await User.findOne({
      username,
    });
    if (existingUser) {
      return res.render("registration", {
        errorMessage: "Username is already taken",
      });
    }
    if (password !== cPassword) {
      return res.render("registration", {
        errorMessage: "Password is not match with confirm password",
      });
    }

    try {
      const userDoc = await User.create({
        username,
        email,
        password: bcrypt.hashSync(password, salt),
        contact,
      });
      if (userDoc) {
        const registerUser = await User.findOne({
          username,
        });

        // Generate JWT token and set it as a cookie
        const token = jwt.sign(
          {
            username,
            id: registerUser._id,
          },
          secret
        );
        res.cookie("token", token);
        res.render("home", {
          username: username,
          id: undefined,
          allJobs: jobs,
        });
      }
    } catch (error) {
      res.status(400).json(error);
    }
  }
  if (rdo === "recruiter") {
    const existingRecruiter = await Recruiter.findOne({
      recruitername: username,
    });
    if (existingRecruiter) {
      return res.render("registration", {
        errorMessage: "Username is already taken",
      });
    }
    if (password !== cPassword) {
      return res.render("registration", {
        errorMessage: "Password is not match with confirm password",
      });
    }

    try {
      const recruiterDoc = await Recruiter.create({
        recruitername: username,
        email,
        password: bcrypt.hashSync(password, salt),
        contact,
      });
      if (recruiterDoc) {
        const registerRecruiter = await Recruiter.findOne({
          recruitername: username,
        });
        // Generate JWT token and set it as a cookie
        const token = jwt.sign(
          {
            username,
            id: registerRecruiter._id,
          },
          secret
        );
        res.cookie("token", token);
        res.render("home", {
          username: username,
          id: registerRecruiter._id,
          allJobs: jobs,
        });
      }
    } catch (error) {
      res.status(400).json(error);
    }
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password, rdo } = req.body;
    const jobs = await Job.find();

    if (rdo === "jobSeeker") {
      const userDoc = await User.findOne({
        username,
      });
      if (!userDoc) {
        return res.render("login", {
          errorMessage: "Username not found!",
        });
      }
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        const token = jwt.sign(
          {
            username,
            id: userDoc._id,
          },
          secret
        );
        res.cookie("token", token);
        res.render("home", {
          username: username,
          id: undefined,
          allJobs: jobs,
        });
      } else {
        return res.render("login", {
          errorMessage: "Password not match!",
        });
      }
    }
    if (rdo === "recruiter") {
      const recruiterDoc = await Recruiter.findOne({
        recruitername: username,
      });
      if (!recruiterDoc) {
        return res.render("login", {
          errorMessage: "Username not found!",
        });
      }
      const passOk = bcrypt.compareSync(password, recruiterDoc.password);
      if (passOk) {
        const token = jwt.sign(
          {
            username,
            id: recruiterDoc._id,
          },
          secret
        );
        res.cookie("token", token);
        res.render("home", {
          username: username,
          id: recruiterDoc._id,
          allJobs: jobs,
        });
      } else {
        return res.render("login", {
          errorMessage: "Password not match!",
        });
      }
    }
  } catch (error) {
    res.status(500).json("Internal server error");
  }
});

app.post("/jobform", upload.single("companyimg"), async (req, res) => {
  const {
    jobname,
    publishdate,
    datelinedate,
    vacancy,
    salary,
    location,
    option,
    description,
    qualification,
    companydetail,
  } = req.body;

  let nature = "";

  if (option === "parttime") {
    nature = "Part Time";
  } else {
    nature = "Full Time";
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      console.error("JWT ERROR", err.message);
      res.status(401).json({
        error: "Invalid token",
      });
    } else {
      try {
        const jobDoc = await Job.create({
          jobname,
          publishdate,
          datelinedate,
          vacancy,
          salary,
          location,
          jobnature: nature,
          description,
          qualification,
          companydetail,
          companyimg: req.file.originalname,
          file: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
          },
          author: info.id,
        });

        if (jobDoc) {
          const jobs = await Job.find({
            author: info.id,
          });
          res.render("jobs", {
            username: info.username,
            id: info.id,
            allJobs: jobs,
          });
        } else {
          res.render("form", {
            username: info.username,
            id: info.id,
          });
        }
      } catch (error) {
        res.status(400).json(error);
      }
    }
  });
});

app.get("/jobs/:jobId", async (req, res) => {
  const requestedJobId = req.params.jobId;

  try {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        res.send(
          `<script>alert('You have to login or register to apply a job !'); window.location.href = '/login';</script>`
        );
      } else {
        let checkRecruiter = undefined;
        const checkRecrDoc = await Recruiter.findOne({
          recruitername: info.username,
        });
        if (checkRecrDoc) {
          checkRecruiter = info.id;
        }

        const jobDoc = await Job.findById(requestedJobId).populate("author", [
          "email",
        ]);

        function formatDate(date) {
          var formattedDate = date.toDateString();
          return formattedDate;
        }

        const publishdate = formatDate(jobDoc.publishdate);
        const datelinedate = formatDate(jobDoc.datelinedate);

        if (jobDoc) {
          res.render("jobdetail", {
            username: info.username,
            id: checkRecruiter,
            jobname: jobDoc.jobname,
            publishdate: publishdate,
            datelinedate: datelinedate,
            vacancy: jobDoc.vacancy,
            salary: jobDoc.salary,
            location: jobDoc.location,
            jobnature: jobDoc.jobnature,
            description: jobDoc.description,
            qualification: jobDoc.qualification,
            companydetail: jobDoc.companydetail,
            contentType: jobDoc.file.contentType,
            data: jobDoc.file.data,
            email: jobDoc.author.email,
          });
        }
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

app.get("/alljob/:recruiterId", async (req, res) => {
  const requestedRecruiterId = req.params.recruiterId;

  try {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        console.error("JWT ERROR", err.message);
        res.status(401).json({
          error: "Invalid token",
        });
      } else {
        const jobs = await Job.find({
          author: requestedRecruiterId,
        });
        if (jobs) {
          res.render("jobs", {
            username: info.username,
            id: info.id,
            allJobs: jobs,
          });
        }
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

app.get("/jobdelete/:jobId", async (req, res) => {
  const requestedJobId = req.params.jobId;

  try {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        console.error("JWT ERROR", err.message);
        res.status(401).json({
          error: "Invalid token",
        });
      } else {
        const response = await Job.deleteOne({
          _id: requestedJobId,
        });
        if (response) {
          const jobs = await Job.find({
            author: info.id,
          });
          res.render("jobs", {
            username: info.username,
            id: info.id,
            allJobs: jobs,
          });
        }
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

app.get("/jobedit/:jobId", async (req, res) => {
  const requestedJobId = req.params.jobId;

  try {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        console.error("JWT ERROR", err.message);
        res.status(401).json({
          error: "Invalid token",
        });
      } else {
        const jobDoc = await Job.findById(requestedJobId);

        function convertDate(inputDate) {
          // Parse the input date
          const inputDateTime = new Date(inputDate);

          // Extract year, month, and day
          const year = inputDateTime.getUTCFullYear();
          const month = inputDateTime.getUTCMonth() + 1; // Months are zero-indexed, so add 1
          const day = inputDateTime.getUTCDate();

          // Format the output date
          const formattedDate = `${year}-${month < 10 ? "0" : ""}${month}-${
            day < 10 ? "0" : ""
          }${day}`;

          return formattedDate;
        }

        const publishdate = convertDate(jobDoc.publishdate);
        const datelinedate = convertDate(jobDoc.datelinedate);

        if (jobDoc) {
          res.render("editform", {
            username: info.username,
            id: info.id,
            jobid: jobDoc._id,
            jobname: jobDoc.jobname,
            publishdate: publishdate,
            datelinedate: datelinedate,
            vacancy: jobDoc.vacancy,
            salary: jobDoc.salary,
            location: jobDoc.location,
            jobnature: jobDoc.jobnature,
            description: jobDoc.description,
            qualification: jobDoc.qualification,
            companydetail: jobDoc.companydetail,
          });
        }
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post("/updatejob/:jobId", upload.single("companyimg"), async (req, res) => {
  const requestedJobId = req.params.jobId;
  const {
    jobname,
    publishdate,
    datelinedate,
    vacancy,
    salary,
    location,
    option,
    description,
    qualification,
    companydetail,
  } = req.body;

  let nature = "";

  if (option === "parttime") {
    nature = "Part Time";
  } else {
    nature = "Full Time";
  }

  try {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        console.error("JWT ERROR", err.message);
        res.status(401).json({
          error: "Invalid token",
        });
      } else {
        const data = {
          jobname: jobname,
          publishdate: publishdate,
          datelinedate: datelinedate,
          vacancy: vacancy,
          salary: salary,
          location: location,
          jobnature: nature,
          description: description,
          qualification: qualification,
          companydetail: companydetail,
        };

        // try {
        //   if (req.file.originalname) {
        //     console.log(req.file.originalname);
        //     data.companyimg = req.file.originalname;
        //     data.file.data = req.file.buffer,
        //     data.contentType = req.file.mimetype;
        //   }
        // } catch (error) {
        //   console.log("Error in Update posting ");
        // }

        const jobDoc = await Job.findById(requestedJobId);

        const editDoc = await jobDoc.updateOne(data);

        const jobs = await Job.find();
        if (editDoc) {
          res.render("jobs", {
            username: info.username,
            id: info.id,
            allJobs: jobs,
          });
        }
      }
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
