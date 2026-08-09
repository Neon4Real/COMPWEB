(() => {
  const whatsappNumber = "971559956683";
  const whatsappLink = (message) => "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message);

  const hero = document.querySelector(".hero");
  hero?.addEventListener("pointermove", (event) => {
    const box = hero.getBoundingClientRect();
    hero.style.setProperty("--pointer-x", (event.clientX - box.left) + "px");
    hero.style.setProperty("--pointer-y", (event.clientY - box.top) + "px");
  });

  const revealTargets = document.querySelectorAll(".product-story, .repair-section, .concierge-section, .reviews-section, .visit-section");
  if ("IntersectionObserver" in window) {
    revealTargets.forEach((target) => target.classList.add("reveal-ready"));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    revealTargets.forEach((target) => observer.observe(target));
  }

  const quoteForm = "<form class=\"concierge-form quote-form\">\n    <div class=\"form-grid\">\n      <label>Customer name<input name=\"name\" autocomplete=\"name\" required placeholder=\"Your full name\"></label>\n      <label>Phone number<input name=\"phone\" type=\"tel\" autocomplete=\"tel\" required placeholder=\"05X XXX XXXX\"></label>\n      <label>Preferred brand<select name=\"brand\" required><option value=\"\" disabled selected>Select brand</option><option>Apple</option><option>Samsung</option><option>Google</option><option>OnePlus</option><option>Other</option></select></label>\n      <label>Model<input name=\"model\" required placeholder=\"Example: iPhone 17 Pro\"></label>\n      <label class=\"wide\">Storage / colour<input name=\"variant\" placeholder=\"Example: 256GB, orange\"></label>\n      <label class=\"wide\">Budget / remarks<textarea name=\"remarks\" rows=\"4\" placeholder=\"New or used preference and any other details\"></textarea></label>\n    </div>\n    <button class=\"button button-whatsapp\" type=\"submit\">Request on WhatsApp →</button>\n  </form>";

  const card = document.querySelector(".concierge-card");
  const tabs = card ? Array.from(card.querySelectorAll(".form-tabs button")) : [];
  const initialRepairForm = card?.querySelector(".concierge-form")?.outerHTML || "";
  const heading = card?.querySelector(".form-heading");

  function bindForm(form, kind) {
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const lines = kind === "booking"
        ? [
            "Hello Live World, I would like to book a service or repair.",
            "Customer name: " + data.get("name"),
            "Phone: " + data.get("phone"),
            "Brand: " + data.get("brand"),
            "Model: " + data.get("model"),
            "Service: " + data.get("service"),
            "Complaint / remarks: " + data.get("remarks"),
          ]
        : [
            "Hello Live World, I would like a mobile phone quote.",
            "Customer name: " + data.get("name"),
            "Phone: " + data.get("phone"),
            "Brand: " + data.get("brand"),
            "Model: " + data.get("model"),
            "Storage / colour: " + data.get("variant"),
            "Budget / remarks: " + data.get("remarks"),
          ];
      window.open(whatsappLink(lines.join("\n")), "_blank", "noopener,noreferrer");
    });
  }

  function showForm(kind) {
    if (!card) return;
    tabs.forEach((tab, index) => {
      const active = (kind === "booking" && index === 0) || (kind === "quote" && index === 1);
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    const current = card.querySelector(".concierge-form");
    if (current) current.outerHTML = kind === "booking" ? initialRepairForm : quoteForm;
    if (heading) heading.innerHTML = kind === "booking"
      ? "<h3>Service or repair booking</h3><p>Enter the device and complaint details below.</p>"
      : "<h3>Ask for a mobile phone quote</h3><p>Tell us the exact phone and configuration you need.</p>";
    bindForm(card.querySelector(".concierge-form"), kind);
  }

  tabs[0]?.addEventListener("click", () => showForm("booking"));
  tabs[1]?.addEventListener("click", () => showForm("quote"));
  bindForm(card?.querySelector(".concierge-form"), "booking");

  const branches = [
    ["Muhaisnah 4", "Live World Hub Electronics LLC Muhaisnah 4 Dubai"],
    ["Al Warqaa 1", "Live World Electronics Q1 Mall Al Warqaa 1 Dubai"],
    ["Mirdif", "Live World Electronics Trading LLC Abaya Mall Mirdif Dubai"],
    ["Oud Al Muteena", "Liveworld Electronic Trading Emirates Cooperative Society Oud Al Muteena Dubai"],
    ["Al Khawaneej", "Live World Electronics Al Khawaneej Dubai"],
  ];
  const branchButtons = Array.from(document.querySelectorAll(".branch-switcher button"));
  const mapFrame = document.querySelector(".map-card iframe");
  branchButtons.forEach((button, index) => button.addEventListener("click", () => {
    branchButtons.forEach((item, itemIndex) => item.classList.toggle("active", itemIndex === index));
    if (mapFrame && branches[index]) {
      mapFrame.title = "Google Map showing " + branches[index][0] + " branch";
      mapFrame.src = "https://www.google.com/maps?q=" + encodeURIComponent(branches[index][1]) + "&output=embed";
    }
  }));

  const counter = document.querySelector(".site-view-count");
  const counterValue = counter?.querySelector("span");
  const countedKey = "live-world-github-official-view-counted";
  const alreadyCounted = sessionStorage.getItem(countedKey) === "1";
  if (!alreadyCounted) sessionStorage.setItem(countedKey, "1");
  const counterUrl = "https://api.counterapi.dev/v1/live-world-electronics/github-official" + (alreadyCounted ? "" : "/up");
  fetch(counterUrl, { cache: "no-store" })
    .then((response) => response.ok ? response.json() : Promise.reject(new Error("counter unavailable")))
    .then((data) => {
      const value = data.count ?? data.value ?? data.counter?.count;
      if (counterValue && Number.isFinite(Number(value))) counterValue.textContent = Number(value).toLocaleString();
    })
    .catch(() => {});
})();
