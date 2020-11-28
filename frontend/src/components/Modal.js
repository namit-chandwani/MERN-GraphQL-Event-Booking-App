import React, { useState, useContext } from "react";
import ReactModal from "react-modal";
import authContextProvider from "../context/authContext";
import { gql, useMutation } from "@apollo/client";

const ADD_EVENT_MUTATION = gql`
  mutation addEventMutation(
    $title: String!
    $description: String!
    $price: Float!
    $date: String!
  ) {
    addEvent(
      title: $title
      description: $description
      price: $price
      date: $date
    ) {
      _id
      title
      description
      price
      date
    }
  }
`;

const Modal = (props) => {
  const authContext = useContext(authContextProvider);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // const onSubmitHandler = (e) => {
  //   e.preventDefault();
  //   const newEvent = {
  //     title: title,
  //     price: Number(price),
  //     date: new Date(date),
  //     description: description,
  //   };
  //   handleCloseModal();
  //   console.log(newEvent);
  // };

  const onChangeHandler = (e) => {
    if (e.target.name === "title") {
      setTitle(e.target.value);
    } else if (e.target.name === "price") {
      setPrice(e.target.value);
    } else if (e.target.name === "date") {
      setDate(e.target.value);
    } else {
      setDescription(e.target.value);
    }
  };

  const PerformCreationComponent = () => {
    const [performCreation, { loading, error, data }] = useMutation(
      ADD_EVENT_MUTATION,
      {
        variables: {
          title,
          description,
          price: Number(price),
          date: new Date(date),
        },
        context: {
          headers: {
            Authorization: authContext.token
              ? `Bearer ${authContext.token}`
              : "",
          },
        },
      }
    );
    if (loading) {
      console.log("Loading...");
    }
    if (error) {
      return console.log(error);
    }
    if (data) {
      handleCloseModal();
      console.log("Data is: ", data);
    }

    return (
      <button
        onClick={performCreation}
        className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
      >
        Submit
      </button>
    );
  };

  return (
    <div>
      <button
        onClick={authContext.token && handleOpenModal}
        className={
          authContext.token
            ? "flex-shrink-0 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg mt-10 sm:mt-0"
            : "bg-gray-600 hover:bg-grey text-white py-2 px-4 rounded inline-flex items-center border-0 py-2 px-8 focus:outline-none cursor-not-allowed"
        }
      >
        Add Event
      </button>
      <ReactModal
        ariaHideApp={false}
        isOpen={showModal}
        contentLabel="Minimal Modal Example"
      >
        <section className="text-gray-700 body-font">
          <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
            <div className="bg-gray-200 rounded-lg p-8 flex flex-col w-full mt-10 md:mt-0">
              <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
                Create New Event
              </h2>
              <div className="relative mb-4">
                <label
                  htmlFor="title"
                  className="leading-7 text-sm text-gray-600"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  onChange={onChangeHandler}
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-4">
                <label
                  htmlFor="price"
                  className="leading-7 text-sm text-gray-600"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  onChange={onChangeHandler}
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-4">
                <label
                  htmlFor="date"
                  className="leading-7 text-sm text-gray-600"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  onChange={onChangeHandler}
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-4">
                <label
                  htmlFor="description"
                  className="leading-7 text-sm text-gray-600"
                >
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  onChange={onChangeHandler}
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <PerformCreationComponent />
            </div>
          </div>
        </section>
      </ReactModal>
    </div>
  );
};

export default Modal;
