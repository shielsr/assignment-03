/* ----------Form validation for add.html--------------- */

function validateAddForm(event) {
    if (event) {
        event.preventDefault();  // From the lecture, this stops the form resetting
    }
    let errors = [];


    // Collect all inputs
    let artist = document.querySelector('input[name="artist"]');
    let dateTime = document.querySelector('input[name="date_time"]');
    let venue = document.querySelector('select[name="venue"]');
    let promoter = document.querySelector('input[name="promoter"]');
    let description = document.querySelector('textarea[name="description"]');
    let imageUrl = document.querySelector('select[name="image_url"]');
    let ticketPrice = document.querySelector('input[name="ticket_price"]');
    let ticketsLeft = document.querySelector('input[name="tickets_left"]');
    let saleDateTime = document.querySelector('input[name="sale_date_time"]');

    // Helper to reset and mark invalid fields
    function setValidity(input, isValid, message) {
        input.classList.remove("is-invalid", "is-valid");
        if (isValid) {
            input.classList.add("is-valid");
        } else {
            input.classList.add("is-invalid");
            if (message) errors.push(message);
        }
    }

    // Field checks
    setValidity(artist, artist.value.trim() !== "", "Artist name is required.");
    setValidity(dateTime, dateTime.value.trim() !== "", "Date and time of event are required.");
    setValidity(venue, venue.value !== "Select a venue", "Please select a venue.");
    setValidity(promoter, promoter.value.trim() !== "", "Promoter name is required.");
    setValidity(description, description.value.trim() !== "", "Description is required.");
    setValidity(imageUrl, imageUrl.value !== "Select an image", "Please select an image.");
    setValidity(ticketPrice, ticketPrice.value && !isNaN(ticketPrice.value) && Number(ticketPrice.value) > 0 && Number(ticketPrice.value) < 200, "Ticket price must be between 1 and 200 euro. Don't be greedy!");
    setValidity(ticketsLeft, ticketsLeft.value && !isNaN(ticketsLeft.value) && Number(ticketsLeft.value) > 0 && Number(ticketsLeft.value) < 100000, "Total tickets must be between 1 and 100,000.");
    setValidity(saleDateTime, saleDateTime.value.trim() !== "", "Start of sale date and time are required.");


    var errorDiv = document.getElementById("form-errors");
    errorDiv.innerHTML = ""; // Clear previous errors

    if (errors.length > 0) {
        document.getElementById("form-errors").classList.remove('d-none');
        errorDiv.innerHTML = errors.join("<br>");
        document.getElementById("form-errors").scrollIntoView({
            behavior: "smooth",
            block: "start"   // "start" | "center" | "end" | "nearest"
        });
        return false; // This is critical!
    }

}


/*  ------------End form validation------------ */

/* ----------Refresh tickets_left using JS--------------- */


document.addEventListener("DOMContentLoaded", function () {
    const refreshTicketsLeft = document.getElementById("refresh-tickets-left");
    if (!refreshTicketsLeft) return; // Exit if refreshTicketsLeft is not present

    refreshTicketsLeft.addEventListener("click", function (event) {

        const gigId = refreshTicketsLeft.getAttribute("data-gig-id");

        fetch(`/check-tickets/${gigId}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById("number-of-tickets").innerText = data.tickets_left;
            });
    });

});




/* ----------Card carousel on mobile only--------------- */


document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.querySelector(".carousel");
    if (!carousel) return; // Exit if carousel is not present
    const arrowBtns = document.querySelectorAll(".wrapper i");
    const wrapper = document.querySelector(".wrapper");

    const firstCard = carousel.querySelector(".carousel-card");
    const firstCardWidth = firstCard.offsetWidth;



    let isDragging = false,
        startX,
        startScrollLeft,
        timeoutId;

    const dragStart = (e) => {
        isDragging = true;
        carousel.classList.add("dragging");
        startX = e.pageX;
        startScrollLeft = carousel.scrollLeft;
    };

    const dragging = (e) => {
        if (!isDragging) return;

        // Calculate the new scroll position
        const newScrollLeft = startScrollLeft - (e.pageX - startX);

        // Check if the new scroll position exceeds 
        // the carousel boundaries
        if (newScrollLeft <= 0 || newScrollLeft >=
            carousel.scrollWidth - carousel.offsetWidth) {

            // If so, prevent further dragging
            isDragging = false;
            return;
        }

        // Otherwise, update the scroll position of the carousel
        carousel.scrollLeft = newScrollLeft;
    };

    const dragStop = () => {
        isDragging = false;
        carousel.classList.remove("dragging");
    };

    const autoPlay = () => {

        // Return if window is smaller than 800
        if (window.innerWidth < 800) return;

        // Calculate the total width of all cards
        const totalCardWidth = carousel.scrollWidth;

        // Calculate the maximum scroll position
        const maxScrollLeft = totalCardWidth - carousel.offsetWidth;

        // If the carousel is at the end, stop autoplay
        if (carousel.scrollLeft >= maxScrollLeft) return;

        // Autoplay the carousel after every 2500ms
        timeoutId = setTimeout(() =>
            carousel.scrollLeft += firstCardWidth, 2500);
    };

    carousel.addEventListener("mousedown", dragStart);
    carousel.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
    wrapper.addEventListener("mouseenter", () =>
        clearTimeout(timeoutId));
    wrapper.addEventListener("mouseleave", autoPlay);

});




// -------------------------------------



const listOfCardElements = document.querySelectorAll('.carousel-card');
const cardElement = document.querySelector('.carousel-card');
const cardContainer = document.querySelector('.card-container');
let currentCard = 0;

function setScrollTo() {
    const scrollLeft = currentCard * listOfCardElements[0].offsetWidth;
    cardContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
}


listOfCardElements.forEach((cardElement, index) => {
    cardElement.addEventListener('click', () => {
        currentCard = index;
        const scrollLeft = currentCard * listOfCardElements[0].offsetWidth;
        cardContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    });
});