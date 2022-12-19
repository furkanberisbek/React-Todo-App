import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [todolar, setTodolar] = useState(null);
  const [title, setTitle] = useState("");
  const [result, setResult] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [edit, setEdit] = useState(false);
  const [updateTodo, setUpdateTodo] = useState(null)
  const [editTitle, setEditTitle] = useState("")

  const todoSil = (id) => {
    axios
      .delete(`http://localhost:3004/todos/${id}`)
      .then((response) => {
        setResult(true);
        setResultMessage("Silme İşlemi Başarılı");
      })
      .catch((error) => {
        setResult(true);
        setResultMessage("Silme İşlemi Esnasında Bir Hata Oluştu");
      });
  };

  const changeTodosCompleted = (todo) => {
    console.log(todo);
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };
    axios
      .put(`http://localhost:3004/todos/${todo.id}`, updatedTodo)
      .then((response) => {
        setResult(true);
        setResultMessage("Todo başarıyla güncellendi");
      })
      .catch((error) => {
        setResult(true);
        setResultMessage("Todo güncellenirken bir hata oluştu!");
      });
  };

  /* 
    CRUD -> CREATE (POST), READ (GET), UPDATE (PUT/PATCH), DELETE (DELETE)
  */

  useEffect(() => {
    axios
      .get("http://localhost:3004/todos")
      .then((response) => {
        console.log(response.data);
        setTodolar(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [result]);

  const formuDenetle = (event) => {
    event.preventDefault();
    //validation
    if (title === "") {
      alert("Yapılacak iş boş bırakılamaz");
      return;
    }
    //create and save todo
    const newTodo = {
      id: String(new Date().getTime()),
      title: title,
      date: new Date(),
      completed: false,
    };

    axios
      .post("http://localhost:3004/todos", newTodo)
      .then((response) => {
        setTitle("");
        setResult(true);
        setResultMessage("Kayıt İşlemi Başarılı");
      })
      .catch((error) => {
        setResult(true);
        setResultMessage("Kaydederken bir hata oluştu");
      });
  };

  const todoGuncelleFormunuDenetle = (event) => {
    event.preventDefault()
    //validation
    if (editTitle === "") {
      alert("Title boş bırakılamaz")
      return
    }
    // update todo and send server
    const updatedTodo = {
      ...updateTodo,
      title: editTitle
    }
    axios.put(`http://localhost:3004/todos/${updateTodo.id}`, updatedTodo)
      .then((response) => {
        setResult(true)
        setResultMessage("Güncelleme işlemi başarılı")
        setEdit(false)
      })
      .catch((error) => {
        setResult(true)
        setResultMessage("Güncelleme işlemi esnasında bir hata oluştu")
      })
  }

  if (todolar === null) {
    return null;
  }

  return (
    <div className="container">
      {result === true && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}>
          <div className="alert alert-success" role="alert">
            <p>{resultMessage}</p>
            <div className="d-flex justify-content-center">
              <button
                onClick={() => setResult(false)}
                className="btn btn-sm btn-outline-primary">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="row my-5">
        <form onSubmit={formuDenetle}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Yapılacak işi girin..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <button className="btn btn-success" type="submit">
              Ekle
            </button>
          </div>
        </form>
      </div>
      {edit === true && (
        <div className="row my-5">
          <form onSubmit={todoGuncelleFormunuDenetle}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Yapılacak işi girin..."
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
              />
              <button
                onClick={() => setEdit(false)}
                className="btn btn-danger"
              >
                Vazgeç
              </button>
              <button className="btn btn-primary" type="submit">
                Güncelle
              </button>
            </div>
          </form>
        </div>
      )}
      {todolar.map((todo) => (
        <div
          key={todo.id}
          className="alert alert-success d-flex justify-content-between align-items-center"
          role="alert">
          <div>
            <h1
              style={{
                textDecoration:
                  todo.completed === true ? "line-through" : "none",
                color: todo.completed === true ? "red" : "black",
              }}>
              {todo.title}
            </h1>
            <p>{new Date(todo.date).toLocaleString()}</p>
          </div>
          <div>
            <div className="btn-group" role="group" aria-label="Basic example">
              <button
                onClick={() => {
                  setEdit(true);
                  setUpdateTodo(todo)
                  setEditTitle(todo.title)
                }}
                type="button"
                className="btn btn-sm btn-warning">
                Düzenle
              </button>
              <button
                onClick={() => todoSil(todo.id)}
                type="button"
                className="btn btn-sm btn-danger">
                Sil
              </button>
              <button
                onClick={() => changeTodosCompleted(todo)}
                type="button"
                className="btn btn-sm btn-secondary">
                {todo.completed === true ? "Yapılmadı" : "Yapıldı"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;