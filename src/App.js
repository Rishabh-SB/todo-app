import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    return JSON.parse(savedTasks);
  } else {
    const defaultTasks = [
      { text: "Midnight Task", resetTime: new Date(new Date().setHours(0, 0, 0, 0)), completed: false, timeLeft: 86400 },
      { text: "Midday Task", resetTime: new Date(new Date().setHours(12, 0, 0, 0)), completed: false, timeLeft: 43200 }
    ];
    localStorage.setItem("tasks", JSON.stringify(defaultTasks));
    return defaultTasks;
  }
});
  const [taskText, setTaskText] = useState("");
  const [resetTime, setResetTime] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          const resetTime = new Date(task.resetTime);
          const timeLeft = Math.max(0, Math.floor((resetTime - now) / 1000));
          const completed = resetTime <= now ? false : task.completed;
          return { ...task, timeLeft, completed };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addTask = () => {
    if (taskText.trim() && resetTime) {
      const now = new Date();
      const resetDateTime = new Date();
      const [hours, minutes] = resetTime.split(":").map(Number);
      resetDateTime.setHours(hours, minutes, 0, 0);
      if (resetDateTime < now) resetDateTime.setDate(resetDateTime.getDate() + 1);
      setTasks([...tasks, { text: taskText, resetTime: resetDateTime, completed: false, timeLeft: Math.floor((resetDateTime - now) / 1000) }]);
      setTaskText("");
      setResetTime("");
    }
  };

  const toggleTaskCompletion = (index) => {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="container dark-theme">
      <h2 className="clock">Your local time:</h2>
      <h3 className="current-time">{currentTime.toLocaleTimeString()}</h3>
      <h1 className="title">Daily Task Master</h1>
      <p className="description">Keep note of your daily scheduled tasks with ease.</p>
      <p className="credits">Created by Rishabh S. B., Reg. No.: 22BCE3310, using HTML, CSS, and React.</p>
      <div className="input-group">
        <input
          type="text"
          className="input-text"
          placeholder="Enter task..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <input
          type="time"
          className="input-time"
          value={resetTime}
          onChange={(e) => setResetTime(e.target.value)}
        />
        <button className="add-btn" onClick={addTask}>Add</button>
      </div>
      <ul className="task-grid">
        {tasks.map((task, index) => (
          <li key={index} className="task-card">
            <div className="task-header">
              <span className="task-title">{task.text}</span>
              <span className="task-reset-time">(Resets at {new Date(task.resetTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})</span>
            </div>
            <div className="task-footer">
              <span className="task-countdown">Time Left: {task.timeLeft}s</span>
              <input
                type="checkbox"
                className="task-checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(index)}
              />
              <span className="delete-btn" onClick={() => deleteTask(index)}>&#10006;</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
