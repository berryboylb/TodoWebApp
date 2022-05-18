import { useEffect } from "react";
import { connect } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { toggleReminder, deleteItem, getAllItems } from "../actions/todo";
import { BounceLoader } from "react-spinners";
import Moment from "react-moment";

const Tasks = ({
  todo: { loading, todos, pages, page },
  toggleReminder,
  deleteItem,
  getAllItems,
  user,
}) => {
  useEffect(() => {
    getAllItems();
  }, [getAllItems]);

  const pageBtns = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const previous = () => {
    getAllItems(Math.max(0, page - 1), 10);
  };

  const next = () => {
    getAllItems(Math.min(pages, page + 1), 10)
  };
  return (
    <>
      <h3>
        Welcome {user && user.firstname} {user && user.lastname}
      </h3>
      {loading ? (
        <BounceLoader color="green" />
      ) : (
        <div>
          {todos.length > 0 ? (
            <>
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  className={`task ${todo.reminder && "reminder"}`}
                  onDoubleClick={() => toggleReminder(todo._id)}
                >
                  <h3>
                    {todo.text}{" "}
                    <FaTimes
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() =>
                        deleteItem(todo._id, () => getAllItems(page, 10))
                      }
                    />
                  </h3>
                  <p>
                    Date: <Moment format="YY-MM-DD">{todo.date}</Moment>
                  </p>
                </div>
              ))}
            </>
          ) : (
            "No Tasks To Show"
          )}
          <div style={pageBtns}>
            <p>Pages:</p>
            <div>
              <button className="btn" onClick={previous}>
                Previous
              </button>
              {Array.from(Array(pages)).map((pag, i) => (
                <button
                  className="btn"
                  style={
                    page === i + 1
                      ? { backgroundColor: "green" }
                      : { backgroundColor: "black" }
                  }
                  key={i}
                  onClick={() => getAllItems(i + 1, 10)}
                >
                  {i + 1}
                </button>
              ))}
              <button className="btn" onClick={next}>
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  todo: state.todo,
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  toggleReminder,
  deleteItem,
  getAllItems,
})(Tasks);
