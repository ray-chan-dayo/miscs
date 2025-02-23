document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('gridContainer');
    const addTileBtn = document.getElementById('addTileBtn');
    const fileInput = document.getElementById('fileInput');
    
    let tileId = 0;
  
    // Add tile button click
    addTileBtn.addEventListener('click', () => {
      fileInput.click();
    });
  
    // Handle image file input
    fileInput.addEventListener('change', (event) => {
      const files = event.target.files;
      if (files.length > 0) {
        Array.from(files).forEach(file => {
          const reader = new FileReader();
          reader.onload = function(e) {
            const imgData = e.target.result;
            addTileToGrid(imgData);
          };
          reader.readAsDataURL(file);
        });
      }
    });
  
    // Function to add a new tile to the grid
    function addTileToGrid(imageData) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.setAttribute('id', `tile-${tileId}`);
      tileId++;
  
      const img = document.createElement('img');
      img.src = imageData;
  
      tile.appendChild(img);
      gridContainer.appendChild(tile);
    }
  });
  