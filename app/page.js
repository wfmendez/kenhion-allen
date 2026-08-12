'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// --- REAL KENHION ALLEN PRODUCTS DATASET ---
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

// Vector Emblem SVG Component
function EmblemSVG({ className = "brand-emblem-svg", stroke = "#111827" }) {
  return (
    <svg className={className} viewBox="0 0 100 120" fill="none" stroke={stroke} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 50 5 Q 50 35 85 60 Q 50 85 50 115 Q 50 85 15 60 Q 50 35 50 5 Z"/>
      <path d="M 24 25 Q 38 60 24 95"/>
      <path d="M 76 25 Q 62 60 76 95"/>
    </svg>
  );
}

export default function Home() {
  // --- STATE ---
  const [currentCategory, setCurrentCategory] = useState('all');
  const [currentGender, setCurrentGender] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [cart, setCart] = useState([]);
  const [cardSelectedSizes, setCardSelectedSizes] = useState({});
  const [activeFAQIndex, setActiveFAQIndex] = useState(null);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickSearchInput, setQuickSearchInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalSize, setModalSize] = useState('M');
  const [modalQty, setModalQty] = useState(1);
  const [lightbox, setLightbox] = useState({ isOpen: false, src: '', caption: '' });
  const [toast, setToast] = useState({ show: false, msg: '', type: 'info' });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ka_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save cart
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('ka_cart', JSON.stringify(newCart));
  };

  const showToastMsg = (msg, type = 'info') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: 'info' }), 3000);
  };

  // --- FILTER & SORT LOGIC ---
  const filteredProducts = PRODUCTS.filter(p => {
    if (currentCategory !== 'all' && p.category !== currentCategory) return false;
    if (currentGender !== 'all' && (p.gender !== currentGender && p.gender !== 'Unisex')) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  // Category Counts
  const countAll = PRODUCTS.length;
  const countElite = PRODUCTS.filter(p => p.category === 'KA ELITE').length;
  const countResiliencia = PRODUCTS.filter(p => p.category === 'Resiliencia').length;
  const countPod = PRODUCTS.filter(p => p.category === 'P.O.D.').length;

  // --- CART FUNCTIONS ---
  const handleSelectCardSize = (productId, size, e) => {
    if (e) e.stopPropagation();
    setCardSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleAddToCartDirect = (product) => {
    const chosenSize = cardSelectedSizes[product.id] || 'M';
    addItemToCart(product, chosenSize, 1);
  };

  const handleAddDozenToCart = (product) => {
    const chosenSize = cardSelectedSizes[product.id] || 'M';
    addItemToCart(product, chosenSize, 12);
    showToastMsg(`Docena de ${product.name} (Talla ${chosenSize}) añadida. 15% Descuento Al Mayor Aplicado.`, 'success');
    setIsCartOpen(true);
  };

  const addItemToCart = (product, size, qty) => {
    const existingIdx = cart.findIndex(item => item.id === product.id && item.size === size);
    let newCart = [...cart];

    if (existingIdx > -1) {
      newCart[existingIdx].qty += qty;
    } else {
      newCart.push({
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

    saveCart(newCart);
    if (qty === 1) showToastMsg(`Añadido a cesta: ${product.name} (Talla ${size})`);
  };

  const handleUpdateCartSize = (index, newSize) => {
    let newCart = [...cart];
    newCart[index].size = newSize;
    saveCart(newCart);
    showToastMsg(`Talla actualizada a ${newSize}`);
  };

  const handleUpdateQty = (index, delta) => {
    let newCart = [...cart];
    newCart[index].qty += delta;
    if (newCart[index].qty <= 0) {
      newCart.splice(index, 1);
    }
    saveCart(newCart);
  };

  const handleRemoveItem = (index) => {
    const removed = cart[index];
    let newCart = cart.filter((_, i) => i !== index);
    saveCart(newCart);
    if (removed) showToastMsg(`Eliminado: ${removed.name}`);
  };

  // Cart Calculations
  const totalCartQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const isWholesale = totalCartQty >= 12;
  const wholesaleDiscount = isWholesale ? (cartSubtotal * 0.15) : 0;
  const finalTotal = cartSubtotal - wholesaleDiscount;

  // WhatsApp Checkout
  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) {
      showToastMsg('Añade al menos una prenda a la cesta para realizar el pedido');
      return;
    }

    let message = `*NUEVO PEDIDO DESDE TIENDA ONLINE KENHION ALLEN*\n\n`;
    message += `Buenas, un cordial saludo de parte de nuestra marca Kenhion Allen! Quisiera procesar la compra de los siguientes productos:\n\n`;

    cart.forEach((item, idx) => {
      message += `*${idx + 1}. ${item.name}*\n`;
      message += `   • Colección: ${item.category}\n`;
      message += `   • Talla: ${item.size}\n`;
      message += `   • Cantidad: ${item.qty} unidad(es)\n`;
      message += `   • Precio: $${(item.price * item.qty).toFixed(2)}\n\n`;
    });

    message += `-----------------------------------\n`;
    message += `Subtotal: $${cartSubtotal.toFixed(2)} USD\n`;
    if (isWholesale) {
      message += `*DESCUENTO AL MAYOR (15% DOCENA): -$${wholesaleDiscount.toFixed(2)} USD*\n`;
    }
    message += `*MONTO TOTAL A PAGAR: $${finalTotal.toFixed(2)} USD*\n`;
    message += `-----------------------------------\n\n`;
    message += `Quedo atento para coordinar los datos de envío en Venezuela. ¡Muchas gracias!`;

    const officialPhone = "584125305464";
    const waUrl = `https://wa.me/${officialPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  // Modal Open
  const handleOpenProductModal = (product) => {
    setSelectedProduct(product);
    setModalSize(cardSelectedSizes[product.id] || 'M');
    setModalQty(1);
  };

  return (
    <div className="app-container">

      {/* Top Announcement Bar */}
      <div className="top-bar">
        <div className="top-bar-content">
          <span>MARACAY, VENEZUELA • DESCUENTO AL MAYOR: 15% OFF COMPRANDO 1 DOCENA (12 UDS) • WHATSAPP: +58 412-530-5464</span>
        </div>
      </div>

      {/* Sticky Navigation Header */}
      <header className="header-sticky" id="header">
        <div className="header-container">
          
          {/* Logo Identity */}
          <a href="#" className="brand-identity">
            <EmblemSVG className="brand-emblem-svg" />
            <div className="brand-text-wrapper">
              <span className="brand-logo-text">KENHION ALLEN</span>
              <span className="brand-subtle-text">Elegante & Trascendente</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            <ul className="nav-menu">
              <li><a href="#hero" className="nav-link active">Inicio</a></li>
              <li><a href="#servicios" className="nav-link">Servicios</a></li>
              <li className="nav-dropdown">
                <a href="#catalogo" className="nav-link">Tienda Online <span className="nav-arrow-icon">▼</span></a>
                <div className="dropdown-menu">
                  <span className="dropdown-item" onClick={() => setCurrentCategory('KA ELITE')}>
                    <span className="dot black"></span> KA ELITE (Compresión)
                  </span>
                  <span className="dropdown-item" onClick={() => setCurrentCategory('Resiliencia')}>
                    <span className="dot red"></span> Resiliencia (Algodón 100%)
                  </span>
                  <span className="dropdown-item" onClick={() => setCurrentCategory('P.O.D.')}>
                    <span className="dot black"></span> P.O.D. (Print On Demand)
                  </span>
                </div>
              </li>
              <li><a href="#galeria" className="nav-link">Fotogalería</a></li>
              <li><a href="#nosotros" className="nav-link">Sobre Nosotros</a></li>
              <li><a href="#faq" className="nav-link">Preguntas Frecuentes</a></li>
              <li><a href="#contacto" className="nav-link">Contacto</a></li>
            </ul>
          </nav>

          {/* Right Header Actions */}
          <div className="header-actions">
            <button className="action-icon-btn" onClick={() => setIsSearchOpen(true)} title="Buscar prenda">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>

            <button className="action-icon-btn cart-btn-style" onClick={() => setIsCartOpen(true)} title="Cesta de Compras">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <span className="cart-badge">{totalCartQty}</span>
            </button>

            <button className="mobile-menu-btn" onClick={() => setIsMobileNavOpen(true)} aria-label="Abrir Menú">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${isMobileNavOpen ? 'active' : ''}`}>
        <div className="mobile-nav-header">
          <div className="mobile-logo-group">
            <EmblemSVG className="brand-emblem-svg" />
            <span className="brand-logo-text">KENHION ALLEN</span>
          </div>
          <button className="close-btn" onClick={() => setIsMobileNavOpen(false)}>&times;</button>
        </div>
        <ul className="mobile-menu-list">
          <li><a href="#hero" className="mobile-nav-link" onClick={() => setIsMobileNavOpen(false)}>Inicio</a></li>
          <li><a href="#servicios" className="mobile-nav-link" onClick={() => setIsMobileNavOpen(false)}>Servicios</a></li>
          <li><a href="#catalogo" className="mobile-nav-link" onClick={() => setIsMobileNavOpen(false)}>Tienda Online</a></li>
          <li><a href="#galeria" className="mobile-nav-link" onClick={() => setIsMobileNavOpen(false)}>Fotogalería</a></li>
          <li><a href="#nosotros" className="mobile-nav-link" onClick={() => setIsMobileNavOpen(false)}>Sobre Nosotros</a></li>
          <li><a href="#faq" className="mobile-nav-link" onClick={() => setIsMobileNavOpen(false)}>Preguntas Frecuentes</a></li>
          <li><a href="#contacto" className="mobile-nav-link" onClick={() => setIsMobileNavOpen(false)}>Contacto & Ubicación</a></li>
        </ul>
      </div>

      {/* HERO SECTION */}
      <section className="hero-section" id="hero">
        <div className="hero-main-container">
          <div className="hero-brand-card">
            
            <div className="red-flourish-badge">
              <span className="red-line"></span>
              <span className="red-badge-text">KENHION ALLEN</span>
              <span className="red-line"></span>
            </div>

            <h1 className="hero-statement-title">
              "Proyecta la grandeza que llevas dentro"
            </h1>

            <p className="hero-statement-sub">
              Buenas, un cordial saludo de parte de nuestra marca <strong>Kenhion Allen</strong>. Ahora tenemos un nuevo método de compra a través de nuestra página web, dale un vistazo, conoce más sobre nosotros y mantente atento a todas nuestras nuevas colecciones.
            </p>

          </div>

          <div className="hero-image-frame">
            <img 
              src="https://af606c0c04.cbaul-cdnwnd.com/a50e9269c7b3dca260132ece6590c58c/200000054-9349b9349d/IMG_0965.JPG%20%281%29.jpeg?ph=af606c0c04" 
              alt="Kenhion Allen Moda Elegante" className="hero-featured-img" 
            />
            <div className="hero-visual-badge">
              <span className="location-label">Maracay, Venezuela</span>
              <span className="style-label">Moda Elegante & Conservadora</span>
            </div>
          </div>
        </div>
      </section>

      {/* 1. SERVICIOS ESPECIALIZADOS */}
      <section className="services-section" id="servicios">
        <div className="section-header center">
          <div className="red-brand-divider">
            <span className="divider-line"></span>
            <span className="divider-text">Kenhion Allen</span>
            <span className="divider-line"></span>
          </div>
          <h2 className="section-title">Nuestros Servicios</h2>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-num">01</div>
            <h3 className="service-title">Asesoría de moda</h3>
            <p className="service-desc">
              Servicio personalizado de orientación y asesoramiento en el ámbito del estilo. Recomendamos prendas y combinaciones ideales según tu personalidad, tipo de cuerpo y ocasión.
            </p>
            <a href="https://wa.me/584125305464?text=Hola!%20Quisiera%20solicitar%20una%20Asesor%C3%ADa%20de%20Moda%20en%20Kenhion%20Allen" 
               target="_blank" rel="noopener noreferrer" className="service-link">Solicitar Asesoría por WhatsApp →</a>
          </div>

          <div className="service-card">
            <div className="service-num">02</div>
            <h3 className="service-title">P.O.D. (Print On Demand)</h3>
            <p className="service-desc">
              Modelo de negocio que nos permite producir productos bajo demanda cuando el cliente realiza el pedido, garantizando piezas exclusivas de edición limitada.
            </p>
            <a href="#catalogo" className="service-link">Ver Productos P.O.D. →</a>
          </div>

          <div className="service-card">
            <div className="service-num">03</div>
            <h3 className="service-title">Prendas personalizadas</h3>
            <p className="service-desc">
              Servicio creativo de vestuario a medida adaptado a tus ideas. Recomendado para artistas, celebridades y personas que buscan prendas verdaderamente únicas.
            </p>
            <a href="https://wa.me/584125305464?text=Hola!%20Me%20interesa%20el%20servicio%20de%20Prendas%20Personalizadas" 
               target="_blank" rel="noopener noreferrer" className="service-link">Consultar Personalización →</a>
          </div>
        </div>
      </section>

      {/* 2. TIENDA ONLINE / CATÁLOGO */}
      <section className="catalog-section" id="catalogo">
        <div className="section-header space-between">
          <div>
            <div className="red-brand-divider left-align">
              <span className="divider-line"></span>
              <span className="divider-text">Colecciones Oficiales</span>
            </div>
            <h2 className="section-title">Tienda Online Kenhion Allen</h2>
          </div>

          <div className="search-input-wrapper">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar prenda (ej. Crop Top, Hoodie, Shorts)..." 
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery('')}>&times;</button>
            )}
          </div>
        </div>

        <div className="catalog-controls">
          <div className="filter-tabs-container">
            <div className="filter-tabs">
              <button className={`filter-btn ${currentCategory === 'all' ? 'active' : ''}`} onClick={() => setCurrentCategory('all')}>
                <span>Todos los productos</span>
                <span className="count-pill">{countAll}</span>
              </button>
              <button className={`filter-btn ${currentCategory === 'KA ELITE' ? 'active' : ''}`} onClick={() => setCurrentCategory('KA ELITE')}>
                <span>KA ELITE</span>
                <span className="count-pill">{countElite}</span>
              </button>
              <button className={`filter-btn ${currentCategory === 'Resiliencia' ? 'active' : ''}`} onClick={() => setCurrentCategory('Resiliencia')}>
                <span>Resiliencia</span>
                <span className="count-pill">{countResiliencia}</span>
              </button>
              <button className={`filter-btn ${currentCategory === 'P.O.D.' ? 'active' : ''}`} onClick={() => setCurrentCategory('P.O.D.')}>
                <span>P.O.D.</span>
                <span className="count-pill">{countPod}</span>
              </button>
            </div>

            <div className="gender-filter-pills">
              <span className="gender-filter-label">Filtrar Por:</span>
              <button className={`gender-pill ${currentGender === 'all' ? 'active' : ''}`} onClick={() => setCurrentGender('all')}>Todos</button>
              <button className={`gender-pill ${currentGender === 'Mujer' ? 'active' : ''}`} onClick={() => setCurrentGender('Mujer')}>Mujer</button>
              <button className={`gender-pill ${currentGender === 'Hombre' ? 'active' : ''}`} onClick={() => setCurrentGender('Hombre')}>Hombre</button>
              <button className={`gender-pill ${currentGender === 'Unisex' ? 'active' : ''}`} onClick={() => setCurrentGender('Unisex')}>Unisex</button>
              
              <button className="size-guide-trigger-btn" onClick={() => setIsSizeGuideOpen(true)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h20M6 8v8M10 9v6M14 8v8M18 9v6"></path></svg>
                <span>Guía de Tallas (cm)</span>
              </button>
            </div>
          </div>

          <div className="sort-wrapper">
            <label className="sort-label">Ordenar por:</label>
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Recomendados Kenhion Allen</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="name">Nombre: A - Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="empty-catalog-state">
            <div className="empty-icon-box">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <h3>No encontramos coincidencias</h3>
            <p>Intenta buscando con otra palabra o restablece los filtros.</p>
            <button className="btn-secondary" onClick={() => { setCurrentCategory('all'); setCurrentGender('all'); setSearchQuery(''); }}>Restablecer Filtros</button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => {
              const selectedSize = cardSelectedSizes[product.id] || 'M';
              return (
                <div key={product.id} className="product-card">
                  <div className="product-img-box" onClick={() => handleOpenProductModal(product)}>
                    <img 
                      src={product.image} 
                      onError={(e) => { e.target.src = product.fallbackImage; }} 
                      alt={product.name} 
                      className="product-img" 
                    />
                    <span className={`product-badge-pill ${product.badgeType}`}>{product.badge}</span>
                    <button className="quick-view-overlay-btn" onClick={(e) => { e.stopPropagation(); handleOpenProductModal(product); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      <span>Ver Detalle</span>
                    </button>
                  </div>

                  <div className="product-info">
                    <div className="card-meta-row">
                      <span className="product-category-name">{product.category}</span>
                      <span className="product-gender-tag">{product.gender}</span>
                    </div>

                    <h3 className="product-title" onClick={() => handleOpenProductModal(product)} style={{ cursor: 'pointer' }}>{product.name}</h3>

                    <div className="product-price-row">
                      <span className="product-price">${product.price.toFixed(2)}</span>
                      {product.oldPrice && <span className="product-old-price">${product.oldPrice.toFixed(2)}</span>}
                    </div>

                    {/* Interactive Size Pill Selector */}
                    <div className="card-size-selector-group">
                      <span className="size-selector-label">Talla:</span>
                      <div className="card-size-pills">
                        {['S', 'M', 'L', 'XL'].map(sz => (
                          <button 
                            key={sz} 
                            type="button" 
                            className={`card-size-pill ${selectedSize === sz ? 'active' : ''}`}
                            onClick={(e) => handleSelectCardSize(product.id, sz, e)}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="card-actions-group">
                      <button className="add-cart-card-btn" onClick={() => handleAddToCartDirect(product)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        <span>Añadir a Cesta</span>
                      </button>

                      <button className="add-dozen-card-btn" onClick={() => handleAddDozenToCart(product)} title="Pedir 12 Unidades con 15% Descuento Al Mayor">
                        <span>Pedir Docena (-15% Al Mayor)</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. FOTOGALERÍA */}
      <section className="gallery-section" id="galeria">
        <div className="section-header center">
          <div className="red-brand-divider">
            <span className="divider-line"></span>
            <span className="divider-text">Elegante y Trascendente</span>
            <span className="divider-line"></span>
          </div>
          <h2 className="section-title">Fotogalería Oficial</h2>
          <p className="section-subtext">Haz clic en cualquier imagen para verla en vista detallada.</p>
        </div>

        <div className="gallery-grid">
          {[
            { src: "https://af606c0c04.cbaul-cdnwnd.com/a50e9269c7b3dca260132ece6590c58c/200000110-2b9d22b9d4/IMG_0964.JPG-5.jpeg?ph=af606c0c04", title: "Colección Kenhion Allen 1" },
            { src: "https://af606c0c04.cbaul-cdnwnd.com/a50e9269c7b3dca260132ece6590c58c/200000085-22e1522e17/IMG_0977.JPG.jpeg?ph=af606c0c04", title: "Colección Kenhion Allen 2" },
            { src: "https://af606c0c04.cbaul-cdnwnd.com/a50e9269c7b3dca260132ece6590c58c/200000094-0c01b0c01c/IMG_0976.JPG.jpeg?ph=af606c0c04", title: "Colección Kenhion Allen 3" },
            { src: "https://af606c0c04.cbaul-cdnwnd.com/a50e9269c7b3dca260132ece6590c58c/200000088-913299132b/IMG_0979.JPG.jpeg?ph=af606c0c04", title: "Colección Kenhion Allen 4" },
          ].map((item, idx) => (
            <div key={idx} className="gallery-item" onClick={() => setLightbox({ isOpen: true, src: item.src, caption: item.title })}>
              <img src={item.src} alt={item.title} className="gallery-img" />
              <div className="gallery-hover-icon">Ampliar Vista</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SOBRE NOSOTROS */}
      <section className="about-section" id="nosotros">
        <div className="about-container">
          <div className="about-image-box emblem-black-card">
            <EmblemSVG className="about-emblem-large" stroke="#ffffff" />
          </div>

          <div className="about-text-content">
            <div className="red-brand-divider left-align">
              <span className="divider-line"></span>
              <span className="divider-text">Sobre Nosotros</span>
            </div>
            <h2 className="section-title">Moda Elegante en Maracay</h2>
            
            <p className="about-lead">
              Somos una tienda de ropa especializada en prendas elegantes para hombres y mujeres. Nos destacamos por la calidad de nuestros productos, ofrecemos ropa de diseñador con un estilo elegante y conservador. Estamos ubicados en Maracay, Venezuela.
            </p>

            <blockquote className="about-quote">
              "Tu forma de vestir es una representación de tu interior, por eso nosotros nos encargamos de que puedas proyectar la grandeza que llevas dentro."
            </blockquote>

            <div className="about-features-grid">
              <div className="feature-box">
                <div className="feature-icon-svg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="1.75"><path d="M12 2l2.4 5.6L20 10l-4.4 4.4L16.8 20 12 17l-4.8 3 1.2-5.6L4 10l5.6-2.4L12 2z"></path></svg>
                </div>
                <h4>Diseño Elegante</h4>
                <p>Cortes pulidos y acabados limpios que resaltan en cualquier ocasión.</p>
              </div>

              <div className="feature-box">
                <div className="feature-icon-svg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="1.75"><circle cx="12" cy="8" r="6"></circle><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"></path></svg>
                </div>
                <h4>Calidad Garantizada</h4>
                <p>Materiales duraderos, 100% algodón de alto gramaje y fibras sintéticas técnicas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PREGUNTAS FRECUENTES (FAQ ACORDEÓN) - PLACED BETWEEN ABOUT & CONTACT */}
      <section className="faq-section" id="faq">
        <div className="section-header center">
          <div className="red-brand-divider">
            <span className="divider-line"></span>
            <span className="divider-text">Resolvemos tus Dudas</span>
            <span className="divider-line"></span>
          </div>
          <h2 className="section-title">Preguntas Frecuentes</h2>
          <p className="section-subtext">Información sobre envíos en Venezuela, compras al mayor por docenas y atención personalizada.</p>
        </div>

        <div className="faq-accordion-wrapper">
          {[
            {
              q: "¿Realizan envíos a toda Venezuela desde Maracay?",
              a: "Sí, realizamos envíos nacionales seguros a través de las agencias de encomienda MRW, Zoom y Tealca hacia cualquier estado de Venezuela. En la ciudad de Maracay contamos con entregas personales y servicio de delivery."
            },
            {
              q: "¿Cómo funciona el Descuento Al Mayor por docena (15% OFF)?",
              a: "Al acumular 12 o más prendas en tu cesta de compras (pueden ser de la misma referencia o combinadas entre colecciones), el sistema calcula automáticamente un 15% de descuento al mayor en el subtotal de tu pedido."
            },
            {
              q: "¿Cuáles son los métodos de pago aceptados?",
              a: "Aceptamos pagos electrónicos mediante Pago Móvil, transferencias bancarias en Bolívares (Banesco / Mercantil), transferencias internacionales vía Zelle y efectivo en USD / divisas para entregas en Maracay."
            },
            {
              q: "¿Cómo solicito una prenda personalizada o asesoría de moda?",
              a: "Puedes agendar tu servicio directamente a través de nuestro botón oficial de WhatsApp +58 412-530-5464. Nuestro equipo de diseño te orientará con ideas, tallaje y combinaciones exclusivas."
            }
          ].map((faq, idx) => (
            <div key={idx} className={`faq-item ${activeFAQIndex === idx ? 'active' : ''}`}>
              <button className="faq-question-btn" onClick={() => setActiveFAQIndex(activeFAQIndex === idx ? null : idx)}>
                <span>{faq.q}</span>
                <span className="faq-toggle-icon">+</span>
              </button>
              <div className="faq-answer-content">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CONTACTO & UBICACIÓN */}
      <section className="contact-section" id="contacto">
        <div className="contact-card-box">
          <div className="contact-info-col">
            <div className="red-brand-divider left-align">
              <span className="divider-line"></span>
              <span className="divider-text">Ubicación y Contacto</span>
            </div>
            <h2 className="contact-title">Ponte en Contacto con Nosotros</h2>
            
            <div className="contact-details-list">
              <div className="contact-detail-item">
                <div className="icon-circle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <h4>Ubicación Oficial</h4>
                  <p>Maracay, Estado Aragua, Venezuela</p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="icon-circle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <h4>Teléfono / WhatsApp Directo</h4>
                  <p><a href="https://wa.me/584125305464" target="_blank" rel="noopener noreferrer">+58 412-530-5464</a></p>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="icon-circle">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div>
                  <h4>Correo Electrónico Oficial</h4>
                  <p>88kenhionallen@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-action-col">
            <div className="direct-chat-card">
              <h3>Atención Inmediata por WhatsApp</h3>
              <p>¿Tienes dudas sobre tallas, disponibilidad o pedidos al mayor por docena en Venezuela? Escríbenos directamente:</p>
              
              <a href="https://wa.me/584125305464?text=Hola%20Kenhion%20Allen,%20un%20gusto%20saludarlos!%20Quisiera%20realizar%20una%20consulta" 
                 target="_blank" rel="noopener noreferrer" className="btn-whatsapp-full">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                <span>Escribir al WhatsApp +58 412-530-5464</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-site">
        <div className="footer-content">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <EmblemSVG className="brand-emblem-svg footer-size" />
              <span className="footer-brand-name">KENHION ALLEN</span>
            </div>
            <p className="footer-brand-desc">
              Tienda de ropa especializada en prendas elegantes para hombres y mujeres. Ofrecemos ropa de diseñador con un estilo elegante y conservador.
            </p>
            <p className="footer-location-tag">Maracay, Aragua, Venezuela</p>

            <div className="footer-trust-badges">
              <div className="trust-pill">🚚 MRW • Zoom • Tealca</div>
              <div className="trust-pill">💳 Zelle • Pago Móvil • USD</div>
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Colecciones</h4>
            <ul className="footer-links">
              <li><a href="#catalogo" className="footer-link" onClick={() => setCurrentCategory('KA ELITE')}>KA ELITE (Compresión)</a></li>
              <li><a href="#catalogo" className="footer-link" onClick={() => setCurrentCategory('Resiliencia')}>Resiliencia (Algodón 100%)</a></li>
              <li><a href="#catalogo" className="footer-link" onClick={() => setCurrentCategory('P.O.D.')}>P.O.D. (Print On Demand)</a></li>
              <li><a href="#catalogo" className="footer-link" onClick={() => setCurrentCategory('all')}>Ver Todos los Productos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Servicios & Ayuda</h4>
            <ul className="footer-links">
              <li><a href="#servicios" className="footer-link">Asesoría de moda</a></li>
              <li><a href="#servicios" className="footer-link">Print On Demand (P.O.D.)</a></li>
              <li><a href="#servicios" className="footer-link">Prendas personalizadas</a></li>
              <li><a href="#faq" className="footer-link">Preguntas Frecuentes</a></li>
              <li><span className="footer-link" onClick={() => setIsSizeGuideOpen(true)} style={{ cursor: 'pointer' }}>Guía de Tallas (cm)</span></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Contacto</h4>
            <p className="footer-info-p">Maracay, Estado Aragua, Venezuela</p>
            <p className="footer-info-p">+58 412-530-5464</p>
            <p className="footer-info-p">88kenhionallen@gmail.com</p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Kenhion Allen. Todos los derechos reservados. Rediseño Oficial en Next.js.</span>
          <span>Elegante y Trascendente</span>
        </div>
      </footer>

      {/* --- MODALS --- */}

      {/* Lightbox Modal */}
      <div className={`lightbox-modal ${lightbox.isOpen ? 'active' : ''}`}>
        <button className="lightbox-close" onClick={() => setLightbox({ isOpen: false, src: '', caption: '' })}>&times;</button>
        <img src={lightbox.src} alt="" className="lightbox-img" />
        <span className="lightbox-caption">{lightbox.caption}</span>
      </div>

      {/* Size Guide Modal */}
      <div className={`modal-overlay ${isSizeGuideOpen ? 'active' : ''}`}>
        <div className="modal-card size-guide-card">
          <button className="modal-close" onClick={() => setIsSizeGuideOpen(false)}>&times;</button>
          <div className="size-guide-header">
            <div className="red-brand-divider left-align">
              <span className="divider-line"></span>
              <span className="divider-text">Kenhion Allen</span>
            </div>
            <h2 className="modal-title">Guía Oficial de Tallas y Medidas</h2>
            <p className="modal-desc">Utiliza esta tabla para seleccionar la talla perfecta para prendas de compresión KA ELITE o 100% Algodón Resiliencia.</p>
          </div>

          <div className="size-guide-table-wrapper">
            <table className="size-guide-table">
              <thead>
                <tr>
                  <th>TALLA</th>
                  <th>PECHO / BUSTO (cm)</th>
                  <th>CINTURA (cm)</th>
                  <th>CADERA (cm)</th>
                  <th>LARGO TOTAL (cm)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>S (Small)</strong></td>
                  <td>86 - 92 cm</td>
                  <td>70 - 76 cm</td>
                  <td>90 - 96 cm</td>
                  <td>68 cm</td>
                </tr>
                <tr>
                  <td><strong>M (Medium)</strong></td>
                  <td>93 - 100 cm</td>
                  <td>77 - 84 cm</td>
                  <td>97 - 104 cm</td>
                  <td>71 cm</td>
                </tr>
                <tr>
                  <td><strong>L (Large)</strong></td>
                  <td>101 - 108 cm</td>
                  <td>85 - 92 cm</td>
                  <td>105 - 112 cm</td>
                  <td>74 cm</td>
                </tr>
                <tr>
                  <td><strong>XL (Extra Large)</strong></td>
                  <td>109 - 116 cm</td>
                  <td>93 - 100 cm</td>
                  <td>113 - 120 cm</td>
                  <td>77 cm</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="size-guide-footer-tips">
            <div className="tip-box">
              <strong>KA ELITE (Compresión):</strong> Tienen ajuste ceñido. Si prefieres un ajuste más relajado, elige una talla superior.
            </div>
            <div className="tip-box">
              <strong>Resiliencia (Algodón 100%):</strong> Presentan un patrón Oversize holgado con caída estructurada de diseñador.
            </div>
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <div className={`cart-drawer-overlay ${isCartOpen ? 'active' : ''}`} onClick={(e) => { if (e.target.classList.contains('cart-drawer-overlay')) setIsCartOpen(false); }}>
        <div className="cart-drawer">
          <div className="cart-header">
            <div className="cart-title-group">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <h3 className="cart-title">Cesta de Compras</h3>
            </div>
            <button className="close-btn" onClick={() => setIsCartOpen(false)}>&times;</button>
          </div>

          <div className="cart-items-container">
            {cart.length === 0 ? (
              <div className="cart-empty-msg">
                <p>Tu cesta de compras está vacía.</p>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Explora las colecciones Kenhion Allen y elige tus prendas y tallas.</span>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="cart-item">
                  <img src={item.image} onError={(e) => { e.target.src = item.fallbackImage; }} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <h4 className="cart-item-title">{item.name}</h4>
                    <div className="cart-item-size-row">
                      <label className="cart-size-label">Talla:</label>
                      <select className="cart-size-select" value={item.size} onChange={(e) => handleUpdateCartSize(idx, e.target.value)}>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                      </select>
                      <span className="cart-category-tag">• {item.category}</span>
                    </div>
                    <span className="cart-item-price">${(item.price * item.qty).toFixed(2)}</span>
                    <div className="cart-item-controls">
                      <div className="qty-control">
                        <button className="qty-btn-sm" onClick={() => handleUpdateQty(idx, -1)}>-</button>
                        <span className="qty-val-sm">{item.qty}</span>
                        <button className="qty-btn-sm" onClick={() => handleUpdateQty(idx, 1)}>+</button>
                      </div>
                      <span className="cart-item-remove" onClick={() => handleRemoveItem(idx)}>Eliminar</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-footer">
              <div className={`wholesale-banner ${isWholesale ? 'active-discount' : 'tip'}`}>
                {isWholesale ? (
                  <>
                    <div className="banner-badge">15% OFF AL MAYOR</div>
                    <span>¡Docena completada! Se ha aplicado un <strong>15% de descuento al mayor</strong> en tu pedido.</span>
                  </>
                ) : (
                  <span><strong>Tip al mayor:</strong> Añade <strong>{12 - totalCartQty} prenda{12 - totalCartQty > 1 ? 's' : ''} más</strong> (1 docena) y obtén <strong>15% Descuento Al Mayor</strong>.</span>
                )}
              </div>

              <div className="cart-trust-badges">
                <span className="trust-tag">🚚 Envíos MRW, Zoom y Tealca</span>
                <span className="trust-tag">💳 Zelle / Pago Móvil / USD</span>
              </div>

              <div className="cart-summary-breakdown">
                <div className="cart-summary-row">
                  <span className="summary-label">Subtotal:</span>
                  <span className="summary-val">${cartSubtotal.toFixed(2)} USD</span>
                </div>
                {isWholesale && (
                  <div className="cart-summary-row discount-row">
                    <span className="summary-label text-green">Descuento Al Mayor (15% Docena):</span>
                    <span className="summary-val text-green">-${wholesaleDiscount.toFixed(2)} USD</span>
                  </div>
                )}
                <div className="cart-summary-row total-row">
                  <span className="summary-label-total">Total a Pagar:</span>
                  <span className="summary-val-total">${finalTotal.toFixed(2)} USD</span>
                </div>
              </div>

              <button className="btn-whatsapp-full checkout-btn" onClick={handleWhatsAppCheckout}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                <span>Completar Pedido por WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div className="modal-overlay active" onClick={(e) => { if (e.target.classList.contains('modal-overlay')) setSelectedProduct(null); }}>
          <div className="modal-card">
            <button className="modal-close" onClick={() => setSelectedProduct(null)}>&times;</button>
            <div className="modal-grid">
              <div className="modal-img-box">
                <img src={selectedProduct.image} onError={(e) => { e.target.src = selectedProduct.fallbackImage; }} alt={selectedProduct.name} className="modal-img" />
                <span className="modal-tag-badge">{selectedProduct.badge}</span>
              </div>
              <div className="modal-body">
                <span className="modal-category">{selectedProduct.category} • {selectedProduct.gender}</span>
                <h2 className="modal-title">{selectedProduct.name}</h2>
                <div className="modal-price-row">
                  <span className="modal-price">${selectedProduct.price.toFixed(2)}</span>
                  {selectedProduct.oldPrice && <span className="modal-old-price">${selectedProduct.oldPrice.toFixed(2)}</span>}
                </div>
                <p className="modal-desc">{selectedProduct.description}</p>

                <div className="modal-option-group">
                  <div className="size-label-row">
                    <label className="option-label">Seleccionar Talla:</label>
                    <button className="modal-size-guide-btn" onClick={() => { setSelectedProduct(null); setIsSizeGuideOpen(true); }}>Ver Guía de Tallas (cm)</button>
                  </div>
                  <div className="size-options">
                    {['S', 'M', 'L', 'XL'].map(sz => (
                      <button key={sz} className={`size-btn ${modalSize === sz ? 'active' : ''}`} onClick={() => setModalSize(sz)}>{sz}</button>
                    ))}
                  </div>
                </div>

                <div className="modal-option-group">
                  <label className="option-label">Cantidad:</label>
                  <div className="quantity-picker">
                    <button className="qty-btn" onClick={() => { if (modalQty > 1) setModalQty(modalQty - 1); }}>-</button>
                    <span className="qty-val">{modalQty}</span>
                    <button className="qty-btn" onClick={() => setModalQty(modalQty + 1)}>+</button>
                  </div>
                </div>

                <div className="modal-actions-wrapper">
                  <button className="btn-primary-black add-to-cart-action" onClick={() => { addItemToCart(selectedProduct, modalSize, modalQty); setSelectedProduct(null); }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    <span>Añadir a la Cesta</span>
                  </button>
                  
                  <button className="btn-wholesale-dozen" onClick={() => { handleAddDozenToCart(selectedProduct); setSelectedProduct(null); }}>
                    <span>Comprar Docena (12 Uds - 15% Descuento Al Mayor)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Search Modal */}
      <div className={`search-overlay ${isSearchOpen ? 'active' : ''}`} onClick={(e) => { if (e.target.classList.contains('search-overlay')) setIsSearchOpen(false); }}>
        <div className="search-modal">
          <div className="search-modal-header">
            <input 
              type="text" 
              value={quickSearchInput} 
              onChange={(e) => setQuickSearchInput(e.target.value)} 
              placeholder="Buscar por nombre de prenda..." 
              autoFocus 
            />
            <button className="close-btn" onClick={() => setIsSearchOpen(false)}>&times;</button>
          </div>
          <div className="search-results-list">
            {!quickSearchInput.trim() ? (
              <p className="search-hint">Empieza a escribir para ver prendas...</p>
            ) : (
              PRODUCTS.filter(p => p.name.toLowerCase().includes(quickSearchInput.toLowerCase()) || p.category.toLowerCase().includes(quickSearchInput.toLowerCase())).map(p => (
                <div key={p.id} className="search-result-item" onClick={() => { handleOpenProductModal(p); setIsSearchOpen(false); }}>
                  <img src={p.image} onError={(e) => { e.target.src = p.fallbackImage; }} className="search-result-img" alt={p.name} />
                  <div className="search-result-info">
                    <h4>{p.name}</h4>
                    <span>{p.category} • ${p.price.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

    </div>
  );
}
