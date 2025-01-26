const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: ["https://hackaton-ayun.vercel.app/", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");

    // Create default admin user if not exists
    const adminEmail = "admin@gmail.com";
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 12);
      await User.create({
        cnic: "admin-cnic",
        email: adminEmail,
        fullName: "Admin User",
        password: hashedPassword,
        role: "admin",
      });
    }
  })
  .catch((err) => console.log(err));

const userRoutes = require("./routes/userRoutes");
const loanRoutes = require("./routes/loanRoutes");

app.use("/api/users", userRoutes);
app.use("/api/loans", loanRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const express = require("express")
// const mongoose = require("mongoose")
// const cors = require("cors")
// const dotenv = require("dotenv")
// const User = require("./models/User")
// const bcrypt = require("bcryptjs")

// dotenv.config()

// const app = express()
// const PORT = process.env.PORT || 5000

// app.use(cors())
// app.use(express.json())

// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(async () => {
//     console.log("MongoDB connected")

//     // Create default admin user if not exists
//     const adminEmail = "admin@gmail.com"
//     const adminExists = await User.findOne({ email: adminEmail })
//     if (!adminExists) {
//       const hashedPassword = await bcrypt.hash("admin123", 12)
//       await User.create({
//         cnic: "admin-cnic",
//         email: adminEmail,
//         fullName: "Admin User",
//         password: hashedPassword,
//         role: "admin",
//       })
//       // console.log("Default admin user created")
//     }
//   })
//   .catch((err) => console.log(err))

// const userRoutes = require("./routes/userRoutes")
// const loanRoutes = require("./routes/loanRoutes")

// app.use("/api/users", userRoutes)
// app.use("/api/loans", loanRoutes)

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`)
// })
