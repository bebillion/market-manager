import { useState, useEffect } from "react";
import axios from "axios";
import styles from './TaskApp.module.css';

const TaskApp = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      console.log("Fetching tasks...");
      const response = await axios.get("http://localhost:5000/tasks");
      console.log("Fetched tasks:", response.data);
      setTasks(response.data);
    } catch (error) {
      setError("Error fetching tasks.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const newTask = { title, openTime, closeTime };
      await axios.post("http://localhost:5000/tasks", newTask);
      setTitle("");
      setOpenTime("");
      setCloseTime("");
      fetchTasks(); // Refresh tasks after adding
    } catch (error) {
      setError("Error adding task.");
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div>
          <h2>Task Manager</h2>
        </div>
        <div>
          <form onSubmit={handleAddTask} className={styles.form}>
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              required
            />
            <input
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              required
            />
            <button type="submit">Add Market</button>
          </form>
        </div>
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Open Time</th>
                <th>Close Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.openTime}</td>
                  <td>{task.closeTime}</td>
                  <td>{task.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>{error && <p className={styles.error}>{error}</p>}</div>
      </div>
    </div>
  );
};

export default TaskApp;
