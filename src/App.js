import React, { useRef, useEffect, useState } from 'react';
import {Dropdown } from 'react-dropdown-now'
import 'react-dropdown-now/style.css';
import mapboxgl from 'mapbox-gl';
import airquality from './air-quality.png';
import 'reactjs-popup/dist/index.css';
import Popup from './components/popups';
import {  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Legend, Bar} from 'recharts';


mapboxgl.accessToken = "pk.eyJ1IjoiYWRyaWVuLWxoZW1hbm4iLCJhIjoiY2t6b213ZTJwMnA0dzJ1cXJyNG0yMHdlbCJ9.kmta6IkpT9B7-4JWX6Lleg"

const App = () => {

  
  const mapContainerRef = useRef(null);

  //State Definitions
  const [entity, setEntity] = useState("")
  const [name, setName] = useState("")
  const [source, setSource] = useState("")
  const [count, setCount] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [isOpen, setIsOpen] = useState(false);
  const [newValue, setNewValue] = useState("")
  const [lng, setLng] = useState(-95.3);
  const [lat, setLat] = useState(29.7);
  const [zoom, setZoom] = useState(10);
  const [measurementsState, setMeasurementsState] = useState([{}])

  // Initialize map when component mounts
  useEffect(() => { 

    var obj;
    var locationType;
    var apiParameters = {};
    var locationColor
  
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });


    var lngLats = [];

    //When Location type gets changes, getLocationList gets called
    const getLocationsList = (value) => {

      //handling location type
      if (value.value === 'All Locations' || typeof value.value === 'undefined') {
        apiParameters = {
        country_id: 'US',
        city: 'Houston',
        limit: '200'}
  
      } else{
  
        locationType = value.value
        console.log("Location Type: ", locationType)
  
        apiParameters = {
          country_id: 'US',
          city: 'Houston',
          limit: '200',
          entity: locationType
        }
      }


      //Getting all locations for set parameters
      fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations?' + new URLSearchParams(apiParameters))
        .then(res => res.json())
        .then(data => obj = data)
        .then(() => {
          

          //Iterate over each location
          obj.results.map((id) => {

            //Handling differences in JSON obj coordinate field definitions
            if (typeof id.coordinates == 'undefined'){
              lngLats.push(id.bounds[0]) //longitdue
              lngLats.push(id.bounds[1]) //latitude
            }else{
              lngLats.push(id.coordinates.longitude)
              lngLats.push(id.coordinates.latitude)
            }

            //Assign marker color by location type
            if (id.entity === 'government'){
              locationColor = 'red'
            } else if (id.entity === 'research'){
              locationColor = 'green'
            } else{
              locationColor = 'blue'
            }

            //Define Marker on map for each location
            let marker = new mapboxgl.Marker({color: locationColor}).setLngLat(lngLats).addTo(map)  


            //Associate location data to marker popup
            var popup = new mapboxgl.Popup(
              {
              closeButton: false,
            closeonClick: false}
            ).setHTML('<h3>Location Type: ' + id.entity + '</h3>' + '<h4>Name: ' + id.name + '</h4>' + '</h3>' + '<h4>Source: ' + id.sources[0].id + '</h4>' + '</h3>' + '<h4>Count: ' + id.parameters[0].count + ' ' + id.parameters[0].unit + '</h4>' + '</h3>' + '<h4>Display Name: ' + id.parameters[0].displayName + '</h4>')

            // add popup to marker
            marker.setPopup(popup);

            const markerDiv = marker.getElement();



           //Marker Event Listeners - Hovering for popups
            markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
            markerDiv.addEventListener('mouseleave', () => marker.togglePopup());
            //Click on markers ]fetches location and measurements (using coordinates as unique identifier)
            markerDiv.addEventListener('click', () => getLocationByCoordinates(marker.getLngLat().lat + "," + marker.getLngLat().lng))
            markerDiv.addEventListener('click', () => getMeasurementsByCoordinates(marker.getLngLat().lat + "," + marker.getLngLat().lng))

            //reset - for mapping
            lngLats = []


            
          })
        });
    } 
  
    getLocationsList(newValue)

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('move', () => {

      console.log("moving")
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));

    });


    // Clean up on unmount
    return () => map.remove();
  }, [newValue]); 


  const getMeasurementsByCoordinates = (coordinates) => {

    var apiParameters
    var obj
    var measurements = []

    apiParameters = {
      coordinates: coordinates
    }


    //Fetch measurements from same air quality source coordinates
    fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/measurements?' + new URLSearchParams(apiParameters))
      .then(res => res.json())
      .then(data => obj = data)
      .then(() => {

        obj.results.map((i) =>{measurements.unshift({name: i.date.utc.slice(0,10), value: i.value})})
        //Set measurements for graphs
        setMeasurementsState(measurements);
        //Handles popup
         setIsOpen(!isOpen);})
  }


  //Save parent location data for location and measurement popup display
  const getLocationByCoordinates = (coordinates) => {

    var apiParameters;
    var obj;

    apiParameters = {
      coordinates: coordinates,
    limit: 1}

      fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations?' + new URLSearchParams(apiParameters))
      .then(res => res.json())
      .then(data => obj = data)
      .then(() => {


        setEntity(obj.results[0].entity);
        setName(obj.results[0].name);
        setSource(obj.results[0].sources[0].id);
        setCount(obj.results[0].parameters[0].count + ' ' + obj.results[0].parameters[0].unit);
        setDisplayName(obj.results[0].parameters[0].displayName);
        
      })

  }

  //Toggle Handling
  const toggleMeasurementView = () => {
    console.log(isOpen)
    setIsOpen(!isOpen);
  }

  //JSX Rendering
  return (
    <div>
      <div className="sidebarStyle">
        <img className="air-quality-image" src={airquality} alt="" />
        <h1 className="title">Houston Air Quality Control</h1>
        <hr className="rounded"></hr>
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className="dropdown">
        <Dropdown
          placeholder="All Locations"
          options={["All Locations", 'government', 'research', 'community']}
          value="Filter by location type"
          onChange={(value) => console.log('change!', value)}
          onSelect={(value) => setNewValue(value)}
          onClose={(closedBySelection) => console.log('closedBySelection?:', closedBySelection)}
          onOpen={() => console.log('open!')}
        />
      </div>
      <div className="map-container" ref={mapContainerRef} />
      <div>
    {isOpen && <Popup
      content={<>
        <h1>Air Quality Measurements</h1>
        <b>Location Summary</b>
        <p>Entity: {entity}</p>
        <p>Name: {name}</p>
        <p>Source: {source}</p>
        <p>Count: {count}</p>
        <p>Display Name: {displayName}</p>
        <b>Location Measurements - TimeSeries (PPM over time)</b>
        <LineChart width={1500} height={600} data={measurementsState} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="name"
          />
          <YAxis dataeky="value"
          />
        <Tooltip />
        </LineChart>
        <b>Location Measurements - Barchart (PPM per day)</b>
        <BarChart
          width={1500}
          height={1600}
          data={measurementsState}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </>}
      handleClose={toggleMeasurementView}
    />}
  </div>
    </div>
  );
};

export default App;





