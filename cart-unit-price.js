function addUnitPrices() {
  var items = document.querySelectorAll('.ec-cart__item:not(.ec-cart-item--summary)');
  if (!items.length) return;

  // Leer descuento total
  var discountEl = document.querySelector('.ec-cart-summary__row--discount');
  var totalDiscount = 0;
  if (discountEl) {
    var discountText = discountEl.textContent.replace(/[^0-9.,]/g, '').replace(',', '');
    totalDiscount = parseFloat(discountText) || 0;
  }

  // Leer subtotal total (antes de descuento)
  var subtotalEl = document.querySelector('.ec-cart-summary__row--subtotal .ec-cart-summary__cell--total, .ec-cart-summary__row:first-child .ec-cart-summary__cell--total');
  var totalSubtotal = 0;
  if (subtotalEl) {
    var subtotalText = subtotalEl.textContent.replace(/[^0-9.,]/g, '').replace(',', '');
    totalSubtotal = parseFloat(subtotalText) || 0;
  }

  items.forEach(function(itemEl) {
    if (itemEl.querySelector('.vz-unit-price')) return;

    var priceEl = itemEl.querySelector('.ec-cart-item__price-inner');
    var qtyEl = itemEl.querySelector('.ec-cart-item__count input') || itemEl.querySelector('.ec-cart-item__count');

    if (!priceEl || !qtyEl) return;

    var totalText = priceEl.textContent.replace(/[^0-9.,]/g, '').replace(',', '');
    var qty = parseInt(qtyEl.value || qtyEl.textContent);

    if (!qty || qty <= 1) return;

    var lineTotal = parseFloat(totalText);

    // Calcular descuento proporcional para esta línea
    var lineDiscount = 0;
    if (totalSubtotal > 0 && totalDiscount > 0) {
      lineDiscount = (lineTotal / totalSubtotal) * totalDiscount;
    }

    var unitPrice = (lineTotal - lineDiscount) / qty;

    var tag = document.createElement('div');
    tag.className = 'vz-unit-price';
    tag.style.cssText = 'font-size:12px;color:#888;text-align:right;margin-top:3px;';
    tag.textContent = '$' + unitPrice.toLocaleString('es-MX', {minimumFractionDigits:2}) + ' c/u';
    priceEl.parentNode.appendChild(tag);
  });
}

function waitForCart() {
  var items = document.querySelectorAll('.ec-cart__item:not(.ec-cart-item--summary)');
  if (items.length > 0) {
    addUnitPrices();
  } else {
    setTimeout(waitForCart, 500);
  }
}

setTimeout(waitForCart, 1000);

if (typeof Ecwid !== 'undefined') {
  Ecwid.OnPageLoaded.add(function(page) {
    if (page.type === 'CART') {
      setTimeout(addUnitPrices, 800);
    }
  });
  Ecwid.OnCartChanged.add(function() {
    setTimeout(function() {
      document.querySelectorAll('.vz-unit-price').forEach(function(el) { el.remove(); });
      addUnitPrices();
    }, 800);
  });
}
