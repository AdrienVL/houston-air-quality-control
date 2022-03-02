import React, { useRef, useEffect, useState } from 'react';
import {Dropdown } from 'react-dropdown-now'
import 'react-dropdown-now/style.css';
import mapboxgl from 'mapbox-gl';
import 'reactjs-popup/dist/index.css';
import MeasurementView from './components/MeasurementView';
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
  const [average, setAverage] = useState("")
  const [units, setUnits] = useState("")
  const [markers] = useState([])
  const [displayName, setDisplayName] = useState("")
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [locationType, setlocationType] = useState("")
  const [lng, setLng] = useState(-95.3);
  const [lat, setLat] = useState(29.7);
  const [zoom, setZoom] = useState(10);
  const [measurementsState, setMeasurementsState] = useState([{}])
  const [limit, setLimit] = useState(100)


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

    if (!map.current) return; //Map is initialized
    map.current.on('move', () => {
      console.log("moving")
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));

    });

    //Clear markers after location selection or limit change
    if (markers !== []) {
      for (var i = markers.length - 1; i >= 0; i--) {
        markers[i].remove();

      }
    }
    //Value -> Value of dropdown value. Ex. 'Government'
    getLocationsList(locationType.value)

  }, [locationType, limit]); 

  //When Location type gets changes, getLocationList gets called
  const getLocationsList = (location) => {

    var apiParameters = {};
    var markerColor;
    var lngLats = [];
    var htmlString

    //handling location type
    if (location === 'All Locations' || typeof location === 'undefined') {
      apiParameters = {
      country_id: 'US',
      city: 'Houston',
      limit: [limit]}

    } else{

      apiParameters = {
        country_id: 'US',
        city: 'Houston',
        limit: [limit],
        entity: location
      }
    }

    //Getting all locations for set parameters
    fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations?' + new URLSearchParams(apiParameters))
      .then(res => res.json())
      .then(data => {
        
        //Iterate over each location
        data.results.map((id) => {

          //Handling differences in JSON obj coordinate field definitions (bounds not coordinates)
          if (typeof id.coordinates == 'undefined'){
            lngLats.push(id.bounds[0]) //longitdue
            lngLats.push(id.bounds[1]) //latitude


            htmlString = '<h3>Location Type: ' + id.entity + '</h3>' + '<h4>Name: ' + id.sources[0].name + '</h4>' + '</h3>' + '<h4>Source: ' + id.sources[0].id + '</h4>' + '</h3>' + '<h4>Average: ' + roundUp(id.parameters[0].average,4) + ' ' + id.parameters[0].unit + '</h4>' + '</h3>' + '<h4>Display Name: ' + id.parameters[0].displayName + '</h4>'

          }else{
            lngLats.push(id.coordinates.longitude)
            lngLats.push(id.coordinates.latitude)

            setUnits(id.parameters[0].unit)
            htmlString = '<h3>Location Type: ' + id.entity + '</h3>' + '<h4>Name: ' + id.name + '</h4>' + '</h3>' + '<h4>Source: ' + id.sources[0].id + '</h4>' + '</h3>' + '<h4>Average: ' + roundUp(id.parameters[0].average,4) + ' ' + id.parameters[0].unit + '</h4>' + '</h3>' + '<h4>Display Name: ' + id.parameters[0].displayName + '</h4>'

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
          ).setHTML(htmlString)

          // add popup to marker
          marker.setPopup(popup);

          //Returns marker HTML
          const markerDiv = marker.getElement();

          //Marker Event Listeners - Hovering for popups
          markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
          markerDiv.addEventListener('mouseleave', () => marker.togglePopup());
          //Click on markers ]fetches location and measurements (using coordinates)
          markerDiv.addEventListener('click', () => getLocationByCoordinates(marker.getLngLat().lat + "," + marker.getLngLat().lng))
          markerDiv.addEventListener('click', () => getMeasurementsByCoordinates(marker.getLngLat().lat + "," + marker.getLngLat().lng))

          //reset - for mapping
          lngLats = []
    
        })
      });
  } 

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


        data.results.map((i) =>{
          const actualDate = i.date.utc.slice(0,10)
          measurements.unshift({time: actualDate, value: i.value})})
        //Set measurements for graphs
        setMeasurementsState(measurements);
        //Handles popup
         setPopupIsOpen(!popupIsOpen);})
  }


  //Save parent location data for location and measurement popup display
  const getLocationByCoordinates = (coordinates) => {

    var apiParameters;

    apiParameters = {
      coordinates: coordinates,
    limit: 1} //Looing for location information from first response

      fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations?' + new URLSearchParams(apiParameters))
      .then(res => res.json())
      .then(data => {

        setEntity(data.results[0].entity);
        setName(data.results[0].name);
        setSource(data.results[0].sources[0].id);
        setAverage(roundUp(data.results[0].parameters[0].average,4) + ' ' + data.results[0].parameters[0].unit);
        setDisplayName(data.results[0].parameters[0].displayName);
        
      })

  }

  //Toggle Handling
  const toggleMeasurementView = () => {
    console.log(popupIsOpen)
    setPopupIsOpen(!popupIsOpen);
  }

  const handleChange = (event) => {
    setLimit(event.target.value);
  }

  //function definition for rounding average ppm values
  function roundUp(num, precision) {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
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
    {popupIsOpen && <MeasurementView
      content={<>
        <h1>Air Quality Measurements</h1>
        <b>Location Summary</b>
        <p>Entity: {entity}</p>
        <p>Name: {name}</p>
        <p>Source: {source}</p>
        <p>Average: {average}</p>
        <p>Display Name: {displayName}</p>
        <b>Location Measurements - TimeSeries ({units} over time)</b>
        <LineChart width={1500} height={600} data={measurementsState} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="time"
          />
          <YAxis dataKey="value"
          />
        <Tooltip />
        </LineChart>
        <b>Location Measurements - Barchart ({units} per day)</b>
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
          <XAxis dataKey="time" />
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





