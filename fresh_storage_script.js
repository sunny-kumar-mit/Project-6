document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Load data from JSON file
    fetch('fresh_storage.json')
        .then(response => response.json())
        .then(data => {
            const itemsContainer = document.getElementById('items-container');
            
            // Function to render items with staggered animation
            function renderItems(items) {
                itemsContainer.innerHTML = '';
                
                items.forEach((item, index) => {
                    const itemCard = document.createElement('div');
                    itemCard.className = `item-card animate__animated animate__fadeInUp animate-delay-${index % 3}`;
                    
                    const icon = item.type === 'fruit' ? 'fa-apple-alt' : 'fa-carrot';
                    
                    itemCard.innerHTML = `
                        <img src="${item.imageUrl}" alt="${item.name}" class="item-image">
                        <div class="item-content">
                            <h3><i class="fas ${icon}"></i> ${item.name}</h3>
                            <span class="type ${item.type}">${item.type}</span>
                            <div class="temp-range">${item.tempRange}</div>
                            <div class="notes">${item.notes}</div>
                        </div>
                    `;
                    
                    // Add hover animation
                    itemCard.addEventListener('mouseenter', () => {
                        itemCard.classList.add('animate__pulse');
                    });
                    itemCard.addEventListener('mouseleave', () => {
                        itemCard.classList.remove('animate__pulse');
                    });
                    
                    itemsContainer.appendChild(itemCard);
                    
                    // Trigger reflow to enable animation
                    setTimeout(() => {
                        itemCard.style.opacity = 1;
                    }, 50);
                });
            }
            
            // Initial render
            renderItems(data.items);
            
            // Filter functionality
            const filterButtons = document.querySelectorAll('.filter-buttons button');
            const searchInput = document.getElementById('search');
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Update active button with animation
                    filterButtons.forEach(btn => {
                        btn.classList.remove('active');
                        btn.classList.remove('animate__bounce');
                    });
                    this.classList.add('active');
                    this.classList.add('animate__bounce');
                    
                    // Remove bounce after animation
                    setTimeout(() => {
                        this.classList.remove('animate__bounce');
                    }, 1000);
                    
                    // Filter items
                    const filter = this.dataset.filter;
                    let filteredItems = data.items;
                    
                    if (filter !== 'all') {
                        filteredItems = data.items.filter(item => item.type === filter);
                    }
                    
                    // Apply search filter if any
                    const searchTerm = searchInput.value.toLowerCase();
                    if (searchTerm) {
                        filteredItems = filteredItems.filter(item => 
                            item.name.toLowerCase().includes(searchTerm)
                        );
                    }
                    
                    renderItems(filteredItems);
                });
            });
            
            // Search functionality with debounce
            let searchTimeout;
            searchInput.addEventListener('input', function() {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const searchTerm = this.value.toLowerCase();
                    const activeFilter = document.querySelector('.filter-buttons button.active').dataset.filter;
                    
                    let filteredItems = data.items;
                    
                    if (activeFilter !== 'all') {
                        filteredItems = data.items.filter(item => item.type === activeFilter);
                    }
                    
                    if (searchTerm) {
                        filteredItems = filteredItems.filter(item => 
                            item.name.toLowerCase().includes(searchTerm)
                        );
                    }
                    
                    renderItems(filteredItems);
                }, 300);
            });
        })
        .catch(error => console.error('Error loading data:', error));
});