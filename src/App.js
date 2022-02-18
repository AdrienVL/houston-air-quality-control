import React, { useRef, useEffect, useState } from 'react';
import {Dropdown } from 'react-dropdown-now'
import 'react-dropdown-now/style.css';
import mapboxgl from 'mapbox-gl';
import airquality from './air-quality.png';
import 'reactjs-popup/dist/index.css';
import Popup from './components/popups';
import { LineChart, Line } from 'recharts';


const API_KEY = process.env.REACT_APP_MAPBOX_API_KEY
mapboxgl.accessToken = API_KEY

const App = () => {

  // ).setHTML('<h3>Location Type: ' + id.entity + '</h3>' + '<h4>Name: ' + id.name + '</h4>' + '</h3>' + '<h4>Source: ' + id.sources[0].id + '</h4>' + '</h3>' + '<h4>Count: ' + id.parameters[0].count + ' ' + id.parameters[0].unit + '</h4>' + '</h3>' + '<h4>Display Name: ' + id.parameters[0].displayName + '</h4>')


  const [entity, setEntity] = useState("")
  const [name, setName] = useState("")
  const [source, setSource] = useState("")
  const [count, setCount] = useState("")
  const [displayName, setDisplayName] = useState("")
  const mapContainerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [newValue, setNewValue] = useState("")
  const [locationId, setLocationId] = useState("")
  const [lng, setLng] = useState(-95.3);
  const [lat, setLat] = useState(29.7);
  const [zoom, setZoom] = useState(10);




  // Initialize map when component mounts
  useEffect(() => { 

    var obj;
    var locationType;
    var apiParameters = {};
    var locationColor
    var coordinates
  

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });


    var lngLats = [];
    const getLocationsList = (value) => {


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



      fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations?' + new URLSearchParams(apiParameters))
        .then(res => res.json())
        .then(data => obj = data)
        .then(() => {
          

          obj.results.map((id) => {

            if (typeof id.coordinates == 'undefined'){
              lngLats.push(id.bounds[0]) //longitdue
              lngLats.push(id.bounds[1]) //latitude
            }else{
              lngLats.push(id.coordinates.longitude)
              lngLats.push(id.coordinates.latitude)
            }

            if (id.entity === 'government'){
              locationColor = 'red'
            } else if (id.entity === 'research'){
              locationColor = 'green'
            } else{
              locationColor = 'blue'
            }

            let marker = new mapboxgl.Marker({color: locationColor}).setLngLat(lngLats).addTo(map)  


            var popup = new mapboxgl.Popup(
              {
              closeButton: false,
            closeonClick: false}
            ).setHTML('<h3>Location Type: ' + id.entity + '</h3>' + '<h4>Name: ' + id.name + '</h4>' + '</h3>' + '<h4>Source: ' + id.sources[0].id + '</h4>' + '</h3>' + '<h4>Count: ' + id.parameters[0].count + ' ' + id.parameters[0].unit + '</h4>' + '</h3>' + '<h4>Display Name: ' + id.parameters[0].displayName + '</h4>')

            // add popup to marker
            marker.setPopup(popup);

      
            const markerDiv = marker.getElement();


            lngLats = []

   



            //MARKER UNIQUE IDENTIFIER IS LONG AND LAT -> Therefore I need 
            markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
            markerDiv.addEventListener('mouseleave', () => marker.togglePopup());
            markerDiv.addEventListener('click', () => getLocationByCoordinates(marker.getLngLat().lat + "," + marker.getLngLat().lng))
            markerDiv.addEventListener('click', () => getMeasurementsByCoordinates(marker.getLngLat().lat + "," + marker.getLngLat().lng))

            
         

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
  }, [newValue]); // eslint-disable-line react-hooks/exhaustive-deps







  const getMeasurementsByCoordinates = (coordinates) => {

    var apiParameters
    var obj

    apiParameters = {
      coordinates: coordinates
    }

    fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/measurements?' + new URLSearchParams(apiParameters))
      .then(res => res.json())
      .then(data => obj = data)
      .then(() => {

        console.log("MEASUREMENT PRINTING:", obj.results)
        setIsOpen(!isOpen);

        
      })
  }




  const getLocationByCoordinates = (coordinates) => {

    var apiParameters;
    var obj;

    console.log("Coordinates,", coordinates)


    apiParameters = {
      coordinates: coordinates,
    limit: 1}

      fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations?' + new URLSearchParams(apiParameters))
      .then(res => res.json())
      .then(data => obj = data)
      .then(() => {

        console.log("fetch call :", obj.results)


        setLocationId(obj.results[0].locationId);
        setEntity(obj.results[0].entity);
        setName(obj.results[0].name);
        setSource(obj.results[0].sources[0].id);
        setCount(obj.results[0].parameters[0].count + ' ' + obj.results[0].parameters[0].unit);
        setDisplayName(obj.results[0].parameters[0].displayName);

        
      })

  }

  const toggleMeasurementView = () => {
    console.log(isOpen)
    setIsOpen(!isOpen);
  }
  

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
      <div className="map-container" ref={mapContainerRef} />
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
        <b>Location Measurements</b>
      </>}
      handleClose={toggleMeasurementView}
    />}
  </div>
    </div>
  );
};

export default App;



// Consider situations where you want to update a component’s data (i.e., its state variables) to trigger a render in order to update the UI. You could also have situations where you want the same behavior with one exception: you do not want to trigger a render cycle because this could lead to bugs, awkward user experience (e.g., flickers), or performance problems.