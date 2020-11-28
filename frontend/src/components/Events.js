import React, { useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import Modal from "./Modal";
import authContextProvider from "../context/authContext";

const GET_EVENTS_QUERY = gql`
  query getEventsQuery {
    events {
      _id
      title
      description
      price
      date
    }
  }
`;

let dateFormatConverter = (UNIX_timestamp) => {
  let a = new Date(Number(UNIX_timestamp));
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let day = a.getDate();
  // let newDate = date + " " + month + " " + year;
  return { day, month, year };
};

const EventList = (events) => {
  // console.log(events);
  return events.map((event) => {
    return (
      <div
        key={event._id}
        className="py-8 px-4 lg:w-1/3 border-2 border-blue-500 border-opacity-25 m-4 ml-20 mb-20"
      >
        <div className="h-full flex items-start">
          <div className="w-12 flex-shrink-0 flex flex-col text-center leading-none">
            <span className="font-medium text-xl text-gray-300 title-font pb-2 mb-2 border-b-2 border-gray-800">
              {dateFormatConverter(event.date).day}
            </span>
            <span className="text-gray-600">
              {dateFormatConverter(event.date).month},{" "}
              {dateFormatConverter(event.date).year}
            </span>
          </div>
          <div className="flex-grow pl-6">
            <h2 className="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">
              Rs. {event.price}
            </h2>
            <h1 className="title-font text-xl font-medium text-white mb-3">
              {event.title}
            </h1>
            <p className="leading-relaxed mb-5">{event.description}</p>
            <button className="inline-flex items-center flex-shrink-0 text-white bg-green-400 border-0 py-1 px-4 focus:outline-none hover:bg-green-600 rounded mt-10 sm:mt-0">
              Book
            </button>
          </div>
        </div>
      </div>
    );
  });
};

const Events = () => {
  const authContext = useContext(authContextProvider);
  const { loading, error, data } = useQuery(GET_EVENTS_QUERY);
  if (loading) {
    console.log("Loading...");
  }
  if (error) {
    console.log("Error: ", error);
  }
  if (data) {
    console.log("Data is: ", data);
  }
  return (
    <div>
      <section className="text-gray-500 bg-gray-900 body-font">
        <section className="text-gray-500 bg-gray-900 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
              <h1 className="flex-grow sm:pr-16 text-5xl font-medium title-font text-white">
                Events
              </h1>
              <Modal />
            </div>
          </div>
        </section>
        <div
          className="container px-5 py-15 mx-auto"
          style={{ minHeight: "86vh" }}
        >
          <div className="flex flex-wrap -mx-4 -my-8">
            {data ? EventList(data.events) : []}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
