import axios from "axios";
import toast from "react-hot-toast";
import {
  GET_ALL_ITEMS,
  ITEM_ERROR,
  TOGGLE_REMINDER,
  DELETE_ITEM,
  ADD_TODO,
} from "../types";

//get all todo items for a user
export const getAllItems =
  (page = 1, perPage = 10) =>
  async (dispatch) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/todo/${page}/${perPage}`);
      dispatch({
        type: GET_ALL_ITEMS,
        payload: { pages : res.data.pages, page: res.data.page, docs : res.data.docs },
      });
      console.log(res.data)
      toast.success("Tasks fetched sucessfully");
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => {
          dispatch(toast.error(error.msg, { duration: 6000 }));
        });
      }
      dispatch({
        type: ITEM_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

export const deleteItem = (id, cb) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:5000/api/todo/${id}`);
    dispatch({
      type: DELETE_ITEM,
      payload: id,
    });
    cb();
    toast.success("Task deleted successfully");
  } catch (err) {
    toast.error(err.message);
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        dispatch(toast.error(error.msg, { duration: 6000 }));
      });
    }
    dispatch({
      type: ITEM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const toggleReminder = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`http://localhost:5000/api/todo/${id}`);
    dispatch({
      type: TOGGLE_REMINDER,
      payload: { id, reminder: res.data.reminder },
    });
    if (res.data.reminder) {
      toast.success("Reminder set sucessfully");
    } else {
      toast.success("Reminder removed sucessfully");
    }
  } catch (err) {
    toast.error(err.message);
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => {
        dispatch(toast.error(error.msg, { duration: 6000 }));
      });
    }
    dispatch({
      type: ITEM_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//add a todo
export const addATodo =
  ({ text }, cb) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ text });
    try {
      const res = await axios.post(
        "http://localhost:5000/api/todo",
        body,
        config
      );
      dispatch({
        type: ADD_TODO,
        payload: res.data,
      });
      toast.success("Success", { duration: 6000 });
      cb();
    } catch (err) {
      cb();
      toast.error(err.message);
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => {
          dispatch(toast.error(error.msg, { duration: 6000 }));
        });
      }
      dispatch({
        type: ITEM_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };
