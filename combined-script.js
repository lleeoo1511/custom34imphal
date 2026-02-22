

const deliveryRates = {
  // Imphal Area
  "Babupara": 50,
  "Baashikhong":80,
  "Chanchipur": 70,
  "Checkon": 50,
  "Chingmeirong": 50,
  "Ghari": 60,
  "Haobam Marak": 50,
  "Hapta": 50,
  "Heirangoithong": 50,
  "Kakwa": 50,
  "Keishampat": 50,
  "Keisamthong": 50,
  "Khongman": 70,
  "Khurai": 60,
  "Kongba": 70,

  "Kwakeithel": 50,
  "Lamphel Supermarket": 50,
  "Langol Shija": 70,
  "Malom": 60,
  "Moirangkhong": 50,
  "Naoremthong Bazar": 50,
  "Paona Bazar": 50,
  "Porompat": 70,
  "Sagolband": 50,
  "Singjamei": 50,
  "Tarung": 60,
  "Thangal Bazar": 50,
  "Thangmeiband": 50,
  "Uripok": 60,
  "Wangkhei": 50,
  "Yaiskhul": 50,

  // Outside Imphal
  "Ahallup": 90,
  "Andro Lamkhai": 170,
  "Bishnupur": 120,
  "Heingang": 100,
  "Heirok": 180,
  "Hiyangthang": 100,
  "Iroishemba": 70,
  "Kakching Bazar": 140,
  "Kakching Lamkhai": 140,
  "Keinou Bazar": 100,
  "Khangabok Bazar": 120,
  "Khongampat": 100,
  "Kiyamgei": 80,
  "Koirengei Bazar": 100,
  "Lairenkabi": 130,
  "Lamlai Bazar": 130,
  "Langjing Achouba": 70,
  "Lilong Bazar": 100,
  "Mayang Imphal": 130,
  "Moirang Bazar": 160,
  "Nambol Bazar": 90,
  "Ningthoukhong": 130,
  "Oinam": 100,
  "Patsoi": 90,
  "Sekmai": 150,
  "Thoubal Bazar": 120,
  "Wangbal Bazar": 120,
  "Wangoi": 100,
  "Yairipok Bazar": 140
};

const select = document.getElementById("location");
const priceBox = document.getElementById("price");
const suggestionsBox = document.getElementById("suggestions");
const searchInput = document.getElementById("search");

// Sort locations alphabetically
const sortedLocations = Object.keys(deliveryRates).sort();

// Show suggestions based on search input
function showSuggestions() {
  const input = searchInput.value.toLowerCase();
  suggestionsBox.innerHTML = "";

  if (!input) {
    select.value = "";
    showPrice();
    suggestionsBox.style.display = "none";
    return;
  }

  const matches = sortedLocations.filter(location =>
    location.toLowerCase().startsWith(input)
  );

  if (matches.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  matches.forEach(location => {
    const div = document.createElement("div");
    div.textContent = location;

    div.onclick = () => {
      select.value = location;
      searchInput.value = location;
      suggestionsBox.style.display = "none";
      showPrice();
    };

    suggestionsBox.appendChild(div);
  });

  suggestionsBox.style.display = "block";
}

// Populate dropdown with locations
if (select) {
  sortedLocations.forEach(location => {
    const option = document.createElement("option");
    option.value = location;
    option.textContent = location;
    select.appendChild(option);
  });
}

// Show price based on selected location
function showPrice() {
  const area = select.value;
  priceBox.textContent = area
    ? `\u20B9 ${deliveryRates[area]}`
    : "Price will appear here";

  if (typeof renderCart === "function") {
    renderCart();
  }
}

// Close suggestions when clicking outside
if (searchInput && suggestionsBox) {
  document.addEventListener('click', function(event) {
    if (!searchInput.contains(event.target) && !suggestionsBox.contains(event.target)) {
      suggestionsBox.style.display = "none";
    }
  });
}

/* ================= FADE SLIDER FUNCTION ================= */

document.querySelectorAll('.slider-wrapper').forEach(wrapper => {
  const cards = wrapper.querySelectorAll('.product-card');
  const nextBtn = wrapper.querySelector('.next');
  const prevBtn = wrapper.querySelector('.prev');

  let index = 0;

  function showCard(i) {
    cards.forEach(card => card.classList.remove('active'));
    cards[i].classList.add('active');
  }

  showCard(index);

  nextBtn.addEventListener('click', () => {
    index = (index + 1) % cards.length;
    showCard(index);
  });

  prevBtn.addEventListener('click', () => {
    index = (index - 1 + cards.length) % cards.length;
    showCard(index);
  });

  /* Swipe Support */
  let startX = 0;

  wrapper.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });

  wrapper.addEventListener('touchend', e => {
    let endX = e.changedTouches[0].clientX;
    let diff = startX - endX;

    if (diff > 50) {
      index = (index + 1) % cards.length;
    } else if (diff < -50) {
      index = (index - 1 + cards.length) % cards.length;
    }

    showCard(index);
  });
});

