"use client"
import React, { Component } from "react";
import Map from "../../components/Map";

function getCurrentLocation(): Promise<{ latitude: number, longitude: number }> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

class MapTransit extends Component<{}, { latitude: number | null, longitude: number | null }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
    };
  }

  componentDidMount() {
    getCurrentLocation()
      .then((location) => {
        this.setState({
          latitude: location.latitude,
          longitude: location.longitude,
        });
      })
      .catch((error) => {
        console.error("Error getting location: ", error);
      });
  }

  render() {

    const { latitude, longitude } = this.state;

    return (
      <div>
        {latitude !== null && longitude !== null ? (
          <Map latitude={latitude} longitude={longitude} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
}

export default MapTransit;