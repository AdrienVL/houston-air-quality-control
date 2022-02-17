import React, { useRef, useEffect, useState } from 'react';
import {Dropdown } from 'react-dropdown-now'
import 'react-dropdown-now/style.css';
import mapboxgl from 'mapbox-gl';
import airquality from './air-quality.png';
import 'reactjs-popup/dist/index.css';
import Popup from './components/popups';

//FIX: Measurements being called on spawn


const API_KEY = process.env.REACT_APP_MAPBOX_API_KEY
mapboxgl.accessToken = API_KEY

const App = () => {

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
              console.log("fails")
              lngLats.push(id.bounds[0]) //longitdue
              lngLats.push(id.bounds[1]) //latitude
            }else{
              console.log("success")
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
            
            markerDiv.addEventListener('mouseenter', () => marker.togglePopup());
            markerDiv.addEventListener('mouseleave', () => marker.togglePopup());
            markerDiv.addEventListener('click', () => setLocationId(id.id));

                     
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



  useEffect(() => {

    var apiParameters
    var obj

    const getMeasurementsList = (value) => {

      apiParameters = {
        location_id: value
      }

      fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/measurements?' + new URLSearchParams(apiParameters))
        .then(res => res.json())
        .then(data => obj = data)
        .then(() => {

          console.log("MEASUREMENT PRINTING:", obj.results)
          setIsOpen(!isOpen);

          
        })
    }

    console.log(locationId)

    if (locationId !== ""){

    getMeasurementsList(locationId)

    }


  }, [locationId]);

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
        <b>Design your Popup</b>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <button>Test button</button>
      </>}
      handleClose={toggleMeasurementView}
    />}
  </div>
    </div>
  );
};

export default App;



// Consider situations where you want to update a component’s data (i.e., its state variables) to trigger a render in order to update the UI. You could also have situations where you want the same behavior with one exception: you do not want to trigger a render cycle because this could lead to bugs, awkward user experience (e.g., flickers), or performance problems.