
function loadProducts() {
  fetch('product.json')
    .then(res => res.json())
    .then(data => showDetails(data.products))
}

loadProducts();



const showDetails = (products) => {
  const list = document.getElementById('product-list');

  products.forEach(item => {
    const div = document.createElement('div');
    div.dataset.id = item.id;

    div.innerHTML = `
      <div class="card bg-base-100 shadow-md border border-base-200 hover:shadow-lg transition-shadow h-full">
        <figure class="px-6 pt-6">
          <img src="${item.image}" alt="${item.title}" class="rounded-xl h-40 w-full object-cover"
               onerror="this.src='https://placehold.co/300x160?text=No+Image'"/>
        </figure>
        <div class="card-body items-center text-center p-4">
          <h2 class="card-title text-sm">${item.title}</h2>
          <p class="text-xs text-gray-500">${item.description.slice(0, 80)}...</p>
          <div class="flex items-center gap-1 text-yellow-400 text-sm">
            ${'★'.repeat(Math.floor(item.rating))}${'☆'.repeat(5 - Math.floor(item.rating))}
            <span class="text-gray-400 text-xs">(${item.rating})</span>
          </div>
          <p class="text-primary font-bold text-lg">$${item.price.toFixed(2)}</p>
          <div class="card-actions w-full">
            <button
              class="btn btn-primary btn-sm w-full"
              onclick="addToCart(${item.id}, ${item.price}, \`${item.title}\`, '${item.image}')">
              🛒 Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;

    list.appendChild(div);
  });
};


let cart = {}; 
let  shipping = 80;
let userBalance = 1000;
let appliedDiscount = 0; 

const updateBalanceDisplay = () => {
  const el = document.getElementById('user-balance');

  if (el) {
    el.textContent = '$' + userBalance.toFixed(2);
  }
};

const applyCoupon = () => {
  const code = document.getElementById('coupon-input').value.trim().toUpperCase();
  const status = document.getElementById('coupon-status');
  if (code === 'SMART10') {
    appliedDiscount = 10;
    status.innerHTML = '<span class="text-success">✅ 10% off applied</span>';
    renderCart();
  } else {
    status.innerHTML = '<span class="text-error">❌ Invalid coupon</span>';
  }
};

const addMoney = () => {
  userBalance += 1000;
  updateBalanceDisplay();
  showToast("✅ $1000 added to your balance!");
  renderCart();
};


function loadReviews() {
  fetch('reviews.json')
    .then(res => res.json())
    .then(data => renderReviews(data.reviews));
}

const reviews = [
  {
    name: "John Smith",
    date: "May 2026",
    rating: 5,
    comment:
      "Amazing products and super fast delivery. Highly recommended!"
  },
  {
    name: "Sarah Johnson",
    date: "April 2026",
    rating: 4,
    comment:
      "The gaming keyboard quality is excellent. Customer support was helpful."
  },
  {
    name: "Michael Brown",
    date: "March 2026",
    rating: 5,
    comment:
      "Best electronics store I've used so far. Prices are reasonable too."
  },
  {
    name: "Emily Davis",
    date: "February 2026",
    rating: 4,
    comment:
      "Very clean website and smooth shopping experience."
  },
  {
    name: "Daniel Wilson",
    date: "January 2026",
    rating: 5,
    comment:
      "Fantastic collection of PC parts and accessories."
  }
];

const reviewSlider = document.getElementById("review-slider");
const reviewDots = document.getElementById("review-dots");

let currentReview = 0;
let autoSlide;


function renderReviews() {

  reviewSlider.innerHTML = reviews.map(review => `
  
    <div class="min-w-full px-4">

      <div class="card bg-base-100 shadow-lg border border-base-300">

        <div class="card-body">

          <div class="flex justify-between items-start">

            <div>

              <h3 class="font-bold text-lg">
                ${review.name}
              </h3>

              <p class="text-sm text-gray-500">
                ${review.date}
              </p>

            </div>

            <div class="text-yellow-400 text-lg">

              ${'★'.repeat(Math.floor(review.rating))}
              ${'☆'.repeat(5 - Math.floor(review.rating))}

            </div>

          </div>

          <p class="mt-4 text-gray-600 leading-relaxed">
            "${review.comment}"
          </p>

        </div>

      </div>

    </div>

  `).join("");


  reviewDots.innerHTML = reviews.map((_, index) => `
  
    <button
      class="w-3 h-3 rounded-full bg-gray-300 review-dot"
      onclick="goToReview(${index})">
    </button>

  `).join("");



  updateReviewSlider();
}



function updateReviewSlider() {

  reviewSlider.style.transform =
    `translateX(-${currentReview * 100}%)`;




  const dots = document.querySelectorAll(".review-dot");

  dots.forEach((dot, index) => {

    if (index === currentReview) {
      dot.classList.add("bg-primary");
      dot.classList.remove("bg-gray-300");
    }

    else {
      dot.classList.remove("bg-primary");
      dot.classList.add("bg-gray-300");
    }

  });
}




function nextReview() {

  currentReview++;

  if (currentReview >= reviews.length) {
    currentReview = 0;
  }

  updateReviewSlider();
}




function prevReview() {

  currentReview--;

  if (currentReview < 0) {
    currentReview = reviews.length - 1;
  }

  updateReviewSlider();
}




function goToReview(index) {

  currentReview = index;

  updateReviewSlider();
}




function startAutoSlide() {

  autoSlide = setInterval(() => {

    nextReview();

  }, 4000);
}


function stopAutoSlide() {

  clearInterval(autoSlide);
}




document.getElementById("next-review")
  .addEventListener("click", () => {

    nextReview();

    stopAutoSlide();
    startAutoSlide();

  });


document.getElementById("prev-review")
  .addEventListener("click", () => {

    prevReview();

    stopAutoSlide();
    startAutoSlide();

  });


renderReviews();

startAutoSlide();



const addToCart = (id, price, title, image) => {
  if (cart[id]) {
    cart[id].quantity++;
  } else {
    cart[id] = { id, title, price, qty: 1, image };
  }
  renderCart();
  showToast(`"${title}" added to cart!`);
};

const removeFromCart = (id) => {
  delete cart[id];
  renderCart();
};

const updateQty = (id, changeamount) => {
  if (!cart[id]) return;
  cart[id].quantity += changeamount;
  if (cart[id].qty <= 0) delete cart[id];
  renderCart();
};

const clearCart = () => {
  if (Object.keys(cart).length === 0) return;
  cart = {};
  renderCart();
};




const renderCart = () => {
  const items      = Object.values(cart);
  const itemList   = document.getElementById('cart-items');
  const emptyState = document.getElementById('cart-empty');
  const cartFooter = document.getElementById('cart-footer');
  const cartBadge  = document.getElementById('cart-badge');
  const cartCount  = document.getElementById('cart-count');

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  let subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmount = subtotal * (appliedDiscount / 100);
  subtotal -= discountAmount;

  
  if (totalQty > 0) {
    cartBadge.textContent = totalQty;
    cartBadge.style.display = 'flex';
  } else {
    cartBadge.style.display = 'none';
  }

  cartCount.textContent = totalQty > 0 ? `(${totalQty})` : '';

  if (items.length === 0) {
    itemList.innerHTML   = '';
    emptyState.style.display = 'flex';
    cartFooter.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  cartFooter.style.display = 'block';

  
  itemList.innerHTML = items.map(item => `
    <div class="flex items-center gap-3 py-3 border-b border-base-200 last:border-0">
      <img src="${item.image}" alt="${item.title}"
           class="w-14 h-14 object-cover rounded-lg shrink-0 bg-base-200"
           onerror="this.src='https://placehold.co/56x56?text=?'"/>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-semibold leading-tight line-clamp-2">${item.title}</p>
        <p class="text-xs text-gray-400 mt-0.5">$${item.price.toFixed(2)} each</p>
        <div class="flex items-center gap-1 mt-1.5">
          <button class="btn btn-xs btn-circle btn-outline" onclick="updateQty(${item.id}, -1)">−</button>
          <span class="text-sm font-bold w-6 text-center">${item.qty}</span>
          <button class="btn btn-xs btn-circle btn-outline" onclick="updateQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <div class="text-right shrink-0 flex flex-col items-end gap-1">
        <p class="text-sm font-bold text-primary">$${(item.price * item.qty).toFixed(2)}</p>
        <button class="btn btn-xs btn-ghost text-error px-1" onclick="removeFromCart(${item.id})" title="Remove item">✕</button>
      </div>
    </div>
  `).join('');

  
  let delivery = 0;
  let deliveryNote = '';
  if (subtotal <= 500) {
    delivery = 0;
    deliveryNote = `Spend $${(500.01 - subtotal).toFixed(2)} more for paid delivery tier`;
  } else if (subtotal < 800) {
    delivery = 50;
    deliveryNote = `Spend $${(800 - subtotal).toFixed(2)} more → delivery becomes $100`;
  } else {
    delivery = 100;
    deliveryNote = 'Free delivery on orders over $800 is not available yet';
  }

const total = subtotal + delivery + shipping;

document.getElementById('cart-subtotal').textContent =
  subtotal.toFixed(2);

document.getElementById('cart-delivery').textContent =
  delivery.toFixed(2);

document.getElementById('shipping-cost').textContent =
  shipping.toFixed(2);

document.getElementById('cart-total').textContent =
  total.toFixed(2);

document.getElementById('delivery-note').textContent =
  deliveryNote;

}

const placeOrder = () => {
  if (Object.keys(cart).length === 0) return;

  const items = Object.values(cart);
  let subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmount = subtotal * (appliedDiscount / 100);
  subtotal -= discountAmount;

  let delivery = 0;
  if (subtotal > 500 && subtotal < 800) delivery = 50;
  else if (subtotal >= 800) delivery = 100;
  const total = subtotal + delivery;

  if (total > userBalance) {
    showToast("❌ Insufficient balance! Add money to continue.");
    return;
  }

 
  const summaryRows = items.map(i => `
    <div class="flex justify-between text-sm py-1 border-b border-base-200">
      <span>${i.title} × ${i.qty}</span>
      <span class="font-medium">$${(i.price * i.qty).toFixed(2)}</span>
    </div>
  `).join('');

  document.getElementById('order-summary').innerHTML = `
    <div class="my-3 max-h-48 overflow-y-auto">${summaryRows}</div>
    <div class="flex justify-between text-sm text-gray-500 mt-2">
      <span>Delivery</span><span>$${delivery.toFixed(2)}</span>
    </div>
    <div class="flex justify-between text-sm text-gray-500 mt-1">
  <span>Shipping</span>
  <span>$${shipping.toFixed(2)}</span>
</div>
    <div class="flex justify-between font-bold text-base mt-1">
      <span>Total Paid</span>
      <span class="text-primary">$${total.toFixed(2)}</span>
    </div>
  `;

  document.getElementById('order-modal').showModal();
  
  
  userBalance -= total;
  cart = {};
  appliedDiscount = 0;
  renderCart();
  updateBalanceDisplay();
};

function handleContactSubmit(e) {
  e.preventDefault();

  let valid = true;

  const name = document.getElementById('contactName').value.trim();
  const email = document.getElementById('contactEmail').value.trim();
  const message = document.getElementById('contactMessage').value.trim();

  
  ['nameError', 'emailError', 'messageError'].forEach(id => {
    document.getElementById(id).classList.add('hidden');
  });

  
  document.getElementById('contactSuccess').classList.add('hidden');

  
  if (name.length < 2) {
    showError(
      'nameError',
      'Please enter at least 2 characters.'
    );
    valid = false;
  }

  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    showError(
      'emailError',
      'Please enter a valid email address.'
    );
    valid = false;
  }

  
  if (message.length < 5) {
    showError(
      'messageError',
      'Message must be at least 5 characters.'
    );
    valid = false;
  }

 
  if (valid) {

    document.getElementById('contactSuccess')
      .classList.remove('hidden');

    showToast('✅ Message sent successfully!');

    document.getElementById('contactForm').reset();
  }
}


function showError(id, msg) {

  const el = document.getElementById(id);

  el.textContent = msg;

  el.classList.remove('hidden');
}


const showToast = (message) => {
  const toast = document.getElementById('cart-toast');
  const msg   = document.getElementById('toast-msg');
  msg.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 2500);
};



loadReviews();
updateBalanceDisplay();
