import React, { FC, ChangeEvent, useState, useEffect } from "react";
import { ITask } from "./Interfaces";
import "./App.css";
import TodoTask from "./Components/TodoTask";

const App: FC = () => {
  const [task, setTask] = useState<string>("");
  const [deadline, setDeadline] = useState<number>(0);
  const [todoList, setTodoList] = useState<ITask[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (todoList.length === 0) {
      const storage = localStorage!.getItem("todoList");

      if (storage) {
        const data = JSON.parse(storage) as ITask[];
        setTodoList([...todoList, ...data]);
      }
    } else {
      localStorage.setItem("todoList", JSON.stringify(todoList));
    }
  }, [todoList]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.name === "task") setTask(event.target.value);
    else if (event.target.name === "deadline")
      if (Number(event.target.value) > 0)
        setDeadline(Number(event.target.value));
      else
        console.log(
          `Deadline value must be greater than ${event.target.value}`
        );
  };

  const addTask = (): void => {
    if (task && deadline > 0) {
      const newTask = {
        name: task,
        deadline: deadline,
      };

      setTodoList([...todoList, newTask]);
      setTask("");
      setDeadline(0);
      setErrorMessage("");
    } else {
      setErrorMessage(
        "Task cannot be empty and deadline must be greater than zero!"
      );
    }
  };

  const completeTask = (taskNameToDelete: string): void => {
    setTodoList(
      todoList.filter((task) => {
        return task.name !== taskNameToDelete;
      })
    );

    localStorage.removeItem("todoList");
  };

  return (
    <div className="App">
      <div className="header" style={{ display: "flex" }}>
        {errorMessage && <div className="error"> {errorMessage} </div>}
        <div className="inputContainer">
          <input
            type="text"
            placeholder="Task..."
            name="task"
            onChange={handleChange}
            value={task}
          />
          <input
            type="number"
            placeholder="Deadline (in Days)..."
            name="deadline"
            value={deadline}
            onChange={handleChange}
          />
        </div>
        <button onClick={addTask}>Add Task</button>
      </div>
      <div className="todoList">
        {todoList.map((task: ITask, key: number) => {
          return <TodoTask key={key} task={task} completeTask={completeTask} />;
        })}
      </div>
    </div>
  );
};

export default App;

