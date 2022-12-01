import React, { Fragment, useEffect, useState } from "react";
import UserLogin from "./UserLogin";
import Title from "./Title";
import Search from "./Search";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

function Home() {
  const [name, setName] = useState("");
  const [shoes, setShoes] = useState([]);
  const [shoeInfo, setShoeInfo] = useState([]);

  const paramm = "Jordan 3 Retro";

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/shoes/?name=${name}`);

      const parseResponse = await response.json();
      setShoes(parseResponse);
      console.log(parseResponse);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchDetails = async () => {
    const data = await fetch(`http://localhost:5001/shoes/?name=${paramm}`);
    const detailData = await data.json();

    setShoeInfo(detailData);
    //console.log(shoeInfo);
  };

  useEffect(() => {
    fetchDetails();
  });
  /*
      <Search />

  */
  return (
    <div className="container">
      {/* <UserLogin /> */}
      <Title />
      <Fragment>
        <div className="container text-center">
        <form className="d-flex" onSubmit={onSubmitForm}>
            <input
              type="text"
              name="name"
              placeholder="Enter shoe ..."
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="btn btn-success">Search</button>
          </form>
          <div className="wrapper">

            <h3>Recommended Picks</h3>
            <Splide
              options={{
                perPage: 4,
                arrows: false,
                pagination: false,
                drag: "free",
                gap: "1rem",
                padding: "3rem"
              }}
            >
              {shoeInfo.map((shoe) => {
                return (
                  <SplideSlide key={shoe.data_instance_id}>
                    <div className="card">
                      <Link to={"/shoeInfo/" + shoe.description}>
                        <p>{shoe.description.replace(/-/g, " ")}</p>
                        <img src={shoe.url} alt="" />
                      </Link>
                    </div>
                  </SplideSlide>
                );
              })}
            </Splide>
          </div>
          
          <table className="table my-5">
            <thead>
              <tr>
                <th> Image </th>
                <th> Shoe Name </th>
                <th> Retail Price </th>
                <th> Color Way </th>
              </tr>
            </thead>
            <tbody>
              {shoes.map((shoe) => (
                <tr key={shoe.data_instance_id}>
                  <Link to={"/shoeInfo/" + shoe.description}>
                    <td>
                      <img src={shoe.url} width="200" height="200"></img>
                    </td>
                  </Link>
                  <td>{shoe.description.replace(/[^a-zA-Z ]/g, " ")}</td>
                  <td>{shoe.retail}</td>
                  <td>{shoe.color_way}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Fragment>
      <Footer />
    </div>
  );
}

export default Home;
