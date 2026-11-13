let cart = [];

// Category အလိုက် Menu စစ်ထုတ်ပြသခြင်း
function filterMenu(category, clickedBtn) {
  const items = document.querySelectorAll(".menu-item");
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach((btn) => btn.classList.remove("active"));
  clickedBtn.classList.add("active");

  // Search box ကို ပြန်ရှင်းထားမည်
  document.getElementById("search-input").value = "";

  items.forEach((item) => {
    if (category === "all" || item.getAttribute("data-category") === category) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

// ဟင်းပွဲနာမည်ဖြင့် ရှာဖွေခြင်း
function searchMenu() {
  const query = document.getElementById("search-input").value.toLowerCase();
  const items = document.querySelectorAll(".menu-item");

  items.forEach((item) => {
    const title = item.querySelector("h3").textContent.toLowerCase();
    const desc = item.querySelector("p").textContent.toLowerCase();
    if (title.includes(query) || desc.includes(query)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

// Order List ထဲသို့ ထည့်ခြင်း (ရှိပြီးသားဆိုလျှင် အရေအတွက် တိုးပေးမည်)
function addToOrder(name, price) {
  const existingItem = cart.find((item) => item.name === name);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateOrderDisplay();
}

// အရေအတွက် အတိုး/အလျှော့ ပြုလုပ်ခြင်း
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateOrderDisplay();
}

// Order List UI ကို အသစ်ပြန်ဆွဲခြင်း
function updateOrderDisplay() {
  const orderList = document.getElementById("order-list");
  const totalPriceEl = document.getElementById("total-price");
  const itemCountEl = document.getElementById("item-count");

  orderList.innerHTML = "";
  let totalAmount = 0;
  let totalItems = 0;

  if (cart.length === 0) {
    orderList.innerHTML =
      '<li class="empty-msg">Your plate is currently empty. Select a dish above to begin!</li>';
  } else {
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.qty;
      totalAmount += itemTotal;
      totalItems += item.qty;

      const li = document.createElement("li");
      li.innerHTML = `
                <div>
                    <strong>${item.name}</strong>
                    <div style="font-size: 0.8rem; color: #a0a6b1;">${item.price.toLocaleString()} MMK each</div>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                    <span style="min-width: 85px; text-align: right; color: #d4af37; font-weight: 600;">
                        ${itemTotal.toLocaleString()} MMK
                    </span>
                </div>
            `;
      orderList.appendChild(li);
    });
  }

  totalPriceEl.textContent = totalAmount.toLocaleString() + " MMK";
  itemCountEl.textContent =
    totalItems + (totalItems === 1 ? " Item" : " Items");
}

// Order အားလုံး ဖျက်ခြင်း
function clearOrder() {
  cart = [];
  updateOrderDisplay();
}

// Order အတည်ပြုပြီး Receipt ပြသခြင်း
function confirmOrder() {
  if (cart.length === 0) {
    alert("Please select at least one dish before confirming your order.");
    return;
  }

  const receiptBox = document.getElementById("receipt-summary");
  let total = 0;
  let receiptHTML = "";

  cart.forEach((item) => {
    const sub = item.price * item.qty;
    total += sub;
    receiptHTML += `<div>• ${item.name} (x${item.qty}) — ${sub.toLocaleString()} MMK</div>`;
  });

  receiptHTML += `<hr style="border-color: rgba(212,175,55,0.3); margin: 10px 0;">`;
  receiptHTML += `<strong>Total Paid: ${total.toLocaleString()} MMK</strong>`;

  receiptBox.innerHTML = receiptHTML;
  document.getElementById("order-modal").style.display = "flex";
}

// Modal ပြန်ပိတ်ခြင်း
function closeModal() {
  document.getElementById("order-modal").style.display = "none";
  clearOrder();
}

// "+ Add to Order" ခလုတ်နှိပ်လိုက်လျှင် Visual Feedback ပြသခြင်း
document.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("order-btn")) {
    const btn = e.target;
    const originalText = btn.textContent;

    btn.textContent = "✓ Added";
    btn.style.backgroundColor = "#2a9d8f";
    btn.style.borderColor = "#2a9d8f";
    btn.style.color = "#ffffff";

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.backgroundColor = "";
      btn.style.borderColor = "";
      btn.style.color = "";
    }, 700);
  }
});
