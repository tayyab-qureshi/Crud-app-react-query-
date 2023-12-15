import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { TiDelete } from 'react-icons/ti';
import { AiFillEdit } from 'react-icons/ai';

const getData = async () => {
  const { data } = await axios.get('https://json-api-5kik.onrender.com/tasks');
  return data;
};

const TodoApp = () => {
  const [newTodo, setNewTodo] = useState('');
  const [updatebtn, setUpdatebtn] = useState(false);
  const [todoID, setTodoID] = useState(0);
  const queryClient = useQueryClient();

  const { isLoading, error, data: todos } = useQuery({
    queryKey: ['tasks'],
    queryFn: getData,
  });

  const addTodoMutation = useMutation({
    mutationFn: (todo) => {
      return axios.post('https://json-api-5kik.onrender.com/tasks', todo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => {
      return axios.delete(`https://json-api-5kik.onrender.com/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
    },
  });
  const updateMutation = useMutation({
    mutationFn: (object) => {
      const { id, todo } = object;
      return axios.patch(`https://json-api-5kik.onrender.com/tasks/${id}`, { task: todo });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
    },
  });

  const handleSubmit = () => {
    if (newTodo.trim() !== '') {
      const updateData = { task: newTodo };
      addTodoMutation.mutate(updateData);
      setNewTodo('');
    }
  };

  const handleUpdate = () => {
    if (newTodo.trim() !== '') {
      updateMutation.mutate({ id: todoID, todo: newTodo });
      setNewTodo('');
      setUpdatebtn(false);
    }
  };

  return (
    <div className="w-3/4 mx-auto p-4 bg-black bg-opacity-60 shadow-md rounded-md">
      <h1 className="text-4xl font-bold py-4 text-center text-pink-900">Todo List</h1>
      <div className="mb-4 flex flex-col">
        <input
          type="text"
          className="border py-2 px-4 text-lg w-full mx-auto rounded"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        {updatebtn ? (
          <button
            className="mt-2 w-full bg-pink-900 text-white px-4 py-2 rounded"
            onClick={handleUpdate}
          >
            Update
          </button>
        ) : (
          <button
            className="mt-4 w-full bg-pink-900 text-white py-2 rounded"
            onClick={handleSubmit}
          >
            Add
          </button>
        )}
      </div>
      <ul>
        {isLoading && <h1 className="text-white">Loading...</h1>}
        {error && <h1 className="text-white">Error: {error.message}</h1>}
        {todos?.map((todo, i) => (
          <li key={todo.id} className="flex justify-between items-center border-b py-2">
            <div className="flex flex-col items-start">
              <span className="text-pink-900 font-semibold text-lg">{i + 1}--</span>
              <span className="text-pink-200 font-semibold text-lg">{todo.task}</span>
            </div>
            <div className="flex gap-2">
              <button
                className="text-yellow-300 text-lg"
                onClick={() => {
                  setNewTodo(todo.task);
                  setUpdatebtn(true);
                  setTodoID(todo.id);
                }}
              >
                <AiFillEdit />
              </button>
              <button
                className="text-red-500 text-lg"
                onClick={() => deleteMutation.mutate(todo.id)}
              >
                <TiDelete />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
