const WA_NUMBER = "971559956683";
function sendToWhatsApp(form, kind) {
  const data = new FormData(form);
  const lines = kind === "booking" ? [
    "Hello Live World, I would like to book a repair/service.",
    "Name: " + data.get("name"),
    "Phone: " + data.get("phone"),
    "Device brand: " + data.get("brand"),
    "Model: " + data.get("model"),
    "Service: " + data.get("service"),
    "Complaint / remarks: " + data.get("remarks")
  ] : [
    "Hello Live World, I would like a mobile phone quote.",
    "Name: " + data.get("name"),
    "Phone: " + data.get("phone"),
    "Preferred brand: " + data.get("brand"),
    "Model: " + data.get("model"),
    "Storage / colour: " + data.get("variant"),
    "Budget / remarks: " + data.get("remarks")
  ];
  window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener,noreferrer");
}
document.querySelector(".service-form")?.addEventListener("submit", function(event) {
  event.preventDefault();
  sendToWhatsApp(event.currentTarget, "booking");
});
document.querySelector(".quote-form")?.addEventListener("submit", function(event) {
  event.preventDefault();
  sendToWhatsApp(event.currentTarget, "quote");
});
