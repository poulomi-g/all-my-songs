import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const TRACKING_NUM = 1023038647106760;

interface TrackInfo {
  date: string;
  time?: string;
  description: string;
  city?: string;
}

export default function App() {
  const [trackingInfo, setTrackingInfo] = useState<TrackInfo[]>([]);
  useEffect(() => {
    const getData = async (track_num: number) => {
      const res = await axios.get(
        "http://localhost:5000/" + track_num.toString()
      );
      console.log(res.data);
      setTrackingInfo(res.data);
    };
    getData(TRACKING_NUM);
  }, []);
  return (
    <div className="App">
      {trackingInfo.length
        ? trackingInfo.map(info => (
            <div>
              date: {info.date}, {info.time ? `time: ${info.time}, ` : ""}
              description: {info.description}
              {info.city ? `, city: ${info.city}` : ""}
            </div>
          ))
        : "Loading..."}
    </div>
  );
}
