const api2Json = "https://api.rss2json.com/v1/api.json?rss_url=";

async function init() {
    for (let index = 0; index < magazines.length; index++) {
        const feeds = await fetchFeed(magazines[index]);
        addCityToDOM(feeds["items"], index);
    }
}

async function fetchFeed(url) {
    try {
        const response = await fetch(api2Json + url);
        if (response.status >= 200 && response.status <= 299) {
            // console.log(response);
            const jsonResponse = await response.json();
            return jsonResponse;
        } else {
            throw Error(response.statusText);
        }
    } catch (error) {
        return null;
    }
}

function addCityToDOM(objArr, index) {
    const temp = [2, 3, 4];
    const renderHook = document.querySelector(
        `#accordion > div:nth-child(${index + temp[index]}) > div > div`
    );
    objArr.forEach((obj, index) => {
        renderHook.insertAdjacentHTML(
            "beforeend",
            `
      <div class="carousel-item">
      <div class="card">
      <a href="${obj.link}" target="_blank">
      <img src="${obj.enclosure.link}"  class="card-img-top" alt="Image not available"></img>
      <div class="card-body">
          <h5 class="card-caption card-header">${obj.title}</h5>
          <span class="meta card-subtitle mb-2 text-muted">
          ${obj.author}
          </span><span> . </span>
          <span class="meta card-subtitle mb-2 text-muted">
          ${obj.pubDate}
          </span>
          <p class="card-text">
          ${obj.description}
          </p>
        </div>
        </a>
      </div>
    </div>`
        );
    });
    renderHook.querySelector("div:nth-child(1)").classList.add("active");
}

$("#accordion").on("hide.bs.collapse show.bs.collapse", (e) => {
    $(e.target).prev().find("i").toggleClass("fa-angle-up fa-angle-down");
});

init();