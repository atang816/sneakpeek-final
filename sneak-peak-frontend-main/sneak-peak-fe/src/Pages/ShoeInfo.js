import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function ShoeInfo() {
  const [shoeInfo, setShoeInfo] = useState([]);
  const [goatShoeInfo, setGoatShoeInfo] = useState([]);

  let params = useParams();

  const fetchDetails = async () => {
    const goatName = params.description.replace(/-/g, " ");
    const goatData = await fetch(
      `http://localhost:5001/goatShoesDesc/?goatNameDesc=${goatName}`
    );

    let goatDetailData = await goatData.json();
    
    for(let i = 0; i < goatDetailData.length; i++){
      let new_price = goatDetailData[i]['size_price'].replace('$', '')
      goatDetailData[i]['size_price'] = new_price
    }

    goatDetailData.sort((a, b) => {
      return a.size - b.size;
    });

    setGoatShoeInfo(goatDetailData);
    console.log(goatDetailData[0]['size_price']);

    const data = await fetch(
      `http://localhost:5001/shoesDesc/?nameDesc=${params.description}`
    );
    const detailData = await data.json();

    setShoeInfo(detailData);

    //console.log(shoeInfo);
  };


  useEffect(() => {
    fetchDetails();
  }, [params.description]);

  return (
    <div className="shoepage-container">
      <div className="shoepage-header">
        <img
          src="../SneakPeek-logos.jpeg"
          alt=""
          width="120"
          height="120"
        ></img>
        <div className="shoepage-header2">
          <h1>SneakPeek</h1>
          <Link to="/" className="search-button">
            Home
          </Link>
        </div>
      </div>

      <div className="divider">
        <hr className="solid"></hr>
      </div>
      <div className="shoe-display">
        {shoeInfo.map((shoe, i) => {
          if(i ===shoeInfo.length-1){return (
            <div key={shoe.data_instance_id}>
              <h1>{shoe.shoe_name}</h1>
              
              <h3>{shoe.description}</h3>
              
              
              <h3 className="colorway">{shoe.color_way}</h3>
              <p>Brand: {shoe.brand}</p>
              <p>Gender: {shoe.gender}</p>
              <img src={shoe.url} width="429" height="278" alt=""></img>
              <br></br>
              <br></br>
              <a href={'https://' + shoe.redirect_url} target="_blank" rel="noreferrer" className="search-button">
                StockX Link
              </a>
              
          
            </div>
          );}
        })}

        {goatShoeInfo.map((shoe, i) => {
          {if(i === 0) return (
            <div key={shoe.data_instance_id}>
              <br></br>
            <a href={'https://' + shoe.redirect_url} target="_blank" rel="noreferrer" className="search-button">
                GOAT Link
              </a>
              </div>
          );}
          })
        }
      </div>
      <div className="shoe-display">
        {shoeInfo.map((shoe, i) => {
          if(i ===shoeInfo.length-1){return (
            <div key={shoe.data_instance_id}>
              <h1> StockX Information</h1>
              <h3>Annual High</h3>
              <p>{shoe.annual_high}</p>
              <hr className="solid"></hr>
              <h3>Annual Low</h3>
              <p>{shoe.annual_low}</p>
              <hr className="solid"></hr>
              <h3>Lowest Asking Price</h3>
              <p>{shoe.lowest_asked}</p>
              <hr className="solid"></hr>
              <h3>Retail</h3>
              <p>{shoe.retail}</p>
              
            </div>
          );}
        })}
      </div>

      <div className="shoe-display">
        <h1>Goat Information</h1>
        <table className="table my-5">
          <thead>
            <tr>
              <th> Size </th>
              <th> Price </th>
            </tr>
          </thead>
          <tbody>
          {goatShoeInfo.map((shoe, i) => {
          if(i <25 ){return (
            <tr key={shoe.data_instance_id}>
                <td>Size: {shoe.size}</td>
                <td>${shoe.size_price}</td>
              </tr>
          );}
        }).sort()}
           
          </tbody>
        </table>
      </div>

      <div className="shoe-display">
            <h1 className="text-heading">
        GOAT Size Prices Chart
      </h1><ResponsiveContainer width="100%" aspect={3} >
          <LineChart data={goatShoeInfo} margin={{ right: 300 }}>
            <CartesianGrid />
            <XAxis dataKey='size' stroke="white"
              interval={'preserveStartEnd'} />
            <YAxis stroke="white">
            </YAxis>
            <Legend />
            <Tooltip />
            <Line dataKey="size_price"
              stroke="black" activeDot={{ r: 8 }} />
            
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="divider">
        <hr className="solid"></hr>
      </div>

      <Footer />
    </div>
  );
}


export default ShoeInfo;
