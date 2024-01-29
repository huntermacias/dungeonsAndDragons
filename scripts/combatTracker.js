document.addEventListener('DOMContentLoaded', () => {
    // Load existing creatures from storage and display them
    loadCreaturesFromStorage();

    // Handle creature form submission
    document.getElementById('creature-form').addEventListener('submit', function (event) {
        event.preventDefault();
        processCreatureInfo();
    });

    // Add event listeners to the toggle buttons
    const toggleButtons = document.querySelectorAll('.toggle-button');
    toggleButtons.forEach((button) => {
        button.addEventListener('click', toggleAdditionalData);
    });
});

function toggleAdditionalData(event) {
    const card = event.target.closest('.bg-gradient-to-br');
    const additionalData = card.querySelector('.additional-data');
    additionalData.classList.toggle('hidden');
}

function processCreatureInfo() {
    let creatureName = document.getElementById('creature-name').value;
    let creatureInitiative = document.getElementById('creature-initiative').value || 'N/A';
    let creatureHP = document.getElementById('creature-hp').value || 'N/A';
    let creatureAC = document.getElementById('creature-ac').value || 'N/A';
    let creatureQuantity = parseInt(document.getElementById('creature-quantity').value) || 1;

    if (creatureName === '') {
        showNotification('Creature name is required', 'bg-red-500');
        return;
    }

    // Save creature info to localStorage
    for (let i = 0; i < creatureQuantity; i++) {
        saveCreatureToStorage({ creatureName, creatureInitiative, creatureHP, creatureAC });
    }

    // Clear the input fields
    document.getElementById('creature-name').value = '';
    document.getElementById('creature-initiative').value = '';
    document.getElementById('creature-hp').value = '';
    document.getElementById('creature-ac').value = '';
    document.getElementById('creature-quantity').value = '';

    showNotification(`${creatureQuantity} creature(s) added successfully!`, 'bg-green-500');

    // Load updated creatures from storage and display them
    loadCreaturesFromStorage();
}

function saveCreatureToStorage(creature) {
    const creatures = JSON.parse(localStorage.getItem('creatures')) || [];
    creatures.push(creature);
    localStorage.setItem('creatures', JSON.stringify(creatures));
}

function createCreatureCard(creature) {
    return `
        <div class="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden shadow-lg transform transition duration-500 hover:scale-105">
            <div class="p-6">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-semibold text-indigo-300 mb-2">Creature Name: <span class="text-white">${creature.creatureName}</span></h3>
                    <button class="toggle-button bg-indigo-500 hover:bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
                <div class="additional-data hidden">
                    <p class="text-indigo-200 mb-1">Initiative: <span class="text-indigo-100">${creature.creatureInitiative}</span></p>
                    <p class="text-indigo-200 mb-1">HP: <span class="text-indigo-100">${creature.creatureHP}</span></p>
                    <p class="text-indigo-200">AC: <span class="text-indigo-100">${creature.creatureAC}</span></p>
                </div>
            </div>
        </div>
    `;
}



function loadCreaturesFromStorage() {
    const creatures = JSON.parse(localStorage.getItem('creatures')) || [];
    const outputElement = document.getElementById('creature-list');
    outputElement.innerHTML = '';
    creatures.forEach(creature => {
        const cardContent = createCreatureCard(creature);
        outputElement.innerHTML += cardContent;
    });
}

function showNotification(message, messageColor) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `${messageColor} text-white px-4 py-2 rounded-md mb-2`;
    notification.classList.remove('hidden');

    if (messageColor === 'bg-green-500') {
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 1500);
    }
}
