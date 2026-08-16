const bookingForm =
    document.getElementById("bookingForm");

const formMessage =
    document.getElementById("formMessage");


if (bookingForm) {

    bookingForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const booking = {

            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            tour: document.getElementById("tour").value,
            people: document.getElementById("people").value,
            date: document.getElementById("date").value,
            message: document.getElementById("message").value

        };

        console.log("Sending booking:", booking);

        try {

            const response = await fetch("/api/bookings", {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(booking)
                }
            );

            const data = await response.json();

            console.log("Server response:", data);

            if (data.success) {

                formMessage.textContent =
                    "Booking received! We will contact you soon.";

                bookingForm.reset();

            }

        } catch (error) {

            console.error("Booking error:", error);

            formMessage.textContent =
                "Unable to send booking. Please try again.";

        }

    });

}

// Automatically select tour from tour link

const urlParams = new URLSearchParams(
    window.location.search
);

const selectedTour =
    urlParams.get("tour");

const tourSelect =
    document.getElementById("tour");

if (selectedTour && tourSelect) {

    tourSelect.value = selectedTour;

}

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", function () {

        navMenu.classList.toggle("active");

    });

}

// Destination filters

const filterButtons =
    document.querySelectorAll(".filter-button");

const destinationCards =
    document.querySelectorAll(".destination-card");


if (
    filterButtons.length &&
    destinationCards.length
) {

    filterButtons.forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const filter =
                    button.dataset.filter;


                // Update active button

                filterButtons.forEach(function(btn) {

                    btn.classList.remove("active");

                });

                button.classList.add("active");


                // Filter destinations

                destinationCards.forEach(
                    function(card) {

                        const category =
                            card.dataset.category;


                        if (
                            filter === "all" ||
                            category === filter
                        ) {

                            card.classList.remove(
                                "hidden"
                            );

                        } else {

                            card.classList.add(
                                "hidden"
                            );

                        }

                    }
                );

            }
        );

    });

}

// Destination search

const destinationSearch =
    document.getElementById(
        "destinationSearch"
    );


if (
    destinationSearch &&
    destinationCards.length
) {

    destinationSearch.addEventListener(
        "input",
        function() {

            const searchTerm =
                destinationSearch.value
                    .toLowerCase()
                    .trim();


            destinationCards.forEach(
                function(card) {

                    const cardText =
                        card.textContent
                            .toLowerCase();


                    if (
                        cardText.includes(searchTerm)
                    ) {

                        card.classList.remove(
                            "hidden"
                        );

                    } else {

                        card.classList.add(
                            "hidden"
                        );

                    }

                }
            );

        }
    );

}