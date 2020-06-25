var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
});

// Add tilelayer

var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// perform JSON request

d3.json(url, function(data) {
  createFeatures(data.features);
});

function colorMag(magnitude) {
  if (magnitude < 1) {
    return "green";
  } else if (magnitude > 1 & magnitude < 2) {
    return "lightgreen";
  } else if (magnitude > 2 & magnitude < 3) {
    return "yellow";
  } else if (magnitude > 3 & magnitude < 4) {
    return "orange";
  } else if (magnitude > 4 & magnitude < 5) {
    return "red";
  } else {
    return "darkred";
  }
}

// function to find earthquakes in data features and create popups with pertinent information
function createFeatures(earthquakeData) {

  function onEachFeature1(feature, layer) {
    L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      color: colorMag(feature.properties.mag),
      fillColor: colorMag(feature.properties.mag),
      fillOpacity: .75,
      radius: feature.properties.mag * 15000
    }).addTo(myMap)
    // layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "<p>");
  }

  // GeoJSON layer containing earthquakeData features

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature1
  }).addTo(myMap);
};

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

  var div = L.DomUtil.create('div', 'info legend'),
    mag = [0,1,2,3,4,5],
    labels = [];

  for (var i = 0; i < mag.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colorMag(mag[i] + 1) + '"></i> ' +
      mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
  }

  return div;
};

legend.addTo(myMap);

d3.json(url, function(data) {
  console.log(data);
})