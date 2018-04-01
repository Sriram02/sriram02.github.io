/* exported mapify */
/* global d3, topojson, G, $ */
function mapify(state) {
  var dummy = {"Ahmedabad" : "Gujarat", "Bangalore" : "Karnataka", "Chennai": "Tamil Nadu", "Delhi": "NCT of Delhi", "Hyderabad" : "Andhra Pradesh", "Kochi": "Kerala", "Kolkata" : "West Bengal", "Mumbai" : "Maharashtra"}
  var dummy_data = ["gujarat", "karnataka", "tamil nadu", "nct of delhi", "andhra pradesh", "kerala", "west bengal", "maharashtra"]
  d3.json('india-states.json', function(err, json) {
    // Get the first shape in the map as GeoJSON
    var toposhape = topojson.feature(json, d3.values(json.objects)[0])
    // Draw the map
    var gmap = G.map()
        .width(900)
        .height(980)
        .shape(toposhape)
    var svg = d3.select('#map-path');
    gmap.map(svg)
        .attr('fill', function(d){
          var colorCode = '#CCC';
          if(dummy[state] && d["properties"]["ST_NM"].toLowerCase() === dummy[state].toLowerCase()) {
            colorCode = '#4F4F85';
          } else if(!dummy[state] && (dummy_data.indexOf(d["properties"]["ST_NM"].toLowerCase()) != -1)) {
            colorCode = '#4F4F85';
          }
          return colorCode;
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', '1px')
    $('#map-path').attr('width', '862px')
    $('#map-path').attr('height', '938px')
        // .on("click", zoomin)
      // .on("click", zoomout)
  })
}