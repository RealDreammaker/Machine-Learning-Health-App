
// create variables for the Europe BMI(obesity,underweight %) and healthy life years a person is expected to live without a disability data

var eubmidc = "../data/eubmidc.geojson";
// var eufvdc = "../eufvdc.geojson";
var euhldc = "../data/euhldc.geojson";

// read the data
d3.json(eubmidc, function(data) {
  let eubmidata = data.features
  d3.json(euhldc, function(data) {
    let healthylifedata = data.features

    createMap(eubmidata,healthylifedata)
  })
})
// create map function
function createMap(eubmidata,healthylifedata) {
// create variable for markers
    let eubmiMarkers = eubmidata.map((feature) =>
      L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],{
          radius: bmiCheck(feature.properties.Obese), 
          stroke: true,
          color: 'black',
          opacity: 1,
          weight: 1,
          
          fill: true,
          fillColor: bmiColor(feature.properties.Obese), 
          fillOpacity: 0.8   
      })
      .bindPopup("<h1> Country : " + feature.properties.country +
      "</h1><hr> <h2> Obese " + feature.properties.Obese + "% </h2>"+
      "</h1><hr><h2><p> Underweight " + feature.properties.Underweight + "% <h2></p>")
     

    )
// Europe BMI
    let eubmi = L.layerGroup(eubmiMarkers);

    function makePolyline(feature, layer){
      L.polyline(feature.geometry.coordinates);
    }
 // Europe healthy lifestyle   


    let euhl = L.geoJSON(healthylifedata, {
      onEachFeature: makePolyline,
        style: function(feature) {
  
//           color: 'green',
//           opacity: 0.9
        }
    })

  
  // Define map layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 19,
    id: "light-v10",
    
    accessToken: API_KEY
  });


  var satellite =  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 19,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });




  var outdoors =  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 19,
    id: "outdoors-v11",
    accessToken: API_KEY
  });

  var baseMaps = {
    "Street Map": streetmap,
    "Light Map": lightmap,
    "Satellite Map": satellite,
    "Outdoors Map": outdoors
  };

  var overlayMaps = {
    Obesity: eubmi,
//     Healthy_Lifestyle : euhl
  };

  var myMap = L.map("map", {
    center: [47.65, 14.705],
    zoom: 3.2,
    layers: [streetmap, eubmi]
  });

var legend = L.control({ position: "bottomright" });

legend.onAdd = function(){

    var legenddiv = L.DomUtil.create("div","legend");

    
    legenddiv.innerHTML += 

[     "<h4 style='margin:15px'>Obesity Legend</h4>",
        "<k class='obese10'></k><span>0-10 Yellow </span><br>",
        "<k class='obese15'></k><span>11-15 Gold</span><br>",
        "<k class='obese20'></k><span>16-20 Orange</span><br>",
        "<k class='obese25'></k><span>21-25 Red</span><br>",
        "<k class='obese25p'></k><span>25+ Dark red</span><br>"
      ]
.join("");
    return legenddiv;
}

legend.addTo(myMap);
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}


     function bmiColor(obe) {
      var color = "";
      if (obe <= 10) { color = "yellow"; }
      else if (obe <= 15) {color = "gold"; }
      else if (obe <= 20) { color = "orange"; }
      else if (obe <= 25) {color = "red"; }
      else { color = "darkred"; }
    
    return color;
    
    };
function bmiCheck(obe){
  if (obe <= 1){
      return 1
  }
  return obe ;
}
