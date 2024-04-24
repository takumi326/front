"use client";
import React, { useEffect, useState } from "react";
import {
  PurposeGetData,
  PurposePost,
  PurposeEdit,
  PurposeDelete,
} from "@/lib/api/purposeDate";

type Purpose = {
  id: string;
  title: string;
  result: string;
  deadline: Date;
  body: string;
  completed: boolean;
};

const PurposeComponent = () => {
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [title, setTitle] = useState("");
  const [editTitle, setEditTitle] = useState(""); // 編集用のタイトル
  const [editId, setEditId] = useState<string | null>(null);

  // Purposeリストを取得
  useEffect(() => {
    PurposeGetData().then((data) => {
      setPurposes(data);
    });
  }, []);

  // Purposeを追加する処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await PurposePost(title);
      const newTodo = await response.json();
      
      setPurposes([...purposes, newTodo]); // Purposeリストを更新
      setTitle("");
    } catch (error) {
      console.error("Failed to create todo:", error);
    }
  };

  // Purposeを削除する処理
  const deleteTodo = async (id: string) => {
    try {
      PurposeDelete(id);

      setPurposes(purposes.filter((purpose) => purpose.id !== id)); // UIからも削除
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  // Purpose編集処理
  const editTodo = async (id: string) => {
    try {
      await PurposeEdit(id, editTitle);

      setPurposes(
        purposes.map((purpose) =>
            purpose.id === id ? { ...purpose, title: editTitle } : purpose
        )
      );

      setEditId(null);
      setEditTitle(""); // 編集フォームのリセット
    } catch (error) {
      console.error("Failed to edit todo:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task"
          className="shadow appearance-none border rounded py-2 px-3 text-grey-darker mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Task
        </button>
      </form>
      <ul className="list-disc pl-5">
        {purposes.map((purpose) => (
          <li key={purpose.id} className="mb-2">
            {editId === purpose.id ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            ) : (
              <span className="text-grey-darker">{purpose.title}</span>
            )}
            <button
              onClick={() => {
                setEditId(purpose.id);
                setEditTitle(purpose.title);
              }}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ml-2"
            >
              Edit
            </button>
            <button
              onClick={() => deleteTodo(purpose.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
            >
              Delete
            </button>
            {editId === purpose.id && (
              <button
                onClick={() => editTodo(purpose.id)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2"
              >
                Save
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PurposeComponent;
