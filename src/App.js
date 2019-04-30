/* eslint-disable no-undef */
import React, { Component } from 'react'
import './App.css'
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps'
import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer'
import axios from 'axios'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

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
      list: []
    }
  }

  componentDidMount () {
    axios.get(
      './data/points.json'
    )
      .then(res => {
        const points = res.data.list
        this.setState({ list: points })
      })
  }

  renderCardItem (item) {
    console.log(item)
    return (
      <Card style={{ marginBottom: '20px' }}>
        <CardContent>
          <Typography component="p" style={{ textAlign: 'left', fontSize: '18px'  }}>
            事件：<a href={item.link}>{item.describe}</a>
            <br/>
          </Typography>
          <Typography component="p" style={{ textAlign: 'left', fontSize: '14px'  }}>
            happened: {item.time}
            <br/>
          </Typography>
          <Typography style={{ textAlign: 'right', fontSize: '14px' }} color="textSecondary" gutterBottom>
            贡献者{item.autor}
          </Typography>
        </CardContent>
      </Card>
    )
  }

  render () {
    return (
      <div className="App">
        <div style={{ width: `74%`, height: `100%` }}>
          <MyMapComponent
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA8f78kK64cbZIt1C23qW5bH0-iUbSi2bM&libraries=visualization"
            data={this.state.list}
            loadingElement={<div style={{ height: `100%` }}/>}
            containerElement={<div style={{ height: `1000px` }}/>}
            mapElement={<div style={{ height: `100%` }}/>}
          >
          </MyMapComponent>
        </div>
        <div style={{ width: `30%`, margin: `3%` }}>
          {
            this.state.list.map((item) => {
              return this.renderCardItem(item)
            })
          }
        </div>
      </div>
    )
  }
}

export default App
