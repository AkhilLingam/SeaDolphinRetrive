document.addEventListener('DOMContentLoaded', function () {
    const folderNameInput = document.getElementById('folderName');
    const notesTextarea = document.getElementById('notes');
    const saveButton = document.getElementById('save');
    const clearButton = document.getElementById('clear');
    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('search');
    const folderList = document.getElementById('folderList');
    const folderInfo = document.getElementById('folderInfo');
  
    // Load and list saved folders on popup open
    loadFolders();
  
    // Save notes to a custom folder when the "Save" button is clicked
    saveButton.addEventListener('click', function () {
      const folderName = folderNameInput.value.trim();
      const notes = notesTextarea.value;
      if (!folderName || !notes) {
        alert('Please enter a folder name and notes.');
        return;
      }
  
      // Create a custom folder path based on folderName
      const folderPath = `SeaDolphinRetrieve/${folderName}`;
  
      // Save notes to a custom folder in local storage
      chrome.storage.local.get([folderPath], function (result) {
        const existingNotes = result[folderPath] || '';
        const allNotes = existingNotes + '\n' + notes;
        const dataToSave = {};
        dataToSave[folderPath] = allNotes;
  
        chrome.storage.local.set(dataToSave, function () {
          alert('Notes saved successfully!');
          clearFields();
          loadFolders(); // Update folder list
        });
      });
    });
  
    // Clear folderName and notes textarea and reset the extension to the initial state
    clearButton.addEventListener('click', function () {
      clearFields();
      folderInfo.innerHTML = ''; // Clear folder information
      loadFolders(); // Update folder list
    });
  
    // Search for saved folders by folder name
    searchButton.addEventListener('click', function () {
      const searchQuery = searchBar.value.trim();
      if (searchQuery === '') {
        loadFolders();
      } else {
        searchFolders(searchQuery);
      }
    });
  
    // Function to delete a folder and its contents
    function deleteFolder(folderName) {
      const folderPath = `SeaDolphinRetrieve/${folderName}`;
      chrome.storage.local.remove([folderPath], function () {
        loadFolders(); // Update folder list after deletion
        folderInfo.innerHTML = ''; // Clear folder information
      });
    }
  
    // Load and list saved folders in the popup
    function loadFolders() {
      folderList.innerHTML = '';
      folderInfo.innerHTML = ''; // Clear folder information
      chrome.storage.local.get(null, function (items) {
        const folders = new Set();
        for (const key in items) {
          const folderName = key.split('/')[1];
          if (folderName) {
            folders.add(folderName);
          }
        }
        folders.forEach((folderName) => {
          const listItem = document.createElement('li');
          listItem.textContent = folderName;
          listItem.classList.add('folderItem');
  
          // Add a delete button for each folder
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.classList.add('deleteButton');
          deleteButton.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent folder click event
            deleteFolder(folderName);
          });
  
          listItem.appendChild(deleteButton);
  
          listItem.addEventListener('click', function () {
            // Load and display files inside the selected folder
            loadFilesInFolder(folderName);
          });
          folderList.appendChild(listItem);
        });
      });
    }
  
    // Search for folders by folder name
    function searchFolders(searchQuery) {
      folderList.innerHTML = '';
      folderInfo.innerHTML = ''; // Clear folder information
      chrome.storage.local.get(null, function (items) {
        const folders = new Set();
        for (const key in items) {
          const folderName = key.split('/')[1];
          if (folderName && folderName.includes(searchQuery)) {
            folders.add(folderName);
          }
        }
        folders.forEach((folderName) => {
          const listItem = document.createElement('li');
          listItem.textContent = folderName;
          listItem.classList.add('folderItem');
  
          // Add a delete button for each folder
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.classList.add('deleteButton');
          deleteButton.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent folder click event
            deleteFolder(folderName);
          });
  
          listItem.appendChild(deleteButton);
  
          listItem.addEventListener('click', function () {
            // Load and display files inside the selected folder
            loadFilesInFolder(folderName);
          });
          folderList.appendChild(listItem);
        });
      });
    }
  
    // Load and display files inside a selected folder
    function loadFilesInFolder(folderName) {
      folderInfo.innerHTML = ''; // Clear folder information
      const folderPath = `SeaDolphinRetrieve/${folderName}`;
      chrome.storage.local.get([folderPath], function (result) {
        const folderContent = result[folderPath];
        if (folderContent) {
          // Toggle folder information visibility when clicking on folder
          folderInfo.style.display = folderInfo.style.display === 'none' ? 'block' : 'none';
          folderInfo.innerHTML = `<strong>${folderName}:</strong><br>${folderContent}`;
        }
      });
    }
  
    // Clear folderName and notes textarea
    function clearFields() {
      folderNameInput.value = '';
      notesTextarea.value = '';
    }
  });
  