document.addEventListener("DOMContentLoaded", function () {
  // Collapsible functionality for all .collapsible elements
  const collapsibles = document.querySelectorAll('.collapsible');
  collapsibles.forEach((collapsible) => {
    const trigger = collapsible.querySelector('h4');
    const content = collapsible.querySelector('.content');
    // Initially hide the content
    content.style.display = 'none';
    trigger.addEventListener('click', () => {
      content.style.display = (content.style.display === 'block') ? 'none' : 'block';
    });
  });

  // Toggle scheme link details
  const schemeLinks = document.querySelectorAll(".scheme-link");
  schemeLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const content = this.nextElementSibling;
      content.classList.toggle("active");
      this.textContent = content.classList.contains("active") ? "Show Less" : "Learn More";
    });
  });

  // Fetch user's area using Geolocation and Google Geocoding API
  function getUserArea() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          console.log('Latitude:', lat, 'Longitude:', lon); // Debug coordinates

          // Use Google Geocoding API for reverse geocoding
          // Replace 'YOUR_GOOGLE_API_KEY' with your actual API key.
          const googleApiKey = 'AIzaSyC_QgpBwSjDEZsKR5rgMQJA2BFv5lKZYek';
          const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${googleApiKey}`;

          fetch(geoUrl)
            .then(response => response.json())
            .then(data => {
              console.log('Google Geocoding Response:', data);
              let areaName = "Unknown Area";
              if (data.status === "OK" && data.results.length > 0) {
                const result = data.results[0];
                let sublocality2 = "";
                let sublocality1 = "";
                let neighborhood = "";
                let locality = "";
                result.address_components.forEach(component => {
                  if (component.types.includes("sublocality_level_2")) {
                    sublocality2 = component.long_name;
                  }
                  if (component.types.includes("sublocality_level_1")) {
                    sublocality1 = component.long_name;
                  }
                  if (component.types.includes("neighborhood")) {
                    neighborhood = component.long_name;
                  }
                  if (component.types.includes("locality")) {
                    locality = component.long_name;
                  }
                });
                // Combine granular components if available
                if (sublocality2 && sublocality1) {
                  areaName = `${sublocality2}, ${sublocality1}`;
                } else if (sublocality1) {
                  areaName = sublocality1;
                } else if (neighborhood) {
                  areaName = neighborhood;
                } else if (locality) {
                  areaName = locality;
                } else {
                  areaName = result.formatted_address;
                }
              }
              typeCityName(areaName);
            })
            .catch(err => {
              console.error('Google reverse geocoding error:', err);
              typeCityName('Unknown Area');
            });
        },
        function (error) {
          console.error('Geolocation error:', error.message);
          typeCityName('Unknown Area');
        },
        {
          enableHighAccuracy: true, // Use best available source (GPS/WiFi)
          timeout: 10000,           // Reasonable timeout
          maximumAge: 0             // Do not use cached position
        }
      );
    } else {
      console.error('Geolocation not supported.');
      typeCityName('Geolocation Not Supported');
    }
  }

  // Function to simulate typing the area name
  function typeCityName(areaName) {
    const cityHeading = document.getElementById('city-heading');
    if (!cityHeading) {
      console.warn('Element with id "city-heading" not found.');
      return;
    }
    const text = `${areaName}, Connected.`;
    let i = 0;
    cityHeading.textContent = ''; // Clear existing text

    function typeWriter() {
      if (i < text.length) {
        cityHeading.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 95);
      }
    }
    typeWriter();
  }

  // Invoke the getUserArea function to start the process
  getUserArea();
});