// ===== QUANTITY SYSTEM =====
document.addEventListener("click", function(e) {

  const plus = e.target.closest(".plus");
  const minus = e.target.closest(".minus");

  if (plus) {
    const container = plus.closest(".quantity-selector");
    const value = container.querySelector(".qty-value");
    value.textContent = parseInt(value.textContent) + 1;
  }

  if (minus) {
    const container = minus.closest(".quantity-selector");
    const value = container.querySelector(".qty-value");
    let current = parseInt(value.textContent);
    if (current > 0) {
      value.textContent = current - 1;
    }
  }

});



// ===== SIMPLE CART SYSTEM =====
let cart = [];
let toastTimeoutId = null;
const cartItemsEl = document.getElementById("cart-items");
const cartCountBadgeEl = document.getElementById("cart-count-badge");
const cartTotalEl = document.getElementById("cart-total");
const cartItemsTotalEl = document.getElementById("cart-items-total");
const cartDeliveryChargeEl = document.getElementById("cart-delivery-charge");
const cartDeliveryLabelEl = document.getElementById("cart-delivery-label");
const cartPanelEl = document.getElementById("cart-panel");
const cartBarEl = document.getElementById("cart-bar");
const cartToggleBtnEl = document.getElementById("cart-toggle-btn");
const cartToggleCountEl = document.getElementById("cart-toggle-count");
const customerLocationEl = document.getElementById("customer-location");
const customerPhoneEl = document.getElementById("customer-phone");
const serviceTypeEl = document.getElementById("service-type");
const customerLocationFieldEl = document.getElementById("customer-location-field");
const customerLocationSuggestionsEl = document.getElementById("customer-location-suggestions");
let isCartOpen = false;
const CART_STORAGE_KEY = "custom34_cart_state_v1";
const ORDER_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbyhil99Mh_wro7iWrpnf6mGQ5Bj7WmuxXyhjl22d2ZCI72zSSur_hdyhzqr2HhmfOFm/exec";

function showPageToast(message) {
  let container = document.querySelector(".page-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "page-toast-container";
    document.body.appendChild(container);
  }

  const existingToast = container.querySelector(".page-toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = "page-toast";
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 250);
  }, 2200);
}

function toNumber(value) {
  return Number(value) || 0;
}

function parsePrice(priceText) {
  return Number(String(priceText).replace(/[^\d.]/g, "")) || 0;
}

function formatRupees(amount) {
  return `\u20B9${Math.round(amount)}`;
}

