/* ==========================================================================
   KENHION ALLEN - EXCLUSIVE LIGHT BOUTIQUE APPLICATION ENGINE (app.js)
   Features: Real Products, Gender Filters, Size Guide Modal, FAQ Accordion, Wholesale Engine
   Style: Ultra-Clean Luxury Vector Interface (Zero Emojis)
   ========================================================================== */

// --- REAL KENHION ALLEN PRODUCTS DATASET (WITH GENDER CLASSIFICATION) ---
const PRODUCTS = [
  {
    id: 1,
    name: "Crop Top de Compresión",
    category: "KA ELITE",
    gender: "Mujer",
    price: 15.00,
    oldPrice: null,
    badge: "KA Elite",
    badgeType: "elite",
    image: "https://af606c0c04.cbaul-cdnwnd.com/a50e9269c7b3dca260132ece6590c58c/200000308-1f1501f152/IMG_1507.JPG.jpeg?ph=af606c0c04",
    fallbackImage: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80",
    description: "Diseñado para brindar compresión ergonómica, soporte y estética deportiva de alto nivel en tus entrenamientos."
  },
  {
    id: 2,
    name: "Biker de Compresión",
    category: "KA ELITE",
    gender: "Mujer",
    price: 15.00,
    oldPrice: null,
    badge: "KA Elite",
    badgeType: "elite",
    image: "https://af606c0c04.cbaul-cdnwnd.com/a50e9269c7b3dca260132ece6590c58c/200000318-03ccb03cce/IMG_1508.JPG.jpeg?ph=af606c0c04",
    fallbackImage: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=800&q=80",
    description: "Short estilo biker de compresión anatómica. Moldea la silueta con pretina alta antideslizante para máximo confort."
  },
  {
    id: 3,
    name: "Shorts KA Elite",
    category: "KA ELITE",
    gender: "Unisex",
    price: 25.00,
    oldPrice: null,
    badge: "KA Elite",
    badgeType: "elite",
    image: "https://af606c0c04.cbaul-cdnwnd.com/a50e9269c7b3dca260132ece6590c58c/200000335-e8567e8569/IMG_1509.JPG.jpeg?ph=af606c0c04",
    fallbackImage: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80",
    description: "Shorts deportivos livianos de máxima movilidad. Tacto ultra suave para entrenamiento o diario casual."
  },
  {
    id: 4,
    name: "Franela de Compresión",
    category: "KA ELITE",
    gender: "Hombre",
    price: 25.00,
    oldPrice: null,
    badge: "KA Elite",
    badgeType: "elite",
    image: "https://af606c0c04.cbaul-cdnwnd.com/a50e9269c7b3dca260132ece6590c58c/200000322-bb18ebb190/IMG_1510.JPG.jpeg?ph=af606c0c04",
    fallbackImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    description: "Franela técnica de ajuste firme al torso. Destaca la figura mientras mantiene alta respirabilidad."
  },
  {
    id: 5,
    name: "Sudadera KA Elite",
    category: "KA ELITE",
    gender: "Unisex",
    price: 25.00,
    oldPrice: null,
    badge: "KA Elite",
    badgeType: "elite",
    image: "https://af606c0c04.cbaul-cdnwnd.com/a50e9269c7b3dca260132ece6590c58c/200000330-b257eb2580/IMG_1511.JPG.jpeg?ph=af606c0c04",
    fallbackImage: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
    description: "Sudadera ligera de ajuste moderno. Corte contemporáneo con bordado frontal distintivo."
  },
  {
    id: 6,
    name: "Basic T Shirt Oversize",
    category: "P.O.D.",
    gender: "Unisex",
    price: 25.00,
    oldPrice: 28.00,
    badge: "Oferta P.O.D.",
    badgeType: "pod",
    image: "https://af606c0c04.cbaul-cdnwnd.com/a50e9269c7b3dca260132ece6590c58c/200000268-43acd43ace/IMG_1018.JPG.jpeg?ph=af606c0c04",
    fallbackImage: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
    description: "Camiseta con patrón Oversize holgado y caída estructurada. Modelo exclusivo Print On Demand en algodón grueso."
  },
  {
    id: 7,
    name: "Girl Shorts Resiliencia",
    category: "Resiliencia",
    gender: "Mujer",
    price: 26.00,
    oldPrice: null,
    badge: "Algodón 100%",
    badgeType: "resiliencia",
    image: "https://af606c0c04.cbaul-cdnwnd.com/a50e9269c7b3dca260132ece6590c58c/200000238-a233fa2344/IMG_0996.JPG.jpeg?ph=af606c0c04",
    fallbackImage: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80",
    description: "La colección Resiliencia destaca por la alta calidad de sus materiales, fabricadas en su totalidad de algodón, en estas prendas resalta la elegancia por su bordado minimalista."
  },
  {
    id: 8,
    name: "Shorts Resiliencia",
    category: "Resiliencia",
    gender: "Hombre",
    price: 28.00,
    oldPrice: null,
    badge: "Algodón 100%",
    badgeType: "resiliencia",
    image: "https://af606c0c04.cbaul-cdnwnd.com/a50e9269c7b3dca260132ece6590c58c/200000220-c7cfdc7cff/IMG_1006.JPG-2.jpeg?ph=af606c0c04",
    fallbackImage: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    description: "Shorts en algodón de alta densidad con estilo elegante y conservador. Perfectos para salir a cenar o ir de paseo a un mall."
  },
  {
    id: 9,
    name: "T Shirt Oversize Resiliencia",
    category: "Resiliencia",
    gender: "Unisex",
    price: 30.00,
    oldPrice: null,
    badge: "Algodón 100%",
    badgeType: "resiliencia",
    image: "https://af606c0c04.cbaul-cdnwnd.com/a50e9269c7b3dca260132ece6590c58c/200000253-a830da830f/IMG_0983.JPG.jpeg?ph=af606c0c04",
    fallbackImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    description: "Franela oversize en 100% algodón. Comodidad y bordado discreto que proyecta la grandeza que llevas dentro."
  },
  {
    id: 10,
    name: "Hoodie Resiliencia",
    category: "Resiliencia",
    gender: "Unisex",
    price: 35.00,
    oldPrice: null,
    badge: "Algodón 100%",
    badgeType: "resiliencia",
    image: "https://af606c0c04.cbaul-cdnwnd.com/a50e9269c7b3dca260132ece6590c58c/200000202-801c5801c6/IMG_1015.JPG.jpeg?ph=af606c0c04",
    fallbackImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
    description: "Hoodie con capucha en algodón pesado de máxima suavidad y abrigo. Icono de la colección Resiliencia."
  }
];

