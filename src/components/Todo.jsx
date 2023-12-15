import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios';
import { TiDelete } from "react-icons/ti";
import { AiFillEdit } from "react-icons/ai";


const getData = async () => {
    const {data} = await axios.get("https://json-api-5kik.onrender.com/tasks")
    return data;
}


const TodoApp = () => {
  const [newTodo, setNewTodo] = useState("");
  const [updatebtn, setUpdatebtn] =useState(false)
  const [todoID, setTodoID] =useState(0)
  const queryClient = useQueryClient()

  const {
    isLoading,
    error,
    data: todos
} = useQuery({ queryKey: ['tasks'], queryFn: getData })


const addTodoMutation = useMutation({
    mutationFn:(todo)=>{
        return axios.post("https://json-api-5kik.onrender.com/tasks", todo)
    },
    onSuccess: () => {
        queryClient.invalidateQueries("tasks");
    }
});
const deleteMutation = useMutation({
    mutationFn:(id)=>{
        return axios.delete(`https://json-api-5kik.onrender.com/tasks/${id}`)
    },
    onSuccess: () => {
        queryClient.invalidateQueries("tasks");
    },
});
const updateMutation = useMutation({
    mutationFn: (object) => {
      const { id, todo } = object;
      return axios.patch(`https://json-api-5kik.onrender.com/tasks/${id}`, { task: todo });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("tasks");
    },
  });

  const handleSubmit = () => {
    if (newTodo.trim() !== '') {
        const updateData = {task: newTodo}
      addTodoMutation.mutate(updateData)
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
    <div className='w-5/5 py-10'>
    <div className="w-3/5 mx-auto px-6 bg-black bg-opacity-60 shadow-lg rounded-md">
      <h1 className="text-4xl font-bold py-8 text-center text-pink-900">Todo List</h1>
      <div className="mb-4 flex">
        <input
          type="text"
          className="border py-2 px-5 text-lg w-full rounded"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        {updatebtn?<button
          className="ml-2 bg-pink-900 text-white px-10 py-2 rounded"
          onClick={handleUpdate}
        >
          Update
        </button>: <button
          className="ml-2 bg-pink-900 text-white px-10 py-2 rounded"
          onClick={handleSubmit}
        >
          Add
        </button>
        }
       
        

      </div>
      <ul>
        {isLoading && <h1 className='text-white'>Loading...</h1>}
        {error && <h1 className='text-white'>Error: {error.message}</h1>}
        {todos?.map((todo,i) => (
          <li
            key={todo.id}
            className="flex justify-between items-center border-b py-2"
          >
            <div className='flex gap-2 items-center'>
            <span className='text-pink-900 font-semibold text-xl'>{i+1}--</span>
            <span className='text-pink-200 font-semibold text-xl'>{todo.task}</span>

            </div>
            <div className='flex gap-[20px]'>

            <button
              className="text-yellow-300 text-xl"
              onClick={()=>{setNewTodo(todo.task);setUpdatebtn(true);setTodoID(todo.id)}}
              
            >
              <AiFillEdit/>
            </button>
            <button
              className="text-red-500 text-xl"
              onClick={()=>deleteMutation.mutate(todo.id)}
             
            >
              <TiDelete/>
            </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default TodoApp;
