const modal = document.getElementById("loginModal");
const openLoginButtons = [
  document.getElementById("openLogin"),
  document.getElementById("heroLogin")
];
const closeLogin = document.getElementById("closeLogin");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const productButtons = Array.from(document.getElementsByClassName("buy-button"));
const categoryButtons = Array.from(document.getElementsByClassName("category-button"));
const productCards = Array.from(document.getElementsByClassName("product-card"));
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const cartItemsList = document.getElementById("cartItemsList");
const cartTotal = document.getElementById("cartTotal");
const clearCartButton = document.getElementById("clearCart");
const checkoutButton = document.getElementById("checkoutButton");
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutSummary = document.getElementById("checkoutSummary");

let cart = [];

function openLoginModal() {
    if (modal) {
        modal.classList.add("open");
    }
}

function closeLoginModal() {
    if (modal) {
        modal.classList.remove("open");
    }
}

function openCart() {
    if (cartPanel) {
        cartPanel.classList.add("open");
    }
}

function closeCartPanel() {
    if (cartPanel) {
        cartPanel.classList.remove("open");
    }
}

function openCheckout() {
    if (checkoutModal) {
        checkoutModal.classList.add("open");
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        if (checkoutSummary) {
            checkoutSummary.innerHTML = `<span>Resumen</span><strong>${formatearPrecio(total)}</strong>`;
        }
    }
}

function closeCheckoutModal() {
    if (checkoutModal) {
        checkoutModal.classList.remove("open");
    }
}

function formatearPrecio(valor) {
    return `${valor.toFixed(2).replace('.', ',')} €`;
}

function renderCart() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    if (cartCount) {
        cartCount.textContent = String(cart.length);
    }

    if (cartTotal) {
        cartTotal.textContent = formatearPrecio(total);
    }

    if (checkoutSummary) {
        checkoutSummary.innerHTML = `<span>Resumen</span><strong>${formatearPrecio(total)}</strong>`;
    }

    if (!cartItemsList) return;

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="empty-cart">Tu carrito está vacío.</p>';
        return;
    }

    cartItemsList.innerHTML = cart.map(function(item, index) {
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatearPrecio(item.price)}</div>
                </div>
                <button class="remove-item" data-index="${index}" type="button">Quitar</button>
            </div>
        `;
    }).join('');

    const removeButtons = cartItemsList.querySelectorAll('.remove-item');
    removeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const index = Number(button.getAttribute('data-index'));
            cart.splice(index, 1);
            renderCart();
        });
    });
}

openLoginButtons.forEach(function(button) {
    if (button) {
        button.addEventListener("click", openLoginModal);
    }
});

if (closeLogin) {
    closeLogin.addEventListener("click", closeLoginModal);
}

if (modal) {
    modal.addEventListener("click", function(event) {
        if (event.target === modal) {
            closeLoginModal();
        }
    });
}

if (cartButton) {
    cartButton.addEventListener("click", openCart);
}

if (closeCart) {
    closeCart.addEventListener("click", closeCartPanel);
}

if (clearCartButton) {
    clearCartButton.addEventListener("click", function() {
        cart = [];
        renderCart();
    });
}

if (checkoutButton) {
    checkoutButton.addEventListener("click", function() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío.');
            return;
        }
        openCheckout();
    });
}

if (closeCheckout) {
    closeCheckout.addEventListener("click", closeCheckoutModal);
}

if (checkoutModal) {
    checkoutModal.addEventListener("click", function(event) {
        if (event.target === checkoutModal) {
            closeCheckoutModal();
        }
    });
}

productButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const card = button.closest('.product-card');
        if (!card) return;

        const product = {
            name: card.dataset.name,
            price: Number(card.dataset.price)
        };

        cart.push(product);
        renderCart();
        openCart();
    });
});

categoryButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const category = button.dataset.category;

        categoryButtons.forEach(function(item) {
            item.classList.toggle("active", item === button);
        });

        productCards.forEach(function(card) {
            const showCard = category === "all" || card.dataset.category === category;
            card.classList.toggle("hidden", !showCard);
        });
    });
});

if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre = document.getElementById('checkoutName').value.trim();
        const email = document.getElementById('checkoutEmail').value.trim();
        const direccion = document.getElementById('checkoutAddress').value.trim();
        const metodo = document.getElementById('checkoutPayment').value;

        if (!nombre || !email || !direccion || !metodo) {
            alert('Completa todos los campos del pago.');
            return;
        }

        alert('Pedido realizado correctamente. Gracias por tu compra.');
        cart = [];
        renderCart();
        closeCheckoutModal();
        closeCartPanel();
        checkoutForm.reset();
    });
}

const SUPABASE_URL = 'https://sferknarlogqdvrlpyjg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_2ibkvwq3TrohlR9jK_58qQ_UT33WXRG';

async function guardarUsuarioSupabase(nombre, email, password) {
    const respuesta = await fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
            nombre: nombre,
            email: email,
            password: password
        })
    });

    const texto = await respuesta.text();

    if (!respuesta.ok) {
        throw new Error(`Supabase respondió ${respuesta.status}: ${texto}`);
    }

    return texto ? JSON.parse(texto) : {};
}

const formularioRegistro = document.getElementById('formularioRegistro');

if (formularioRegistro) {
    formularioRegistro.addEventListener('submit', async function(evento) {
        evento.preventDefault();

        const nombreInput = document.getElementById('nombre');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const mensaje = document.getElementById('mensajeDeEstado');

        if (!nombreInput || !emailInput || !passwordInput || !mensaje) {
            console.error('Faltan campos del formulario.');
            return;
        }

        const nombreUsuario = nombreInput.value.trim();
        const emailUsuario = emailInput.value.trim();
        const passwordUsuario = passwordInput.value.trim();

        if (!nombreUsuario || !emailUsuario || !passwordUsuario) {
            mensaje.innerText = 'Completa todos los campos antes de enviar.';
            return;
        }

        mensaje.innerText = 'Guardando usuario...';

        try {
            await guardarUsuarioSupabase(nombreUsuario, emailUsuario, passwordUsuario);
            mensaje.innerText = '¡Usuario registrado correctamente!';
            formularioRegistro.reset();
        } catch (error) {
            console.error(error);
            mensaje.innerText = 'No se pudo guardar: ' + error.message;
        }
    });
}

renderCart();

