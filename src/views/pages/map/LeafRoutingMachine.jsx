import { useEffect, useCallback } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";
import iconEndPoint from "./icon/location.png";
import ShipperIcon from "./icon/shipper.png";

const startIcon = new L.Icon({
  iconUrl: ShipperIcon,
  iconSize: [40, 40],
});

const endIcon = new L.Icon({
  iconUrl: iconEndPoint,
  iconSize: [50, 50],
});

const RoutingLine = ({ locations }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || locations.length !== 2) return;

    const startMarker = L.marker(
      [locations[0].latitude, locations[0].longitude],
      { icon: startIcon }
    ).addTo(map);
    const endMarker = L.marker(
      [locations[1].latitude, locations[1].longitude],
      { icon: endIcon }
    ).addTo(map);

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(locations[0].latitude, locations[0].longitude),
        L.latLng(locations[1].latitude, locations[1].longitude),
      ],
      lineOptions: {
        styles: [{ color: "#0000FF", opacity: 0.8, weight: 6 }],
      },
      createMarker: () => null,
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      show: false, // Ẩn bảng chỉ đường
    }).addTo(map);

    // Listen for the routesfound event
    routingControl.on("routesfound", function (e) {
      const routes = e.routes;
      const summary = routes[0].summary;
      console.log(
        `Travel time: ${Math.round(
          summary.totalTime / 60
        )} min, Distance: ${Math.round(summary.totalDistance / 1000)} km`
      );
    });

    return () => {
      map.removeControl(routingControl);
      map.removeLayer(startMarker);
      map.removeLayer(endMarker);
    };
  }, [map, locations]); // Ensure dependencies are correct

  return null;
};

export default RoutingLine;
