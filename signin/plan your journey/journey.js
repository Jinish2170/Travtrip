let stationData = {};

// Fetch station data (async/await version)
async function fetchStationData() {
  try {
    const response = await fetch('unique_station.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    stationData = await response.json();
  } catch (error) {
    console.error('Error loading station data:', error);
  }
}

// Debounce function to limit rapid calls to station suggestions
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Suggest stations based on user input
function suggestStations(inputId) {
  const input = document.getElementById(inputId);
  const suggestionsDiv = document.getElementById(`${inputId}-suggestions`);
  const query = input.value.trim().toLowerCase();

  // Clear any existing suggestions
  suggestionsDiv.innerHTML = '';

  if (query && Object.keys(stationData).length > 0) {
    // Filter station names based on the query
    const suggestions = Object.keys(stationData).filter(station =>
      station.toLowerCase().startsWith(query)
    );

    // Create suggestion items
    suggestions.forEach(station => {
      const suggestionItem = document.createElement('div');
      suggestionItem.textContent = station;
      suggestionItem.classList.add('suggestion-item');
      suggestionItem.addEventListener('click', () => {
        input.value = station;
        suggestionsDiv.innerHTML = ''; // Clear suggestions upon selection
      });
      suggestionsDiv.appendChild(suggestionItem);
    });
  }
}

// Search buses between two stations
function searchBuses() {
  const from = document.getElementById('from').value.trim();
  const to = document.getElementById('to').value.trim();
  const resultsDiv = document.getElementById('results');

  // Clear previous results
  resultsDiv.innerHTML = '';

  // Validate inputs
  if (!from || !to) {
    alert('Please enter both departure and destination stations!');
    return;
  }

  if (!stationData[from] || !stationData[to]) {
    resultsDiv.textContent = 'No data available for the entered stations.';
    return;
  }

  // Find common buses in both stations
  const fromBuses = stationData[from];
  const toBuses = stationData[to];
  const commonBuses = fromBuses.filter(bus => toBuses.includes(bus));

  if (commonBuses.length > 0) {
    const resultList = document.createElement('ul');
    const heading = document.createElement('h3');
    heading.textContent = 'Available Buses:';
    resultList.appendChild(heading);

    commonBuses.forEach(bus => {
      const listItem = document.createElement('li');
      listItem.textContent = bus;
      resultList.appendChild(listItem);
    });
    resultsDiv.appendChild(resultList);
  } else {
    resultsDiv.textContent = 'No direct buses found between these stations.';
  }
}

// Initializes the FAQ tab navigation and collapsible answers
document.querySelectorAll('.faq-tab').forEach(button => {
  button.addEventListener('click', () => {
    const target = button.getAttribute('data-target');

    document.querySelectorAll('.faq-tab').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    document.querySelectorAll('.faq-tab-content').forEach(content => {
      content.classList.remove('active');
      if (content.id === target) {
        content.classList.add('active');
      }
    });
  });
});

// Collapsible FAQ items within the active tab content
document.querySelectorAll('.faq-tab-content').forEach(tabContent => {
  const faqItems = tabContent.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('h3');
    const answer = question.nextElementSibling;
    // Initially hide the answers
    answer.style.display = 'none';

    question.addEventListener('click', () => {
      // Toggle the answer's visibility
      answer.style.display = (answer.style.display === 'block') ? 'none' : 'block';
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // 1. Fetch station data
  fetchStationData();

  // 2. Set up event listeners for station suggestions (debounced)
  const fromInput = document.getElementById('from');
  const toInput = document.getElementById('to');
  if (fromInput) {
    fromInput.addEventListener('input', debounce(() => suggestStations('from'), 300));
  }
  if (toInput) {
    toInput.addEventListener('input', debounce(() => suggestStations('to'), 300));
  }

  // 3. Initialize FAQ tabs & collapsible
  setupFAQTabsAndCollapsible();
});

function filterStations(selectId, searchTerm) {
  const select = document.getElementById(selectId);
  select.innerHTML = '<option value="" disabled selected>Select a station</option>';

  const filteredStations = stationData.filter(station =>
      station.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredStations.length === 0) {
      select.innerHTML += '<option value="" disabled>No matching stations</option>';
      return;
  }

  filteredStations.forEach(station => {
      const option = document.createElement('option');
      option.value = station;
      option.textContent = station;
      select.appendChild(option);
  });

  // Automatically select the first filtered option
  if (filteredStations.length > 0) {
      select.value = filteredStations[0];
  }
}
let allStations = [];

// Load station data from JSON when the page loads
async function loadStations() {
    try {
        const response = await fetch('unique_station.json');
        const data = await response.json();
        allStations = data.stations;
        console.log('Stations loaded:', allStations);
    } catch (error) {
        console.error('Error loading stations:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadStations);

// Show suggestions under the input field
function showSuggestionsStart(searchTerm) {
  const suggestionsContainer = document.getElementById('start-suggestions');

  // Clear previous suggestions
  suggestionsContainer.innerHTML = '';

  if (searchTerm.trim() === '') {
      return; // Exit if search is empty
  }

  const filteredStations = allStations.filter(station =>
      station.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredStations.length === 0) {
      suggestionsContainer.innerHTML = '<div>No matching stations</div>';
      return;
  }

  // LIMIT TO FIRST 5 RESULTS
  filteredStations.slice(0, 10).forEach(station => {
      const suggestionItem = document.createElement('div');
      suggestionItem.textContent = station;
      suggestionItem.addEventListener('click', () => {
          document.getElementById('startSearch').value = station;
          suggestionsContainer.innerHTML = ''; // Clear suggestions after selection
      });
      suggestionsContainer.appendChild(suggestionItem);
  });

}

function showSuggestionsEnd(searchTerm) {
  const suggestionsContainer = document.getElementById('end-suggestions');

  // Clear previous suggestions
  suggestionsContainer.innerHTML = '';

  if (searchTerm.trim() === '') {
      return; // Exit if search is empty
  }

  const filteredStations = allStations.filter(station =>
      station.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredStations.length === 0) {
      suggestionsContainer.innerHTML = '<div>No matching stations</div>';
      return;
  }

  // LIMIT TO FIRST 5 RESULTS
  filteredStations.slice(0, 10).forEach(station => {
      const suggestionItem = document.createElement('div');
      suggestionItem.textContent = station;
      suggestionItem.addEventListener('click', () => {
          document.getElementById('endSearch').value = station;
          suggestionsContainer.innerHTML = ''; // Clear suggestions after selection
      });
      suggestionsContainer.appendChild(suggestionItem);
  });

}

document.addEventListener('DOMContentLoaded', function() {
  loadStations();

  // Copy offer code functionality
  document.querySelectorAll('.copy-offer-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const code = this.getAttribute('data-code');
      navigator.clipboard.writeText(code).then(() => {
        const confirm = this.parentElement.querySelector('.copy-confirm');
        confirm.style.display = 'inline';
        setTimeout(() => {
          confirm.style.display = 'none';
        }, 1200);
      });
    });
  });
});