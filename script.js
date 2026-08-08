(function () {
  "use strict";
  var WA = "971559956683";
  var tabs = document.querySelectorAll(".form-tabs [role=tab]");
  var repairForm = document.querySelector(".service-form");
  var quoteForm = document.querySelector(".quote-form");
  var heading = document.querySelector(".form-heading h3");
  var description = document.querySelector(".form-heading p");

  function setRequestType(type) {
    var booking = type === "booking";
    if (!repairForm || !quoteForm) return;
    repairForm.hidden = !booking;
    quoteForm.hidden = booking;
    if (tabs[0]) {
      tabs[0].classList.toggle("active", booking);
      tabs[0].setAttribute("aria-selected", String(booking));
    }
    if (tabs[1]) {
      tabs[1].classList.toggle("active", !booking);
      tabs[1].setAttribute("aria-selected", String(!booking));
    }
    if (heading) heading.textContent = booking ? "Service or repair booking" : "Ask for a mobile phone quote";
    if (description) description.textContent = booking ? "Enter the device and complaint details below." : "Tell us the exact phone and configuration you need.";
  }

  function sendToWhatsApp(event, kind) {
    event.preventDefault();
    var data = new FormData(event.currentTarget);
    var lines = kind === "booking"
      ? [
          "Hello Live World, I would like to book a service or repair.",
          "Customer name: " + data.get("name"),
          "Phone: " + data.get("phone"),
          "Brand: " + data.get("brand"),
          "Model: " + data.get("model"),
          "Service: " + data.get("service"),
          "Complaint / remarks: " + data.get("remarks")
        ]
      : [
          "Hello Live World, I would like a mobile phone quote.",
          "Customer name: " + data.get("name"),
          "Phone: " + data.get("phone"),
          "Brand: " + data.get("brand"),
          "Model: " + data.get("model"),
          "Storage / colour: " + data.get("variant"),
          "Budget / remarks: " + data.get("remarks")
        ];
    window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  if (tabs[0]) tabs[0].addEventListener("click", function () { setRequestType("booking"); });
  if (tabs[1]) tabs[1].addEventListener("click", function () { setRequestType("quote"); });
  if (repairForm) repairForm.addEventListener("submit", function (event) { sendToWhatsApp(event, "booking"); });
  if (quoteForm) quoteForm.addEventListener("submit", function (event) { sendToWhatsApp(event, "quote"); });
  setRequestType("booking");
})();