// --- APP STATE ---
let state = {
  currentCategory: 'all',
  currentGender: 'all',
  searchQuery: '',
  sortBy: 'featured',
  cart: JSON.parse(localStorage.getItem('ka_cart') || '[]'),
  selectedProduct: null,
  selectedSize: 'M',
  selectedQty: 1,
  cardSelectedSizes: {}
};

// --- DOM ELEMENTS ---
const elements = {
  productsGrid: document.getElementById('products-grid'),
  emptyState: document.getElementById('empty-catalog-state'),
  filterTabs: document.getElementById('filter-tabs'),
  genderPills: document.getElementById('gender-filter-pills'),
  sortSelect: document.getElementById('sort-select'),
  searchInput: document.getElementById('catalog-search-input'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  resetFiltersBtn: document.getElementById('reset-filters-btn'),
  
  countAll: document.getElementById('count-all'),
  countElite: document.getElementById('count-elite'),
  countResiliencia: document.getElementById('count-resiliencia'),
  countPod: document.getElementById('count-pod'),
  
  cartBtn: document.getElementById('cart-btn'),
  cartCounter: document.getElementById('cart-counter'),
  cartOverlay: document.getElementById('cart-drawer-overlay'),
  cartCloseBtn: document.getElementById('cart-close-btn'),
  cartItemsContainer: document.getElementById('cart-items-container'),
  
  wholesaleBanner: document.getElementById('wholesale-banner'),
  cartSubtotal: document.getElementById('cart-subtotal'),
  wholesaleDiscountRow: document.getElementById('wholesale-discount-row'),
  wholesaleDiscountVal: document.getElementById('wholesale-discount-val'),
  cartTotalFinal: document.getElementById('cart-total-final'),
  checkoutBtn: document.getElementById('checkout-btn'),
  
  modalOverlay: document.getElementById('product-modal-overlay'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  modalImg: document.getElementById('modal-product-img'),
  modalBadge: document.getElementById('modal-product-badge'),
  modalCategory: document.getElementById('modal-product-category'),
  modalTitle: document.getElementById('modal-product-title'),
  modalPrice: document.getElementById('modal-product-price'),
  modalOldPrice: document.getElementById('modal-product-old-price'),
  modalDesc: document.getElementById('modal-product-desc'),
  modalSizeOptions: document.getElementById('modal-size-options'),
  modalQtyVal: document.getElementById('modal-qty-val'),
  modalQtyMinus: document.getElementById('modal-qty-minus'),
  modalQtyPlus: document.getElementById('modal-qty-plus'),
  modalAddToCartBtn: document.getElementById('modal-add-to-cart-btn'),
  modalAddDozenBtn: document.getElementById('modal-add-dozen-btn'),
  
  sizeGuideModal: document.getElementById('size-guide-modal'),
  openSizeGuideBtn: document.getElementById('open-size-guide-btn'),
  modalOpenSizeGuide: document.getElementById('modal-open-size-guide'),
  sizeGuideCloseBtn: document.getElementById('size-guide-close-btn'),
  footerSizeGuideLink: document.getElementById('footer-size-guide-link'),
  
  searchTriggerBtn: document.getElementById('search-trigger-btn'),
  searchOverlay: document.getElementById('search-overlay'),
  searchModalClose: document.getElementById('search-modal-close'),
  quickSearchInput: document.getElementById('quick-search-modal-input'),
  searchResultsList: document.getElementById('search-results-list'),
  
  mobileMenuBtn: document.getElementById('mobile-menu-btn'),
  mobileNavDrawer: document.getElementById('mobile-nav-drawer'),
  mobileNavClose: document.getElementById('mobile-nav-close'),
  
  lightboxModal: document.getElementById('lightbox-modal'),
  lightboxClose: document.getElementById('lightbox-close'),
  lightboxImg: document.getElementById('lightbox-img'),
  lightboxCaption: document.getElementById('lightbox-caption'),
  
  toastContainer: document.getElementById('toast-container')
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.setAttribute('data-theme', 'light');
  updateCategoryCounts();
  renderProducts();
  updateCartUI();
  setupEventListeners();
  setupFAQAccordion();
});

// --- CATEGORY COUNTS ---
function updateCategoryCounts() {
  elements.countAll.textContent = PRODUCTS.length;
  elements.countElite.textContent = PRODUCTS.filter(p => p.category === 'KA ELITE').length;
  elements.countResiliencia.textContent = PRODUCTS.filter(p => p.category === 'Resiliencia').length;
  elements.countPod.textContent = PRODUCTS.filter(p => p.category === 'P.O.D.').length;
}

// --- CARD SIZE SELECTOR ---
function selectCardSize(productId, size, event) {
  if (event) event.stopPropagation();
  state.cardSelectedSizes[productId] = size;
  
  const container = document.getElementById(`card-sizes-${productId}`);
  if (container) {
    container.querySelectorAll('.card-size-pill').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim() === size);
    });
  }
}