function normalizePhoneNumber(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

function findMatchedLocation(locationText) {
  const normalized = String(locationText || "").trim().toLowerCase().replace(/\s+/g, " ");
  if (!normalized) return "";

  const exactMatch = sortedLocations.find(
    location => location.toLowerCase().replace(/\s+/g, " ") === normalized
  );
  if (exactMatch) return exactMatch;

  return "";
}

function getDeliveryCharge() {
  const serviceType = String(serviceTypeEl?.value || "").trim();
  if (serviceType !== "Delivery") return 0;

  const typedLocation = String(customerLocationEl?.value || "").trim();
  const matchedLocation = findMatchedLocation(typedLocation);

  return matchedLocation ? toNumber(deliveryRates[matchedLocation]) : 0;
}

function getDeliverySummary() {
  const serviceType = String(serviceTypeEl?.value || "").trim();
  if (serviceType !== "Delivery") {
    return { label: "Delivery", charge: 0 };
  }

  const typedLocation = String(customerLocationEl?.value || "").trim();
  const matchedLocation = findMatchedLocation(typedLocation);
  const charge = matchedLocation ? toNumber(deliveryRates[matchedLocation]) : 0;
  const locationLabel = matchedLocation || typedLocation || "Not selected";

  return { label: `Delivery (${locationLabel})`, charge };
}

function updateServiceTypeUI() {
  if (!serviceTypeEl || !customerLocationFieldEl) return;

  const isDelivery = serviceTypeEl.value === "Delivery";
  customerLocationFieldEl.classList.toggle("hidden", !isDelivery);

  if (!isDelivery && customerLocationSuggestionsEl) {
    customerLocationSuggestionsEl.classList.add("hidden");
    customerLocationSuggestionsEl.innerHTML = "";
  }
}

function updateCustomerLocationSuggestions() {
  if (!customerLocationEl || !customerLocationSuggestionsEl) return;

  const input = String(customerLocationEl.value || "").trim().toLowerCase();
  if (!input) {
    customerLocationSuggestionsEl.classList.add("hidden");
    customerLocationSuggestionsEl.innerHTML = "";
    return;
  }

  const matches = sortedLocations.filter(location =>
    location.toLowerCase().startsWith(input)
  );

  if (matches.length === 0) {
    customerLocationSuggestionsEl.classList.add("hidden");
    customerLocationSuggestionsEl.innerHTML = "";
    return;
  }

  customerLocationSuggestionsEl.innerHTML = matches
    .slice(0, 8)
    .map(
      location => `<div class="customer-location-suggestion-item" data-location="${location}">${location}</div>`
    )
    .join("");

  customerLocationSuggestionsEl.classList.remove("hidden");
}

function loadCartState() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return;

    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed.cart)) {
      cart = parsed.cart;
    }
  } catch (err) {
    // Ignore invalid storage entries
  }
}

