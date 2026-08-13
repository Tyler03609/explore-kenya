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