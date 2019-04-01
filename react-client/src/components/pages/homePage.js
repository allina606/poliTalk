import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { GOOGLE_KEY } from "./keys.js";
import { dataRender } from "./civicAPI.js";

function Official(props) {
  return (
    <div class="row">
      <img class="col-6" src={props.image} alt="<No image>" height="100" width="100" />
      <div class="col-6">
        <p>Candidate : {props.name}</p>
        <p>Party: {props.party}</p>
        <p>Office(s): {props.office}</p>
      </div>
      <hr />
    </div>
  );
}

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      data:{}
    };
  }

  civicAPI(event) {
    if (event.target.value.length != 5) {
      this.setState({ data: [] });
      return (
        <div>
          <p>No Result</p>
        </div>
      );
    }

    const url ="https://www.googleapis.com/civicinfo/v2/representatives?address=" +
    event.target.value +
    "&key=" + GOOGLE_KEY;

    fetch(url, {
      mode: "cors",
      credentials: "same-origin",
      headers: {
        "Content-Tyle": "application/json; charset=utf-8"
      },
      redirect: "follow",
      referrer: "no-referrer"
    })
    .then(response => {
      if (response.status === 200) {
        console.log("response ok");
        return response.json();
      }
      else console.log("There was an error");
    })
    .then(response => {
      this.setState({ data: response });
    });
  }

  render() {
    var data = [];
    var office = [];
    console.log(this.state.data);

    //Get offices from JSON
    if(this.state.data.offices != null) {
      office = this.state.data.offices.map(obj => {
        let data = {
          name: obj.name,
          officialIndices: obj.officialIndices
        };
        return data;
      });
    }

    //Get Representative data from JSON
    for (var key in this.state.data.officials) {
      data.push(this.state.data.officials[key]);
    }

    //Add Office data to Representative data
    for(let j = 0; j < office.length; j++) {
      for(let idx of office[j].officialIndices){
        data[idx].office = [];
        data[idx].office.push(office[j].name);
      }
    }

    for (var i = 0; i < data.length; i++) {
      dataRender.push(<Official key={i} name={data[i].name} party={data[i].party} image={data[i].photoUrl} office={data[i].office} />);
    }

    return (
        <div className="container">
          <div className="row">
            <div className="bigText1">
              Want to vote but don't <br />
              know where to start? <br />
              <p className="bigText2">
                View your representative! <br />
                Enter zip code: <br />
                <input
                  onChange={e => this.civicAPI(e)}
                  type = "text"
                  placeholder="zip code"
                  className="text-center"
                />
                <Link className="button" to="/representatives">Submit</Link>
              </p>
            </div>
          </div>
        </div>
    )
  }
}

export default HomePage;
export {dataRender};
