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
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
    });

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

})();