function saveCartState() {
  try {
    const payload = {
      cart
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    // Ignore storage failures
  }
}

function clearCustomerDetails() {
  if (customerPhoneEl) customerPhoneEl.value = "";
  if (serviceTypeEl) serviceTypeEl.value = "";
  if (customerLocationEl) customerLocationEl.value = "";
  if (customerLocationSuggestionsEl) {
    customerLocationSuggestionsEl.classList.add("hidden");
    customerLocationSuggestionsEl.innerHTML = "";
  }
  updateServiceTypeUI();
}

function setCartOpen(nextOpen) {
  isCartOpen = nextOpen;
  cartPanelEl.classList.toggle("open", isCartOpen);
  cartBarEl.classList.toggle("open", isCartOpen);
  cartToggleBtnEl.setAttribute("aria-expanded", String(isCartOpen));
}

function renderCart() {
  const validEntries = cart
    .map((item, index) => ({ item, index }))
    .filter(entry => toNumber(entry.item.quantity) > 0);

  const totalItems = validEntries.reduce((sum, entry) => sum + toNumber(entry.item.quantity), 0);
  const itemsTotal = validEntries.reduce(
    (sum, entry) => sum + parsePrice(entry.item.price) * toNumber(entry.item.quantity),
    0
  );
  const deliveryCharge = getDeliveryCharge();
  const grandTotal = itemsTotal + deliveryCharge;
  const deliverySummary = getDeliverySummary();

  if (cartToggleCountEl) {
    cartToggleCountEl.textContent = String(totalItems);
  }

  if (!cartItemsEl || !cartCountBadgeEl || !cartTotalEl || !cartItemsTotalEl || !cartDeliveryChargeEl || !cartDeliveryLabelEl) {
    saveCartState();
    return;
  }

  cartCountBadgeEl.textContent = `${totalItems} item${totalItems === 1 ? "" : "s"}`;
  if (cartItemsTotalEl) {
    cartItemsTotalEl.textContent = formatRupees(itemsTotal);
  }
  if (cartDeliveryChargeEl) {
    cartDeliveryChargeEl.textContent = formatRupees(deliverySummary.charge);
  }
  if (cartDeliveryLabelEl) {
    cartDeliveryLabelEl.textContent = deliverySummary.label;
  }
  cartTotalEl.textContent = formatRupees(grandTotal);

  if (validEntries.length === 0) {
    cartItemsEl.innerHTML = '<p class="cart-empty-text">Your cart is empty.</p>';
    saveCartState();
    return;
  }

  cartItemsEl.innerHTML = validEntries.map(entry => `
    <div class="cart-item">
      <div class="cart-item-top">
        <div class="cart-item-text">
          <div class="cart-item-name">${entry.item.name}</div>
          <div class="cart-item-size">${entry.item.size}</div>
        </div>
        <button class="cart-remove-btn" data-index="${entry.index}" type="button">Remove</button>
      </div>
      <div class="cart-item-meta">
        <span>Qty: ${entry.item.quantity}</span>
        <span>${entry.item.price}</span>
      </div>
    </div>
  `).join("");

  saveCartState();
}

document.addEventListener("click", function(e) {

  const addBtn = e.target.closest(".add-to-cart-btn");
  if (addBtn) {

    const product = addBtn.closest(".product-card");

    const name = product.querySelector(".product-name").textContent;
    const size = product.querySelector(".product-size").textContent;
    const price = product.querySelector(".price").textContent;
    const quantity = toNumber(product.querySelector(".qty-value")?.textContent || "0");

    if (quantity <= 0) {
      showPageToast("Please select quantity above 0");
      return;
    }

    cart.push({
      name,
      size,
      price,
      quantity
    });

    showPageToast(`${name} added to cart`);
    renderCart();
  }

});

document.addEventListener("click", function(e) {
  const removeBtn = e.target.closest(".cart-remove-btn");
  if (!removeBtn) return;

  const index = Number(removeBtn.dataset.index);
  if (Number.isNaN(index) || !cart[index]) return;

  const removedItem = cart[index];
  cart.splice(index, 1);
  renderCart();
  showPageToast(`${removedItem.name} removed from cart`);
});

const orderAllBtnEl = document.getElementById("order-all-btn");
if (orderAllBtnEl) {
orderAllBtnEl.addEventListener("click", async function() {

  const validItems = cart.filter(item => Number(item.quantity) > 0);
  const totalQuantity = validItems.reduce((sum, item) => sum + Number(item.quantity), 0);
  const customerLocation = String(customerLocationEl.value || "").trim();
  const customerPhoneRaw = String(customerPhoneEl.value || "").trim();
  const serviceType = String(serviceTypeEl.value || "").trim();
  const customerPhone = normalizePhoneNumber(customerPhoneRaw);
  const matchedLocation = findMatchedLocation(customerLocation);
  const deliveryCharge = getDeliveryCharge();

  if (totalQuantity === 0) {
    showPageToast("Your cart is empty!");
    return;
  }

  if (!customerPhone || customerPhone.length < 10) {
    showPageToast("Please enter a valid phone number");
    customerPhoneEl.focus();
    return;
  }

  if (!serviceType) {
    showPageToast("Please select pickup or delivery");
    serviceTypeEl.focus();
    return;
  }

  if (serviceType === "Delivery" && !customerLocation) {
    showPageToast("Please enter customer location");
    customerLocationEl.focus();
    return;
  }

  if (serviceType === "Delivery" && deliveryCharge <= 0) {
    showPageToast("Please select a valid delivery area");
    customerLocationEl.focus();
    return;
  }

  const webhookUrl = String(ORDER_WEBHOOK_URL || "").trim();
  if (!webhookUrl) {
    showPageToast("Paste your Apps Script Web App URL in combined-script.js");
    return;
  }

  const itemsTotal = validItems.reduce(
    (sum, item) => sum + parsePrice(item.price) * Number(item.quantity),
    0
  );
  const grandTotal = itemsTotal + deliveryCharge;

  const payload = {
    orderId: `ORD-${Date.now()}`,
    placedAt: new Date().toISOString(),
    customer: {
      phone: customerPhone,
      serviceType,
      location: serviceType === "Delivery" ? (matchedLocation || customerLocation) : "Pickup at store"
    },
    items: validItems.map(item => ({
      name: item.name,
      size: item.size,
      quantity: Number(item.quantity),
      unitPrice: parsePrice(item.price),
      lineTotal: parsePrice(item.price) * Number(item.quantity)
    })),
    totals: {
      itemsTotal,
      deliveryCharge,
      grandTotal
    }
  };

  const originalLabel = orderAllBtnEl.textContent;
  orderAllBtnEl.disabled = true;
  orderAllBtnEl.textContent = "Placing...";

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    let responseData = null;
    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch (parseErr) {
      responseData = null;
    }

    if (!response.ok) {
      throw new Error(`Order request failed with status ${response.status}`);
    }

    if (responseData && responseData.ok === false) {
      throw new Error(responseData.error || "Apps Script returned an error");
    }

    cart = [];
    clearCustomerDetails();
    renderCart();
    showPageToast("Order placed successfully");
  } catch (err) {
    showPageToast(`Order failed: ${err.message || "Unknown error"}`);
  } finally {
    orderAllBtnEl.disabled = false;
    orderAllBtnEl.textContent = originalLabel;
  }
});
}

