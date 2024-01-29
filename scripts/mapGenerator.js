document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gridCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 20; 
    let wallColor = localStorage.getItem('wallColor') || '#c34037'; 
    let wallWidth = parseInt(localStorage.getItem('wallWidth'), 10) || 1; 
    let shadowColor = localStorage.getItem('shadowColor') || '#000000'; 
    let shadowOffsetX = parseInt(localStorage.getItem('shadowOffsetX'), 10) || 0; 
    let shadowOffsetY = parseInt(localStorage.getItem('shadowOffsetY'), 10) || 0; 
    let hatchingStyle = localStorage.getItem('hatchingStyle') || 'none'; 
    let hatchingSize = parseInt(localStorage.getItem('hatchingSize'), 10) || 10;
    let isSnapEnabled = localStorage.getItem('isSnapEnabled') === 'true';
    let selectedImage = null;


    resizeCanvasToDisplaySize(canvas);
    loadSquares(ctx, gridSize, wallColor, wallWidth, shadowColor, shadowOffsetX, shadowOffsetY, hatchingStyle, hatchingSize);
    drawGrid(ctx, canvas.width, canvas.height, gridSize);

    // Handle Snap On/Off Feature
    document.getElementById('snap-on').addEventListener('click', function() {
        isSnapEnabled = true;
        localStorage.setItem('isSnapEnabled', isSnapEnabled);
        // Optionally, indicate visually that snap is enabled
    });

    document.getElementById('snap-off').addEventListener('click', function() {
        isSnapEnabled = false;
        localStorage.setItem('isSnapEnabled', isSnapEnabled);
        // Optionally, indicate visually that snap is disabled
    });

    // Handle Image Upload and Custom Image Addition
    document.querySelector('.add-custom-image').addEventListener('click', function() {
        document.getElementById('customImageInput').click();
    });

    document.getElementById('customImageInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.classList.add('image-option');
            document.getElementById('imageContainer').appendChild(img);
            
            // Initialize click event for the newly added image
            img.addEventListener('click', function() {
                selectedImage = img;
                
                // Optionally, visually indicate that this image is selected
            });
        };
        
        reader.readAsDataURL(file);
    });
    
    // Tab switching
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('bg-blue-500', 'text-white')); // Remove active class from all tabs
            tab.classList.add('bg-blue-500', 'text-white'); // Add active class to clicked tab

            // Show corresponding tab content
            document.getElementById('tabContent').style.display = tab.id === 'imagesTab' ? 'block' : 'none';
        });
    });

    // Image selection
    const imageOptions = document.querySelectorAll('.image-option');
    imageOptions.forEach(img => {
        img.addEventListener('click', function() {
            imageOptions.forEach(i => i.classList.remove('border-blue-500')); // Remove active class from all images
            img.classList.add('border-blue-500'); // Add active class to clicked image
            selectedImage = img; // Set the selected image
        });
    });
    
    const predefinedImages = document.querySelectorAll('.image-option');
    predefinedImages.forEach(img => {
        img.addEventListener('click', function() {
        selectedImage = img;
        // Optionally, visually indicate which image is selected
    });

    window.addEventListener('resize', () => {
        if (resizeCanvasToDisplaySize(canvas)) {
            redrawSquares(ctx, gridSize, wallColor, wallWidth, shadowColor, shadowOffsetX, shadowOffsetY, hatchingStyle, hatchingSize);
        }
    });

    canvas.addEventListener('click', function(event) {
        
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;
            if (selectedImage) {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                const x = (event.clientX - rect.left) * scaleX;
                const y = (event.clientY - rect.top) * scaleY;
                
                placeImageOnCanvas(ctx, selectedImage, x, y, gridSize);  // Pass gridSize here
                // saveSquare(x, y, gridSize, wallColor, wallWidth, shadowColor, shadowOffsetX, shadowOffsetY, hatchingStyle, hatchingSize);
            } else {
                // Draw a colored square if no image is selected
                drawSquare(ctx, x, y, gridSize, wallColor, wallWidth, shadowColor, shadowOffsetX, shadowOffsetY, hatchingStyle, hatchingSize);
                saveSquare(x, y, gridSize, wallColor, wallWidth, shadowColor, shadowOffsetX, shadowOffsetY, hatchingStyle, hatchingSize);
            }
          
    });

  

  
});

    const shadowColorInput = document.getElementById('shadow-color');
    shadowColorInput.addEventListener('input', function(event) {
        shadowColor = event.target.value;
        localStorage.setItem('shadowColor', shadowColor);
        redrawSquares(ctx, gridSize, wallColor, wallWidth, shadowColor, shadowOffsetX, shadowOffsetY, hatchingStyle, hatchingSize);
    });

    const shadowXInput = document.getElementById('shadow-x');
    shadowXInput.addEventListener('input', function(event) {
        shadowOffsetX = parseInt(event.target.value, 10);
        localStorage.setItem('shadowOffsetX', shadowOffsetX);
        redrawSquares(ctx, gridSize, wallColor, wallWidth, shadowColor, shadowOffsetX, shadowOffsetY, hatchingStyle, hatchingSize);
    });

    const shadowYInput = document.getElementById('shadow-y');
    shadowYInput.addEventListener('input', function(event) {
        shadowOffsetY = parseInt(event.target.value, 10);
        localStorage.setItem('shadowOffsetY', shadowOffsetY);
        redrawSquares(ctx, gridSize, wallColor, wallWidth, shadowColor, shadowOffsetX, shadowOffsetY, hatchingStyle, hatchingSize);
    });

    const wallColorInput = document.getElementById('walls-color');
    wallColorInput.addEventListener('input', function(event) {
        wallColor = event.target.value;
        localStorage.setItem('wallColor', wallColor);
        redrawSquares(ctx, gridSize, wallColor, wallWidth, shadowColor, shadowOffsetX, shadowOffsetY, hatchingStyle, hatchingSize);
    });

    const wallWidthInput = document.getElementById('walls-width');
    wallWidthInput.addEventListener('input', function(event) {
        wallWidth = parseInt(event.target.value, 10);
        localStorage.setItem('wallWidth', wallWidth);
        redrawSquares(ctx, gridSize, wallColor, wallWidth, shadowColor, shadowOffsetX, shadowOffsetY, hatchingStyle, hatchingSize);
    });

    const hatchingStyleInput = document.getElementById('hatching-variant');
    hatchingStyleInput.addEventListener('change', function(event) {
        hatchingStyle = event.target.value;
        localStorage.setItem('hatchingStyle', hatchingStyle);
        redrawSquares(ctx, gridSize, wallColor, wallWidth, shadowColor, shadowOffsetX, shadowOffsetY, hatchingStyle, hatchingSize);
    });

    const hatchingSizeInput = document.getElementById('hatching-size');
    hatchingSizeInput.addEventListener('input', function(event) {
        hatchingSize = parseInt(event.target.value, 10);
        localStorage.setItem('hatchingSize', hatchingSize);
        redrawSquares(ctx, gridSize, wallColor, wallWidth, shadowColor, shadowOffsetX, shadowOffsetY, hatchingStyle, hatchingSize);
    });
});

