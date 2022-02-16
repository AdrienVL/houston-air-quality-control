import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import airquality from './air-quality.png';


const API_KEY = process.env.REACT_APP_MAPBOX_API_KEY
mapboxgl.accessToken = API_KEY


// mapboxgl.accessToken = "pk.eyJ1IjoiYWRyaWVuLWxoZW1hbm4iLCJhIjoiY2t6b213ZTJwMnA0dzJ1cXJyNG0yMHdlbCJ9.kmta6IkpT9B7-4JWX6Lleg"

function App() {


// const [ setLocationsList ] = useState([]);
// const [ setLoading ] = useState(false);

  
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-111.9);
  const [lat, setLat] = useState(40.7);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  const getLocationsList = () => {
    // setLoading(true);
    fetch('https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/locations')
      .then(res => res.json())
      .then(res => {
        // setLocationsList(res.data);
        console.log(res)
        // setLoading(false);
      });
  }



  return (
    <div>
      <img className="air-quality-image" src={airquality} alt="" />
      <h1 className="title">Salt Lake City Air Quality Control</h1>
      <hr className="rounded"></hr>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
      <div ref = {getLocationsList}></div>
    </div>
  );
}
export default App;
