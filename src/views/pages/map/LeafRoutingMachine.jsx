import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/7541/7541900.png",
  iconSize: [38, 38],
});

const RoutingLine = ({ locations }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || locations.length !== 2) return;

    // Create routing control
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(locations[0].latitude, locations[0].longitude),
        L.latLng(locations[1].latitude, locations[1].longitude),
      ],
      lineOptions: {
        styles: [{ color: "#0000FF", opacity: 0.8, weight: 6 }], // Customize route line color and style
      },
      routeWhileDragging: true,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
    }).addTo(map);

    // Hide routing direction container
    const routingContainers = document.querySelectorAll(
      ".leaflet-routing-container.leaflet-bar.leaflet-control"
    );
    routingContainers.forEach((container) => {
      container.style.display = "none";
    });

    // Handle route found event
    routingControl.on("routesfound", function (e) {
      const routes = e.routes;
      const summary = routes[0].summary;
      console.log(
        "Travel time: " +
          Math.round(summary.totalTime / 60) +
          " min, " +
          "Distance: " +
          Math.round(summary.totalDistance / 1000) +
          " km"
      );
    });

    // Cleanup function to remove routing control when component unmounts or locations change
    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, locations]); // Include locations in dependencies

  return null;
};

export default RoutingLine;
