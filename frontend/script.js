// API Configuration
const API_BASE_URL = 'http://localhost:8000';

// ============================================
// FORM SUBMISSION
// ============================================

document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading spinner
    const spinner = document.getElementById('loadingSpinner');
    spinner.classList.remove('hidden');
    
    try {
        // Collect form data
        const formData = {
            carat: parseFloat(document.getElementById('carat').value),
            depth: parseFloat(document.getElementById('depth').value),
            table: parseFloat(document.getElementById('table').value),
            x: parseFloat(document.getElementById('x').value),
            y: parseFloat(document.getElementById('y').value),
            z: parseFloat(document.getElementById('z').value),
            cut: document.getElementById('cut').value,
            color: document.getElementById('color').value,
            clarity: document.getElementById('clarity').value
        };
        
        // Make API call
        const response = await fetch(`${API_BASE_URL}/api/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Display result
        displayPredictionResult(result);
        
        // Reload history
        loadPredictionHistory();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error making prediction: ' + error.message);
    } finally {
        // Hide loading spinner
        spinner.classList.add('hidden');
    }
});

// ============================================
// DISPLAY PREDICTION RESULT
// ============================================

function displayPredictionResult(result) {
    const resultSection = document.getElementById('resultSection');
    const predictedPrice = document.getElementById('predictedPrice');
    const resultDetails = document.getElementById('resultDetails');
    
    // Format price with currency
    const price = parseFloat(result.predicted_price);
    predictedPrice.textContent = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(price);
    
    // Display input details
    const input = result.input_data;
    resultDetails.innerHTML = `
        <p><strong>Carat:</strong> ${input.carat}</p>
        <p><strong>Cut:</strong> ${input.cut}</p>
        <p><strong>Color:</strong> ${input.color}</p>
        <p><strong>Clarity:</strong> ${input.clarity}</p>
        <p><strong>Dimensions:</strong> ${input.x}mm × ${input.y}mm × ${input.z}mm</p>
        <p><strong>Predicted at:</strong> ${new Date(result.timestamp).toLocaleString()}</p>
    `;
    
    // Show result section
    resultSection.classList.remove('hidden');
    
    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// LOAD PREDICTION HISTORY
// ============================================

async function loadPredictionHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/history`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const history = await response.json();
        displayHistory(history);
        
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

// ============================================
// DISPLAY HISTORY
// ============================================

function displayHistory(history) {
    const historyList = document.getElementById('historyList');
    
    if (!history || history.length === 0) {
        historyList.innerHTML = '<p class="empty-message">No predictions yet. Make your first prediction above!</p>';
        return;
    }
    
    historyList.innerHTML = history.map((item, index) => `
        <div class="history-item">
            <div class="history-item-field">
                <span class="history-item-label">Predicted Price</span>
                <span class="history-item-value">${formatCurrency(item.predicted_price)}</span>
            </div>
            <div class="history-item-field">
                <span class="history-item-label">Carat</span>
                <span class="history-item-value">${item.carat}</span>
            </div>
            <div class="history-item-field">
                <span class="history-item-label">Cut</span>
                <span class="history-item-value">${item.cut}</span>
            </div>
            <div class="history-item-field">
                <span class="history-item-label">Color</span>
                <span class="history-item-value">${item.color}</span>
            </div>
            <div class="history-item-field">
                <span class="history-item-label">Clarity</span>
                <span class="history-item-value">${item.clarity}</span>
            </div>
            <div class="history-item-field">
                <span class="history-item-label">Time</span>
                <span class="history-item-value">${formatDate(item.timestamp)}</span>
            </div>
        </div>
    `).join('');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('predictionForm').reset();
    document.getElementById('resultSection').classList.add('hidden');
}

// ============================================
// SMOOTH SCROLLING FOR NAV LINKS
// ============================================

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');
    });
});

// ============================================
// LOAD HISTORY ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadPredictionHistory();
});
