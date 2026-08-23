self.addEventListener("push", (event) => {

    const data = event.data
        ? event.data.json()
        : {};

    self.registration.showNotification(
        data.title || "BookNest",
        {
            body: data.body || "You have a new notification.",
            icon: "/logo.png"
        }
    );

});