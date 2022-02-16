import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import airquality from './air-quality.png';


const API_KEY = process.env.REACT_APP_MAPBOX_API_KEY
mapboxgl.accessToken = API_KEY
const Map = () => {
  const mapContainerRef = useRef(null);

  var obj;

  const [lng, setLng] = useState(-111.9);
  const [lat, setLat] = useState(40.7);
  const [zoom, setZoom] = useState(10);

  const getLocationsList = () => {
    fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations?' + new URLSearchParams({
      country_id: 'US',
      city: 'Salt Lake City',
      limit: '5'
    }))
      .then(res => res.json())
      .then(data => obj = data)
      .then(() => console.log(obj)

    
      )
  } 

 


  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });

    var lngLats = [];
    const getLocationsList2 = () => {
      fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations?' + new URLSearchParams({
        country_id: 'US',
        city: 'Salt Lake City',
        limit: '5'
      }))
        .then(res => res.json())
        .then(data => obj = data)
        .then(() => {
          

          obj.results.map((id) => {


            lngLats.push(id.coordinates.longitude)
            lngLats.push(id.coordinates.latitude)

            console.log(lngLats)
            new mapboxgl.Marker().setLngLat(lngLats).addTo(map)   
            
            lngLats = []

          })



        }
        
      
        );
    } 

  
    getLocationsList2()
  

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="sidebarStyle">
        <img className="air-quality-image" src={airquality} alt="" />
        <h1 className="title">Salt Lake City Air Quality Control</h1>
        <hr className="rounded"></hr>
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className="map-container" ref={mapContainerRef} />
      <div ref = {getLocationsList}></div>
    </div>
  );
};

export default Map;
