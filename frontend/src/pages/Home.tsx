import { useEffect, useState } from "react";
import api from "../api";

function Home() {
  const [notes, setNotes] = useState<
    {
      id: number;
      title: string;
      content: string;
      created_at: string;
      updated_at: string;
    }[]
  >([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    getNote();
  }, []);

  const getNote = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id: number) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Note deleted successfully");
        } else {
          throw new Error("Failed to Delete Note");
        }
      })
      .then(() => getNote())
      .catch((err) => alert(err));
  };

  const createNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api
      .post("/api/notes/", { title, content })
      .then((res) => {
        if (res.status === 201) {
          alert("Note created successfully");
        } else {
          throw new Error("Failed to Create Note");
        }
      })
      .then(() => {
        getNote();
        setTitle("");
        setContent("");
      })
      .catch((err) => alert(err));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h2>Notes</h2>
        {notes.map((item) => {
          return (
            <div key={item.id} className="space-y-2 border">
              <div>
                <h3>Title - {item.title}</h3>
                <p>Content - {item.content}</p>
              </div>
              <button onClick={() => deleteNote(item.id)}>Delete</button>
            </div>
          );
        })}
      </div>
      <div className="space-y-4">
        <h2>Create A Note</h2>
        <form onSubmit={createNote} className="space-x-2">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            required
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Home;
