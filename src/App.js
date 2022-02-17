import React, { useRef, useEffect, useState } from 'react';
import {Dropdown } from 'react-dropdown-now'
import 'react-dropdown-now/style.css';
import mapboxgl from 'mapbox-gl';
import airquality from './air-quality.png';


const API_KEY = process.env.REACT_APP_MAPBOX_API_KEY
mapboxgl.accessToken = API_KEY

const App = () => {

  const mapContainerRef = useRef(null);

  var obj;
  var locationType;
  var apiParameters = {};

  const [newValue, setNewValue] = useState("")
  const [lng, setLng] = useState(-95.3);
  const [lat, setLat] = useState(29.7);
  const [zoom, setZoom] = useState(10);


  // Initialize map when component mounts
  useEffect(() => { 

    console.log("Inside effect")
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });


    var lngLats = [];
    const getLocationsList = (value) => {

      console.log("value.value", value.value)

      if (value.value === 'All Locations' || typeof value.value === 'undefined') {

        console.log("All locations")

        apiParameters = {
        country_id: 'US',
        city: 'Houston',
        limit: '30'}
  
      } else{
  
        locationType = value.value
        console.log("Location Type: ", locationType)
  
        apiParameters = {
          country_id: 'US',
          city: 'Houston',
          limit: '30',
          entity: locationType
        }
      }



      fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations?' + new URLSearchParams(apiParameters))
        .then(res => res.json())
        .then(data => obj = data)
        .then(() => {
          

          obj.results.map((id) => {

            if (typeof id.coordinates == 'undefined'){
              console.log("fails")
              lngLats.push(id.bounds[0]) //longitdue
              lngLats.push(id.bounds[1]) //latitude
            }else{
              console.log("success")
              lngLats.push(id.coordinates.longitude)
              lngLats.push(id.coordinates.latitude)
            }

            let marker = new mapboxgl.Marker().setLngLat(lngLats).addTo(map)  

            // var popup = new mapboxgl.Popup(
            //   {offset:[28, 0]}
            // ).setText("Location Type: " + id.entity + ". Name: " + id.name + ". Source: " + id.sources[0].id + ". Count : " + id.parameters[0].count + ". Unit: " + id.parameters[0].unit

            // );

            // // add popup to marker
            // marker.setPopup(popup);

            var popup = new mapboxgl.Popup(
              {
              closeButton: false,
            closeonClick: false}
            ).setText("Location Type: " + id.entity + ". Name: " + id.name + ". Source: " + id.sources[0].id + ". Count : " + id.parameters[0].count + ". Unit: " + id.parameters[0].unit );


            // add popup to marker
            marker.setPopup(popup);


            
            const markerDiv = marker.getElement();
            
            markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
            markerDiv.addEventListener('mouseleave', () => marker.togglePopup());
                     

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
  }, [newValue]); // eslint-disable-line react-hooks/exhaustive-deps

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
      {/* <div ref = {getLocationsList}></div> */}
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

    </div>
  );
};

export default App;
