import React from 'react';
import npyjs from 'npyjs';
import OpenSeaDragon from 'openseadragon';

import HeatmapOverlay from './openseadragon-heatmapjs-overlay.js';

var viewer;

const paintHeatmap = () => {
  let n = new npyjs();
  const heatmap = new HeatmapOverlay(viewer, {
    backgroundColor: 'rgba(0,0,0,0)',
    // the maximum opacity (the value with the highest intensity will have it)
    maxOpacity: 0.5,
    // minimum opacity. any value > 0 will produce no transparent gradient transition
    minOpacity: 0.05
  });
  // now generate some random data
  let points = [];
  let max = 0;
  n.load("/Tumor_047.npy", ndArray => {
    // `array` is a one-dimensional array of the raw data
    // `shape` is a one-dimensional array that holds a numpy-style shape.
    console.log('numpy array', ndArray);
    const ndShape = ndArray.shape;
    const ndData = ndArray.data;
    ndData.map((ndd, i) => {
      // (ndd !== 0) && console.log('ndd !== 0', i, ndd);
      if (ndd !== 0) {
        max = Math.max(max, ndd);
        const point = {
          x: Math.floor(i / ndShape[1]) * 64 - 32, // (i % ndShape[0]) * 64 - 32,
          y: (i % ndShape[1]) * 64 - 32, // Math.floor(i / ndShape[0]) * 64 - 32,
          value: ndd,
          radius: 10
        };
        points.push(point);
      }
    });
    console.log('points', points);
    var data = {
      max: max,
      data: points
    };
    heatmap.setData(data);
  });
}


const OpenSeaDragonView = () => {
  React.useEffect(() => {
    viewer = OpenSeaDragon({
      id: "seadragon-viewer",
      debugMode:  false,
			visibilityRatio: 1.0,
			constrainDuringPan: true,
			showNavigator: true,
			zoomPerScroll: 1.8,
			showRotationControl: true,
    });
    viewer.addTiledImage({
      tileSource: "http://localhost:5000/slide.dzi",
      x: 0,
      y: 0,
      success: paintHeatmap
    });
  },[]);

  return (<div id="seadragon-viewer" style={{ height: "90vh", width: "100%" }} />);
};

export default OpenSeaDragonView;
