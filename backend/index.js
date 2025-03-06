import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cron from "node-cron";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json());


let tasks = [
  { id: 1, title: "Market 1", openTime: "08:00", closeTime: "18:00", status: "open" },
  { id: 2, title: "Market 2", openTime: "09:00", closeTime: "17:00", status: "open" },
  { id: 3, title: "Market 3", openTime: "10:00", closeTime: "20:00", status: "open" }
];


const updateTaskStatus = () => {
    
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();

  tasks = tasks.map((task) => {
    const [openHour, openMinutes] = task.openTime.split(":").map(Number);
    const [closeHour, closeMinutes] = task.closeTime.split(":").map(Number);

    if (currentHour > closeHour || (currentHour === closeHour && currentMinutes >= closeMinutes)) {
      return { ...task, status: "closed" };
    } 
    else if (currentHour > openHour || (currentHour === openHour && currentMinutes >= openMinutes)) {
      return { ...task, status: "open" };
    }
    else {
      return { ...task, status: "Open" };
    }
  });
};


cron.schedule("* * * * *", () => {
  updateTaskStatus();
});


app.get("/tasks", (req, res) => {
  res.json(tasks);
});


app.post("/tasks", (req, res) => {
  const { title, openTime, closeTime } = req.body;
  const newTask = { id: tasks.length + 1, title, openTime, closeTime, status: "pending" };
  tasks.push(newTask);
  res.status(201).json(newTask);
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
