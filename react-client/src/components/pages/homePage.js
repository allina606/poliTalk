import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { GOOGLE_KEY } from "./keys.js";
import { dataRender } from "./civicAPI.js";
import Official from "./Official.js";
import 'tachyons';
// import CivicAPI from "./civicAPI.js";

let city = "";
let state = "";

class HomePage extends Component {

  constructor() {
    super();
    this.state = {
      data:{}
    };
  }

  civicAPI(event) {
    if (event.target.value.length != 5) {     //value user inserts
      this.setState({ data: [] });
      return (
        <div>
          <p>No Result</p>
        </div>
      );
    }
    /*Empty array of reps to be rendered*/
    dataRender.splice(0,dataRender.length);

    const url ="https://www.googleapis.com/civicinfo/v2/representatives?address=" +
    event.target.value +
    "&key=" + GOOGLE_KEY;

    console.log("URL", url);

    fetch(url, {
      mode: "cors",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      redirect: "follow",
      referrer: "no-referrer"
    })
    .then(response => {
      if (response.status === 200) {
        console.log("response ok");
        return response.json();
      }
      else {
        console.log("There was an error", response.status, response);        
        return response.json();
      }
    })
    .then(response => {
      this.setState({ data: response });
      /*Representative data*/
      var data = [];
      var office = [];      

      if(this.state.data.normalizedInput != null) {
        city = this.state.data.normalizedInput.city;
        state = this.state.data.normalizedInput.state;
    }

      // console.log(this.state.data);
      if(this.state.data.offices != null) {
        office = this.state.data.offices.map(obj => {
          let data = {
            name: obj.name,
            officialIndices: obj.officialIndices
          };
          return data;
        });
        console.log(office);
      }
      for (var key in this.state.data.officials) {
        data.push(this.state.data.officials[key]);
      }
      //Add Office to data
      for(let j = 0; j < office.length; j++) {
        console.log("office", office[j].name, office[j].officialIndices);
        for(let idx of office[j].officialIndices){
          console.log("idx", idx);
          data[idx].office = [];
          data[idx].office.push(office[j].name);
        }
      }

      /* Remove irrelevant representatives*/
      let removeOffice = ['President of the United States', 'Vice-President of the United States', 'United States Senate'];
      data = data.filter(obj => {
        console.log("Filter", "office", obj.office);
        if(removeOffice.indexOf(obj.office[0]) === -1) {
          console.log("index now found");
          return obj;
        }
      });
      
      /*Checks data by login to console*/
      console.log("rep", data);
      console.log("offices", office.length, "rep", data.length);

      /*Add data to be rendered*/
      for (var i = 0; i < data.length; i++) {
        /*Check if rep has a photo, if not place photo-holder*/
        let photoExists = typeof data[i].photoUrl !== 'undefined' ? true : false;
        if(!photoExists) {
          data[i].photoUrl = 'https://www.redrockmtg.com/uploads/sites/2338/public/ForMissingHeadshotsVelma_6.png';        
        }
        dataRender.push(<Official key={i} name={data[i].name} party={data[i].party} image={data[i].photoUrl} office={data[i].office} />);
      }
    });
  }

  render() {
    return (
      <div className="container items-center">
        <div className="flex flex-wrap justify-between items-center">
          <div className="row">
            <div className="col bigText1">
              Want to vote but don't <br />
              know where to start? <br />
              View your <span className="highlight">representative</span>!<br />                       
            </div>
          </div> 
          <img className="o-50" src="https://www.swansonreed.com/wp-content/uploads/2015/02/map-usa-s.png" width="560px" height="320px" />
        </div>
        <div className="flex justify-center bigText2 mt5">              
          <p>Enter zip code: <br /></p>
          <input
            onChange={e => this.civicAPI(e)}
            type = "text"
            placeholder="zip code"
            className="text-center fr ml3"
          />
          <Link className="arrow flex fn justify-center" to="/representatives"><img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-arrow-forward-512.png" height="50" width="50"/></Link>                    
        </div>
      </div>        
    )
  }
}

export default HomePage;
export {dataRender};
export {city}
export {state};
