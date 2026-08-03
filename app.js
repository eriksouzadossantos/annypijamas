/* Anny Pijamas — lógica da loja (100% estático, sem backend) */
(function () {
  "use strict";

  var SITE = {
    whatsapp: "5519983595915",
    whatsappDisplay: "+55 19 98359-5915",
    instagram: "https://www.instagram.com/anny.pijamasofc/",
    instagramHandle: "@anny.pijamasofc",
    cidade: "Campinas/SP",
  };
  window.SITE = SITE;

  var ICON_BAG = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12l1 13H5L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>';
  var ICON_WHATS = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 0 1-13.4 7.8L3 21l1.3-4.4A9 9 0 1 1 21 12Z"/><path d="M8.5 9.5c0 4 2 6 6 6 .8 0 1.5-.7 1.5-1.5l-2-1-1 1c-1 -.4-2.1-1.5-2.5-2.5l1-1-1-2c-.8 0-2 .2-2 1Z"/></svg>';
  var ICON_SEARCH = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
  var ICON_IG = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>';
  var ICON_TRUCK = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>';
  var ICON_HEART = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9Z"/></svg>';
  var ICON_SWAP = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h13l-3-3M20 15H7l3 3"/></svg>';
  var ICON_RULER = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="8" width="20" height="8" rx="2"/><path d="M7 8v3M12 8v4M17 8v3"/></svg>';

  var DATA = window.STORE || { products: [], categories: [], sizeTable: [], faq: [], reviews: [], sizes: [] };

  /* ---------- utilitários ---------- */
  function money(v) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  function whatsLink(msg) {
    var base = "https://wa.me/" + SITE.whatsapp;
    return msg ? base + "?text=" + encodeURIComponent(msg) : base;
  }
  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }
  function el(html) {
    var d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstElementChild;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function toast(msg) {
    var t = el('<div class="toast">' + esc(msg) + "</div>");
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  }
  function categoryName(slug) {
    var c = DATA.categories.find(function (x) { return x.slug === slug; });
    return c ? c.name : slug;
  }

  /* ---------- carrinho (localStorage) ---------- */
  var KEY = "anny-pijamas-cart";
  var Cart = {
    items: function () {
      try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
    },
    save: function (items) {
      localStorage.setItem(KEY, JSON.stringify(items));
      renderBadge();
      document.dispatchEvent(new CustomEvent("cart:change"));
    },
    add: function (product, size, quantity) {
      quantity = quantity || 1;
      var items = Cart.items();
      var key = product.id + "-" + size;
      var found = items.find(function (i) { return i.key === key; });
      if (found) found.quantity += quantity;
      else items.push({
        key: key, id: product.id, slug: product.slug, name: product.name,
        price: product.price, image: product.images[0], size: size, quantity: quantity,
      });
      Cart.save(items);
    },
    setQty: function (key, q) {
      var items = Cart.items().map(function (i) {
        return i.key === key ? Object.assign({}, i, { quantity: Math.max(1, q) }) : i;
      });
      Cart.save(items);
    },
    remove: function (key) {
      Cart.save(Cart.items().filter(function (i) { return i.key !== key; }));
    },
    clear: function () { Cart.save([]); },
    count: function () { return Cart.items().reduce(function (s, i) { return s + i.quantity; }, 0); },
    total: function () { return Cart.items().reduce(function (s, i) { return s + i.quantity * i.price; }, 0); },
  };
  window.Cart = Cart;

  /* ---------- cabeçalho e rodapé ---------- */
  var NAV = [
    { label: "Início", href: "index.html" },
    { label: "Produtos", href: "produtos.html" },
    { label: "Categorias", href: "categorias.html" },
    { label: "Tamanhos", href: "tabela-de-tamanhos.html" },
    { label: "Dúvidas", href: "duvidas.html" },
    { label: "Sobre", href: "sobre.html" },
  ];

  function currentPage() {
    var p = location.pathname.split("/").pop();
    return p === "" ? "index.html" : p;
  }

  var TOPBAR = [
    "Entrega por motoboy em Campinas e região",
    "Até 7 dias para troca",
    "Do P ao G3",
    "Pedidos pelo WhatsApp " + SITE.whatsappDisplay,
  ];

  function renderChrome() {
    var page = currentPage();
    var header = document.getElementById("site-header");
    if (header) {
      var cats = (DATA.categories || []).slice(0, 8).map(function (c) {
        return '<a href="produtos.html?categoria=' + c.slug + '">' + esc(c.name) + "</a>";
      }).join("");

      header.className = "header";
      header.innerHTML =
        '<div class="topbar"><div class="topbar-inner">' +
        TOPBAR.map(function (t) { return "<span>" + t + "</span>"; }).join('<i>/</i>') +
        "</div></div>" +
        '<div class="header-main">' +
          '<div class="header-side left">' +
            '<a class="ico" href="' + SITE.instagram + '" target="_blank" rel="noopener" aria-label="Instagram">' + ICON_IG + "</a>" +
            '<form class="searchbox" action="produtos.html" method="get" role="search">' +
              '<input type="search" name="q" placeholder="Faça uma pesquisa..." aria-label="Buscar produtos">' +
              '<button type="submit" aria-label="Buscar">' + ICON_SEARCH + "</button>" +
            "</form>" +
          "</div>" +
          '<a class="brand" href="index.html"><img src="assets/logo.jpg" alt="Logotipo Anny Pijamas" width="150" height="72"></a>' +
          '<div class="header-side right">' +
            '<a class="whats-top" href="' + whatsLink("Olá, Anny Pijamas! 💕") + '" target="_blank" rel="noopener">' + ICON_WHATS + "<span>" + SITE.whatsappDisplay + "</span></a>" +
            '<a class="cart-link" href="carrinho.html" aria-label="Carrinho">' + ICON_BAG + '<span class="cart-badge" id="cart-badge" hidden>0</span></a>' +
            '<button class="menu-toggle" aria-label="Abrir menu">&#9776;</button>' +
          "</div>" +
        "</div>" +
        '<nav class="catnav"><div class="catnav-inner">' +
          cats +
          NAV.filter(function (n) { return n.href !== "index.html" && n.href !== "produtos.html" && n.href !== "categorias.html"; })
            .map(function (n) { return '<a href="' + n.href + '"' + (n.href === page ? ' class="active"' : "") + ">" + n.label + "</a>"; })
            .join("") +
        "</div></nav>";

      header.querySelector(".menu-toggle").addEventListener("click", function () {
        header.querySelector(".catnav").classList.toggle("open");
      });
    }


    var footer = document.getElementById("site-footer");
    if (footer) {
      footer.className = "footer";
      footer.innerHTML =
        '<div class="footer-grid">' +
        '<div><img src="assets/logo.jpg" alt="Anny Pijamas" width="64" height="64" style="width:64px;height:64px;border-radius:50%;object-fit:cover">' +
        '<p class="muted" style="max-width:34ch">Conforto e beleza para acompanhar as suas noites, com peças delicadas escolhidas com carinho.</p></div>' +
        "<nav>" +
        NAV.concat([{ label: "Política de trocas", href: "politica-de-trocas.html" }])
          .map(function (n) { return '<a href="' + n.href + '">' + n.label + "</a>"; })
          .join("") +
        "</nav>" +
        '<div class="muted">' +
        '<p><a href="' + whatsLink("Olá, Anny Pijamas! 💕") + '" target="_blank" rel="noopener">WhatsApp ' + SITE.whatsappDisplay + "</a></p>" +
        '<p><a href="' + SITE.instagram + '" target="_blank" rel="noopener">Instagram ' + SITE.instagramHandle + "</a></p>" +
        "<p>" + SITE.cidade + "</p>" +
        '<p style="color:var(--fg);font-weight:500">Pedidos por WhatsApp</p>' +
        "</div></div>" +
        '<div class="footer-bottom">© 2026 Anny Pijamas. Todos os direitos reservados.</div>';
    }

    if (!document.querySelector(".fab")) {
      var fab = el('<a class="fab" href="' + whatsLink("Olá, Anny Pijamas! 💕") + '" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">' + ICON_WHATS + '</a>');
      document.body.appendChild(fab);
    }
    renderBadge();
  }

  function renderBadge() {
    var b = document.getElementById("cart-badge");
    if (!b) return;
    var c = Cart.count();
    b.textContent = c;
    b.hidden = c === 0;
  }

  /* ---------- componentes ---------- */
  function productCard(p) {
    var tag = !p.available
      ? '<span class="tag off">Indisponível</span>'
      : p.bestSeller ? '<span class="tag">Mais vendido</span>' : "";
    return (
      '<a class="card" href="produto.html?slug=' + p.slug + '">' +
      '<div class="thumb">' + tag + '<img src="' + p.images[0] + '" alt="' + esc(p.name) + '" loading="lazy"></div>' +
      '<div class="card-body"><h3>' + esc(p.name) + "</h3>" +
      '<span class="muted" style="font-size:.85rem">' + categoryName(p.category) + "</span>" +
      '<span class="price">' + money(p.price) + "</span></div></a>"
    );
  }

  /* ---------- páginas ---------- */
  function pageHome() {
    var best = DATA.products.filter(function (p) { return p.bestSeller; });
    if (best.length < 4) best = DATA.products.slice();
    var g = document.getElementById("home-featured");
    if (g) g.innerHTML = best.slice(0, 8).map(productCard).join("");

    var novos = DATA.products.slice().sort(function (a, b) { return b.createdAt.localeCompare(a.createdAt); });
    var n = document.getElementById("home-new");
    if (n) n.innerHTML = novos.slice(0, 4).map(productCard).join("");

    var c = document.getElementById("home-categories");
    if (c) c.innerHTML = DATA.categories.map(function (cat) {
      return (
        '<a class="circle-tile" href="produtos.html?categoria=' + cat.slug + '">' +
        '<span class="circle-img"><img src="' + cat.image + '" alt="' + esc(cat.name) + '" loading="lazy"></span>' +
        "<span>" + esc(cat.name) + "</span></a>"
      );
    }).join("");

    var r = document.getElementById("home-reviews");
    if (r) r.innerHTML = DATA.reviews.map(function (rev) {
      return '<blockquote class="panel"><p>“' + esc(rev.text) + '”</p><footer class="muted">— ' + esc(rev.author) + "</footer></blockquote>";
    }).join("");

    var b = document.getElementById("home-benefits");
    if (b) b.innerHTML = [
      [ICON_TRUCK, "Entrega por motoboy", "Campinas e região"],
      [ICON_SWAP, "Até 7 dias para troca", "Sem complicação"],
      [ICON_RULER, "Do P ao G3", "Tabela de medidas completa"],
      [ICON_HEART, "Atendimento humano", "Direto no WhatsApp"],
    ].map(function (i) {
      return '<div class="benefit">' + i[0] + "<div><strong>" + i[1] + "</strong><span>" + i[2] + "</span></div></div>";
    }).join("");
  }


  function pageProducts() {
    var grid = document.getElementById("product-grid");
    if (!grid) return;
    var fCat = document.getElementById("f-cat");
    var fSize = document.getElementById("f-size");
    var fSort = document.getElementById("f-sort");
    var fSearch = document.getElementById("f-search");
    var countEl = document.getElementById("result-count");

    fCat.innerHTML = '<option value="">Todas as categorias</option>' +
      DATA.categories.map(function (c) { return '<option value="' + c.slug + '">' + c.name + "</option>"; }).join("");
    fSize.innerHTML = '<option value="">Todos os tamanhos</option>' +
      DATA.sizes.map(function (s) { return '<option value="' + s + '">' + s + "</option>"; }).join("");

    if (qs("categoria")) fCat.value = qs("categoria");
    if (qs("busca")) fSearch.value = qs("busca");
    if (qs("q")) fSearch.value = qs("q");

    function apply() {
      var list = DATA.products.slice();
      if (fCat.value) list = list.filter(function (p) { return p.category === fCat.value; });
      if (fSize.value) list = list.filter(function (p) { return p.sizes.indexOf(fSize.value) > -1; });
      var q = (fSearch.value || "").trim().toLowerCase();
      if (q) list = list.filter(function (p) { return p.name.toLowerCase().indexOf(q) > -1 || p.description.toLowerCase().indexOf(q) > -1; });
      if (fSort.value === "price-asc") list.sort(function (a, b) { return a.price - b.price; });
      if (fSort.value === "price-desc") list.sort(function (a, b) { return b.price - a.price; });
      if (fSort.value === "new") list.sort(function (a, b) { return b.createdAt.localeCompare(a.createdAt); });
      countEl.textContent = list.length + (list.length === 1 ? " produto" : " produtos");
      grid.innerHTML = list.length
        ? list.map(productCard).join("")
        : '<p class="muted">Nenhum produto encontrado com esses filtros.</p>';
    }
    [fCat, fSize, fSort].forEach(function (e) { e.addEventListener("change", apply); });
    fSearch.addEventListener("input", apply);
    apply();
  }

  function pageCategories() {
    var g = document.getElementById("categories-grid");
    if (!g) return;
    g.innerHTML = DATA.categories.map(function (cat) {
      var n = DATA.products.filter(function (p) { return p.category === cat.slug; }).length;
      return (
        '<a class="card" href="produtos.html?categoria=' + cat.slug + '">' +
        '<div class="thumb"><img src="' + cat.image + '" alt="' + esc(cat.name) + '" loading="lazy"></div>' +
        '<div class="card-body"><h3>' + esc(cat.name) + '</h3><span class="muted">' + n + " produto" + (n === 1 ? "" : "s") + "</span></div></a>"
      );
    }).join("");
  }

  function pageProduct() {
    var root = document.getElementById("product-detail");
    if (!root) return;
    var p = DATA.products.find(function (x) { return x.slug === qs("slug"); });
    if (!p) {
      root.innerHTML = '<p class="muted">Produto não encontrado. <a href="produtos.html">Ver catálogo</a></p>';
      return;
    }
    document.title = p.name + " | Anny Pijamas";
    var selected = null;

    root.innerHTML =
      '<nav class="breadcrumb"><a href="index.html">Início</a> / <a href="produtos.html">Produtos</a> / ' +
      '<a href="produtos.html?categoria=' + p.category + '">' + categoryName(p.category) + "</a> / " + esc(p.name) + "</nav>" +
      '<div class="grid grid-2" style="align-items:start">' +
      '<div><div class="gallery-main"><img id="main-img" src="' + p.images[0] + '" alt="' + esc(p.name) + '"></div>' +
      '<div class="thumbs">' + p.images.map(function (img, i) {
        return '<img src="' + img + '" alt="' + esc(p.name) + " — foto " + (i + 1) + '"' + (i === 0 ? ' class="active"' : "") + ">";
      }).join("") + "</div></div>" +
      "<div><h1>" + esc(p.name) + "</h1>" +
      '<p class="price" style="font-size:1.6rem">' + money(p.price) + "</p>" +
      "<p>" + esc(p.description) + "</p>" +
      '<p><strong>Tamanho:</strong> <span id="size-label" class="muted">selecione</span></p>' +
      '<div class="sizes" id="size-list">' + p.sizes.map(function (s) {
        return '<button type="button" class="size-chip" data-size="' + s + '">' + s + "</button>";
      }).join("") + "</div>" +
      '<p id="size-warn" class="muted" style="color:var(--rose-deep)" hidden>Selecione um tamanho para continuar.</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px">' +
      '<button class="btn btn-primary" id="add-cart"' + (p.available ? "" : " disabled") + ">" + (p.available ? "Adicionar ao carrinho" : "Indisponível") + "</button>" +
      '<a class="btn btn-whats" id="buy-now" href="#">Comprar pelo WhatsApp</a></div>' +
      '<div class="panel" style="margin-top:24px"><p><strong>Tecido:</strong> ' + esc(p.fabric) + "</p>" +
      "<p><strong>Caimento:</strong> " + esc(p.fit) + "</p>" +
      '<p class="muted">Consulte a <a href="tabela-de-tamanhos.html">tabela de medidas</a>.</p></div>' +
      "</div></div>";

    var mainImg = root.querySelector("#main-img");
    root.querySelectorAll(".thumbs img").forEach(function (t) {
      t.addEventListener("click", function () {
        mainImg.src = t.src;
        root.querySelectorAll(".thumbs img").forEach(function (x) { x.classList.remove("active"); });
        t.classList.add("active");
      });
    });

    root.querySelectorAll(".size-chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        selected = btn.dataset.size;
        root.querySelectorAll(".size-chip").forEach(function (b) { b.classList.remove("selected"); });
        btn.classList.add("selected");
        root.querySelector("#size-label").textContent = selected;
        root.querySelector("#size-warn").hidden = true;
      });
    });

    root.querySelector("#add-cart").addEventListener("click", function () {
      if (!selected) { root.querySelector("#size-warn").hidden = false; return; }
      Cart.add(p, selected, 1);
      toast("Adicionado ao carrinho: " + p.name + " (" + selected + ")");
    });

    root.querySelector("#buy-now").addEventListener("click", function (e) {
      if (!selected) { e.preventDefault(); root.querySelector("#size-warn").hidden = false; return; }
      this.href = whatsLink(
        "Olá, Anny Pijamas! 💕\nTenho interesse neste produto:\n\n• " + p.name +
        "\nTamanho: " + selected + "\nValor: " + money(p.price)
      );
    });

    var related = DATA.products.filter(function (x) { return x.category === p.category && x.slug !== p.slug; }).slice(0, 4);
    var rel = document.getElementById("related");
    if (rel && related.length) {
      rel.innerHTML = '<h2>Você também pode gostar</h2><div class="grid grid-4">' + related.map(productCard).join("") + "</div>";
    }
  }

  function pageCart() {
    var list = document.getElementById("cart-list");
    if (!list) return;
    var summary = document.getElementById("cart-summary");

    function render() {
      var items = Cart.items();
      if (!items.length) {
        list.innerHTML = '<p class="muted">Seu carrinho está vazio. <a href="produtos.html">Ver produtos</a></p>';
        summary.hidden = true;
        return;
      }
      summary.hidden = false;
      list.innerHTML = items.map(function (i) {
        return (
          '<div class="cart-row">' +
          '<img src="' + i.image + '" alt="' + esc(i.name) + '">' +
          "<div><strong>" + esc(i.name) + '</strong><div class="muted">Tamanho ' + i.size + "</div>" +
          '<div class="qty" style="margin-top:8px"><button data-dec="' + i.key + '">−</button><span>' + i.quantity +
          '</span><button data-inc="' + i.key + '">+</button></div></div>' +
          '<div style="text-align:right"><div class="price">' + money(i.price * i.quantity) + "</div>" +
          '<button class="btn btn-outline" style="padding:6px 14px;margin-top:8px" data-del="' + i.key + '">Remover</button></div></div>'
        );
      }).join("");
      document.getElementById("cart-total").textContent = money(Cart.total());

      list.querySelectorAll("[data-inc]").forEach(function (b) {
        b.onclick = function () {
          var i = Cart.items().find(function (x) { return x.key === b.dataset.inc; });
          Cart.setQty(i.key, i.quantity + 1); render();
        };
      });
      list.querySelectorAll("[data-dec]").forEach(function (b) {
        b.onclick = function () {
          var i = Cart.items().find(function (x) { return x.key === b.dataset.dec; });
          Cart.setQty(i.key, i.quantity - 1); render();
        };
      });
      list.querySelectorAll("[data-del]").forEach(function (b) {
        b.onclick = function () { Cart.remove(b.dataset.del); render(); };
      });
    }
    render();

    var form = document.getElementById("checkout-form");
    var entrega = form.querySelector('select[name="entrega"]');
    var enderecoBox = document.getElementById("endereco-box");
    entrega.addEventListener("change", function () {
      enderecoBox.hidden = entrega.value !== "motoboy";
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var items = Cart.items();
      if (!items.length) { toast("Adicione produtos antes de finalizar."); return; }
      var f = new FormData(form);
      var linhas = items.map(function (i) {
        return "• " + i.name + " — Tam " + i.size + " × " + i.quantity + " = " + money(i.price * i.quantity);
      }).join("\n");
      var msg =
        "Olá, Anny Pijamas! 💕 Quero finalizar meu pedido:\n\n" + linhas +
        "\n\nTotal: " + money(Cart.total()) +
        "\n\nNome: " + f.get("nome") +
        "\nEntrega: " + (f.get("entrega") === "motoboy" ? "Motoboy" : "Retirada combinada");
      if (f.get("entrega") === "motoboy") {
        msg += "\nEndereço: " + (f.get("endereco") || "") + " — " + (f.get("bairro") || "") + " / " + (f.get("cidade") || SITE.cidade);
      }
      if (f.get("obs")) msg += "\nObservações: " + f.get("obs");
      window.open(whatsLink(msg), "_blank", "noopener");
    });
  }

  function pageSizes() {
    var body = document.getElementById("size-table-body");
    if (!body) return;
    body.innerHTML = DATA.sizeTable.map(function (r) {
      return "<tr><td><strong>" + r.size + "</strong></td><td>" + r.busto + "</td><td>" + r.cintura + "</td><td>" + r.quadril + "</td><td>" + r.caimento + "</td></tr>";
    }).join("");
  }

  function pageFaq() {
    var box = document.getElementById("faq-list");
    if (!box) return;
    box.innerHTML = DATA.faq.map(function (f) {
      return "<details><summary>" + esc(f.q) + "</summary><p>" + esc(f.a) + "</p></details>";
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderChrome();
    pageHome(); pageProducts(); pageCategories(); pageProduct(); pageCart(); pageSizes(); pageFaq();
    document.querySelectorAll("[data-whats]").forEach(function (a) {
      a.href = whatsLink(a.dataset.whats);
    });
  });
})();
