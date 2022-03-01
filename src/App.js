import React, { useRef, useEffect, useState } from 'react';
import {Dropdown } from 'react-dropdown-now'
import 'react-dropdown-now/style.css';
import mapboxgl from 'mapbox-gl';
import 'reactjs-popup/dist/index.css';
import Popup from './components/Popup';
import Header from './components/Header'
import {  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Legend, Bar } from 'recharts';


const accessToken = process.env.REACT_APP_API_KEY
mapboxgl.accessToken = accessToken

const App = () => {

  const mapContainer = useRef(null);
  const map = useRef(null);


  //State Definitions
  const [entity, setEntity] = useState("")
  const [name, setName] = useState("")
  const [source, setSource] = useState("")
  const [count, setCount] = useState("")
  const [markers, setMarkers] = useState([])
  const [displayName, setDisplayName] = useState("")
  const [popupIsOpen, setpopupIsOpen] = useState(false);
  const [locationType, setlocationType] = useState("")
  const [lng, setLng] = useState(-95.3);
  const [lat, setLat] = useState(29.7);
  const [zoom, setZoom] = useState(10);
  const [measurementsState, setMeasurementsState] = useState([{}])
  const [limit, setLimit] = useState(100)


  //Separate Components for Map, Marker (has its own useeffect). Create parent components (ex., API Parameters, map, marker) - Pass through Props

  //To-DO: 
  //1. Effect - Re-rendering map unnecessarily
  //2. const setLocationID (locationID)

  // useEffect(() => {

  //Map is being defined in return statement -> Marker object



  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [lng, lat],
    zoom: zoom
    });
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

  });

  useEffect(() => {

    if (!map.current) return; 
    map.current.on('move', () => {
      console.log("moving")
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));

    });
  });

  useEffect(() => {

    console.log(markers)
    if (markers !== []) {
      for (var i = markers.length - 1; i >= 0; i--) {
        markers[i].remove();

      }
    }
  }, [locationType]);


  useEffect(() => { 



    // if (!map.current) return; // wait for map to initialize

    var apiParameters = {};
    var markerColor;
    var lngLats = [];



    //When Location type gets changes, getLocationList gets called
    const getLocationsList = (location) => {


      
      //handling location type
      if (location.value === 'All Locations' || typeof location.value === 'undefined') {
        apiParameters = {
        country_id: 'US',
        city: 'Houston',
        limit: [limit]}
  
      } else{
  
        apiParameters = {
          country_id: 'US',
          city: 'Houston',
          limit: [limit],
          entity: location.value
        }
      }


      //Getting all locations for set parameters
      fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations?' + new URLSearchParams(apiParameters))
        .then(res => res.json())
        .then(data => {
          
          //Iterate over each location
          data.results.map((id) => {



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
              markerColor = 'red'
            } else if (id.entity === 'research'){
              markerColor = 'green'
            } else{
              markerColor = 'blue'
            }

            //Define Marker on map for each location
            let marker = new mapboxgl.Marker({color: markerColor}).setLngLat(lngLats).addTo(map.current) 
            markers.push(marker);





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

    getLocationsList(locationType)


    // Clean up on unmount

  }, [locationType, limit]); 

  const getMeasurementsByCoordinates = (coordinates) => {

    var apiParameters
    var measurements = []

    apiParameters = {
      coordinates: coordinates
    }


    //Fetch measurements from same air quality source coordinates
    fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/measurements?' + new URLSearchParams(apiParameters))
      .then(res => res.json())
      .then(data =>  {

        data.results.map((i) =>{measurements.unshift({name: i.date.utc.slice(0,10), value: i.value})})
        //Set measurements for graphs
        setMeasurementsState(measurements);
        //Handles popup
         setpopupIsOpen(!popupIsOpen);})
  }


  //Save parent location data for location and measurement popup display
  const getLocationByCoordinates = (coordinates) => {

    var apiParameters;

    apiParameters = {
      coordinates: coordinates,
    limit: 1}

      fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations?' + new URLSearchParams(apiParameters))
      .then(res => res.json())
      .then(data => {


        setEntity(data.results[0].entity);
        setName(data.results[0].name);
        setSource(data.results[0].sources[0].id);
        setCount(data.results[0].parameters[0].count + ' ' + data.results[0].parameters[0].unit);
        setDisplayName(data.results[0].parameters[0].displayName);
        
      })

  }

  //Toggle Handling
  const toggleMeasurementView = () => {
    console.log(popupIsOpen)
    setpopupIsOpen(!popupIsOpen);
  }

  const handleChange = (event) => {
    setLimit(event.target.value);
  }


  //JSX Rendering
  return (
    <div>
      <Header/>
      <div>
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div className="dropdown">
        <Dropdown
          placeholder="All Locations"
          options={["All Locations", 'government', 'research', 'community']}
          locationType="Filter by location type"
          onChange={(locationType) => console.log('change!', locationType)}
          onSelect={(location) => setlocationType(location)}
          onClose={(closedBySelection) => console.log('closedBySelection?:', closedBySelection)}
          onOpen={() => console.log('open!')}
        />
      </div>
      <input type="text" onChange={handleChange} placeholder="Set Marker Limit..."/>
      <div className="map-container" ref={mapContainer} />
    <div>
    {popupIsOpen && <Popup
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





