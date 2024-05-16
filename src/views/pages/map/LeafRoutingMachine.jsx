import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/7541/7541900.png",
  iconSize: [38, 38],
});

// This function will generate expected route line between 2 locations by
//putting locations as a parameter
const RoutingLine = ({ locations }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (locations.length === 2) {
      const routingControl = L.Routing.control({
        waypoints: [
          // L.latLng(10.8431579, 106.8365875),
          // L.latLng(10.8368910, 106.8305375),
          L.latLng(locations[0]?.["longitude"], locations[0]?.["latitude"]),
          L.latLng(locations[1]?.["longitude"], locations[1]?.["latitude"]),
        ],
        routeWhileDragging: true,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
      }).addTo(map);

      //Display none showing directions container.
      const routingContainers = document.querySelectorAll(
        ".leaflet-routing-container.leaflet-bar.leaflet-control"
      );
      routingContainers.forEach((container) => {
        container.style.display = "none";
      });

      //Get the expected timeout for the shipping
      routingControl.on("routesfound", function (e) {
        var routes = e.routes;
        var summary = routes[0].summary;
        // Display total travel time and distance
        console.log(
          "Travel time: " +
            Math.round(summary.totalTime / 60) +
            " min, Distance: " +
            Math.round(summary.totalDistance / 1000) +
            " km"
        );
      });

      return () => map.removeControl(routingControl);
    }
  }, [map]);

  return null;
};

export default RoutingLine;