window.selectCardSize = selectCardSize;

// --- FILTER & SORT ---
function getFilteredProducts() {
  let list = [...PRODUCTS];

  if (state.currentCategory !== 'all') {
    list = list.filter(p => p.category === state.currentCategory);
  }

  if (state.currentGender !== 'all') {
    list = list.filter(p => p.gender === state.currentGender || p.gender === 'Unisex');
  }

  if (state.searchQuery.trim() !== '') {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  if (state.sortBy === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === 'name') {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  return list;
}

// --- RENDER PRODUCTS GRID ---
function renderProducts() {
  const filtered = getFilteredProducts();

  if (filtered.length === 0) {
    elements.productsGrid.style.display = 'none';
    elements.emptyState.style.display = 'block';
    return;
  }

  elements.emptyState.style.display = 'none';
  elements.productsGrid.style.display = 'grid';

  elements.productsGrid.innerHTML = filtered.map(product => {
    const selectedSize = state.cardSelectedSizes[product.id] || 'M';
    
    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-img-box" onclick="openProductModal(${product.id})">
          <img src="${product.image}" 
               onerror="this.onerror=null; this.src='${product.fallbackImage}';" 
               alt="${product.name}" class="product-img" loading="lazy">
          <span class="product-badge-pill ${product.badgeType}">${product.badge}</span>
          
          <button class="quick-view-overlay-btn" onclick="event.stopPropagation(); openProductModal(${product.id})">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <span>Ver Detalle</span>
          </button>
        </div>

        <div class="product-info">
          <div class="card-meta-row">
            <span class="product-category-name">${product.category}</span>
            <span class="product-gender-tag">${product.gender}</span>
          </div>

          <h3 class="product-title" onclick="openProductModal(${product.id})" style="cursor:pointer;">${product.name}</h3>
          
          <div class="product-price-row">
            <span class="product-price">$${product.price.toFixed(2)}</span>
            ${product.oldPrice ? `<span class="product-old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
          </div>

          <!-- Interactive Card Size Selector -->
          <div class="card-size-selector-group">
            <span class="size-selector-label">Talla:</span>
            <div class="card-size-pills" id="card-sizes-${product.id}">
              <button type="button" class="card-size-pill ${selectedSize === 'S' ? 'active' : ''}" onclick="selectCardSize(${product.id}, 'S', event)">S</button>
              <button type="button" class="card-size-pill ${selectedSize === 'M' ? 'active' : ''}" onclick="selectCardSize(${product.id}, 'M', event)">M</button>
              <button type="button" class="card-size-pill ${selectedSize === 'L' ? 'active' : ''}" onclick="selectCardSize(${product.id}, 'L', event)">L</button>
              <button type="button" class="card-size-pill ${selectedSize === 'XL' ? 'active' : ''}" onclick="selectCardSize(${product.id}, 'XL', event)">XL</button>
            </div>
          </div>

          <div class="card-actions-group">
            <button class="add-cart-card-btn" onclick="addToCartDirect(${product.id})">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <span>Añadir a Cesta</span>
            </button>
            
            <button class="add-dozen-card-btn" onclick="addDozenToCart(${product.id})" title="Pedir 12 Unidades con 15% Descuento Al Mayor">
              <span>Pedir Docena (-15% Al Mayor)</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.openProductModal = openProductModal;
window.addToCartDirect = addToCartDirect;
window.addDozenToCart = addDozenToCart;

// --- PRODUCT QUICK VIEW MODAL ---
function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  state.selectedProduct = product;
  state.selectedSize = state.cardSelectedSizes[productId] || 'M';
  state.selectedQty = 1;

  elements.modalImg.src = product.image;
  elements.modalImg.onerror = () => { elements.modalImg.src = product.fallbackImage; };
  elements.modalBadge.textContent = product.badge;
  elements.modalCategory.textContent = `${product.category} • ${product.gender}`;
  elements.modalTitle.textContent = product.name;
  elements.modalPrice.textContent = `$${product.price.toFixed(2)}`;
  
  if (product.oldPrice) {
    elements.modalOldPrice.style.display = 'inline';
    elements.modalOldPrice.textContent = `$${product.oldPrice.toFixed(2)}`;
  } else {
    elements.modalOldPrice.style.display = 'none';
  }
  
  elements.modalDesc.textContent = product.description;
  elements.modalQtyVal.textContent = state.selectedQty;

  const sizeBtns = elements.modalSizeOptions.querySelectorAll('.size-btn');
  sizeBtns.forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === state.selectedSize);
  });

  elements.modalOverlay.classList.add('active');
}

function closeProductModal() {
  elements.modalOverlay.classList.remove('active');
}

// --- SIZE GUIDE MODAL ---
function openSizeGuideModal() {
  elements.sizeGuideModal.classList.add('active');
}

function closeSizeGuideModal() {
  elements.sizeGuideModal.classList.remove('active');
}

// --- LIGHTBOX INTERACTIVE GALLERY ---
function openLightbox(src, caption) {
  elements.lightboxImg.src = src;
  elements.lightboxCaption.textContent = caption;
  elements.lightboxModal.classList.add('active');
}

function closeLightbox() {
  elements.lightboxModal.classList.remove('active');
}

window.openLightbox = openLightbox;

// --- CART & WHOLESALE DOZEN ENGINE ---
function addToCartDirect(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  const chosenSize = state.cardSelectedSizes[productId] || 'M';
  addItemToCart(product, chosenSize, 1);
}

function addDozenToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const chosenSize = state.cardSelectedSizes[productId] || 'M';
  addItemToCart(product, chosenSize, 12);
  showToast(`Docena de ${product.name} (Talla ${chosenSize}) añadida. 15% Descuento Al Mayor Aplicado.`, 'success');
  elements.cartOverlay.classList.add('active');
}

function addItemToCart(product, size, qty) {
  const existingIndex = state.cart.findIndex(item => item.id === product.id && item.size === size);

  if (existingIndex > -1) {
    state.cart[existingIndex].qty += qty;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      fallbackImage: product.fallbackImage,
      category: product.category,
      gender: product.gender,
      size: size,
      qty: qty
    });
  }

  saveCart();
  updateCartUI();
  
  if (qty === 1) {
    showToast(`Añadido a cesta: ${product.name} (Talla ${size})`);
  }
}

function updateCartItemSize(index, newSize) {
  state.cart[index].size = newSize;
  saveCart();
  updateCartUI();
  showToast(`Talla actualizada a ${newSize}`);
}

window.updateCartItemSize = updateCartItemSize;

function updateCartQty(index, change) {
  state.cart[index].qty += change;
  if (state.cart[index].qty <= 0) {
    state.cart.splice(index, 1);
  }
  saveCart();
  updateCartUI();
}

function removeCartItem(index) {
  const removed = state.cart.splice(index, 1)[0];
  saveCart();
  updateCartUI();
  if (removed) {
    showToast(`Eliminado: ${removed.name}`);
  }
}

function saveCart() {
  localStorage.setItem('ka_cart', JSON.stringify(state.cart));
}

function updateCartUI() {
  const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  elements.cartCounter.textContent = totalCount;

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  elements.cartSubtotal.textContent = `$${subtotal.toFixed(2)} USD`;

  // Wholesale Discount Logic (15% OFF for 12+ items)
  const isWholesale = totalCount >= 12;
  const wholesaleDiscountRate = 0.15;
  const discountAmount = isWholesale ? (subtotal * wholesaleDiscountRate) : 0;
  const finalTotal = subtotal - discountAmount;

  if (isWholesale) {
    elements.wholesaleDiscountRow.style.display = 'flex';
    elements.wholesaleDiscountVal.textContent = `-$${discountAmount.toFixed(2)} USD`;
    elements.wholesaleBanner.className = 'wholesale-banner active-discount';
    elements.wholesaleBanner.innerHTML = `
      <div class="banner-badge">15% OFF AL MAYOR</div>
      <span>¡Docena completada! Se ha aplicado un <strong>15% de descuento al mayor</strong> en tu pedido.</span>
    `;
  } else {
    elements.wholesaleDiscountRow.style.display = 'none';
    const needed = 12 - totalCount;
    elements.wholesaleBanner.className = 'wholesale-banner tip';
    elements.wholesaleBanner.innerHTML = `
      <span><strong>Tip al mayor:</strong> Añade <strong>${needed} prenda${needed > 1 ? 's' : ''} más</strong> (1 docena) y obtén <strong>15% Descuento Al Mayor</strong>.</span>
    `;
  }

  elements.cartTotalFinal.textContent = `$${finalTotal.toFixed(2)} USD`;

  if (state.cart.length === 0) {
    elements.cartItemsContainer.innerHTML = `
      <div class="cart-empty-msg">
        <p>Tu cesta de compras está vacía.</p>
        <span style="font-size:0.85rem; color:var(--text-secondary);">Explora las colecciones Kenhion Allen y elige tus prendas y tallas.</span>
      </div>
    `;
    elements.wholesaleBanner.style.display = 'none';
    return;
  }

  elements.wholesaleBanner.style.display = 'block';

  elements.cartItemsContainer.innerHTML = state.cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.image}" onerror="this.onerror=null; this.src='${item.fallbackImage}';" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.name}</h4>
        
        <!-- Cart Item Size Selector Dropdown -->
        <div class="cart-item-size-row">
          <label class="cart-size-label">Talla:</label>
          <select class="cart-size-select" onchange="updateCartItemSize(${index}, this.value)">
            <option value="S" ${item.size === 'S' ? 'selected' : ''}>S</option>
            <option value="M" ${item.size === 'M' ? 'selected' : ''}>M</option>
            <option value="L" ${item.size === 'L' ? 'selected' : ''}>L</option>
            <option value="XL" ${item.size === 'XL' ? 'selected' : ''}>XL</option>
          </select>
          <span class="cart-category-tag">• ${item.category}</span>
        </div>

        <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
        
        <div class="cart-item-controls">
          <div class="qty-control">
            <button class="qty-btn-sm" onclick="changeQty(${index}, -1)">-</button>
            <span class="qty-val-sm">${item.qty}</span>
            <button class="qty-btn-sm" onclick="changeQty(${index}, 1)">+</button>
          </div>
          <span class="cart-item-remove" onclick="removeItem(${index})">Eliminar</span>
        </div>
      </div>
    </div>
  `).join('');
}

window.changeQty = updateCartQty;
window.removeItem = removeCartItem;

// --- WHATSAPP CHECKOUT ENGINE ---
function processWhatsAppCheckout() {
  if (state.cart.length === 0) {
    showToast('Añade al menos una prenda a la cesta para realizar el pedido');
    return;
  }

  const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const isWholesale = totalCount >= 12;
  const discountAmount = isWholesale ? (subtotal * 0.15) : 0;
  const finalTotal = subtotal - discountAmount;

  let message = `*NUEVO PEDIDO DESDE TIENDA ONLINE KENHION ALLEN*\n\n`;
  message += `Buenas, un cordial saludo de parte de nuestra marca Kenhion Allen! Quisiera procesar la compra de los siguientes productos:\n\n`;

  state.cart.forEach((item, idx) => {
    message += `*${idx + 1}. ${item.name}*\n`;
    message += `   • Colección: ${item.category}\n`;
    message += `   • Talla: ${item.size}\n`;
    message += `   • Cantidad: ${item.qty} unidad(es)\n`;
    message += `   • Precio: $${(item.price * item.qty).toFixed(2)}\n\n`;
  });

  message += `-----------------------------------\n`;
  message += `Subtotal: $${subtotal.toFixed(2)} USD\n`;
  
  if (isWholesale) {
    message += `*DESCUENTO AL MAYOR (15% DOCENA): -$${discountAmount.toFixed(2)} USD*\n`;
  }
  
  message += `*MONTO TOTAL A PAGAR: $${finalTotal.toFixed(2)} USD*\n`;
  message += `-----------------------------------\n\n`;
  message += `Quedo atento para coordinar los datos de envío en Venezuela. ¡Muchas gracias!`;

  const officialPhone = "584125305464"; // Verified Kenhion Allen Phone
  const encodedText = encodeURIComponent(message);
  const waUrl = `https://wa.me/${officialPhone}?text=${encodedText}`;

  window.open(waUrl, '_blank');
}

// --- FAQ ACCORDION HANDLER ---
function setupFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

// --- QUICK SEARCH MODAL ---
function handleQuickSearch(query) {
  if (!query.trim()) {
    elements.searchResultsList.innerHTML = '<p class="search-hint">Empieza a escribir para ver prendas...</p>';
    return;
  }

  const q = query.toLowerCase();
  const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));

  if (matches.length === 0) {
    elements.searchResultsList.innerHTML = '<p class="search-hint">No se encontraron prendas coincidentes.</p>';
    return;
  }

  elements.searchResultsList.innerHTML = matches.map(p => `
    <div class="search-result-item" onclick="openProductModal(${p.id}); closeSearchModal();">
      <img src="${p.image}" onerror="this.onerror=null; this.src='${p.fallbackImage}';" class="search-result-img">
      <div class="search-result-info">
        <h4>${p.name}</h4>
        <span>${p.category} • $${p.price.toFixed(2)}</span>
      </div>
    </div>
  `).join('');
}

function closeSearchModal() {
  elements.searchOverlay.classList.remove('active');
}

// --- TOAST UTILITY ---
function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${msg}</span>
  `;

  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// --- EVENT LISTENERS BINDING ---
function setupEventListeners() {
  elements.filterTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    elements.filterTabs.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    state.currentCategory = btn.dataset.category;
    renderProducts();
  });

  if (elements.genderPills) {
    elements.genderPills.addEventListener('click', (e) => {
      const btn = e.target.closest('.gender-pill');
      if (!btn) return;

      elements.genderPills.querySelectorAll('.gender-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      state.currentGender = btn.dataset.gender;
      renderProducts();
    });
  }

  if (elements.openSizeGuideBtn) {
    elements.openSizeGuideBtn.addEventListener('click', openSizeGuideModal);
  }
  if (elements.modalOpenSizeGuide) {
    elements.modalOpenSizeGuide.addEventListener('click', () => {
      closeProductModal();
      openSizeGuideModal();
    });
  }
  if (elements.sizeGuideCloseBtn) {
    elements.sizeGuideCloseBtn.addEventListener('click', closeSizeGuideModal);
  }
  if (elements.sizeGuideModal) {
    elements.sizeGuideModal.addEventListener('click', (e) => {
      if (e.target === elements.sizeGuideModal) closeSizeGuideModal();
    });
  }
  if (elements.footerSizeGuideLink) {
    elements.footerSizeGuideLink.addEventListener('click', (e) => {
      e.preventDefault();
      openSizeGuideModal();
    });
  }

  document.querySelectorAll('.footer-link[data-filter]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.dataset.filter;
      state.currentCategory = cat;
      
      const targetTab = elements.filterTabs.querySelector(`[data-category="${cat}"]`);
      if (targetTab) {
        elements.filterTabs.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        targetTab.classList.add('active');
      }

      renderProducts();
      document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      const cat = item.dataset.category;
      if (cat) {
        state.currentCategory = cat;
        const targetTab = elements.filterTabs.querySelector(`[data-category="${cat}"]`);
        if (targetTab) {
          elements.filterTabs.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          targetTab.classList.add('active');
        }
        renderProducts();
      }
    });
  });

  elements.sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderProducts();
  });

  elements.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    elements.searchClearBtn.style.display = state.searchQuery ? 'block' : 'none';
    renderProducts();
  });

  elements.searchClearBtn.addEventListener('click', () => {
    state.searchQuery = '';
    elements.searchInput.value = '';
    elements.searchClearBtn.style.display = 'none';
    renderProducts();
  });

  elements.resetFiltersBtn.addEventListener('click', () => {
    state.currentCategory = 'all';
    state.currentGender = 'all';
    state.searchQuery = '';
    elements.searchInput.value = '';
    elements.filterTabs.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    elements.filterTabs.querySelector('[data-category="all"]').classList.add('active');
    
    if (elements.genderPills) {
      elements.genderPills.querySelectorAll('.gender-pill').forEach(b => b.classList.remove('active'));
      elements.genderPills.querySelector('[data-gender="all"]').classList.add('active');
    }

    renderProducts();
  });

  elements.cartBtn.addEventListener('click', () => {
    elements.cartOverlay.classList.add('active');
  });

  elements.cartCloseBtn.addEventListener('click', () => {
    elements.cartOverlay.classList.remove('active');
  });

  elements.cartOverlay.addEventListener('click', (e) => {
    if (e.target === elements.cartOverlay) {
      elements.cartOverlay.classList.remove('active');
    }
  });

  elements.checkoutBtn.addEventListener('click', processWhatsAppCheckout);

  elements.modalCloseBtn.addEventListener('click', closeProductModal);
  elements.modalOverlay.addEventListener('click', (e) => {
    if (e.target === elements.modalOverlay) {
      closeProductModal();
    }
  });

  elements.modalSizeOptions.addEventListener('click', (e) => {
    const btn = e.target.closest('.size-btn');
    if (!btn) return;
    elements.modalSizeOptions.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.selectedSize = btn.textContent.trim();
  });

  elements.modalQtyMinus.addEventListener('click', () => {
    if (state.selectedQty > 1) {
      state.selectedQty--;
      elements.modalQtyVal.textContent = state.selectedQty;
    }
  });

  elements.modalQtyPlus.addEventListener('click', () => {
    state.selectedQty++;
    elements.modalQtyVal.textContent = state.selectedQty;
  });

  elements.modalAddToCartBtn.addEventListener('click', () => {
    if (state.selectedProduct) {
      addItemToCart(state.selectedProduct, state.selectedSize, state.selectedQty);
      closeProductModal();
    }
  });

  if (elements.modalAddDozenBtn) {
    elements.modalAddDozenBtn.addEventListener('click', () => {
      if (state.selectedProduct) {
        addDozenToCart(state.selectedProduct.id);
        closeProductModal();
      }
    });
  }

  elements.searchTriggerBtn.addEventListener('click', () => {
    elements.searchOverlay.classList.add('active');
    elements.quickSearchInput.focus();
  });

  elements.searchModalClose.addEventListener('click', closeSearchModal);

  elements.searchOverlay.addEventListener('click', (e) => {
    if (e.target === elements.searchOverlay) {
      closeSearchModal();
    }
  });

  elements.quickSearchInput.addEventListener('input', (e) => {
    handleQuickSearch(e.target.value);
  });

  elements.mobileMenuBtn.addEventListener('click', () => {
    elements.mobileNavDrawer.classList.add('active');
  });

  elements.mobileNavClose.addEventListener('click', () => {
    elements.mobileNavDrawer.classList.remove('active');
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      elements.mobileNavDrawer.classList.remove('active');
    });
  });

  if (elements.lightboxClose) {
    elements.lightboxClose.addEventListener('click', closeLightbox);
  }
  if (elements.lightboxModal) {
    elements.lightboxModal.addEventListener('click', (e) => {
      if (e.target === elements.lightboxModal) {
        closeLightbox();
      }
    });
  }
}
