document.addEventListener('DOMContentLoaded', function() {
    // Store carousel data globally
    let carouselData = [];
    let glideInstance = null;
    let lgInstance = null; // Track the current LightGallery instance
    
    // DOM elements
    const mainContent = document.getElementById('main-content');
    const detailPage = document.getElementById('detail-page');
    const detailTitle = document.getElementById('detail-title');
    const detailText = document.getElementById('detail-text');
    const detailImages = document.getElementById('detail-images');
    const backButton = document.getElementById('back-button');
    
    // Fetch carousel data from JSON file
    fetch('carousel.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Store the data globally
        carouselData = data;
            
        // Get carousel slides container
        const slidesContainer = document.getElementById('carousel-slides');
        const bulletsContainer = document.getElementById('carousel-bullets');
        
        // Clear any existing content
        slidesContainer.innerHTML = '';
        bulletsContainer.innerHTML = '';
        
        // Generate slides from JSON data
        data.forEach((item, index) => {
            // Create slide
            const slide = document.createElement('li');
            slide.className = 'glide__slide';
            
            // Create card structure
            slide.innerHTML = `
                <div class="card" data-id="${item.id}">
                    <div class="card-img">
                        <img src="img/${item.img}" alt="${item.title}">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.text}</p>
                    </div>
                </div>
            `;
            
            // Add slide to container
            slidesContainer.appendChild(slide);
            
            // Create bullet
            const bullet = document.createElement('button');
            bullet.className = 'glide__bullet';
            bullet.setAttribute('data-glide-dir', `=${index}`);
            
            // Add bullet to container
            bulletsContainer.appendChild(bullet);
        });
        
        // Initialize Glide.js after slides are added
        glideInstance = new Glide('.glide', {
            type: 'carousel',
            perView: 3,
            gap: 0, // Using padding instead of gap for better control
            autoplay: 3000,
            hoverpause: true,
            bound: true,
            rewind: false,
            peek: 0,
            breakpoints: {
                992: {
                    perView: 2
                },
                576: {
                    perView: 1
                }
            }
        }).mount();
        
        // Add click event listeners to all cards
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('click', function() {
                const cardId = parseInt(this.getAttribute('data-id'));
                showDetailPage(cardId);
            });
        });
    })
    .catch(error => {
        console.error('Error fetching carousel data:', error);
        document.getElementById('carousel-slides').innerHTML = '<li class="glide__slide"><div class="card"><div class="card-body"><h5 class="card-title">Error</h5><p class="card-text">Failed to load carousel data</p></div></div></li>';
    });
    
    function destroyGalleries() {
          // Destroy LightGallery
          if (lgInstance) {
              lgInstance.destroy(true);
              lgInstance = null;
          }
          
          // Fallback method for LightGallery
          if (detailImages.getAttribute('lg-uid')) {
              const dataId = detailImages.getAttribute('lg-uid');
              if (window.lgData && window.lgData[dataId]) {
                  window.lgData[dataId].destroy(true);
              }
              detailImages.removeAttribute('lg-uid');
          }
          
          // Remove any leftover LightGallery elements
          const lgContainer = document.querySelector('.lg-container');
          if (lgContainer) {
              lgContainer.parentNode.removeChild(lgContainer);
          }
          
          document.querySelectorAll('.lg-backdrop, .lg-outer').forEach(el => {
              el.parentNode.removeChild(el);
          });
          
          // Destroy JustifiedGallery
          if ($(detailImages).data('jg.controller')) {
              $(detailImages).justifiedGallery('destroy');
          }
      }
    
    // Function to show detail page with slide animation
    function showDetailPage(itemId) {
        // Find the item in the stored data
        const selectedItem = carouselData.find(item => item.id === itemId);
        
        if (selectedItem && selectedItem.details) {
            // Pause the Glide autoplay if it's running
            if (glideInstance && glideInstance.settings.autoplay) {
                glideInstance.pause();
            }
            
            // Populate detail page content
            detailTitle.textContent = selectedItem.details.innerTitle;
            detailText.textContent = selectedItem.details.innerText;
            
            // Destroy any existing LightGallery instance first
            destroyGalleries();
            
            // Clear existing images and recreate the container
            detailImages.innerHTML = '';
            
            // Add images from innerPics with anchor tags for lightbox functionality
            const innerPics = selectedItem.details.innerPics;
            for (const key in innerPics) {
                if (innerPics.hasOwnProperty(key)) {
                    const anchor = document.createElement('a');
                    anchor.href = `img/${innerPics[key]}`; // Link to full-size image
                    anchor.dataset.src = `img/${innerPics[key]}`; // Also set data-src for LightGallery
                    
                    const img = document.createElement('img');
                    img.src = `img/${innerPics[key]}`; // Same source for thumbnail
                    img.alt = `${selectedItem.title} - ${key}`;
                    
                    anchor.appendChild(img);
                    detailImages.appendChild(anchor);
                }
            }
            
            // Initialize JustifiedGallery for the detail page images
            $(detailImages).justifiedGallery({
                rowHeight: 250,
                margins: 10,
                lastRow: 'nojustify',
                captions: false
            }).on('jg.complete', function () {
                  // Wait a brief moment to ensure DOM is updated
                  setTimeout(() => {
                      // Make sure any existing LightGallery is fully destroyed before initialization
                      if (lgInstance) {
                          lgInstance.destroy(true);
                          lgInstance = null;
                      }
                      
                      // Reset any stray elements
                      document.querySelectorAll('.lg-backdrop, .lg-outer').forEach(el => {
                          if (el && el.parentNode) el.parentNode.removeChild(el);
                      });
                      
                      // Initialize LightGallery with additional settings to prevent overlap
                      lgInstance = lightGallery(detailImages, {
                          selector: 'a',
                          plugins: [lgZoom, lgFullscreen],
                          fullscreen: true,
                          zoom: true,
                          download: false,
                          actualSize: false,
                          backdropDuration: 300,
                          speed: 500,
                          mode: 'lg-fade',
                          preload: 2,
                          escKey: true,
                          closable: true,
                          hideBarsDelay: 3000,
                          mousewheel: true,
                          appendSubHtmlTo: '.lg-item', // This can help with overlap issues
                          addClass: 'lg-clean', // Add a custom class for potential CSS fixes
                          allowMediaOverlap: false // Prevent media overlap
                      });
                  }, 200); // Increased timeout for more reliable initialization
            });
            
            // Animate the detail page into view
            requestAnimationFrame(() => {
                mainContent.classList.add('detail-active');
                detailPage.classList.add('active');
            });
            
            // Disable body scrolling to prevent background scrolling
            document.body.style.overflow = 'hidden';
            
            // Scroll detail page to top
            detailPage.scrollTop = 0;
        } else {
            console.error('Item not found or missing details:', itemId);
        }
    }
    
    // Back button event listener
    backButton.addEventListener('click', function() {
        // Properly destroy LightGallery instance
        destroyGalleries();
        
        // Animate the detail page out of view
        mainContent.classList.remove('detail-active');
        detailPage.classList.remove('active');
        
        // Re-enable body scrolling
        document.body.style.overflow = '';
        
        // Resume the Glide autoplay if it was paused
        if (glideInstance) {
            setTimeout(() => {
                glideInstance.play();
            }, 500); // Resume after animation completes
        }
    });
});