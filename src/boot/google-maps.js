// src/boot/google-maps.js
export default () => {
  const googleMapsApiKey = "AIzaSyDqU2r_BSnbHabImFCe5pOMykGKJjT0Yic";

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
  script.async = true;
  script.defer = true;

  script.onload = () => {
    console.log("Google Maps script loaded");
  };

  document.head.appendChild(script);
};
