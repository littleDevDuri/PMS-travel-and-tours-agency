let allPackages = []; // Store all fetched packages

// Function to create table
function createTable(packages) {
    if (packages.length === 0) return '<p>No packages available for this type.</p>';
    let table = '<table border="1"><thead><tr><th>Package</th><th>Departure Date</th><th>Departure City</th><th>Airline</th><th>Price</th><th>Available Slots</th><th>Action</th></tr></thead><tbody>';
    packages.forEach(pkg => {
        table += `<tr>
            <td>${pkg.Package || ''}</td>
            <td>${pkg['Departure Date'] || ''}</td>
            <td>${pkg['Departure City'] || ''}</td>
            <td>${pkg.Airline || ''}</td>
            <td>${pkg.Price || ''}</td>
            <td>${pkg['Available Slots'] || ''}</td>
            <td><button class="book-btn" onclick="openModal('${pkg['Package Type']}')">Book</button></td>
        </tr>`;
    });
    table += '</tbody></table>';
    return table;
}

// Function to update table based on selected type
function updateTable(type) {
    const filteredPackages = allPackages.filter(pkg => pkg.Type === type);
    document.getElementById('packages-table').innerHTML = createTable(filteredPackages);
}

// Function to open modal with the correct form
function openModal(type) {
    const modal = document.getElementById('booking-modal');
    const formContent = document.getElementById('modal-form-content');
    if (type === 'Land' || type === 'Sea') {
        formContent.innerHTML = `
            <h2>Book a ${type}-Based Tour</h2>
            <form id="modal-land-form" action="https://formspree.io/f/xgvjkkgo" method="POST">
                <label for="modal-tour-type">Tour Type:</label>
                <select id="modal-tour-type" required>
                    <option value="">Select...</option>
                    <option value="city">City Tour</option>
                    <option value="adventure">Adventure Tour</option>
                    <option value="cultural">Cultural Tour</option>
                </select>
                <label for="modal-date">Preferred Date:</label>
                <input type="date" id="modal-date" required>
                <label for="modal-name">Full Name:</label>
                <input type="text" id="modal-name" required>
                <label for="modal-email">Email:</label>
                <input type="email" id="modal-email" required>
                <button type="submit">Book Now</button>
            </form>
        `;
        document.getElementById('modal-land-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('${type}-based tour booked successfully! (Mock confirmation - integrate with backend for real bookings)');
            closeModal();
        });
    } else if (type === 'Air') {
        formContent.innerHTML = `
            <h2>Book an Air Flight</h2>
            <form id="modal-air-form">
                <label for="modal-departure">Departure City:</label>
                <input type="text" id="modal-departure" placeholder="e.g., New York" required>
                <label for="modal-arrival">Arrival City:</label>
                <input type="text" id="modal-arrival" placeholder="e.g., Paris" required>
                <label for="modal-flight-date">Flight Date:</label>
                <input type="date" id="modal-flight-date" required>
                <label for="modal-passengers">Number of Passengers:</label>
                <input type="number" id="modal-passengers" min="1" required>
                <label for="modal-air-name">Full Name:</label>
                <input type="text" id="modal-air-name" required>
                <label for="modal-air-email">Email:</label>
                <input type="email" id="modal-air-email" required>
                <button type="submit">Book Now</button>
            </form>
        `;
        document.getElementById('modal-air-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Air flight booked successfully! (Mock confirmation - integrate with backend for real bookings)');
            closeModal();
        });
    }
    modal.style.display = 'flex';
}

// Function to close modal
function closeModal() {
    document.getElementById('booking-modal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('booking-modal');
    if (event.target === modal) {
        closeModal();
    }
};

// Function to toggle hamburger menu
function toggleMenu() {
    const navLinks = document.getElementById('nav-links');
    const hamburger = document.querySelector('.hamburger');
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('close');
}

// Fetch data from Google Sheet (replace with your published CSV URL)
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRZ70RJcdGesBRHEkmhW7YhnU6-qYuSCS0797nkyrzjhEk94psOsdLwovBBBOCeNMnlh2jp9b6XIIrn/pub?output=csv'; // Replace with your actual published CSV URL

fetch(sheetURL)
    .then(response => {
        if (!response.ok) throw new Error(`HTTPS ${response.status}: ${response.statusText}`);
        return response.text();
    
    })
    .then(csv => {
        Papa.parse(csv, {
            header: true,
            complete: (results) => {
                allPackages = results.data;
                // Initial load based on dropdown default
                updateTable(document.getElementById('package-type').value);
            },
            error: (error) => {
                console.error('Parsing error:', error);
                document.getElementById('packages-table').innerHTML = '<p>Error parsing data.</p>';
            }
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        document.getElementById('packages-table').innerHTML = '<p>Error loading packages. Please check your internet or try again later.</p>';
    });


// Event listener for dropdown change
document.getElementById('package-type').addEventListener('change', function() {
    const selectedType = this.value;
    updateTable(selectedType);
});

// Contact form submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon. (Mock submission - integrate with backend for real handling)');
});

// Basic JS for status check (unchanged)
document.getElementById('status-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const bookingId = document.getElementById('booking-id').value;
    const resultDiv = document.getElementById('status-result');
    // Mock data - replace with real API call
    const mockStatuses = {
        'LAND123': 'Confirmed - Land Tour on 2023-10-15',
        'AIR456': 'Pending - Air Flight on 2023-11-01',
        'INVALID': 'Booking not found.'
    };
    const status = mockStatuses[bookingId] || 'Booking not found.';
    resultDiv.textContent = `Status: ${status}`;
    resultDiv.style.display = 'block';
});

