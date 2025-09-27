// ----------Form validation for buy.html---------------
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("buyForm");
    if (!form) return;

    form.addEventListener("submit", function (event) {
        // Run your validation
        const isValid = validateBuyForm();

        if (!isValid) {
            // Validation failed → stop submission
            event.preventDefault();
        }
        // If isValid is true, do nothing → form submits normally
    });
});



function validateBuyForm(event) {
    if (event) event.preventDefault(); // Stop default submission/reset

    let errors = [];

    // Gather the inputs
    let buyerInput = document.querySelector('input[name="buyer"]'); // may not exist if logged in
    let buyAmountInput = document.querySelector('input[name="buy_amount"]');
    let buyAmount = Number(buyAmountInput.value);
    let ticketsLeftElem = document.getElementById('number-of-tickets');
    let ticketsLeft = Number(ticketsLeftElem ? ticketsLeftElem.textContent : 99999);

    // Helper to reset and mark invalid fields
    function setValidity(input, isValid, message) {
        if (!input) return; // skip if element doesn't exist
        input.classList.remove("is-invalid", "is-valid");
        if (isValid) {
            input.classList.add("is-valid");
        } else {
            input.classList.add("is-invalid");
            if (message) errors.push(message);
        }
    }

    // Validate buyer name only if input exists (guest)
    if (buyerInput) {
        setValidity(buyerInput, buyerInput.value.trim() !== "", "Your name is required.");
    }

    // Validate buy amount
    if (!buyAmountInput.value || isNaN(buyAmount) || buyAmount < 1 || buyAmount > 50) {
        setValidity(buyAmountInput, false, "You can only buy between 1 and 50 tickets.");
    } else if (buyAmount > ticketsLeft) {
        setValidity(buyAmountInput, false, "You can't buy more tickets than are available.");
    } else {
        setValidity(buyAmountInput, true);
    }

    // Show errors
    let errorDiv = document.getElementById("buy-form-errors");
    errorDiv.innerHTML = "";

    if (errors.length > 0) {
        errorDiv.classList.remove('d-none');
        errorDiv.innerHTML = errors.join("<br>");
        errorDiv.scrollIntoView({ behavior: "smooth", block: "start" });

        // Focus first invalid field
        const firstInvalid = document.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();

        return false; // Stop form submission
    } else {
        errorDiv.classList.add('d-none');
        return true; // Allow submission
    }
}




/* ----------Form validation for add.html--------------- */

document.addEventListener("DOMContentLoaded", function () {
    const addForm = document.getElementById("addForm"); // Make sure your form has id="addForm"
    if (!addForm) return;

    addForm.addEventListener("submit", function (event) {
        const isValid = validateAddForm();

        if (!isValid) {
            // Stop form submission if invalid
            event.preventDefault();
        }
        // If valid, form submits normally to Flask
    });
});



function validateAddForm() {
    let errors = [];

    const artist = document.querySelector('input[name="artist"]');
    const dateTime = document.querySelector('input[name="date_time"]');
    const venue = document.querySelector('select[name="venue"]');
    const promoter = document.querySelector('input[name="promoter"]');
    const description = document.querySelector('textarea[name="description"]');
    const imageUrl = document.querySelector('select[name="image_url"]');
    const ticketPrice = document.querySelector('input[name="ticket_price"]');
    const ticketsLeft = document.querySelector('input[name="tickets_left"]');
    const saleDateTime = document.querySelector('input[name="sale_date_time"]');

    function setValidity(input, isValid, message) {
        if (!input) return;
        input.classList.remove("is-invalid", "is-valid");
        if (isValid) {
            input.classList.add("is-valid");
        } else {
            input.classList.add("is-invalid");
            if (message) errors.push(message);
        }
    }

    setValidity(artist, artist.value.trim() !== "", "Artist name is required.");
    setValidity(dateTime, dateTime.value.trim() !== "", "Date and time of event are required.");
    setValidity(venue, venue.value !== "Select a venue", "Please select a venue.");
    setValidity(promoter, promoter.value.trim() !== "", "Promoter name is required.");
    setValidity(description, description.value.trim() !== "", "Description is required.");
    setValidity(imageUrl, imageUrl.value !== "Select an image", "Please select an image.");
    setValidity(ticketPrice, ticketPrice.value && !isNaN(ticketPrice.value) && Number(ticketPrice.value) > 0 && Number(ticketPrice.value) < 200, "Ticket price must be between 1 and 200 euro.");
    setValidity(ticketsLeft, ticketsLeft.value && !isNaN(ticketsLeft.value) && Number(ticketsLeft.value) > 0 && Number(ticketsLeft.value) < 100000, "Total tickets must be between 1 and 100,000.");
    setValidity(saleDateTime, saleDateTime.value.trim() !== "", "Start of sale date and time are required.");

    const errorDiv = document.getElementById("form-errors");
    errorDiv.innerHTML = "";

    if (errors.length > 0) {
        errorDiv.classList.remove('d-none');
        errorDiv.innerHTML = errors.join("<br>");
        errorDiv.scrollIntoView({ behavior: "smooth", block: "start" });

        const firstInvalid = document.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();

        return false;
    } else {
        errorDiv.classList.add('d-none');
        return true;
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


/* -------- Countdown timer on /buy page -----------  */

document.addEventListener("DOMContentLoaded", function () {
    const countdownText = document.getElementById("countdown");
    let secondsLeft = Number(countdownText.dataset.seconds);

    function render(sec) {
        if (sec <= 0) {
            countdownText.textContent = "Sale is live! Reload this page to start buying tickets.";
            return;
        }
        const days = Math.floor(sec / 86400);
        const hours = Math.floor((sec % 86400) / 3600);
        const minutes = Math.floor((sec % 3600) / 60);
        const seconds = sec % 60;

        countdownText.textContent =
            (days > 0 ? days + "d " : "") +
            (hours > 0 ? hours + "h " : "") +
            (minutes > 0 ? minutes + "m " : "") +
            seconds + "s";
    }

    render(secondsLeft);
    const timer = setInterval(function () {
        secondsLeft--;
        if (secondsLeft <= 0) {
            clearInterval(timer);
            render(0);
        } else {
            render(secondsLeft);
        }
    }, 1000);
});