function placeImageOnCanvas(ctx, img, x, y, gridSize) {
    const image = new Image();
    image.src = img.src;
    image.onload = function() {
        const startX = Math.floor(x / gridSize) * gridSize;
        const startY = Math.floor(y / gridSize) * gridSize;
        ctx.drawImage(image, startX, startY, gridSize, gridSize);
    };
}


function resizeCanvasToDisplaySize(canvas) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
    }
    return false;
}

// Redrawing the grid on top of the squares
function drawGrid(ctx, width, height, step) {
    ctx.beginPath();
    for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
            ctx.rect(x, y, 1, 1); // Draw a small rectangle (dot)
        }
    }
    ctx.fillStyle = 'rgba(0, 200, 0, 1)'; // Change dots color to be more subtle
    ctx.fill();
}

// Function to draw square hatching
function drawSquareHatching(ctx, x, y, size, hatchingSize) {
    ctx.beginPath();
    for (let i = 0; i < size; i += hatchingSize) {
        ctx.moveTo(x + i, y);
        ctx.lineTo(x + i, y + size);
        ctx.moveTo(x, y + i);
        ctx.lineTo(x + size, y + i);
    }
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

// Function to draw random hatching
function drawRandomHatching(ctx, x, y, size, hatchingSize) {
    for (let i = 0; i < size / hatchingSize; i++) {
        for (let j = 0; j < size / hatchingSize; j++) {
            if (Math.random() > 0.5) {
                ctx.beginPath();
                ctx.moveTo(x + i * hatchingSize, y + j * hatchingSize);
                ctx.lineTo(x + (i + 1) * hatchingSize, y + (j + 1) * hatchingSize);
                ctx.stroke();
            }
        }
    }
}

function drawSquare(ctx, x, y, size, color, wallWidth, shadowColor, shadowOffsetX, shadowOffsetY, hatchingStyle, hatchingSize) {
    // Calculate starting points for the square considering the wall width
    const startX = Math.floor(x / size) * size;
    const startY = Math.floor(y / size) * size;

    // Set up shadow properties
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = 5; // You can make this a variable or a function parameter if you want it to be adjustable
    ctx.shadowOffsetX = shadowOffsetX;
    ctx.shadowOffsetY = shadowOffsetY;

    // Set the fill color and draw the square
    ctx.fillStyle = color;
    ctx.fillRect(startX, startY, size * wallWidth, size); // Use wallWidth for square width

    // Draw hatching if applicable
    if (hatchingStyle === 'square') {
        drawSquareHatching(ctx, startX, startY, size, hatchingSize);
    } else if (hatchingStyle === 'random') {
        drawRandomHatching(ctx, startX, startY, size, hatchingSize);
    }

    // Reset shadow color to avoid affecting other elements
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
}


function getSavedSquares() {
    try {
        return JSON.parse(localStorage.getItem('squares')) || [];
    } catch (e) {
        console.error('Error parsing squares from localStorage', e);
        return [];
    }
}

function redrawSquares(ctx, size, wallColor, wallWidth, shadowColor, shadowOffsetX, shadowOffsetY, hatchingStyle, hatchingSize) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const squares = getSavedSquares();
    squares.forEach(square => {
        drawSquare(ctx, 
            square.startX, 
            square.startY, 
            size, 
            square.wallColor || wallColor, 
            square.wallWidth || wallWidth,
            square.shadowColor || shadowColor, 
            square.shadowOffsetX || shadowOffsetX, 
            square.shadowOffsetY || shadowOffsetY, 
            square.hatchingStyle || hatchingStyle, 
            square.hatchingSize || hatchingSize);
    });
    drawGrid(ctx, ctx.canvas.width, ctx.canvas.height, size);
}

