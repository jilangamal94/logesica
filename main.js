let products = [
  { id: 1,  name: "كروس  كلاسيك",    price: 650,  category: "كروس",   color: "نبيتي",  image: " images/1.jpg" },
  { id: 2,  name: "كروس جلد ",       price: 890,  category: "كروس",   color: "أسود",   image:  " images/2.jpg"},
  { id: 3,  name: "كروس سلسلة ",     price: 720,  category: "كروس",   color: "بيج",    image:  " images/3.jpg"},
  { id: 4,  name: "توت كبيرة ",     price: 1250, category: "توت",    color: "جملي",   image:  " images/4.jpg" },
  { id: 5,  name: "توت قماش ",      price: 480,  category: "توت",    color: "كحلي",   image:  " images/5.jpg" },
  { id: 6,  name: "شنطة  جلد",        price: 1100, category: "ظهر",    color: "أسود",   image:  " images/6.jpg" },
  { id: 7,  name: "شنطة ظهر ",    price: 750,  category: "ظهر",    color: "رمادي",  image:  " images/7.jpg" },
  { id: 8,  name: "كلتش سهرة ",      price: 560,  category: "كلتش",   color: "دهبي",   image:  " images/8.jpg" },
  { id: 9,  name: "كلتش مظروف",          price: 420,  category: "كلتش",   color: "وردي",   image:  " images/9.jpg" },
  { id: 10, name: "محفظة طويلة ",  price: 300,  category: "محافظ",  color: "بني",    image:  " images/10.jpg" },
  { id: 11, name: "محفظة كروت ",    price: 180,  category: "محافظ",  color: "أسود",   image:  " images/11.jpg" },
  { id: 12, name: "محفظة جلد ",      price: 340,  category: "محافظ",  color: "نبيتي",  image:  " images/12.jpg" }
];
productsCon = document.getElementById("products");
categoriesBtn = document.querySelectorAll(".cat-btn");
function cards(list){
    let card = list.map(function(product){
        return `<div class="card show">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.price}</p>
        <span>${product.category}</span>
        <button class="add-btn" onclick= "addToCart(${product.id})">أضف للسلة</button>
        </div>`;           
    });
    productsCon.innerHTML = card.join("");
}
categoriesBtn.forEach(function (btn){
  btn.addEventListener("click", function(){
    let category = btn.dataset.category; 
    categoriesBtn.forEach(function(b){
        b.classList.remove("active");
    });
    
    btn.classList.add("active");
    let filtered = category === "الكل" 
    ? products
    : products.filter(function(product){
        return product.category === category;
    });
     cards(filtered);
  });   
});
cards(products)
    let input = document.getElementById("search");
    input.addEventListener("input", function(){
    let searchText = input.value.toLowerCase();
    let filters = products.filter(function(product){
        return product.name.toLowerCase().includes(searchText);
    });
    cards(filters);
});
let change =  document.getElementById("sort");
change.addEventListener("change", function(){
    let sortValue = change.value;
    if (sortValue==="asc"){
        products.sort(function(a,b){
            return a.price - b.price;
        });
    }else if (sortValue ==="desc"){
        products.sort(function(a,b){
            return b.price - a.price;
        });
    };
    cards(products);
});
let cart =JSON.parse(localStorage.getItem('cart'))|| [];
function saveCart(){
    localStorage.setItem("cart", JSON.stringify(cart));
}
function addToCart(productId) {
  let item = cart.find(function (i) {
    return i.id === productId;
  });
  if (item) {
    item.qty++;
  } else {
    let product = products.find(function (p) {
      return p.id === productId;
    });
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
  }
  saveCart();
  renderCart();     // لتحديث عرض محتويات السلة
  updateTotals();   // لتحديث الإجمالي وعدد القطع ورسالة الشحن
}

