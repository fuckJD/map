/* eslint-disable no-undef */
import React, { Component } from 'react'
import './App.css'
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'
import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer'
import axios from 'axios'

const MyMapComponent = withScriptjs(withGoogleMap((props) => {
    let points = []
    if (props.data.length > 0) {
      points = props.data.map((item) => {
        return new google.maps.LatLng(item.location.lat, item.location.lng)
      })
    }
    return (
      <GoogleMap
        defaultZoom={5}
        defaultCenter={{ lat: 39.8401204, lng: 116.5900514 }}
        mapTypeId={'hybrid'}
      >
        <HeatmapLayer
          data={points}
        ></HeatmapLayer>
      </GoogleMap>
    )
  }
))

class App extends Component {
  constructor (e) {
    super(e)
    this.state = {
      points: [
        {
          'autor': '',
          'describe': '',
          'location': {
            'lat': 39.8401204,
            'lng': 116.5900514
          }
        }
      ]
    }
  }

  componentDidMount () {
    axios.get(
      './data/points.json'
    )
      .then(res => {
        const points = res.data.list
        console.log(points)
        this.setState({ list: points })
      })
  }

  render () {
    return (
      <div className="App">
        <MyMapComponent
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA8f78kK64cbZIt1C23qW5bH0-iUbSi2bM&libraries=visualization"
          data={this.state.list}
          loadingElement={<div style={{ height: `100%` }}/>}
          containerElement={<div style={{ height: `1000px` }}/>}
          mapElement={<div style={{ height: `100%` }}/>}
        >
        </MyMapComponent>
      </div>
    )
  }
}

export default App
