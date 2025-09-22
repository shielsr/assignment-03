document.addEventListener("DOMContentLoaded", function () {
    const refreshTicketsLeft = document.getElementById("refresh-tickets-left");


    refreshTicketsLeft.addEventListener("click", function (event) {

        const gigId = refreshTicketsLeft.getAttribute("data-gig-id");
        fetch(`/check-tickets/${gigId}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById("number-of-tickets").innerText = data.tickets_left;
            });
    });

});




/* Card carousel on mobile  */

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

    // Add event listeners for the arrow buttons to 
    // scroll the carousel left and right
    arrowBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            carousel.scrollLeft += btn.id === "left" ?
                -firstCardWidth : firstCardWidth;
        });
    });
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