function loadSquares(ctx, size, wallColor, wallWidth, shadowColor, shadowOffsetX, shadowOffsetY, hatchingStyle, hatchingSize) {
    const squares = JSON.parse(localStorage.getItem('squares')) || [];
    squares.forEach(square => {
        drawSquare(ctx, 
            square.startX, 
            square.startY, 
            size, 
            square.wallColor || wallColor, 
            square.wallWidth || wallWidth, // make sure wallWidth is defined or passed as a parameter
            square.shadowColor || shadowColor, 
            square.shadowOffsetX || shadowOffsetX, 
            square.shadowOffsetY || shadowOffsetY, 
            square.hatchingStyle || hatchingStyle, 
            square.hatchingSize || hatchingSize);
    });
    drawGrid(ctx, ctx.canvas.width, ctx.canvas.height, size);
}

function saveSquare(x, y, size, wallColor, wallWidth, shadowColor, shadowOffsetX, shadowOffsetY, hatchingStyle, hatchingSize) {
    const startX = Math.floor(x / size) * size;
    const startY = Math.floor(y / size) * size;
    const squares = getSavedSquares();
    squares.push({ startX, startY, size, wallColor, wallWidth, shadowColor, shadowOffsetX, shadowOffsetY, hatchingStyle, hatchingSize });
    localStorage.setItem('squares', JSON.stringify(squares));
}

// Function to initialize image click events
function initializeImageClicks() {
    const imageOptions = document.querySelectorAll('.image-option');
    imageOptions.forEach(image => {
        image.addEventListener('click', function() {
            // Set selectedImage to the clicked image
            selectedImage = image;
            
            // Optionally, visually indicate that this image is selected
            // For example, add a class to highlight the selected image
        });
    });
}

// Call this function after your images have been added to the DOM
initializeImageClicks();