if (select) {
  select.addEventListener("change", function() {
    renderCart();
  });
}

if (serviceTypeEl) {
  serviceTypeEl.addEventListener("change", function() {
    updateServiceTypeUI();
    renderCart();
  });
}

if (customerLocationEl) {
  customerLocationEl.addEventListener("input", function() {
    updateCustomerLocationSuggestions();
    renderCart();
  });

  customerLocationEl.addEventListener("focus", function() {
    updateCustomerLocationSuggestions();
  });
}

if (customerLocationSuggestionsEl && customerLocationEl) {
  customerLocationSuggestionsEl.addEventListener("click", function(event) {
    const item = event.target.closest(".customer-location-suggestion-item");
    if (!item) return;

    const nextLocation = item.dataset.location || "";
    customerLocationEl.value = nextLocation;
    renderCart();

    customerLocationSuggestionsEl.classList.add("hidden");
    customerLocationSuggestionsEl.innerHTML = "";
  });
}

document.addEventListener("click", function(event) {
  if (!customerLocationEl || !customerLocationSuggestionsEl) return;

  const clickedInsideInput = customerLocationEl.contains(event.target);
  const clickedInsideSuggestions = customerLocationSuggestionsEl.contains(event.target);
  if (!clickedInsideInput && !clickedInsideSuggestions) {
    customerLocationSuggestionsEl.classList.add("hidden");
  }
});

if (cartToggleBtnEl) {
  cartToggleBtnEl.addEventListener("click", function() {
    saveCartState();
    const onCartPage = document.body.classList.contains("cart-page");
    if (onCartPage) {
      if (window.opener && !window.opener.closed) {
        window.opener.focus();
      } else {
        window.location.href = "index.html";
      }
      return;
    }

    const cartWindow = window.open("cart.html", "custom34_cart");
    if (cartWindow) {
      cartWindow.focus();
    }
  });
}

const returnBtnEl = document.getElementById("return-btn");
if (returnBtnEl) {
  returnBtnEl.addEventListener("click", function() {
    if (window.opener && !window.opener.closed) {
      window.opener.focus();
      window.close();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "index.html";
    }
  });
}

updateServiceTypeUI();
loadCartState();
renderCart();



