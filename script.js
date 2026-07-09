// ============================================================
//  SOLAR DEMO — MAIN SCRIPT
// ============================================================
(function () {
    'use strict';

    // ── Loading Screen ──────────────────────────────────────
    const loader = document.getElementById('loader');
    const loaderProgress = document.getElementById('loader-progress');
    let progress = 0;
    const tick = setInterval(() => {
        progress += Math.random() * 18;
        if (progress >= 100) { progress = 100; clearInterval(tick); }
        loaderProgress.style.width = progress + '%';
    }, 80);
    window.addEventListener('load', () => {
        setTimeout(() => { loader.classList.add('hidden'); }, 400);
    });

    // ── Custom Cursor ────────────────────────────────────────
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    (function animateCursor() {
        dot.style.left  = mouseX + 'px';
        dot.style.top   = mouseY + 'px';
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(animateCursor);
    })();
    document.querySelectorAll('a, button, [onclick]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.style.width  = '50px'; ring.style.height = '50px';
            ring.style.borderColor = 'rgba(16,185,129,0.8)';
        });
        el.addEventListener('mouseleave', () => {
            ring.style.width  = '32px'; ring.style.height = '32px';
            ring.style.borderColor = 'rgba(16,185,129,0.5)';
        });
    });

    // ── Sticky Header ────────────────────────────────────────
    const header = document.getElementById('header');
    function updateHeaderState() {
        const activePage = document.querySelector('.page.active');
        const pageId = activePage ? activePage.id : '';
        const lightPages = ['page-products', 'page-product-detail', 'page-article'];
        const forceSolid = lightPages.includes(pageId);
        header.classList.toggle('scrolled', forceSolid || window.scrollY > 40);
    }
    window.addEventListener('scroll', updateHeaderState);
    window.updateHeaderState = updateHeaderState;

    // ── Floating Particles (Hero) ────────────────────────────
    function createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        for (let i = 0; i < 18; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 60 + 20;
            Object.assign(p.style, {
                width:  size + 'px', height: size + 'px',
                left:   (Math.random() * 100) + '%',
                animationDuration: (Math.random() * 20 + 15) + 's',
                animationDelay:    (Math.random() * -20) + 's',
            });
            container.appendChild(p);
        }
    }
    createParticles();

    // ── Scroll Reveal (Intersection Observer) ────────────────
    function initReveal(root) {
        const targets = root.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
        if (!targets.length) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(en => {
                if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        targets.forEach(t => io.observe(t));
    }
    initReveal(document);

    // ── Counter Up ───────────────────────────────────────────
    let countersStarted = false;
    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;
        document.querySelectorAll('.counter').forEach(el => {
            const target = +el.dataset.target;
            const duration = 1800;
            const start = performance.now();
            function step(now) {
                const elapsed = now - start;
                const t = Math.min(elapsed / duration, 1);
                const val = Math.round(target * (1 - (1 - t) * (1 - t)));
                el.textContent = val.toLocaleString('vi-VN');
                if (t < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
    }
    const statsEl = document.querySelector('.stats');
    if (statsEl) {
        new IntersectionObserver(([e]) => { if (e.isIntersecting) startCounters(); }, { threshold: 0.3 }).observe(statsEl);
    }

    // ── Toast Helper ──────────────────────────────────────────
    function showToast(msg) {
        const toast = document.getElementById('toast');
        toast.querySelector('span').textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }
    window.showToast = showToast;

    // ============================================================
    //  SPA NAVIGATION
    // ============================================================
    window.navigateTo = function (pageId, targetId) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById('page-' + pageId);
        if (!target) return;
        target.classList.add('active');
        initReveal(target);
        document.querySelectorAll('.nav-link[data-page]').forEach(a => {
            a.classList.toggle('active', a.dataset.page === pageId);
        });
        if (targetId) {
            setTimeout(() => {
                const scrollTarget = document.getElementById(targetId);
                if (scrollTarget) {
                    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Cập nhật trạng thái màu sắc menu header theo trang mới
        if (typeof updateHeaderState === 'function') {
            updateHeaderState();
        }
    };

    // ── Mobile Menu ──────────────────────────────────────────
    window.toggleMenu = function () {
        document.querySelector('.nav').classList.toggle('open');
    };

    // ── Video Modal ──────────────────────────────────────────
    window.openVideoModal = function () {
        alert('Tính năng xem video sẽ được tích hợp trong phiên bản đầy đủ.');
    };

    // ── Contact Form ─────────────────────────────────────────
    window.handleFormSubmit = function (e) {
        e.preventDefault();
        showToast('Gửi thành công! Chuyên gia sẽ liên hệ trong 24h.');
        e.target.reset();
    };

    // ── Project Filter ───────────────────────────────────────
    window.filterProjects = function (btn, cat) {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.full-proj-card').forEach(card => {
            card.classList.toggle('hidden', !(cat === 'all' || card.dataset.cat === cat));
        });
    };

    // ============================================================
    //  PRODUCT DATA
    // ============================================================
    const IMG = 'images/';
    const PRODUCTS = {
        'panel-jinko-n72': {
            brand: 'JinkoSolar', name: 'Tấm Pin N-Type Tiger Neo 580W', code: 'JKM-580N-72HL4',
            images: [IMG + 'product_panel_jinko_1783010743968.jpg', IMG + 'solar_project_1_1783009346227.jpg', IMG + 'solar_project_2_1783009357654.jpg'],
            highlights: [
                'Hiệu suất tối đa 22.1% — thuộc Top đầu thị trường N-Type',
                'Công nghệ N-Type TOPCon thế hệ mới, ít bị suy giảm hơn P-Type',
                'Bảo hành hiệu suất tuyến tính 30 năm',
                'Chịu tải tuyết 5400 Pa, tải gió 2400 Pa',
                'Chứng nhận: IEC 61215, IEC 61730, MCS, CE, TÜV'
            ],
            specs: [['Công suất định mức','580 Wp'],['Hiệu suất','22.1%'],['Điện áp hở mạch (Voc)','49.8V'],['Dòng ngắn mạch (Isc)','14.87A'],['Kích thước','2278 × 1134 × 35 mm'],['Trọng lượng','28.8 kg'],['Bảo hành sản phẩm','12 năm'],['Bảo hành hiệu suất','30 năm']]
        },
        'panel-longi-hi': {
            brand: 'LONGi Solar', name: 'Tấm Pin Hi-MO 6 Scientist 580W', code: 'LR5-72HTH-580M',
            images: [IMG + 'product_panel_jinko_1783010743968.jpg', IMG + 'solar_project_3_1783009367754.jpg'],
            highlights: [
                'Hiệu suất mô-đun đạt 22.8% — kỷ lục thế giới dòng sản phẩm dân dụng',
                'Công nghệ HPBC thế hệ 2, đặc biệt hiệu quả tại điều kiện ánh sáng yếu',
                'Bề mặt tế bào không có đường hàn, tăng thẩm mỹ và độ bền',
                'Phù hợp cho mái nhà cao cấp, biệt thự và công trình xanh',
                'Đạt chứng nhận Bloomberg Tier 1 liên tiếp 10 năm'
            ],
            specs: [['Công suất định mức','580 Wp'],['Hiệu suất','22.8%'],['Điện áp hở mạch (Voc)','51.2V'],['Dòng ngắn mạch (Isc)','14.04A'],['Kích thước','2094 × 1134 × 35 mm'],['Trọng lượng','27.5 kg'],['Bảo hành sản phẩm','15 năm'],['Bảo hành hiệu suất','30 năm']]
        },
        'inv-sungrow-5k': {
            brand: 'Sungrow', name: 'Inverter Hybrid SH10RT', code: 'SH10RT-V122',
            images: [IMG + 'product_inverter_sungrow_1783010754311.jpg', IMG + 'solar_project_1_1783009346227.jpg'],
            highlights: [
                'Tích hợp sẵn quản lý pin EMS thông minh — tự động tối ưu lưu trữ và xả',
                'Hỗ trợ mở rộng dung lượng pin linh hoạt từ 9.6kWh đến 100kWh',
                'Giám sát realtime qua iSolarCloud — app iOS & Android',
                'Chế độ off-grid tự động kích hoạt khi mất điện lưới trong <20ms',
                'IP65 + C5 Anti-corrosion — phù hợp lắp đặt ngoài trời, ven biển'
            ],
            specs: [['Công suất PV đầu vào','12 kWp (max)'],['Công suất AC đầu ra','10 kW'],['Điện áp pin','80 – 160V DC'],['Hiệu suất','98.4%'],['Chuẩn bảo vệ','IP65'],['Giao tiếp','RS485, WiFi, LAN'],['Kích thước','670 × 460 × 220 mm'],['Bảo hành','10 năm']]
        },
        'bat-sungrow-sh': {
            brand: 'Sungrow', name: 'Pin Lưu Trữ SBR096 – 9.6 kWh', code: 'SBR096-B',
            images: [IMG + 'product_battery_storage_1783010764817.jpg', IMG + 'solar_project_2_1783009357654.jpg'],
            highlights: [
                'Công nghệ pin LFP (Lithium Iron Phosphate) — an toàn, không cháy nổ',
                'Tuổi thọ 6000 chu kỳ (tương đương >16 năm sử dụng hàng ngày)',
                'Mô-đun hóa linh hoạt — lắp thêm pin dễ dàng không cần thay Inverter',
                'Thiết kế rack gọn gàng, không ồn, lắp đặt trong nhà hoặc ngoài trời',
                'Tích hợp BMS bảo vệ quá nhiệt, quá áp, ngắn mạch'
            ],
            specs: [['Dung lượng','9.6 kWh'],['Điện áp danh định','100.8V'],['Chiều sâu xả (DoD)','100%'],['Tuổi thọ chu kỳ','6000 lần (80% DoD)'],['Hiệu suất vòng','96.5%'],['Chuẩn bảo vệ','IP55'],['Nhiệt độ hoạt động','-20°C đến 60°C'],['Bảo hành','10 năm']]
        },
        'acc-mount-rail': {
            brand: 'K2 Systems', name: 'Khung Nhôm Định Hình (Rail) 4050mm', code: 'K2-RAIL-4050',
            images: [IMG + 'solar_project_1_1783009346227.jpg'],
            highlights: [
                'Nhôm hợp kim 6063 T6 — siêu nhẹ, chịu lực tốt, chống ăn mòn',
                'Tương thích với hầu hết các loại kẹp tấm pin tiêu chuẩn trên thị trường',
                'Hệ thống rãnh T-slot tiêu chuẩn, lắp đặt nhanh chóng',
                'Chứng nhận MCS, ISO 9001 — đạt tiêu chuẩn thi công châu Âu',
                'Cắt được theo yêu cầu — phù hợp mọi kích thước mái'
            ],
            specs: [['Vật liệu','Nhôm 6063 T6'],['Chiều dài','4050 mm'],['Kích thước mặt cắt','40 × 40 mm'],['Tải trọng tối đa','3.5 kN/m'],['Màu sắc','Bạc tự nhiên / Đen anodized'],['Tiêu chuẩn','EN 1090-1'],['Bảo hành','10 năm']]
        },
    };

    // ── Open Product Detail ───────────────────────────────────
    window.openProductDetail = function (id) {
        const prod = PRODUCTS[id];
        if (!prod) return;
        document.getElementById('pd-breadcrumb').textContent = prod.name;
        document.getElementById('pd-brand').textContent = prod.brand;
        document.getElementById('pd-title').textContent = prod.name;
        document.getElementById('pd-code').textContent = 'Mã sản phẩm: ' + prod.code;

        const mainImg = document.getElementById('pd-img-main');
        mainImg.src = prod.images[0]; mainImg.alt = prod.name;
        document.getElementById('zoom-img').src = prod.images[0];

        const thumbsEl = document.getElementById('pd-thumbs');
        thumbsEl.innerHTML = '';
        prod.images.forEach((src, i) => {
            const thumb = document.createElement('div');
            thumb.className = 'pd-thumb' + (i === 0 ? ' active' : '');
            thumb.innerHTML = `<img src="${src}" alt="">`;
            thumb.onclick = () => {
                mainImg.src = src;
                document.getElementById('zoom-img').src = src;
                thumbsEl.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            };
            thumbsEl.appendChild(thumb);
        });

        document.getElementById('pd-highlights').innerHTML =
            '<h4>Ưu Điểm Nổi Bật</h4><ul>' +
            prod.highlights.map(h => `<li><i class="fa-solid fa-circle-check"></i>${h}</li>`).join('') +
            '</ul>';

        document.getElementById('pd-specs-table').innerHTML =
            prod.specs.map(([k, v]) =>
                `<div class="pd-spec-row"><div class="pd-spec-key">${k}</div><div class="pd-spec-val">${v}</div></div>`
            ).join('');

        window._currentProduct = prod.name;
        navigateTo('product-detail');
        if (typeof currentLang !== 'undefined' && currentLang !== 'vi' && typeof translateDOM === 'function') {
            translateDOM(document.getElementById('page-product-detail'), currentLang);
        }
    };

    // ── Product Filter (Products Page) ────────────────────────
    window.filterProducts = function (cat, btn) {
        document.querySelectorAll('.pf-tab').forEach(t => t.classList.remove('active'));
        if (btn) {
            btn.classList.add('active');
        } else {
            const tabs = document.querySelectorAll('.pf-tab');
            tabs.forEach(t => {
                if (t.getAttribute('onclick') && t.getAttribute('onclick').includes(`'${cat}'`)) t.classList.add('active');
            });
            if (cat === 'all' && document.querySelectorAll('.pf-tab.active').length === 0) {
                document.querySelector('.pf-tab') && document.querySelector('.pf-tab').classList.add('active');
            }
        }
        document.querySelectorAll('#product-grid .prod-card').forEach(card => {
            card.classList.toggle('hidden', !(cat === 'all' || card.dataset.cat === cat));
        });
    };

    // ============================================================
    //  NEWS DATA
    // ============================================================
    const ARTICLES = {
        'art-001': {
            catLabel: 'Tin Công Ty', catClass: 'company',
            title: 'GreenTech Solar Hoàn Thành Dự Án 2.5 MWp Tại Thái Nguyên',
            meta: '28/06/2026 &nbsp;|&nbsp; 5 phút đọc &nbsp;|&nbsp; Phòng Marketing',
            cover: IMG + 'news_tech_1783010788004.jpg',
            body: `<p>Ngày 27/06/2026, hệ thống điện mặt trời mái nhà lớn nhất tỉnh Thái Nguyên với công suất <strong>2.5 MWp</strong> do GreenTech Solar là tổng thầu EPC đã chính thức được bàn giao và đưa vào vận hành thương mại.</p>
            <h2>Dự án tiêu biểu tại miền Bắc</h2>
            <p>Nhà máy sản xuất Samsung SDI tại KCN Yên Bình lựa chọn GreenTech Solar sau quá trình đánh giá năng lực nghiêm ngặt. Dự án hoàn thành trong <strong>45 ngày thi công</strong>, vượt tiến độ 10 ngày.</p>
            <h3>Thông số kỹ thuật chính</h3>
            <ul><li>Công suất lắp đặt: <strong>2,548 kWp</strong></li><li>Sản lượng dự kiến hàng năm: <strong>3,200,000 kWh</strong></li><li>Tấm pin: JinkoSolar N-Type Tiger Neo 580W (4,393 tấm)</li><li>Inverter: Sungrow SG125HX (21 bộ)</li><li>CO₂ giảm thiểu: ~1,600 tấn/năm</li></ul>
            <blockquote>"GreenTech Solar đã chứng minh năng lực thi công chuyên nghiệp, đúng hẹn và chất lượng vượt mong đợi." — Giám đốc KT Samsung SDI Việt Nam</blockquote>
            <h2>Tiết kiệm chi phí ấn tượng</h2>
            <p>Hệ thống giúp nhà máy tiết kiệm khoảng <strong>6.4 tỷ đồng/năm</strong>, hoàn vốn trong vòng <strong>4.2 năm</strong>.</p>`
        },
        'art-002': {
            catLabel: 'Kiến Thức', catClass: 'knowledge',
            title: 'Giải Mã Hệ Thống Hybrid: Khi Nào Nên Lắp Pin Lưu Trữ?',
            meta: '25/06/2026 &nbsp;|&nbsp; 8 phút đọc &nbsp;|&nbsp; Kỹ sư Trần Minh Đức',
            cover: IMG + 'solar_project_1_1783009346227.jpg',
            body: `<p>Hệ thống điện mặt trời <strong>Hybrid</strong> đang ngày càng phổ biến. Nhưng không phải trường hợp nào cũng cần lắp thêm pin.</p>
            <h2>3 loại hệ thống chính</h2>
            <ul><li><strong>On-grid:</strong> Bán điện dư cho EVN. Chi phí thấp, phù hợp điện lưới ổn định.</li><li><strong>Off-grid:</strong> Độc lập hoàn toàn. Chi phí cao, phù hợp vùng sâu xa.</li><li><strong>Hybrid:</strong> Kết hợp cả hai. Ưu tiên tự dùng, lưu trữ phần dư.</li></ul>
            <h2>Nên lắp Hybrid khi nào?</h2>
            <ul><li>Khu vực thường xuyên mất điện ảnh hưởng sản xuất/kinh doanh</li><li>Giá điện ban đêm cao hơn ban ngày (TOU tariff)</li><li>Muốn chủ động năng lượng, không phụ thuộc EVN</li><li>Có thiết bị nhạy cảm cần nguồn điện ổn định liên tục</li></ul>
            <blockquote>Chi phí pin lưu trữ đã giảm hơn 70% trong 10 năm qua. Đây là thời điểm tốt để đầu tư Hybrid.</blockquote>
            <h2>ROI của hệ thống Hybrid</h2>
            <p>Chi phí lắp thêm pin cho hệ thống 10kWp dao động <strong>80–150 triệu đồng</strong>. Thời gian hoàn vốn phần pin khoảng <strong>7–10 năm</strong>.</p>`
        },
        'art-003': {
            catLabel: 'Chính Sách', catClass: 'policy',
            title: 'Chính Sách Điện Mặt Trời Mái Nhà 2025: Những Điểm Mới Doanh Nghiệp Cần Biết',
            meta: '20/06/2026 &nbsp;|&nbsp; 6 phút đọc &nbsp;|&nbsp; Phòng Pháp Chế',
            cover: IMG + 'news_policy_1783010776587.jpg',
            body: `<p>Bộ Công Thương vừa ban hành Thông tư mới hướng dẫn cơ chế mua bán điện mặt trời mái nhà. Những điểm quan trọng nhất doanh nghiệp cần biết:</p>
            <h2>1. Net-metering được duy trì</h2>
            <p>Điện dư phát lên lưới được bù trừ vào hóa đơn tháng tiếp theo. Giá mua điện dư <strong>thấp hơn giá bán</strong> của EVN 15–25%.</p>
            <h2>2. Bỏ giới hạn công suất 1MW (mới)</h2>
            <p>Thông tư mới <strong>bỏ giới hạn công suất 1MW</strong> cho hệ thống tự dùng. Doanh nghiệp lắp công suất tùy theo nhu cầu tiêu thụ thực tế.</p>
            <h2>3. Thủ tục đơn giản hóa</h2>
            <ul><li>Dưới 100kWp: Thông báo đơn giản, không cần xin phép</li><li>100kWp – 1MWp: Đăng ký với Công ty Điện lực địa phương</li><li>Trên 1MWp: Cần phê duyệt của EVN khu vực</li></ul>
            <blockquote>GreenTech Solar hỗ trợ toàn bộ thủ tục đấu nối EVN miễn phí cho tất cả dự án chúng tôi thi công.</blockquote>
            <h2>Cơ hội lớn cho doanh nghiệp</h2>
            <p>Đây là thời điểm lý tưởng để đầu tư, vừa giảm chi phí điện vừa đáp ứng tiêu chuẩn ESG ngày càng khắt khe từ chuỗi cung ứng quốc tế.</p>`
        }
    };

    // ── Open Article ─────────────────────────────────────────
    window.openArticle = function (id) {
        const art = ARTICLES[id];
        if (!art) return;
        document.getElementById('art-breadcrumb').textContent = art.title.substring(0, 50) + '…';
        const catBadge = document.getElementById('art-cat-badge');
        catBadge.textContent = art.catLabel;
        catBadge.className = 'nc-cat ' + art.catClass;
        document.getElementById('art-title').textContent = art.title;
        document.getElementById('art-meta').innerHTML = `<i class="fa-regular fa-calendar"></i> ${art.meta}`;
        document.getElementById('art-cover-img').src = art.cover;
        document.getElementById('art-body').innerHTML = art.body;
        navigateTo('article');
        if (typeof currentLang !== 'undefined' && currentLang !== 'vi' && typeof translateDOM === 'function') {
            translateDOM(document.getElementById('page-article'), currentLang);
        }
    };

    // ── News Filter ───────────────────────────────────────────
    window.filterNews = function (cat, li) {
        document.querySelectorAll('.ns-cats li').forEach(l => l.classList.remove('active'));
        if (li) li.classList.add('active');
        document.querySelectorAll('#news-grid .news-card').forEach(card => {
            card.classList.toggle('hidden', !(cat === 'all' || card.dataset.newscat === cat));
        });
    };

    // ── Quote Popup ───────────────────────────────────────────
    window.openQuotePopup = function () {
        const productInput = document.getElementById('q-product');
        if (productInput && window._currentProduct) productInput.value = window._currentProduct;
        document.getElementById('quote-overlay').classList.add('open');
        document.body.style.overflow = 'hidden';
    };
    window.closeQuotePopup = function () {
        document.getElementById('quote-overlay').classList.remove('open');
        document.body.style.overflow = '';
    };
    window.handleQuoteSubmit = function (e) {
        e.preventDefault();
        closeQuotePopup();
        showToast('Gửi thành công! Chuyên gia sẽ gọi lại trong 30 phút.');
        e.target.reset();
    };

    // ── Image Zoom ────────────────────────────────────────────
    window.openZoom = function () {
        document.getElementById('zoom-overlay').classList.add('open');
        document.body.style.overflow = 'hidden';
    };
    window.closeZoom = function () {
        document.getElementById('zoom-overlay').classList.remove('open');
        document.body.style.overflow = '';
    };

    // ESC closes all modals
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeQuotePopup(); closeZoom(); }
    });


    // ── Advanced Sidebar Filter ───────────────────────────────
    window.applyFilters = function () {
        const searchVal  = (document.getElementById('prod-search')?.value || '').toLowerCase();
        const sortVal    = document.getElementById('prod-sort')?.value || 'default';

        const checkedCats   = [...document.querySelectorAll('#fs-cat input:checked, .fs-checkboxes input[value="panels"], .fs-checkboxes input[value="inverters"], .fs-checkboxes input[value="batteries"], .fs-checkboxes input[value="accessories"]')]
            .filter(cb => cb.closest('.fs-checkboxes') && cb.checked).map(cb => cb.value);
        const checkedBrands = [...document.querySelectorAll('.fs-checkboxes input:checked')]
            .filter(cb => ['JinkoSolar','LONGi Solar','Sungrow','Fronius','BYD','K2 Systems'].includes(cb.value)).map(cb => cb.value);
        const checkedBadges = [...document.querySelectorAll('.fs-checkboxes input:checked')]
            .filter(cb => ['Bán chạy','Mới','Hot'].includes(cb.value)).map(cb => cb.value);

        const cards = [...document.querySelectorAll('#product-grid .prod-card')];
        let visible = 0;

        cards.forEach(card => {
            const cat   = card.dataset.cat   || '';
            const brand = card.dataset.brand || '';
            const badge = card.dataset.badge || '';
            const name  = (card.dataset.name || card.querySelector('.prod-name')?.textContent || '').toLowerCase();

            const catOK   = checkedCats.length   === 0 || checkedCats.includes(cat);
            const brandOK = checkedBrands.length === 0 || checkedBrands.includes(brand);
            const badgeOK = checkedBadges.length === 0 || checkedBadges.includes(badge);
            const searchOK = !searchVal || name.includes(searchVal);

            const show = catOK && brandOK && badgeOK && searchOK;
            card.style.display = show ? '' : 'none';
            if (show) visible++;
        });

        // Sort
        if (sortVal !== 'default') {
            const grid = document.getElementById('product-grid');
            const sorted = cards.filter(c => c.style.display !== 'none')
                .sort((a, b) => {
                    const na = a.querySelector('.prod-name')?.textContent || '';
                    const nb = b.querySelector('.prod-name')?.textContent || '';
                    return sortVal === 'name-asc' ? na.localeCompare(nb, 'vi') : nb.localeCompare(na, 'vi');
                });
            sorted.forEach(c => grid.appendChild(c));
        }

        // Update count & empty state
        const countEl = document.getElementById('prod-count');
        if (countEl) countEl.innerHTML = `Hiển thị <strong>${visible}</strong> sản phẩm`;
        const emptyEl = document.getElementById('prod-empty');
        if (emptyEl) emptyEl.style.display = visible === 0 ? 'flex' : 'none';

        // Sync the quick-tab pills to "Tất cả" if no single cat selected
        if (checkedCats.length !== 1) {
            document.querySelectorAll('.pf-tab').forEach(t => t.classList.remove('active'));
            const allTab = document.querySelector('.pf-tab[onclick*="\'all\'"]');
            if (allTab && checkedCats.length === 0) allTab.classList.add('active');
        }
    };

    window.resetAllFilters = function () {
        document.querySelectorAll('.fs-checkboxes input[type="checkbox"]').forEach(cb => cb.checked = false);
        const searchEl = document.getElementById('prod-search');
        if (searchEl) searchEl.value = '';
        const sortEl = document.getElementById('prod-sort');
        if (sortEl) sortEl.value = 'default';
        document.querySelectorAll('#product-grid .prod-card').forEach(c => c.style.display = '');
        const countEl = document.getElementById('prod-count');
        const total = document.querySelectorAll('#product-grid .prod-card').length;
        if (countEl) countEl.innerHTML = `Hiển thị <strong>${total}</strong> sản phẩm`;
        const emptyEl = document.getElementById('prod-empty');
        if (emptyEl) emptyEl.style.display = 'none';
        document.querySelectorAll('.pf-tab').forEach(t => t.classList.remove('active'));
        const allTab = document.querySelector('.pf-tab[onclick*="\'all\'"]');
        if (allTab) allTab.classList.add('active');
    };

    // Sync quick-tab pills with sidebar checkboxes
    const _origFilter = window.filterProducts;
    window.filterProducts = function (cat, btn) {
        // Uncheck all cat checkboxes first, then check the right one
        document.querySelectorAll('.fs-checkboxes input').forEach(cb => {
            if (['panels','inverters','batteries','accessories'].includes(cb.value)) cb.checked = false;
        });
        if (cat !== 'all') {
            const cb = document.querySelector(`.fs-checkboxes input[value="${cat}"]`);
            if (cb) cb.checked = true;
        }
        // Update tab active state
        document.querySelectorAll('.pf-tab').forEach(t => t.classList.remove('active'));
        if (btn) btn.classList.add('active');
        applyFilters();
    };

    window.calculateROI = function () {
        const capacityInput = document.getElementById('calc-capacity');
        const billInput = document.getElementById('calc-bill');
        const modelInput = document.querySelector('input[name="calc-model"]:checked');
        
        if (!capacityInput || !billInput || !modelInput) return;
        
        const capacity = parseInt(capacityInput.value, 10);
        const monthlyBill = parseInt(billInput.value, 10);
        const model = modelInput.value;
        
        // Dynamic labels based on language
        let billText = monthlyBill + ' Tr VNĐ';
        let areaText = `Diện tích mái yêu cầu: ~${(capacity * 6.5).toLocaleString('vi-VN')} m²`;
        let unitBillion = ' Tỷ';
        let unitVND = ' VNĐ';
        let unitYear = ' năm';
        let unitPerYear = '/năm';
        let instantText = 'Tức thì (0 năm)';
        
        if (typeof currentLang !== 'undefined') {
            if (currentLang === 'en') {
                billText = monthlyBill + ' M VND';
                areaText = `Required roof area: ~${(capacity * 6.5).toLocaleString('en-US')} m²`;
                unitBillion = ' B VND';
                unitVND = ' VND';
                unitYear = ' years';
                unitPerYear = '/year';
                instantText = 'Instant (0 years)';
            } else if (currentLang === 'zh') {
                billText = monthlyBill + ' 百万越盾';
                areaText = `所需屋顶面积: ~${(capacity * 6.5).toLocaleString('zh-CN')} m²`;
                unitBillion = ' 十亿越盾';
                unitVND = ' 越盾';
                unitYear = ' 年';
                unitPerYear = '/年';
                instantText = '即时 (0年)';
            }
        }
        
        // Update input label displays
        document.getElementById('calc-capacity-val').textContent = capacity + ' kWp';
        document.getElementById('calc-bill-val').textContent = billText;
        document.getElementById('calc-area-val').textContent = areaText;
        
        // Calculations variables
        let capexBefore, capexAfter;
        let rateBefore, rateAfter;
        let paybackBefore, paybackAfter;
        let savingsBefore, savingsAfter;
        
        // 1. CAPEX estimation (approx 13 Million VND per kWp for self-investment)
        const capexTotal = (capacity * 13) / 1000; // in Billion VND
        
        // 2. Savings and Cash flow models
        // Electricity generated per month (kWp * 115 kWh/month average solar yields in VN)
        const monthlyGen = capacity * 115; 
        const avgPrice = 2800; // average EVN price per kWh
        const monthlySolarVal = (monthlyGen * avgPrice) / 1000000; // in Million VND
        
        // Monthly electricity savings (cannot exceed the current monthly bill)
        const savingsPerMonth = Math.min(monthlyBill, monthlySolarVal); 
        
        if (model === 'esco-ppa') {
            // ESCO PPA Mode
            capexBefore = capexTotal; // Before: Capital is paid 100% by factory
            capexAfter = 0;           // After: 0 VND CAPEX
            
            rateBefore = 'N/A';
            rateAfter = 'N/A';
            
            // Payback
            paybackBefore = (capexTotal * 1000) / (savingsPerMonth * 12); // years
            paybackAfter = 0; // Instant savings (0 years payback!)
            
            // 20-Year cumulative savings
            // Before: Net profit = (20 years of solar yield) - CAPEX - O&M (estimated 1.5% of CAPEX per year)
            savingsBefore = (savingsPerMonth * 12 * 20) - (capexTotal * 1000) - (capexTotal * 0.015 * 20 * 1000); // Million VND
            
            // After: Under ESCO, factory gets electricity discount of e.g. 20%
            // Net profit = 20% discount on solar generated electricity (no CAPEX, no O&M)
            savingsAfter = (savingsPerMonth * 12 * 20) * 0.20; // Million VND
            
            // Formatting displays
            document.getElementById('capex-before').textContent = capexBefore.toFixed(2) + unitBillion;
            document.getElementById('capex-after').textContent = '0' + unitVND;
            document.getElementById('rate-before').textContent = 'N/A';
            document.getElementById('rate-after').textContent = 'N/A';
            document.getElementById('payback-before').textContent = paybackBefore.toFixed(1) + unitYear;
            document.getElementById('payback-after').textContent = instantText;
            document.getElementById('savings-before').textContent = (savingsBefore / 1000).toFixed(2) + unitBillion;
            document.getElementById('savings-after').textContent = (savingsAfter / 1000).toFixed(2) + unitBillion;
            
            // Visual cumulative bars
            updateBars(savingsBefore, savingsAfter);
            
            // Summary text
            if (typeof currentLang !== 'undefined' && currentLang === 'en') {
                document.getElementById('calc-summary-text').innerHTML = 
                    `Thanks to the <strong>ESCO/PPA</strong> model, you receive <strong>100%</strong> initial investment worth <strong>${capexTotal.toFixed(2)} Billion VND</strong>. You save <strong>${(savingsAfter / 240).toFixed(1)} M VND/month</strong> (equivalent to <strong>${(savingsAfter/1000).toFixed(2)} Billion</strong> after 20 years) from day one with zero technical risk.`;
            } else if (typeof currentLang !== 'undefined' && currentLang === 'zh') {
                document.getElementById('calc-summary-text').innerHTML = 
                    `得益于 <strong>ESCO/PPA</strong> 模式，您将获得 <strong>100%</strong> 的初始资金支持，价值 <strong>${capexTotal.toFixed(2)} 十亿越盾</strong>。从第一天起，您每月即可节省 <strong>${(savingsAfter / 240).toFixed(1)} 百万越盾</strong>（20年后累计节省 <strong>${(savingsAfter/1000).toFixed(2)} 十亿</strong>），且无需承担任何技术风险。`;
            } else {
                document.getElementById('calc-summary-text').innerHTML = 
                    `Nhờ giải pháp <strong>ESCO/PPA</strong>, bạn được tài trợ <strong>100%</strong> vốn đầu tư ban đầu trị giá <strong>${capexTotal.toFixed(2)} Tỷ VNĐ</strong>. Bạn tiết kiệm ngay <strong>${(savingsAfter / 240).toFixed(1)} Tr VNĐ/tháng</strong> (tương đương <strong>${(savingsAfter/1000).toFixed(2)} Tỷ</strong> sau 20 năm) từ ngày đầu tiên mà không chịu bất kỳ rủi ro kỹ thuật nào.`;
            }
            
        } else {
            // Green Loan Mode
            capexBefore = capexTotal * 0.50; // Capital required upfront
            capexAfter = capexTotal * 0.20;
            
            rateBefore = '10.5%';
            rateAfter = '7.5%';
            
            // Payback periods
            paybackBefore = (capexTotal * 1000) / (savingsPerMonth * 12 * 0.85);
            paybackAfter = (capexTotal * 1000) / (savingsPerMonth * 12 * 0.95);
            
            paybackBefore = Math.max(paybackBefore, 6.2);
            paybackAfter = Math.max(paybackAfter - 1.5, 4.2);
            
            // 20-Year savings
            savingsBefore = (savingsPerMonth * 12 * 20) - (capexTotal * 1000) - (capexTotal * 1000 * 0.45);
            savingsAfter = (savingsPerMonth * 12 * 20 * 1.07) - (capexTotal * 1000) - (capexTotal * 1000 * 0.20);
            
            document.getElementById('capex-before').textContent = capexBefore.toFixed(2) + unitBillion;
            document.getElementById('capex-after').textContent = capexAfter.toFixed(2) + unitBillion;
            document.getElementById('rate-before').textContent = rateBefore + unitPerYear;
            document.getElementById('rate-after').textContent = rateAfter + unitPerYear;
            document.getElementById('payback-before').textContent = paybackBefore.toFixed(1) + unitYear;
            document.getElementById('payback-after').textContent = paybackAfter.toFixed(1) + unitYear;
            document.getElementById('savings-before').textContent = (savingsBefore / 1000).toFixed(2) + unitBillion;
            document.getElementById('savings-after').textContent = (savingsAfter / 1000).toFixed(2) + unitBillion;
            
            updateBars(savingsBefore, savingsAfter);
            
            const capexSaved = capexBefore - capexAfter;
            const rateDiff = 3.0;
            const yearsDiff = paybackBefore - paybackAfter;
            
            if (typeof currentLang !== 'undefined' && currentLang === 'en') {
                document.getElementById('calc-summary-text').innerHTML = 
                    `Through our green credit matchmaking, your upfront equity is reduced by <strong>${capexSaved.toFixed(2)} Billion VND</strong>, loan interest rate drops by <strong>${rateDiff.toFixed(1)}%</strong> and payback period is shortened by <strong>${yearsDiff.toFixed(1)} years</strong> (20-year net benefit difference reaches <strong>${((savingsAfter - savingsBefore)/1000).toFixed(2)} Billion VND</strong>).`;
            } else if (typeof currentLang !== 'undefined' && currentLang === 'zh') {
                document.getElementById('calc-summary-text').innerHTML = 
                    `通过绿色信贷经纪对接，您的自筹首付资金减少了 <strong>${capexSaved.toFixed(2)} 十亿越盾</strong>，贷款利率降低了 <strong>${rateDiff.toFixed(1)}%</strong>，投资回收期缩短了 <strong>${yearsDiff.toFixed(1)} 年</strong>（20年累计收益差额达 <strong>${((savingsAfter - savingsBefore)/1000).toFixed(2)} 十亿越盾</strong>）。`;
            } else {
                document.getElementById('calc-summary-text').innerHTML = 
                    `Nhờ Môi giới kết nối Quỹ xanh, bạn giảm được <strong>${capexSaved.toFixed(2)} Tỷ VNĐ</strong> vốn tự có đối ứng ban đầu, lãi suất vay giảm <strong>${rateDiff.toFixed(1)}%</strong> và rút ngắn <strong>${yearsDiff.toFixed(1)} năm</strong> thời gian hoàn vốn (Chênh lệch lợi nhuận 20 năm đạt <strong>${((savingsAfter - savingsBefore)/1000).toFixed(2)} Tỷ VNĐ</strong>).`;
            }
        }
    };
    
    function updateBars(before20, after20) {
        // Estimate 5 and 10 years values proportionally
        const before5 = before20 * 0.15;
        const after5 = after20 * 0.22; // higher early flow
        
        const before10 = before20 * 0.45;
        const after10 = after20 * 0.55;
        
        const maxVal = Math.max(before20, after20);
        
        setBarWidth('bar-5-before', before5, maxVal);
        setBarWidth('bar-5-after', after5, maxVal);
        setBarWidth('bar-10-before', before10, maxVal);
        setBarWidth('bar-10-after', after10, maxVal);
        setBarWidth('bar-20-before', before20, maxVal);
        setBarWidth('bar-20-after', after20, maxVal);
    }
    
    function setBarWidth(id, val, max) {
        const el = document.getElementById(id);
        if (!el) return;
        const percentage = Math.max(5, (val / max) * 100);
        el.style.width = percentage.toFixed(0) + '%';
        // Add content text representing value inside bar
        el.textContent = Math.round(val).toLocaleString('vi-VN') + ' Tr';
        el.style.color = '#fff';
        el.style.fontSize = '0.75rem';
        el.style.fontWeight = '700';
        el.style.paddingLeft = '8px';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
    }
    
    // ── Translation Dictionary and Engine ───────────────────
    window.currentLang = 'vi';
    
    const DICTIONARY = {
        // Nav Header
        "Trang Chủ": { en: "Home", zh: "首页" },
        "Giới Thiệu": { en: "About Us", zh: "关于我们" },
        "Sản Phẩm": { en: "Products", zh: "产品中心" },
        "Tấm Pin Năng Lượng": { en: "Solar Panels", zh: "太阳能电池板" },
        "Inverter (Biến Tần)": { en: "Inverters", zh: "逆变器" },
        "Pin Lưu Trữ": { en: "Battery Storage", zh: "储能电池" },
        "Phụ Kiện Thi Công": { en: "Mounting Accessories", zh: "安装配件" },
        "Giải Thế": { en: "Solutions", zh: "解决方案" },
        "Giải Pháp": { en: "Solutions", zh: "解决方案" },
        "Doanh nghiệp & Nhà máy": { en: "C&I and Factories", zh: "工商业及工厂" },
        "Hộ Gia Đình": { en: "Residential", zh: "家用及户用" },
        "Nông Nghiệp": { en: "Agriculture", zh: "农业应用" },
        "Đầu Tư Môi Giới": { en: "Investment & Broker", zh: "投资与经纪" },
        "Giải pháp ESCO/PPA": { en: "ESCO/PPA Solutions", zh: "ESCO/PPA 解决方案" },
        "Kết nối Quỹ tín dụng xanh": { en: "Green Loan Matching", zh: "对接绿色信贷基金" },
        "Đòn bẩy EPC & O&M": { en: "EPC & O&M Leverage", zh: "EPC与O&M杠杆" },
        "Dự Án": { en: "Projects", zh: "示范项目" },
        "Tin Tức": { en: "News", zh: "新闻动态" },
        "Liên Hệ": { en: "Contact Us", zh: "联系我们" },
        "Nhận Báo Giá": { en: "Get Quote", zh: "获取报价" },
        "Năng lượng · Tỏa sáng": { en: "Energy · Shine", zh: "能量 · 闪耀" },
        
        // Buttons & Forms
        "Xem tất cả": { en: "View All", zh: "查看全部" },
        "Đọc tiếp": { en: "Read More", zh: "阅读更多" },
        "Quay Lại Tin Tức": { en: "Back to News", zh: "返回新闻" },
        "Gửi Yêu Cầu Tư Vấn": { en: "Submit Request", zh: "提交咨询申请" },
        "Gửi Yêu Cầu": { en: "Submit Request", zh: "提交申请" },
        "Liên Hệ Nhận Báo Giá": { en: "Contact for Quote", zh: "联系获取报价" },
        "Tìm hiểu thêm": { en: "Learn More", zh: "了解更多" },
        "Nhận Tư Vấn Miễn Phí": { en: "Get Free Consultation", zh: "获取免费咨询" },
        "Xem Hồ Sơ Năng Lực": { en: "View Portfolio", zh: "查看公司画册" },
        "Khám Phá Giải Pháp": { en: "Explore Solutions", zh: "探索解决方案" },
        "Xem video thực tế": { en: "Watch Real Video", zh: "观看实景视频" },
        "Nhận Tư Vấn ESCO": { en: "Get ESCO Consult", zh: "咨询 ESCO 方案" },
        "Kết Nối Với Quỹ Xanh": { en: "Connect with Green Funds", zh: "对接绿色基金" },
        "Đăng Ký Khảo Sát EPC": { en: "Request EPC Survey", zh: "申请 EPC 勘测" },
        "Khảo sát miễn phí": { en: "Free Survey", zh: "免费上门勘测" },
        "Gửi liên hệ": { en: "Submit", zh: "提交" },
        "Hủy": { en: "Cancel", zh: "取消" },
        "Trang chủ": { en: "Home", zh: "首页" },
        "Chi Tiết": { en: "Detail", zh: "产品详情" },
        "Bài viết": { en: "Article", zh: "文章详情" },
        
        // Hero Section & Stats
        "Tiên phong năng lượng xanh tại Việt Nam": { en: "Pioneering green energy in Vietnam", zh: "越南绿色能源的先驱" },
        "Giải Pháp Điện Mặt Trời": { en: "Solar Energy Solutions", zh: "太阳能解决方案" },
        "Chuẩn Quốc Tế": { en: "International Standard", zh: "国际标准" },
        "Tổng thầu EPC hàng đầu — Đồng hành cùng doanh nghiệp tối ưu chi phí năng lượng, đạt chứng chỉ ESG và kiến tạo tương lai bền vững.": {
            en: "Leading EPC Contractor — Accompanying enterprises to optimize energy costs, achieve ESG certificates, and build a sustainable future.",
            zh: "一流的EPC总包服务商 — 助力企业优化能源成本，获得ESG认证，共创可持续未来。"
        },
        "Hiệu suất hôm nay": { en: "Today's Yield", zh: "今日发电量" },
        "+8.2% so với hôm qua": { en: "+8.2% vs yesterday", zh: "比昨天 +8.2%" },
        "4.2 Tấn": { en: "4.2 Tons", zh: "4.2 吨" },
        "CO₂ giảm thiểu": { en: "CO₂ Reduced", zh: "CO₂ 减排量" },
        "Cuộn xuống": { en: "Scroll Down", zh: "向下滚动" },
        "MWp Đã Lắp Đặt": { en: "MWp Installed", zh: "已安装容量 (MWp)" },
        "Dự Án Hoàn Thành": { en: "Projects Completed", zh: "已落成项目" },
        "Kinh Nghiệm": { en: "Years Experience", zh: "行业经验 (年)" },
        "Tấn CO₂ Giảm Thiểu": { en: "Tons CO₂ Reduced", zh: "CO₂ 减排量 (吨)" },
        "năm": { en: "years", zh: "年" },
        
        // About Section (Home Page)
        "VỀ CHÚNG TÔI": { en: "ABOUT US", zh: "关于我们" },
        "Tổng Thầu EPC Uy Tín Số 1": { en: "Top 1 Reputable EPC Contractor", zh: "行业领先的首选 EPC 总包商" },
        "GreenTech Solar là đơn vị thiết kế, thi công và vận hành hệ thống điện mặt trời toàn diện. Với đội ngũ kỹ sư hơn 10 năm kinh nghiệm và công nghệ Tier 1 quốc tế, chúng tôi cam kết mang lại hiệu quả đầu tư tối ưu cho từng khách hàng.": {
            en: "GreenTech Solar is a comprehensive design, construction, and operation provider of solar energy systems. With a team of engineers holding over 10 years of experience and international Tier 1 technologies, we commit to delivering optimized investment efficiency for every client.",
            zh: "GreenTech Solar 是一家提供太阳能光伏系统规划设计、采购施工和运营维护的全方位服务商。凭借拥有10年以上经验的工程师团队 và 国际 Tier 1 标准的技术，我们致力于为每位客户实现最优质的投资回报。"
        },
        "Thiết kế thi công EPC trọn gói": { en: "Turnkey EPC Design & Construction", zh: "全包EPC设计与施工" },
        "Bảo hành hiệu suất 25 năm": { en: "25-year Performance Warranty", zh: "25年线性功率质保" },
        "Chứng chỉ ISO 9001:2015": { en: "ISO 9001:2015 Certification", zh: "ISO 9001:2015 质量体系认证" },
        "Hỗ trợ thủ tục EVN, PCCC trọn gói": { en: "Full EVN Connection & Fire Safety Support", zh: "全套协助对接电网与消防审批手续" },
        "Tổng thầu EPC hàng đầu": { en: "Leading EPC Contractor", zh: "一流 EPC 总包商" },
        "Việt Nam 2024": { en: "Vietnam 2024", zh: "越南 2024" },
        "Khách hàng hài lòng": { en: "Customer satisfaction", zh: "客户满意度" },
        
        // Solutions Cards (Home / Solutions Page)
        "GIẢI PHÁP": { en: "SOLUTIONS", zh: "解决方案" },
        "Tối Ưu Cho Mọi Nhu Cầu": { en: "Optimized for Every Need", zh: "针对各种需求进行优化" },
        "Từ nhà máy quy mô lớn đến hộ gia đình, chúng tôi có giải pháp phù hợp với từng mục tiêu của bạn.": {
            en: "From large-scale factories to private households, we have tailored solutions for your goals.",
            zh: "从大型工厂到普通家庭，我们为您量身定制解决方案。"
        },
        "Phổ biến nhất": { en: "Most Popular", zh: "最受欢迎" },
        "Doanh Nghiệp & Nhà Máy": { en: "Commercial & Industrial", zh: "工商业与工厂" },
        "Hoàn vốn 4–5 năm": { en: "4-5 years payback", zh: "4-5年回收成本" },
        "Giảm 80% hóa đơn điện": { en: "Reduce 80% electric bill", zh: "降低80%电费" },
        "Đạt chứng chỉ LEED / ESG": { en: "Achieve LEED / ESG certs", zh: "获得LEED/ESG认证" },
        "Hệ thống Hybrid On/Off-grid": { en: "Hybrid On/Off-grid systems", zh: "并离网混合储能系统" },
        "Giám sát realtime qua App": { en: "Real-time app monitoring", zh: "手机App实时监控" },
        "Lắp đặt trong 1–2 ngày": { en: "Installation in 1-2 days", zh: "1-2天快速安装" },
        "Nông Nghiệp Công Nghệ Cao": { en: "High-Tech Agriculture", zh: "高科技农业" },
        "Tối ưu diện tích canh tác": { en: "Optimize farming area", zh: "优化耕作面积" },
        "Vận hành bơm tưới tự động": { en: "Automated pump operation", zh: "自动灌溉系统运行" },
        "Hiệu quả kinh tế kép": { en: "Double economic efficiency", zh: "双重经济效益" },
        "Tối ưu chi phí, tăng giá trị xanh cho mọi mô hình.": {
            en: "Optimize costs, increase green value for every business model.",
            zh: "优化成本，为各种商业模式提升绿色价值。"
        },
        "Phù hợp với nhà máy, kho xưởng, trung tâm thương mại. Hệ thống từ 50kWp–5MWp, hoàn vốn 4–5 năm, giảm 70–80% hóa đơn điện hàng tháng.": {
            en: "Suitable for factories, warehouses, shopping malls. Systems range from 50kWp to 5MWp, with a payback period of 4-5 years, reducing monthly electricity bills by 70-80%.",
            zh: "适用于工厂、仓库、商场。系统容量从 50kWp 到 5MWp，投资回收期为4-5年，每月可降低 70-80% 的电费。"
        },
        "Hệ thống On-grid, Off-grid và Hybrid linh hoạt. Tự chủ điện 24/7, quản lý từ xa qua ứng dụng điện thoại thông minh.": {
            en: "Flexible On-grid, Off-grid, and Hybrid systems. Complete 24/7 power independence, managed remotely via smartphone applications.",
            zh: "灵活的并网、离网和混合储能系统。实现 24/7 商业/住宅用电独立，通过智能手机App进行远程监控和管理。"
        },
        "Mô hình Agrivoltaic kết hợp sản xuất điện và canh tác nông nghiệp. Tăng hiệu quả kinh tế trên cùng diện tích đất, phù hợp với nhà kính, trang trại.": {
            en: "Agrivoltaic model combining electricity generation and farming. Increase economic efficiency on the same land area, ideal for greenhouses and farms.",
            zh: "光伏农业模式将清洁发电与农业种植相结合。在同一片土地上成倍提升经济效益，是温室和农场的理想选择。"
        },
        
        // Solutions specs
        "Công suất": { en: "Capacity", zh: "装机容量" },
        "Hoàn vốn": { en: "Payback", zh: "回收期" },
        "Tiết kiệm": { en: "Savings", zh: "节省比例" },
        "Lắp đặt": { en: "Installation", zh: "安装周期" },
        "Mô hình": { en: "Model", zh: "应用模式" },
        "Lợi ích": { en: "Benefit", zh: "核心优势" },
        "Agrivoltaic": { en: "Agrivoltaic", zh: "光伏农业" },
        "Kép (điện + nông)": { en: "Dual (solar + farm)", zh: "双重收益 (发电+农耕)" },
        "1–2 ngày": { en: "1–2 days", zh: "1–2 天" },
        "25 năm": { en: "25 years", zh: "25 年" },
        "4–5 năm": { en: "4–5 years", zh: "4–5 年" },
        "70–80%/tháng": { en: "70–80%/month", zh: "每月 70-80%" },
        "50kWp – 5MWp": { en: "50kWp – 5MWp", zh: "50 kWp – 5 MWp" },
        "3kWp – 20kWp": { en: "3kWp – 20kWp", zh: "3 kWp – 20 kWp" },
        "20kWp – 500kWp": { en: "20kWp – 500kWp", zh: "20 kWp – 500 kWp" },
        
        // Projects Preview (Home / Projects Page)
        "DỰ ÁN": { en: "PROJECTS", zh: "示范项目" },
        "Dấu Ấn Trên Mọi Miền": { en: "Our Footprints Across Regions", zh: "我们在各地区的足迹" },
        "Dự Án Tiêu Biểu": { en: "Featured Projects", zh: "经典案例/项目" },
        "300+ dự án hoàn thành trên toàn quốc với tổng công suất 150 MWp.": {
            en: "300+ completed projects nationwide with a total capacity of 150 MWp.",
            zh: "全国已落成300多个项目，总装机容量达150兆瓦 (MWp)。"
        },
        "Tất cả": { en: "All", zh: "全部" },
        "Công nghiệp": { en: "Industrial", zh: "工业" },
        "Dân dụng": { en: "Residential", zh: "户用" },
        "Nông nghiệp": { en: "Agricultural", zh: "农业" },
        "Nhà Máy Tech Vina – 1.2 MWp": { en: "Tech Vina Factory – 1.2 MWp", zh: "Tech Vina 工厂 – 1.2兆瓦 (MWp)" },
        "KCN Yên Phong, Bắc Ninh": { en: "Yen Phong IP, Bac Ninh", zh: "北宁省安丰工业区" },
        "Biệt Thự Vinhomes – 15 kWp": { en: "Vinhomes Villa – 15 kWp", zh: "Vinhomes 别墅 – 15千瓦 (kWp)" },
        "Long Biên, Hà Nội": { en: "Long Bien, Hanoi", zh: "河内市龙边郡" },
        "Trang Trại HT – 500 kWp": { en: "HT Farm – 500 kWp", zh: "HT 农场 – 500千瓦 (kWp)" },
        "Mộc Châu, Sơn La": { en: "Moc Chau, Son La", zh: "山罗省木州县" },
        "Nhà Máy Tech Vina": { en: "Tech Vina Factory", zh: "Tech Vina 工厂" },
        "Biệt Thự Vinhomes Riverside": { en: "Vinhomes Riverside Villa", zh: "Vinhomes Riverside 别墅" },
        "Trang Trại Nông Nghiệp Sạch HT": { en: "HT Clean Agriculture Farm", zh: "HT 绿色农业示范农场" },
        "Nhà Máy Samsung SDI": { en: "Samsung SDI Factory", zh: "三星 SDI 制造厂" },
        "Khu Dân Cư The Manor": { en: "The Manor Residential District", zh: "The Manor 现代住宅区" },
        "Vùng Trồng Rau VietGAP": { en: "VietGAP Vegetable Growing Area", zh: "VietGAP 蔬菜种植基地" },
        "Bắc Ninh": { en: "Bac Ninh", zh: "北宁" },
        "Hà Nội": { en: "Hanoi", zh: "河内" },
        "Sơn La": { en: "Son La", zh: "山罗" },
        "Thái Nguyên": { en: "Thai Nguyen", zh: "太原" },
        "TP.HCM": { en: "HCMC", zh: "胡志明市" },
        "Đà Lạt": { en: "Da Lat", zh: "大叻" },
        
        // Why Us (Home Page)
        "GIÁ TRỊ CỐT LÕI": { en: "CORE VALUES", zh: "核心价值观" },
        "Tại Sao Chọn GreenTech Solar?": { en: "Why Choose GreenTech Solar?", zh: "为什么选择 GreenTech Solar?" },
        "Thiết Bị Tier 1": { en: "Tier 1 Equipment", zh: "Tier 1 一级设备" },
        "Tấm pin & Inverter thuộc Top 5 Tier 1 Bloomberg. Cam kết hiệu suất 25 năm.": {
            en: "Solar panels & inverters from Bloomberg Top 5 Tier 1. Committing to a 25-year performance warranty.",
            zh: "光伏组件与逆变器均来自彭博社 (Bloomberg) 评选的前五大 Tier 1 品牌。承诺25年发电效率保证。"
        },
        "Bảo Hành 25 Năm": { en: "25-Year Warranty", zh: "25年工程质保" },
        "Bảo hành hiệu suất 84% sau 25 năm vận hành và phần cứng 12 năm.": {
            en: "84% efficiency guaranteed after 25 years of operation and 12-year hardware warranty.",
            zh: "在运行25年后保证仍有 84% 以上的发电效率，并提供12年的硬件质保。"
        },
        "Kỹ Sư 10+ Năm": { en: "10+ Yrs Engineers", zh: "10年以上经验工程师" },
        "Đội ngũ kỹ sư được đào tạo quốc tế, thiết kế và thi công đúng chuẩn.": {
            en: "Globally trained engineering team, planning and executing strictly to standards.",
            zh: "我们的技术人员均接受过国际标准培训，确保系统结构规划和施工符合标准规范。"
        },
        "Thủ Tục Trọn Gói": { en: "Turnkey Procedures", zh: "全包代办手续" },
        "Hỗ trợ toàn bộ giấy phép PCCC, đấu nối EVN nhanh và chuyên nghiệp.": {
            en: "Full support for fire safety permits and fast, professional EVN grid connection.",
            zh: "全程协助办理消防审批、并网接入国家电网 (EVN) 手续，快捷且专业。"
        },
        "Sẵn sàng chuyển sang năng lượng xanh?": { en: "Ready to switch to green energy?", zh: "您准备好转向绿色电力了吗？" },
        "Nhận tư vấn và báo giá miễn phí từ chuyên gia trong 24 giờ.": { en: "Get free expert advice and quotes within 24 hours.", zh: "在24小时内获得我们专家的免费量身咨询和详细报价。" },
        "Nhận Báo Giá Miễn Phí": { en: "Get Free Quote", zh: "获取免费报价" },
        
        // About Page Detailed Content
        "Về TEST": { en: "About TEST", zh: "关于 TEST" },
        "Năng lượng mặt trời — không chỉ là công nghệ, đó là cam kết kiến tạo tương lai xanh cho Việt Nam.": {
            en: "Solar energy — not just technology, it's a commitment to building a green future for Vietnam.",
            zh: "太阳能 — 不仅仅是技术，更是我们为越南创造绿色未来的庄严承诺。"
        },
        "Năm kinh nghiệm": { en: "Years Experience", zh: "行业经验" },
        "Tổng công suất": { en: "Total Capacity", zh: "总装机容量" },
        "Top 3 EPC Solar": { en: "Top 3 Solar EPC", zh: "前三大光伏总承包商" },
        "Câu Chuyện Của Chúng Tôi": { en: "Our Story", zh: "我们的故事" },
        "Từ 5 Kỹ Sư Đến": { en: "From 5 Engineers to", zh: "从 5 位工程师到" },
        "Top 3 Thị Trường": { en: "Top 3 in the Market", zh: "市场前三名" },
        "Năm 2009, TEST được thành lập bởi nhóm 5 kỹ sư năng lượng với một niềm tin mãnh liệt: Việt Nam hoàn toàn có thể chủ động về năng lượng nhờ ánh nắng mặt trời dồi dào trải dài suốt 12 tháng.": {
            en: "In 2009, TEST was founded by a group of 5 energy engineers with a strong belief: Vietnam can completely secure its energy independence thanks to abundant sunlight spanning all 12 months.",
            zh: "2009年，TEST由一个5位开发工程师组成的小组创立，他们抱有一个强烈的信念：得益于一年四季12个月源源不断的光照，越南完全可以实现能源自给自足。"
        },
        "Từ dự án đầu tiên 50 kWp tại một trường học ở Hà Nội, chúng tôi đã từng bước xây dựng uy tín qua chất lượng thi công thực tế. Khách hàng giới thiệu khách hàng — đó là cách TEST lớn lên.": {
            en: "From the first 50 kWp project at a school in Hanoi, we have built our reputation step-by-step through practical construction quality. Customer referrals — that is how TEST has grown.",
            zh: "从在河内一所学校的第一个50千瓦项目开始，我们通过过硬的施工质量一步步树立起声誉。口碑相传 — 这就是 TEST 成长的基石。"
        },
        "Hôm nay, với đội ngũ 150+ chuyên gia, TEST tự hào là đơn vị tổng thầu EPC Solar hàng đầu, phủ sóng từ các khu công nghiệp miền Bắc đến những nông trại điện mặt trời tại miền Nam.": {
            en: "Today, with a team of 150+ experts, TEST is proud to be a leading Solar EPC contractor, covering everything from industrial parks in the North to solar farms in the South.",
            zh: "今天，TEST已拥有一支由150多名专家组成的团队，自豪地成为领先的太阳能光伏EPC总包商，业务范围从北部的工业园区一直延伸到南部的大型光伏农场。"
        },
        "Thiết kế — Thi công — Vận hành trọn gói": { en: "Design — Construction — Operation Turnkey", zh: "规划设计 — 采购施工 — 运行维护全包服务" },
        "Cam kết hoàn vốn dưới 5 năm": { en: "Payback guaranteed in under 5 years", zh: "承诺回收期低于5年" },
        "Bảo hành hệ thống 10 năm": { en: "10-year system warranty", zh: "10年整机系统质保" },
        "Hỗ trợ kỹ thuật 24/7 suốt vòng đời dự án": { en: "24/7 technical support throughout project life", zh: "在项目整个生命周期内提供24/7技术支持" },
        "Định Hướng Chiến Lược": { en: "Strategic Direction", zh: "战略规划" },
        "Tầm Nhìn · Sứ Mệnh · Giá Trị": { en: "Vision · Mission · Values", zh: "愿景 · 使命 · 核心价值" },
        "Tầm Nhìn": { en: "Vision", zh: "企业愿景" },
        "Trở thành tập đoàn năng lượng tái tạo hàng đầu Đông Nam Á vào năm 2035, với 1 GWp công suất lắp đặt tích lũy và hiện diện tại 5 quốc gia.": {
            en: "To become a leading renewable energy group in Southeast Asia by 2035, with 1 GWp of cumulative installed capacity and presence in 5 countries.",
            zh: "到2035年成为东南亚领先的可再生能源集团，累计装机容量达到 1 GWp，并在5个国家开展业务。"
        },
        "Sứ Mệnh": { en: "Mission", zh: "使命" },
        "Trao quyền chủ động năng lượng cho mọi doanh nghiệp và hộ gia đình Việt Nam thông qua công nghệ điện mặt trời tiên tiến, minh bạch và bền vững.": {
            en: "To empower every business and household in Vietnam with clean energy independence through advanced, transparent, and sustainable solar technologies.",
            zh: "通过先进、透明且可持续的太阳能技术，赋予越南每家企业和家庭掌握自身能源自主的权利。"
        },
        "Giá Trị Cốt Lõi": { en: "Core Values", zh: "核心价值" },
        "Chính trực trong từng cam kết. Đổi mới không ngừng. Trách nhiệm với cộng đồng và môi trường. Xuất sắc trong chuyên môn kỹ thuật.": {
            en: "Integrity in every commitment. Non-stop innovation. Responsibility to communities and environment. Excellence in engineering.",
            zh: "诚信对待每一份承诺。不断开拓创新。对社区与环境尽责。在工程技术领域追求卓越。"
        },
        "DNA Của Chúng Tôi": { en: "Our DNA", zh: "我们的企业文化" },
        "4 Nguyên Tắc Vận Hành": { en: "4 Operating Principles", zh: "4大经营与运行原则" },
        "Chính Trực": { en: "Integrity", zh: "诚实正直" },
        "Báo giá rõ ràng, không ẩn phí. Cam kết đúng tiến độ. Không bớt vật liệu, không thay thế chui.": {
            en: "Clear quotes, no hidden fees. Committed to schedule. No material cutting or unauthorized replacements.",
            zh: "透明报价，无隐性费用。严守工程进度。绝不偷工减料，不私自替换低配物料。"
        },
        "Đổi Mới": { en: "Innovation", zh: "开拓创新" },
        "Liên tục cập nhật công nghệ thế hệ mới. Đội R&D nội bộ phát triển giải pháp tùy chỉnh cho từng công trình.": {
            en: "Continuously updating new-generation technologies. Internal R&D team designs custom setups for each project.",
            zh: "持续引进和应用前沿技术。自有研发团队为每一栋建筑物设计定制化的太阳能方案。"
        },
        "Trách Nhiệm": { en: "Responsibility", zh: "责任担当" },
        "Mỗi hệ thống TEST lắp đặt giảm trung bình 60 tấn CO₂/năm. Mục tiêu 1 triệu tấn carbon tiết kiệm vào 2030.": {
            en: "Each system installed by TEST reduces an average of 60 tons of CO₂ annually. Target 1 million tons saved by 2030.",
            zh: "TEST安装的每个系统平均每年可减少60吨二氧化碳排放。目标到2030年累计减碳达100万吨。"
        },
        "Xuất Sắc": { en: "Excellence", zh: "追求卓越" },
        "Kỹ sư được chứng nhận bởi các nhà sản xuất quốc tế. Tiêu chuẩn thi công theo IEC 62548.": {
            en: "Engineers certified by global manufacturers. Installation standard complies with IEC 62548.",
            zh: "工程师均获得国际一线设备商认证。施工与施工安全符合国际电工委员会 IEC 62548 标准。"
        },
        "Con Người Làm Nên Khác Biệt": { en: "People Make the Difference", zh: "人才是我们最核心的优势" },
        "Đội Ngũ Lãnh Đạo": { en: "Leadership Team", zh: "核心领导团队" },
        "Kết hợp giữa kinh nghiệm kỹ thuật sâu và tầm nhìn kinh doanh chiến lược.": {
            en: "A perfect blend of deep engineering experience and strategic business vision.",
            zh: "深厚的技术工程背景与前瞻性战略商业眼光的完美结合。"
        },
        "Nguyễn Minh Khoa": { en: "Nguyen Minh Khoa", zh: "阮明科" },
        "CEO & Đồng sáng lập": { en: "CEO & Co-founder", zh: "首席执行官 & 联合创始人" },
        "15 năm trong ngành NLTT. Cử nhân Điện — ĐH Bách Khoa HN. MBA — RMIT Việt Nam.": {
            en: "15 years in renewable energy. B.Eng in Electrical — Hanoi UST. MBA — RMIT Vietnam.",
            zh: "15年可再生能源行业经验。河内百科大学电气工程学士，RMIT越南工商管理硕士 (MBA)。"
        },
        "Trần Thị Lan Anh": { en: "Tran Thi Lan Anh", zh: "陈氏兰英" },
        "CTO — Giám đốc Kỹ thuật": { en: "CTO — Technical Director", zh: "首席技术官 — 技术总监" },
        "Chuyên gia thiết kế hệ thống PV với 200+ dự án. Thành viên Hiệp hội NLTT Việt Nam (VREA).": {
            en: "PV system design expert with 200+ projects. Member of Vietnam Renewable Energy Association (VREA).",
            zh: "光伏系统结构设计专家，主持设计200多个项目。越南可再生能源协会 (VREA) 会员。"
        },
        "Lê Văn Đức": { en: "Le Van Duc", zh: "黎文德" },
        "COO — Giám đốc Vận hành": { en: "COO — Operations Director", zh: "首席运营官 — 运营总监" },
        "Quản lý danh mục 300+ công trình. Chuyên gia tối ưu chuỗi cung ứng thiết bị solar Tier 1.": {
            en: "Managed a portfolio of 300+ installations. Expert in optimizing Tier 1 solar equipment supply chains.",
            zh: "负责300多个电站项目的运行维护。精通优化 Bloomberg Tier 1 一线光伏供应链。"
        },
        "Phạm Quốc Bảo": { en: "Pham Quoc Bao", zh: "范国宝" },
        "CFO — Giám đốc Tài chính": { en: "CFO — Finance Director", zh: "财务总监" },
        "Cấu trúc tài chính dự án, mô hình BOT, thuê-mua và vốn vay ưu đãi ESCO.": {
            en: "Structured project financing, BOT models, leasing, and preferential ESCO loan capital.",
            zh: "精通电站资产证券化、BOT模式、融资租赁及 ESCO 专项绿色低息贷款结构设计。"
        },
        
        // Timeline & History Milestones
        "Hành Trình 15 Năm": { en: "15-Year Journey", zh: "15年发展历程" },
        "Những Cột Mốc Đáng Nhớ": { en: "Memorable Milestones", zh: "企业里程碑" },
        "Ngày Đầu Tiên": { en: "The First Day", zh: "创立初期" },
        "Thành lập tại Hà Nội với 5 kỹ sư. Dự án đầu tiên: Hệ thống 50kWp cho trường THPT Chu Văn An.": {
            en: "Founded in Hanoi with 5 engineers. First project: 50 kWp system for Chu Van An High School.",
            zh: "在河内市成立，初创成员仅5人。首个落地案例: 河内朱文安高级中学 50kWp 示范电站。"
        },
        "Bước Vào Công Nghiệp": { en: "Entering C&I Market", zh: "开拓工业市场" },
        "Hoàn thành nhà máy 500kWp đầu tiên tại Bình Dương. Mở văn phòng TP.HCM, ký đối tác với JinkoSolar.": {
            en: "Completed first 500 kWp factory system in Binh Duong. Opened HCMC office, partnered with JinkoSolar.",
            zh: "在平阳省顺利建成交付首个 500kWp 厂房屋顶电站。成立胡志明市分公司，与晶科建立战略合作。"
        },
        "Chuẩn Hóa Chất Lượng": { en: "Standardizing Quality", zh: "品质标准化" },
        "Đạt chứng chỉ ISO 9001:2015. Mở rộng đội ngũ lên 60 người. Ra mắt giám sát vận hành từ xa.": {
            en: "Achieved ISO 9001:2015 certification. Expanded team to 60. Launched remote monitoring services.",
            zh: "荣获 ISO 9001:2015 质量管理体系认证。团队扩展至60人。上线首代远程智能运维系统。"
        },
        "Vượt 100 Dự Án": { en: "Surpassing 100 Projects", zh: "突破百大项目" },
        "50 MWp tổng công suất. Ra mắt dịch vụ O&M định kỳ. Mở rộng sang nông nghiệp kết hợp.": {
            en: "50 MWp cumulative capacity. Launched structured O&M services. Expanded to agrivoltaics.",
            zh: "累计总装机容量达 50 MWp。推出定期运营维护(O&M)标准化服务。开拓光伏+农业应用。"
        },
        "Top 3 Toàn Quốc": { en: "Top 3 Nationwide", zh: "全国排名前三" },
        "Vietnam Energy Report xếp Top 3 Tổng thầu EPC Solar. Hoàn thành dự án MWp tại Tây Nguyên.": {
            en: "Ranked Top 3 Solar EPC by Vietnam Energy Report. Completed large-scale project in Central Highlands.",
            zh: "被《越南能源报告》评为全国前三大 EPC 光伏总承包商。在西原地区交付兆瓦级大型地面电站。"
        },
        "Hôm Nay & Tương Lai": { en: "Today & Beyond", zh: "立足当下，展望未来" },
        "300+ dự án. 150 MWp. 150 chuyên gia. Đang mở rộng sang Campuchia và Lào. Mục tiêu 1 GWp năm 2035.": {
            en: "300+ projects. 150 MWp. 150 experts. Expanding to Cambodia and Laos. Target 1 GWp by 2035.",
            zh: "已落成300多个项目，装机 150 MWp，150名行业专家。积极布局老挝与柬埔寨市场。目标在2035年实现 1 GWp 累计容量。"
        },
        
        // Certifications & Partners
        "Đảm Bảo Chất Lượng": { en: "Quality Assurance", zh: "品质保证" },
        "Chứng Nhận Quốc Tế": { en: "International Certifications", zh: "国际权威认证" },
        "Hệ thống quản lý chất lượng toàn diện": { en: "Comprehensive quality management system", zh: "全面的标准化工程质量管理体系" },
        "Bloomberg Tier 1": { en: "Bloomberg Tier 1", zh: "彭博社 Tier 1 评级" },
        "Chỉ sử dụng tấm pin Tier 1 đạt chuẩn tài chính quốc tế": { en: "We only use Tier 1 solar panels meeting international financial standards", zh: "仅采用具备国际金融可融资性的一线 Tier 1 光伏组件" },
        "Bộ Công Thương — Giấy phép EPC": { en: "Ministry of Industry & Trade — EPC License", zh: "越南工贸部 — 电力EPC总承包资质" },
        "Tổng thầu điện được cấp phép hành nghề chính thức": { en: "Officially licensed general contractor for power electrical works", zh: "具备官方正式颁发的电力工程设计与施工资质" },
        "PCCC — Cục Cảnh sát PCCC": { en: "Fire Safety — Fire Department Approval", zh: "消防许可 — 公安部消防局审批" },
        "Hệ thống phòng cháy chữa cháy đạt chuẩn an toàn": { en: "Fire fighting and prevention system meeting strict safety codes", zh: "所建电站均符合严苛的消防安全设计与验收规范" },
        "Green Building Council Vietnam": { en: "Green Building Council Vietnam (VGBC)", zh: "越南绿色建筑委员会 (VGBC)" },
        "Thành viên chính thức VGBC từ năm 2019": { en: "Official member of VGBC since 2019", zh: "自2019年起正式加入VGBC委员会" },
        "Hệ Sinh Thái Đối Tác": { en: "Partner Ecosystem", zh: "全球合作伙伴生态" },
        "Đối Tác Chiến Lược": { en: "Strategic Partners", zh: "战略合作伙伴" },
        "Chỉ hợp tác với những thương hiệu được kiểm chứng bởi thời gian và thị trường toàn cầu.": {
            en: "We only partner with global brands proven by time and international markets.",
            zh: "我们仅与经受过全球市场与时间长期检验的一线品牌深度合作。"
        },
        "Tấm pin N-Type": { en: "N-Type modules", zh: "N型光伏组件" },
        "Tấm pin Hi-MO": { en: "Hi-MO modules", zh: "Hi-MO系列单晶组件" },
        "Inverter & Pin lưu trữ": { en: "Inverters & Storage", zh: "逆变器与储能系统" },
        "Inverter premium": { en: "Premium inverters", zh: "高端分布式逆变器" },
        "Giám sát hệ thống": { en: "System monitoring", zh: "电站智能监控系统" },
        "Kết cấu lắp đặt": { en: "Mounting structures", zh: "高标准铝合金支架结构" },
        
        // About CTA
        "Sẵn Sàng Chuyển Đổi Sang Năng Lượng Sạch?": { en: "Ready to Switch to Clean Energy?", zh: "您准备好转型绿色能源了吗？" },
        "Đội ngũ kỹ sư TEST sẽ khảo sát miễn phí và đưa ra phương án tối ưu trong vòng 48 giờ.": {
            en: "TEST's engineering team will conduct a free survey and deliver optimized proposals within 48 hours.",
            zh: "TEST 工程师团队将为您提供免费上门勘测，并在48小时内出具最优质的定制化设计方案。"
        },
        
        // Contact Page & Footer Detail
        "Thông Tin Liên Hệ": { en: "Contact Information", zh: "联系我们" },
        "Địa Chỉ": { en: "Address", zh: "总部地址" },
        "Tầng 15, Tòa nhà Xanh, 123 Xuân Thủy, Cầu Giấy, Hà Nội": {
            en: "15th Floor, Green Building, 123 Xuan Thuy, Cau Giay, Hanoi",
            zh: "哈内市求纸郡春水路123号绿色大楼15层"
        },
        "Cầu Giấy, Hà Nội": { en: "Cau Giay, Hanoi", zh: "河内市求纸郡" },
        "Tiên phong trong giải pháp năng lượng tái tạo, kiến tạo tương lai xanh bền vững cho Việt Nam.": {
            en: "Pioneering in renewable energy solutions, building a green and sustainable future for Vietnam.",
            zh: "可再生能源解决方案的先驱，为越南创造绿色和可持续的未来。"
        },
        "Chính sách bảo mật": { en: "Privacy Policy", zh: "隐私政策" },
        "Điều khoản sử dụng": { en: "Terms of Use", zh: "使用条款" },
        "2026 TEST. Bảo lưu mọi quyền.": { en: "2026 TEST. All rights reserved.", zh: "2026 TEST. 保留所有权利。" },
        "Gửi thành công! Chúng tôi sẽ liên hệ trong 24h.": { en: "Sent successfully! We will contact you within 24 hours.", zh: "提交成功！我们将在24小时内与您联系。" },
        
        // Dynamic articles titles & meta
        "GreenTech Solar Hoàn Thành Dự Án 2.5 MWp Tại Thái Nguyên": { en: "GreenTech Solar Completes 2.5 MWp Project in Thai Nguyen", zh: "GreenTech Solar 在太原省顺利落成 2.5 MWp 工商业项目" },
        "Giải Mã Hệ Thống Hybrid: Khi Nào Nên Lắp Pin Lưu Trữ?": { en: "Demystifying Hybrid Systems: When to Install Battery Storage?", zh: "全面解析混合动力系统：什么时候应该加装储能电池？" },
        "Chính Sách Điện Mặt Trời Mái Nhà 2025: Những Điểm Mới Doanh Nghiệp Cần Biết": { en: "Rooftop Solar Policy 2025: Key Changes Businesses Must Know", zh: "2025年屋顶光伏政策：企业必须了解的新规要点" },
        "Hiểu về hệ thống điện mặt trời Hybrid On/Off-grid": { en: "Understanding Hybrid On/Off-grid Solar Systems", zh: "深入了解并网/离网混合动力太阳能系统" },
        "Chính sách điện mặt trời mái nhà 2025": { en: "Rooftop Solar Policy 2025", zh: "2025年屋顶太阳能光伏新政" },
        "Tin Công Ty": { en: "Company News", zh: "企业动态" },
        "Kiến Thức": { en: "Knowledge", zh: "科普知识" },
        "Chính Sách": { en: "Policy", zh: "最新政策" },
        "Tất cả bài viết": { en: "All Articles", zh: "所有文章" },
        "Tin công ty": { en: "Company News", zh: "企业动态" },
        "Kiến thức điện mặt trời": { en: "Solar Knowledge", zh: "光伏与储能科普" },
        "Cập nhật chính sách": { en: "Policy Updates", zh: "最新行业政策" },
        "Danh Mục": { en: "Categories", zh: "文章类别" },
        "Bài Viết Nổi Bật": { en: "Featured Articles", zh: "推荐阅读" },
        "Tin Tức & Kiến Thức": { en: "News & Knowledge", zh: "新闻动态与行业科普" },
        "Cập nhật thông tin mới nhất về năng lượng mặt trời và chính sách năng lượng.": {
            en: "Stay updated with the latest solar energy news and clean energy policies.",
            zh: "为您提供关于太阳能光伏和可再生能源政策的最新解读资讯。"
        },
        "Hệ thống điện mặt trời mái nhà lớn nhất tỉnh Thái Nguyên vừa được GreenTech Solar chính thức đưa vào vận hành, cung cấp điện ổn định cho nhà máy sản xuất với công suất 2.5 MWp.": {
            en: "The largest rooftop solar system in Thai Nguyen province has just been officially commissioned by GreenTech Solar, supplying stable power to the manufacturing plant with a capacity of 2.5 MWp.",
            zh: "太原省最大的屋顶光伏发电系统近日由 GreenTech Solar 顺利并网交付，为客户的生产车间稳定供应 2.5 MWp 绿电。"
        },
        "Hệ thống Hybrid kết hợp điện mặt trời với pin lưu trữ đang là xu hướng được nhiều gia đình và doanh nghiệp lựa chọn. Bài viết phân tích chi tiết ưu nhược điểm và điều kiện phù hợp.": {
            en: "Hybrid solar systems combining solar PV with battery storage are a rising trend for homes and businesses. This article analyzes its pros, cons, and suitability.",
            zh: "光伏+储能的并离网混合型系统正成为家庭和工商业主的新宠。本文详细分析其优缺点及适用场景。"
        },
        "Bộ Công Thương vừa ban hành Thông tư mới hướng dẫn thực hiện cơ chế mua bán điện mặt trời mái nhà. Dưới đây là tóm tắt những điểm thay đổi quan trọng nhất.": {
            en: "The Ministry of Industry and Trade has just issued a new Circular guiding rooftop solar transactions. Here is a summary of the most critical changes.",
            zh: "越南工贸部近日正式印发了关于屋顶光伏电力买卖交易机制的新规指南。以下是核心要点总结。"
        },
        "Thỏa thuận hợp tác này sẽ giúp GreenTech Solar tiếp cận nguồn tấm pin N-Type Hi-MO 6 với giá ưu đãi và dịch vụ hậu mãi ưu tiên trong 5 năm tới.": {
            en: "This partnership agreement enables GreenTech Solar to access LONGi's N-Type Hi-MO 6 modules at preferential pricing and priority after-sales service over the next 5 years.",
            zh: "该战略协议将确保 GreenTech Solar 能够以最优惠的协议价格采购隆基 N型 Hi-MO 6 组件，并在未来5年享有专属的售后支持。"
        },
        "GreenTech Solar Ký Kết Hợp Tác Chiến Lược Với Tập Đoàn LONGi": { en: "GreenTech Solar Signs Strategic Partnership with LONGi Group", zh: "GreenTech Solar 与隆基绿能集团签署战略合作协议" },
        "5 Sai Lầm Thường Gặp Khi Lắp Điện Mặt Trời Hộ Gia Đình": { en: "5 Common Mistakes in Residential Solar Installation", zh: "家用光伏安装中常见的 5 个错误误区" },
        "Nhiều gia đình gặp phải tình trạng hệ thống không hoạt động đúng hiệu suất sau khi lắp đặt. Bài viết chỉ ra 5 sai lầm phổ biến và cách tránh chúng.": {
            en: "Many families face underperforming PV systems after installation. This article highlights 5 common mistakes and how to avoid them.",
            zh: "部分住户反映安装后的光伏系统并未达到理想的发电效能。本文列出了 5 大常见错误及规避建议。"
        },
        "Hướng Dẫn Thủ Tục Đấu Nối Điện Mặt Trời Lên Lưới EVN Mới Nhất": { en: "Latest Guide on Connecting Rooftop Solar to EVN Grid", zh: "最新屋顶光伏并网国家电网 (EVN) 申请流程指南" },
        "Quy trình đấu nối điện mặt trời vào lưới EVN đã được đơn giản hóa đáng kể theo Thông tư mới. GreenTech Solar tổng hợp đầy đủ các bước thủ tục cần thiết.": {
            en: "The procedure for connecting solar power to the EVN grid has been simplified significantly under the new Circular. GreenTech Solar summarizes the necessary steps.",
            zh: "根据新规，分布式光伏并入国家电网 (EVN) 的流程已大幅简化。GreenTech Solar 为您汇总了具体申请步骤。"
        },
        
        // Article Bodies Text Elements (Dynamic replacements)
        "Ngày 27/06/2026, hệ thống điện mặt trời mái nhà lớn nhất tỉnh Thái Nguyên với công suất 2.5 MWp do GreenTech Solar là tổng thầu EPC đã chính thức được bàn giao và đưa vào vận hành thương mại.": {
            en: "On June 27, 2026, the largest rooftop solar system in Thai Nguyen province with a capacity of 2.5 MWp, engineered and constructed by GreenTech Solar, was officially handed over and put into commercial operation.",
            zh: "2026年6月27日，太原省最大的工商业屋顶太阳能光伏系统（容量为 2.5 MWp，由 GreenTech Solar 作为 EPC 总承包商承建）顺利完成移交并投入商业运营。"
        },
        "Dự án tiêu biểu tại miền Bắc": { en: "Featured Project in Northern Vietnam", zh: "北部示范项目" },
        "Nhà máy sản xuất Samsung SDI tại KCN Yên Bình lựa chọn GreenTech Solar sau quá trình đánh giá năng lực nghiêm ngặt. Dự án hoàn thành trong 45 ngày thi công, vượt tiến độ 10 ngày.": {
            en: "The Samsung SDI manufacturing plant at Yen Binh Industrial Park selected GreenTech Solar after a rigorous assessment. The project was completed in 45 construction days, 10 days ahead of schedule.",
            zh: "位于延平工业区的三星 SDI 生产厂在经过严格的实力评估与筛选后，选择 GreenTech Solar 作为 EPC。整个项目仅用 45 天即完工，提前 10 天交付。"
        },
        "Thông số kỹ thuật chính": { en: "Key Specifications", zh: "核心技术参数" },
        "Công suất lắp đặt: 2,548 kWp": { en: "Installed Capacity: 2,548 kWp", zh: "装机容量: 2,548 kWp" },
        "Sản lượng dự kiến hàng năm: 3,200,000 kWh": { en: "Expected Annual Yield: 3,200,000 kWh", zh: "年发电量预测: 3,200,000 kWh" },
        "Tấm pin: JinkoSolar N-Type Tiger Neo 580W (4,393 tấm)": { en: "Solar Panels: JinkoSolar N-Type Tiger Neo 580W (4,393 modules)", zh: "光伏组件: 晶科能源 N型 Tiger Neo 580W (4,393 块)" },
        "Inverter: Sungrow SG125HX (21 bộ)": { en: "Inverters: Sungrow SG125HX (21 units)", zh: "逆变器: 阳光电源 (Sungrow) SG125HX (21 台)" },
        "CO₂ giảm thiểu: ~1,600 tấn/năm": { en: "CO₂ Reduced: ~1,600 tons/year", zh: "CO₂ 减排量: 约 1,600 吨/年" },
        "\"GreenTech Solar đã chứng minh năng lực thi công chuyên nghiệp, đúng hẹn và chất lượng vượt mong đợi.\" — Giám đốc KT Samsung SDI Việt Nam": {
            en: '\"GreenTech Solar has proven its professional execution capability, on-time delivery, and quality exceeding expectations.\" — Technical Director, Samsung SDI Vietnam',
            zh: '\"GreenTech Solar 证明了其专业高效的施工能力、准时的交付和超乎预期的工程质量。\" — 三星SDI越南技术总监'
        },
        "Tiết kiệm chi phí ấn tượng": { en: "Impressive Financial Savings", zh: "卓越的财务与用能回报" },
        "Hệ thống giúp nhà máy tiết kiệm khoảng 6.4 tỷ đồng/năm, hoàn vốn trong vòng 4.2 năm.": {
            en: "The system helps the factory save approximately 6.4 billion VND/year, with a payback period of 4.2 years.",
            zh: "该系统每年帮助工厂节省约 64 亿越盾，投资回收期仅为 4.2 年。"
        },
        
        "Hệ thống điện mặt trời Hybrid đang ngày càng phổ biến. Nhưng không phải trường hợp nào cũng cần lắp thêm pin.": {
            en: "Hybrid solar systems are becoming increasingly popular. However, adding battery storage is not always necessary for every setup.",
            zh: "分布式光伏+储能混合系统在近两年大受欢迎。但并不是在所有情况下都有必要配备蓄电池。"
        },
        "3 loại hệ thống chính": { en: "3 Main Solar System Types", zh: "3 大主要光伏系统模式" },
        "On-grid: Bán điện dư cho EVN. Chi phí thấp, phù hợp điện lưới ổn định.": {
            en: "On-grid: Feed excess electricity back to EVN. Lowest cost, ideal for regions with stable grid.",
            zh: "并网 (On-grid): 余电可发给国家电网。造价低，适合电网电压稳定的地区。"
        },
        "Off-grid: Độc lập hoàn toàn. Chi phí cao, phù hợp vùng sâu xa.": {
            en: "Off-grid: Completely independent. Higher cost, ideal for remote or rural regions.",
            zh: "离网 (Off-grid): 完全独立运行。储能容量要求大、成本高，适合电网不通的偏远地区。"
        },
        "Hybrid: Kết hợp cả hai. Ưu tiên tự dùng, lưu trữ phần dư.": {
            en: "Hybrid: Combining both. Prioritizes self-consumption, storing excess power for night use.",
            zh: "并离网混合 (Hybrid): 兼具两者优势。优先自发自用，余电充入蓄电池以备夜间或断电时使用。"
        },
        "Nên lắp Hybrid khi nào?": { en: "When Should You Invest in a Hybrid System?", zh: "何时建议选择混合储能系统？" },
        "Khu vực thường xuyên mất điện ảnh hưởng sản xuất/kinh doanh": { en: "Regions with frequent power outages that disrupt business operations", zh: "电网电压不稳或经常停电、影响生产与营业的地区" },
        "Giá điện ban đêm cao hơn ban ngày (TOU tariff)": { en: "High Peak-Valley electricity tariff differences (TOU tariff)", zh: "峰谷电价差大（如工商业峰谷电价机制）" },
        "Muốn chủ động năng lượng, không phụ thuộc EVN": { en: "Desire for complete energy independence from the state grid (EVN)", zh: "期望实现能源独立、不想受制于国家电网 (EVN) 调控" },
        "Có thiết bị nhạy cảm cần nguồn điện ổn định liên tục": { en: "Having critical or sensitive appliances that require uninterrupted power supply", zh: "拥有昂贵或高度敏感的仪器设备、必须保证 24/7 不断电" },
        "Chi phí pin lưu trữ đã giảm hơn 70% trong 10 năm qua. Đây là thời điểm tốt để đầu tư Hybrid.": {
            en: "The cost of solar battery storage has decreased by over 70% in the last 10 years. This is the optimal time to invest in Hybrid.",
            zh: "蓄电池组的价格在过去10年中下降了 70% 以上。目前是投资混合储能系统的绝佳时机。"
        },
        "ROI của hệ thống Hybrid": { en: "ROI of Hybrid Systems", zh: "混合储能系统的投资回报率" },
        "Chi phí lắp thêm pin cho hệ thống 10kWp dao động 80–150 triệu đồng. Thời gian hoàn vốn phần pin khoảng 7–10 năm.": {
            en: "The cost to add batteries for a 10 kWp system ranges from 80 to 150 million VND. The payback period for the battery portion is about 7 to 10 years.",
            zh: "为一个 10kWp 系统配置储能电池的造价大约在 8,000 万至 1.5 亿越盾之间。电池部分的投资回收期通常需要 7-10 年左右。"
        },
        
        "Bộ Công Thương vừa ban hành Thông tư mới hướng dẫn cơ chế mua bán điện mặt trời mái nhà. Những điểm quan trọng nhất doanh nghiệp cần biết:": {
            en: "The Ministry of Industry and Trade has just issued a new Circular guiding rooftop solar transactions. Here are the most critical changes that enterprises must understand:",
            zh: "越南工贸部近日发布了最新通知，细化并指导分布式屋顶光伏买卖电的流转机制。以下是企业必须关注的几大改变:"
        },
        "1. Net-metering được duy trì": { en: "1. Net-Metering Remains Active", zh: "1. 净电量结算 (Net-Metering) 机制继续生效" },
        "Điện dư phát lên lưới được bù trừ vào hóa đơn tháng tiếp theo. Giá mua điện dư thấp hơn giá bán của EVN 15–25%.": {
            en: "Excess electricity sent back to the grid will be offset against the next month's bill. The EVN buy-back price is 15-25% lower than the selling price.",
            zh: "发往电网的余电可用于冲抵下月的用电账单。回购电价比 EVN 正常售电价格低 15-25%。"
        },
        "2. Bỏ giới hạn công suất 1MW (mới)": { en: "2. Removal of 1MW Capacity Limit (New)", zh: "2. 取消 1MW 的装机容量上限 (新)" },
        "Thông tư mới bỏ giới hạn công suất 1MW cho hệ thống tự dùng. Doanh nghiệp lắp công suất tùy theo nhu cầu tiêu thụ thực tế.": {
            en: "The new Circular removes the 1MW capacity limit for self-consumption. Enterprises can install capacity based on their actual consumption profile.",
            zh: "新通告取消了自发自用屋顶光伏电站 1MW 的装机容量限制。企业可以根据自身用电的实际负荷曲线来灵活规划装机容量。"
        },
        "3. Thủ tục đơn giản hóa": { en: "3. Simplified Administrative Procedures", zh: "3. 报批流程极大简化" },
        "Dưới 100kWp: Thông báo đơn giản, không cần xin phép": { en: "Under 100kWp: Simple notification, no permits required", zh: "100kWp 以下: 只需书面通知备案，无需申请并网许可" },
        "100kWp – 1MWp: Đăng ký với Công ty Điện lực địa phương": { en: "100kWp – 1MWp: Register with local Power Company (PC)", zh: "100kWp – 1MWp: 需向当地电力公司 (PC) 办理注册登记" },
        "Trên 1MWp: Cần phê duyệt của EVN khu vực": { en: "Above 1MWp: Requires regional EVN approval", zh: "1MWp 以上: 需经区域电力公司 (EVN) 组织并网论证与审批" },
        "GreenTech Solar hỗ trợ toàn bộ thủ tục đấu nối EVN miễn phí cho tất cả dự án chúng tôi thi công.": {
            en: "GreenTech Solar handles all EVN grid connection procedures completely free of charge for all projects we construct.",
            zh: "GreenTech Solar 为所有由我们承包建设的项目提供免费的并网手续全过程代办服务。"
        },
        "Cơ hội lớn cho doanh nghiệp": { en: "A Major Window of Opportunity for Businesses", zh: "广大工商业主面临的黄金机遇" },
        "Đây là thời điểm lý tưởng để đầu tư, vừa giảm chi phí điện vừa đáp ứng tiêu chuẩn ESG ngày càng khắt khe từ chuỗi cung ứng quốc tế.": {
            en: "This is the ideal time to invest, simultaneously cutting electricity costs and meeting the increasingly strict ESG compliance from global supply chains.",
            zh: "这是投资分布式屋顶光伏的最佳时期，既能显著消减厂房运营成本，又能使企业快速满足跨国供应链中日益严苛的 ESG/绿色工厂准入标杆。"
        },
        
        // Investment Calculator
        "BỘ TÍNH TOÁN": { en: "ROI CALCULATOR", zh: "投资回报计算器" },
        "Ước Tính Hiệu Quả Đầu Tư & Tiết Kiệm": { en: "Investment & Savings Calculator", zh: "投资与效益估算" },
        "Nhập thông tin dự án để thấy rõ sự chênh lệch lợi ích tài chính trước và sau khi có môi giới/quỹ xanh.": { 
            en: "Enter project details to see the difference in financial benefits before and after green brokerage.", 
            zh: "输入项目配置，直观查看绿色金融经纪介入前后的财务效益差异。" 
        },
        "Cấu Hình Dự Án": { en: "Project Config", zh: "项目配置" },
        "Công suất lắp đặt:": { en: "Installed Capacity:", zh: "装机容量:" },
        "Tiền điện TB hàng tháng:": { en: "Avg Monthly Electric Bill:", zh: "平均月度电费:" },
        "Mô hình đầu tư mong muốn:": { en: "Desired Investment Model:", zh: "期望投资模式:" },
        "Tự Đầu Tư (Vay tín dụng xanh ưu đãi)": { en: "Self-Invest (Green loan)", zh: "自主投资 (绿色优惠贷款)" },
        "Hợp tác ESCO / PPA (Vốn đầu tư 0đ)": { en: "ESCO / PPA (0 VND Capital)", zh: "ESCO / PPA 合作 (0元初始投入)" },
        "So Sánh Hiệu Quả": { en: "Benefits Comparison", zh: "效益对比" },
        "TRƯỚC MÔI GIỚI": { en: "BEFORE BROKER", zh: "经纪介入前" },
        "(Tự liên hệ / Tự đầu tư)": { en: "(Self-directed)", zh: "(自行投资 / 自筹资金)" },
        "SAU MÔI GIỚI": { en: "AFTER BROKER", zh: "经纪介入后" },
        "(Qua GreenTech Broker)": { en: "(Via GreenTech Broker)", zh: "(通过绿色经纪)" },
        "Vốn tự có ban đầu": { en: "Equity Required", zh: "自筹初始资金" },
        "Lãi suất vay vốn": { en: "Loan Interest Rate", zh: "贷款年利率" },
        "Thời gian hoàn vốn": { en: "Payback Period", zh: "投资回收期" },
        "Lãi lũy kế 20 năm": { en: "20-Year Cum. Savings", zh: "20年累计净收益" },
        "Dòng tiền tích lũy chênh lệch theo thời gian (Tr VNĐ)": { 
            en: "Cumulative Savings Over Time (Million VND)", 
            zh: "不同时期的累计收益对比 (百万越盾)" 
        },
        
        // Form Placeholders & Labels
        "Họ và Tên *": { en: "Full Name *", zh: "姓名 *" },
        "Số Điện Thoại *": { en: "Phone Number *", zh: "电话号码 *" },
        "Loại Công Trình *": { en: "Building Type *", zh: "建筑类型 *" },
        "Nội Dung": { en: "Message / Notes", zh: "需求描述" },
        "-- Chọn loại công trình --": { en: "-- Select Building Type --", zh: "-- 请选择建筑类型 --" },
        "Nhà máy / Công nghiệp": { en: "Factory / Industrial", zh: "工厂 / 工业厂房" },
        "Hộ gia đình": { en: "Household / Residential", zh: "住宅 / 户用" },
        "Nông nghiệp / Trang trại": { en: "Agriculture / Farm", zh: "农业 / 农场" },
        "Khác": { en: "Other", zh: "其它" },
        "Mô tả nhu cầu, diện tích mái, vị trí lắp đặt...": { 
            en: "Describe your needs, roof area, location...", 
            zh: "请描述您的需求、屋顶面积、安装位置..." 
        },
        "Sản phẩm quan tâm": { en: "Product of Interest", zh: "感兴趣的产品" },
        "Nhu Cầu / Ghi Chú": { en: "Your Notes / Inquiries", zh: "其它备注/要求" },
        "Công suất cần lắp, vị trí, câu hỏi...": { 
            en: "Capacity needed, location, questions...", 
            zh: "所需装机容量、位置、咨询 vấn..." 
        },
        "Điền thông tin — chuyên gia sẽ gọi lại trong 30 phút": { 
            en: "Fill in the form — our expert will call you within 30 minutes", 
            zh: "填写表单 — 我们的专家将在30分钟内给您回电" 
        },
        
        // Dynamic Product details
        "Ưu Điểm Nổi Bật": { en: "Key Highlights", zh: "产品核心优势" },
        "Mã sản phẩm:": { en: "Product Code:", zh: "产品编码:" },
        "Hàng chính hãng 100%": { en: "100% Genuine Product", zh: "100% 正品保障" },
        "Giao hàng toàn quốc": { en: "Nationwide Delivery", zh: "全国配送" },
        "Hỗ trợ kỹ thuật 24/7": { en: "24/7 Technical Support", zh: "24/7 技术支持" },
        "Mã SP:": { en: "SKU:", zh: "型号:" },
        "Dung lượng": { en: "Capacity", zh: "容量" },
        "Điện áp danh định": { en: "Nominal Voltage", zh: "额定电压" },
        "Chiều sâu xả (DoD)": { en: "Depth of Discharge (DoD)", zh: "放电深度 (DoD)" },
        "Tuổi thọ chu kỳ": { en: "Cycle Life", zh: "循环寿命" },
        "Hiệu suất vòng": { en: "Round-trip Efficiency", zh: "往返效率" },
        "Chuẩn bảo vệ": { en: "Protection Class", zh: "防护等级" },
        "Nhiệt độ hoạt động": { en: "Operating Temp", zh: "工作温度" },
        "Bảo hành": { en: "Warranty", zh: "质保" },
        "Vật liệu": { en: "Material", zh: "材料" },
        "Chiều dài": { en: "Length", zh: "长度" },
        "Kích thước mặt cắt": { en: "Cross Section Size", zh: "截面尺寸" },
        "Tải trọng tối đa": { en: "Max Load", zh: "最大负载" },
        "Màu sắc": { en: "Color", zh: "颜色" },
        "Tiêu chuẩn": { en: "Standards", zh: "认证标准" },
        "Bảo hành hiệu suất": { en: "Performance Warranty", zh: "线性功率保修" },
        "Bảo hành sản phẩm": { en: "Product Warranty", zh: "产品保修" },
        "Công suất định mức": { en: "Rated Power", zh: "额定功率" },
        "Hiệu suất": { en: "Module Efficiency", zh: "组件效率" },
        "Điện áp hở mạch (Voc)": { en: "Open Circuit Voltage (Voc)", zh: "开路电压 (Voc)" },
        "Dòng ngắn mạch (Isc)": { en: "Short Circuit Current (Isc)", zh: "短路电流 (Isc)" },
        "Kích thước": { en: "Dimensions", zh: "尺寸" },
        "Trọng lượng": { en: "Weight", zh: "重量" }
    };

    function translateDOM(element, lang) {
        if (!element) return;
        if (element.nodeType === 3) { // TEXT_NODE
            const text = element.textContent.trim();
            if (!text) return;
            
            if (element._originalText === undefined) {
                element._originalText = element.textContent;
            }
            
            const cleanKey = element._originalText.trim().replace(/\s+/g, ' ');
            if (DICTIONARY[cleanKey] && DICTIONARY[cleanKey][lang]) {
                const leading = element._originalText.match(/^\s*/)[0];
                const trailing = element._originalText.match(/\s*$/)[0];
                element.textContent = leading + DICTIONARY[cleanKey][lang] + trailing;
            } else if (lang === 'vi') {
                element.textContent = element._originalText;
            }
        } else {
            // Translate placeholders
            if (element.placeholder) {
                if (element._originalPlaceholder === undefined) {
                    element._originalPlaceholder = element.placeholder;
                }
                const cleanKey = element._originalPlaceholder.trim().replace(/\s+/g, ' ');
                if (DICTIONARY[cleanKey] && DICTIONARY[cleanKey][lang]) {
                    element.placeholder = DICTIONARY[cleanKey][lang];
                } else if (lang === 'vi') {
                    element.placeholder = element._originalPlaceholder;
                }
            }
            // Recurse children
            if (element.tagName !== 'SCRIPT' && element.tagName !== 'STYLE') {
                element.childNodes.forEach(child => translateDOM(child, lang));
            }
        }
    }

    window.changeLanguage = function (lang) {
        window.currentLang = lang;
        localStorage.setItem('preferredLang', lang);
        
        // Update active class on buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Translate entire body
        translateDOM(document.body, lang);
        
        // Re-run calculateROI to update calculator text
        if (typeof calculateROI === 'function') {
            calculateROI();
        }
    };

    // Load preferred lang and auto-calculate on initial load
    setTimeout(() => { 
        calculateROI(); 
        const savedLang = localStorage.getItem('preferredLang') || 'vi';
        if (savedLang !== 'vi') {
            changeLanguage(savedLang);
        }
    }, 500);

})();
