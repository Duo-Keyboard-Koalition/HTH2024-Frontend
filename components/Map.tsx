"use client";
import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import * as XLSX from "xlsx";
import "./Map.css"; // Import the CSS file
import axios from "axios";

interface LatLong {
  latitude: number;
  longitude: number;
}

export default function Map({ latitude, longitude }: LatLong) {
  const mapRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: "weekly",
      });
      const { Map } = await loader.importLibrary("maps");
      const markerLibrary = await loader.importLibrary(
        "marker"
      ) as google.maps.MarkerLibrary;
      const position = { lat: latitude, lng: longitude };
      const mapOptions: google.maps.MapOptions = {
        center: position,
        zoom: 12,
        mapId: "MAP_ID",
      };
      const map = new Map(mapRef.current as HTMLElement, mapOptions);

      // Create a custom pin marker for the user's position
      const userPin = document.createElement("div");
      userPin.innerHTML = `
        <svg width="15" height="20" viewBox="0 0 20 30" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0C16.6 0 20 5.4 20 10C20 18 10 30 10 30C10 30 0 18 0 10C0 5.4 3.4 0 10 0Z" fill="#0000FF"/>
        </svg>
      `;
      userPin.style.position = "absolute";
      userPin.style.transform = "translate(-50%, -100%)"; // Center the pin on the position

      const userMarker = new markerLibrary.AdvancedMarkerElement({
        map: map,
        position: position,
        content: userPin, // Pass the SVG as content
        title: "Your Location",
      });

      // Fetch data from AWS and add markers
      await fetchData(map, loader, markerLibrary);
    };

    initMap();
  }, [latitude, longitude]);

  return (
    <div className="map-container">
      <div className="map-title">Map of Locations</div>
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}

// Fetch data from AWS and process
async function fetchData(
  map: google.maps.Map,
  loader: Loader,
  markerLibrary: google.maps.MarkerLibrary
) {
  try {
    const response = await axios.get('/api/fetchData');
    console.log(`Status Code: ${response.status}, Response: ${JSON.stringify(response.data)}`);
    
    const data = response.data;
    console.log(`Length: ${data.length}`);
    
    const addresses = data.map((item: { Location: string }) => item.Location);
    
    // Geocode and add markers for each address
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (const address of addresses) {
      if (address && address.trim() !== "") {
        await geocodeAddress(loader, address, map, markerLibrary);
        await delay(500); // Add delay to avoid geocoding API rate limits
      } else {
        console.error(`Skipping empty or invalid address: ${address}`);
      }
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

// Geocode the address and add marker to the map
async function geocodeAddress(
  loader: Loader,
  address: string,
  map: google.maps.Map,
  markerLibrary: google.maps.MarkerLibrary
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    const { Geocoder } = (await loader.importLibrary("geocoding")) as google.maps.GeocodingLibrary;
    const geocoder = new Geocoder();

    geocoder.geocode({ address: address }, async (results, status) => {
      if (status === "OK" && results && results[0]) {
        console.log(`Successfully geocoded: ${address}`); // Confirm successful geocoding
        const location = results[0].geometry.location;
        const marker = new markerLibrary.AdvancedMarkerElement({
          map: map,
          position: location,
          title: address,
        });

        console.log(`Creating marker for: ${address}`, marker); // Log marker creation

        marker.addListener("click", () => {
          console.log(`Marker clicked for address: ${address}`);
        });

        resolve();
      } else {
        console.error(`Geocode error for ${address}: ${status}`);
        reject(new Error(status));
      }
    });
  });
}
