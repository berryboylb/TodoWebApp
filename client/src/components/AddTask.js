import { useState } from "react";
import toast from "react-hot-toast";
import { connect } from "react-redux";
import { addATodo, getAllItems } from "../actions/todo";

const AddTask = ({
  addATodo,
  getAllItems,
}) => {
  const [text, setText] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const letterAndWhitespace = /^[a-zA-Z\s]*$/;

    if (!text) {
      return toast.error("Please add a task", { duration: 6000 });
    }
    if (text.length < 6) {
      return toast.error("task length must be greater than 6", {
        duration: 6000,
      });
    }

    if (!letterAndWhitespace.test(text)) {
      return toast.error("Only letter and white spaces are allowed", {
        duration: 6000,
      });
    }

    addATodo({ text }, () => {
      getAllItems(1, 10);
      setText("");
    });
  };

  return (
    <form className="add-form" onSubmit={onSubmit}>
      <div className="form-control">
        <label>Task</label>
        <input
          type="text"
          placeholder="Add Task"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <input type="submit" value="Save Task" className="btn btn-block" />
    </form>
  );
};
// const mapStateToProps = (state) => ({
//   todo: state.todo,
// });

export default connect(null, { addATodo, getAllItems })(AddTask);
