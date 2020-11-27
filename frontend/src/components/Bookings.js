import React, { useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import authContextProvider from "../context/authContext";

const GET_BOOKINGS_QUERY = gql`
  query getBookingsQuery {
    bookings {
      _id
      event {
        _id
        title
        description
        price
        date
        creator {
          _id
        }
      }
      user {
        _id
        email
        password
      }
      createdAt
      updatedAt
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

const BookingList = ({ bookings, userId }) => {
  return bookings.map((booking) => {
    console.log(booking.event.creator);
    const date = dateFormatConverter(booking.event.date);
    return (
      <div
        key={booking._id}
        className="flex relative pt-10 pb-20 sm:items-center md:w-2/3 mx-auto"
      >
        <div className="h-full w-6 absolute inset-0 flex items-center justify-center">
          <div className="h-full w-1 bg-gray-800 pointer-events-none" />
        </div>
        <div className="flex-shrink-0 w-6 h-6 rounded-full mt-10 sm:mt-0 inline-flex items-center justify-center bg-indigo-500 text-white relative z-10 title-font font-medium text-sm">
          1
        </div>
        <div className="flex-grow md:pl-8 pl-6 flex sm:items-center items-start flex-col sm:flex-row">
          <div className="flex-shrink-0 w-24 h-24 bg-gray-800 text-indigo-400 rounded-full inline-flex items-center justify-center">
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              className="w-12 h-12"
              viewBox="0 0 24 24"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="flex-grow sm:pl-6 mt-6 sm:mt-0">
            <h2 className="font-medium title-font text-white mb-1 text-xl ml-12">
              {booking.event.title}
            </h2>
            <p className="leading-relaxed lg:w-2/3 flex flex-col sm:flex-row sm:items-center items-start mx-auto">
              <h1 className="flex-grow sm:pr-16 title-font">
                {date.day + " " + date.month + ", " + date.year}
              </h1>
              {booking.event.creator._id !== userId ? (
                <button className="flex-shrink-0 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg mt-10 sm:mt-0">
                  Cancel Booking
                </button>
              ) : (
                <button className="bg-gray-600 hover:bg-grey text-white py-2 px-4 rounded inline-flex items-center border-0 py-2 px-8 focus:outline-none cursor-not-allowed">
                  You are the owner of this event
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  });
};

const Bookings = (props) => {
  const authContext = useContext(authContextProvider);
  const { loading, error, data } = useQuery(GET_BOOKINGS_QUERY, {
    context: {
      headers: {
        Authorization: authContext.token ? `Bearer ${authContext.token}` : "",
      },
    },
  });
  if (loading) {
    console.log("Loading...");
  }
  if (error) {
    console.log("Error: ", error);
  }
  if (data) {
    console.log("Data is: ", data.bookings);
  }
  return (
    <div>
      <section className="text-gray-500 bg-gray-900 body-font">
        <h1 className="title-font font-medium text-5xl text-white text-center pt-10">
          Bookings
        </h1>
        <div
          className="container px-5 py-24 mx-auto flex flex-wrap"
          style={{ minHeight: "86vh" }}
        >
          <BookingList
            bookings={data ? data.bookings : []}
            userId={authContext.userId}
          />
        </div>
      </section>
    </div>
  );
};

export default Bookings;
