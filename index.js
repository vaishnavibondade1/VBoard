document.addEventListener("DOMContentLoaded", async function () {
    const accordion = document.getElementById("accordion");

    // Array of RSS feed URLs
    const magazines = [
        "https://flipboard.com/@thenewsdesk/the-latest-on-coronavirus-covid-19-t82no8kmz.rss",
        "https://flipboard.com/@dfletcher/india-tech-b2meqpd6z.rss",
        "https://flipboard.com/@thehindu/sportstarlive-rj3ttinvz.rss"
    ];


    // Function to fetch and parse RSS feeds
    async function fetchRSS(url) {
        try {
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return {
                title: data.feed.title, // Extract feed title
                items: data.items
            }; // Extract items array from the JSON response
        } catch (error) {
            console.error('Error fetching or parsing data:', error);
            return { title: "Undefined", items: [] }; // Return default values if error occurs
        }
    }

    // Function to populate accordion with carousel items
    async function populateAccordion() {
        for (let i = 0; i < magazines.length; i++) {
            const { title, items } = await fetchRSS(magazines[i]);

            if (items.length === 0) continue; // Skip if no items found

            const accordionItem = document.createElement('div');
            accordionItem.className = 'card';

            accordionItem.innerHTML = `
        <div class="card-header" id="heading${i}">
          <button id="my-button"  class="my-button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="${i === 0 ? 'true' : 'false'}" aria-controls="collapse${i}">
          <i id="icn" class="bi bi-chevron-up"></i>
                ${title}
          </button>
        </div>
        <div id="collapse${i}" class="collapse ${i === 0 ? 'show' : ''}" aria-labelledby="heading${i}" data-parent="#accordion">
          <div class="card-body">
            <div id="carousel${i}" class="carousel slide" data-ride="carousel">
              <div class="carousel-inner">
                ${items.map((item, index) => `
                  <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <div class="card-flex">
                      <a href="${item.link}" target="_blank">
                        <img src="${item.enclosure.link}" class="d-block w-100" alt="${item.title}">
                      </a>
                      <h5 class="card-caption">${item.title}</h5>
                      <div class="meta">
                        <p>
                          <span>${item.author}</span> <span>.</span>
                          <span>${new Date(item.pubDate).toLocaleDateString()}</span>
                        </p>
                      </div>
                      <p class="">${item.description}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
              <a class="carousel-control-prev" href="#carousel${i}" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
              </a>
              <a class="carousel-control-next" href="#carousel${i}" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
              </a>
            </div>
          </div>
        </div>
      `;

            accordion.appendChild(accordionItem);


            // Activate the first carousel in each accordion
            // Add event listener to each collapse element to toggle icon

        }

        // Activate the first carousel in each accordion
    }



    // Call function to populate accordion on page load
    populateAccordion();
});