let cartItems = document.getElementById("cart-items");

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = "<p>السلة فاضية</p>";
    return;
  }

  cartItems.innerHTML = cart.map(function (item) {
    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <p>${item.price} ج.م</p>
          <p>الكمية: ${item.qty}</p>
          <button class="del" onclick ="removeFromCart(${item.id})" >مسح</button>
          
        </div>
      </div>
    `;
  }).join("");
}
let cartTotalEl = document.getElementById("cart-total");
let cartCountEl = document.getElementById("cart-count");
let shipNote = document.getElementById("ship-note");
let whatsappBtn = document.getElementById("whatsapp-btn");
let FREE_SHIPPING = 1000;

function updateTotals() {
  let total = cart.reduce(function (sum, item) {
    return sum + item.price * item.qty;
  }, 0);
  let count = cart.reduce(function (sum, item) {
    return sum + item.qty;
  }, 0);

  cartTotalEl.textContent = total.toLocaleString("en-US") + " ج.م";
  cartCountEl.textContent = count;

  if (count === 0) {
    shipNote.textContent = "أضيفي منتجات للسلة";
  } else if (total >= FREE_SHIPPING) {
    shipNote.textContent = "الشحن مجاني 🎉";
  } else {
    shipNote.textContent = "باقي " + (FREE_SHIPPING - total) + " ج.م على الشحن المجاني";
  }

  whatsappBtn.disabled = count === 0;
}

function removeFromCart(productId) {
  cart = cart.filter(function (item) {
    return item.id !== productId;
  });
  saveCart();
  renderCart();
  updateTotals();
}
renderCart();
updateTotals();
removeFromCart()
// 1. لما تدوس على زرار "اطلب على واتساب"، نظهر فورم البيانات
if(whatsappBtn) {
    whatsappBtn.addEventListener('click', function() {
        let orderForm = document.getElementById('order-form');
        if(orderForm) {
            orderForm.hidden = false; // إظهار الفورم
            whatsappBtn.hidden = true; // إخفاء زرار الطلب مؤقتاً
        }
    });
}

// 2. تأكدي أن دالة إرسال الطلب بتاخد البيانات من الحقول وتبعثها صح
function sendWhatsAppOrder(event) {
    if(event) {
        event.preventDefault(); // منع الصفحة من إعادة التحميل لو الزر جوه فورم
    }

    let customerName = document.getElementById('customer-name').value.trim();
    let customerPhone = document.getElementById('customer-phone').value.trim();
    let customerAddress = document.getElementById('customer-address').value.trim();

    // التحقق البسيط من الحقول
    if (!customerName || !customerPhone || !customerAddress) {
        alert('يرجى ملء جميع بيانات التوصيل (الاسم، رقم التليفون، العنوان).');
        return;
    }

    if (cart.length === 0) {
        alert('السلة فارغة، يرجى إضافة منتجات أولاً.');
        return;
    }

    let message = `🛒 *طلب جديد من متجرك*%0A`;
    message += `-----------------------------------%0A`;
    
    cart.forEach((item, index) => {
        message += `*${index + 1}. ${item.name}*%0A`;
        message += `   - الكمية: ${item.qty}%0A`;
        message += `   - السعر: ${item.price} ج.م%0A`;
        message += `   - المجموع: ${item.price * item.qty} ج.م%0A`;
        message += `-----------------------------------%0A`;
    });

    let totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    message += `💰 *الإجمالي الكلي: ${totalAmount} ج.م*%0A%0A`;

    message += `👤 *بيانات العميل:*%0A`;
    message += `• الاسم: ${customerName}%0A`;
    message += `• رقم التليفون: ${customerPhone}%0A`;
    message += `• العنوان: ${customerAddress}%0A`;

    let phoneNumber = "201000000000"; 
    let whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// اربطي هذه الدالة بزر الواتساب في ملف الـ HTML أو برمجياً هكذا:
// document.getElementById('whatsapp-btn').addEventListener('click', sendWhatsAppOrder);