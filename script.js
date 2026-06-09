document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. MOBILE MENU TOGGLE
       ========================================== */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = navMenu.querySelectorAll('a');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }

    /* ==========================================
       2. SMOOTH SCROLL FOR ANCHOR LINKS
       ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefVal = this.getAttribute('href');
            if (hrefVal === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(hrefVal);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ==========================================
       3. TESTIMONIALS SLIDER WITH TRACK TRANSLATION (TRƯỢT MƯỢT MÀ)
       ========================================== */
    const slider = document.getElementById('testimonialSlider');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevSlideBtn');
    const nextBtn = document.getElementById('nextSlideBtn');
    
    let slides = document.querySelectorAll('.testimonial-slide');
    let dots = document.querySelectorAll('.slider-dots .dot');
    let currentSlide = 0;
    let slideInterval;

    function refreshSlidesArray() {
        slides = document.querySelectorAll('.testimonial-slide');
        dots = document.querySelectorAll('.slider-dots .dot');
    }

    function showSlide(index) {
        refreshSlidesArray();
        if (slides.length === 0) return;
        
        // Vòng lặp chỉ số slide
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        
        // Gỡ bỏ active cũ và thêm active mới
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        
        // Dịch chuyển track slider theo phương ngang cực mượt
        slider.style.transform = `translateX(-${index * 100}%)`;
        currentSlide = index;
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startSlideTimer() {
        stopSlideTimer();
        slideInterval = setInterval(nextSlide, 6000); // Tự động trượt sau 6 giây
    }

    function stopSlideTimer() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    if (slider) {
        // Khởi động trượt ngay slide 1 ban đầu
        showSlide(0);
        
        // Sử dụng Event Delegation cho các nút tròn (dots) - gán 1 lần duy nhất lên container cha
        if (dotsContainer) {
            dotsContainer.addEventListener('click', (e) => {
                const dot = e.target.closest('.dot');
                if (dot) {
                    const idx = parseInt(dot.getAttribute('data-index') || 0);
                    showSlide(idx);
                    startSlideTimer();
                }
            });
        }
        
        startSlideTimer();

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startSlideTimer();
            });
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startSlideTimer();
            });
        }

        const sliderContainer = document.querySelector('.testimonials-slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopSlideTimer);
            sliderContainer.addEventListener('mouseleave', startSlideTimer);
        }
    }

    /* ==========================================
       4. FAQ ACCORDION
       ========================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            faqItems.forEach(innerItem => {
                innerItem.classList.remove('active');
                innerItem.querySelector('.faq-answer').style.maxHeight = null;
                innerItem.querySelector('.faq-icon i').className = 'fa-solid fa-plus';
            });
            
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                item.querySelector('.faq-icon i').className = 'fa-solid fa-minus';
            }
        });
    });

    /* ==========================================
       5. GALLERY FILTERING
       ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
                } else if (item.classList.contains(`filter-${filterValue}`)) {
                    item.style.display = 'block';
                    setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => { item.style.display = 'none'; }, 300);
                }
            });
        });
    });

    /* ==========================================
       6. LIGHTBOX POPUP FOR GALLERY
       ========================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    let activeImages = [];
    let currentImageIndex = 0;

    function updateActiveImages() {
        activeImages = [];
        galleryItems.forEach(item => {
            if (item.style.display !== 'none') {
                const img = item.querySelector('img');
                activeImages.push({
                    src: img.getAttribute('src'),
                    alt: img.getAttribute('alt'),
                    title: item.querySelector('.gallery-img-title') ? item.querySelector('.gallery-img-title').innerText : ''
                });
            }
        });
    }

    const galleryInnerElements = document.querySelectorAll('.gallery-item-inner');
    galleryInnerElements.forEach((element) => {
        element.addEventListener('click', function() {
            updateActiveImages();
            
            const targetImg = this.querySelector('img');
            const targetSrc = targetImg.getAttribute('src');
            
            currentImageIndex = activeImages.findIndex(img => img.src === targetSrc);
            
            if (currentImageIndex !== -1) {
                showLightboxImage(currentImageIndex);
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function showLightboxImage(index) {
        if (index >= 0 && index < activeImages.length) {
            const imgData = activeImages[index];
            lightboxImg.setAttribute('src', imgData.src);
            lightboxImg.setAttribute('alt', imgData.alt);
            lightboxCaption.innerText = imgData.title || imgData.alt;
            currentImageIndex = index;
        }
    }

    if (lightboxClose && lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) {
                closeLightbox();
            }
        });
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    if (lightboxPrev && lightboxNext) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            let prevIndex = currentImageIndex - 1;
            if (prevIndex < 0) prevIndex = activeImages.length - 1;
            showLightboxImage(prevIndex);
        });

        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            let nextIndex = (currentImageIndex + 1) % activeImages.length;
            showLightboxImage(nextIndex);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') lightboxNext.click();
            if (e.key === 'ArrowLeft') lightboxPrev.click();
        }
    });

    /* ==========================================
       7. ACTIVE REVIEW MODAL & STAR SELECTION
       ========================================== */
    const reviewModal = document.getElementById('reviewModal');
    const openReviewBtn = document.getElementById('openReviewModalBtn');
    const closeReviewBtn = document.getElementById('closeReviewModal');
    const reviewForm = document.getElementById('reviewForm');
    const starSelect = document.getElementById('starSelect');
    
    let selectedRating = 5;

    if (openReviewBtn && reviewModal && closeReviewBtn) {
        openReviewBtn.addEventListener('click', () => {
            reviewModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeReviewBtn.addEventListener('click', () => {
            reviewModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        reviewModal.addEventListener('click', (e) => {
            if (e.target === reviewModal) {
                reviewModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    if (starSelect) {
        const stars = starSelect.querySelectorAll('.star-item');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                const val = parseInt(star.getAttribute('data-value'));
                selectedRating = val;
                
                stars.forEach(s => {
                    const sVal = parseInt(s.getAttribute('data-value'));
                    if (sVal <= val) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const revName = document.getElementById('reviewName').value.trim();
            const revAddr = document.getElementById('reviewAddress').value.trim() || 'Hải Phòng';
            const revContent = document.getElementById('reviewContent').value.trim();
            
            if (!revName || !revContent) return;

            let starsHTML = '';
            for (let i = 0; i < 5; i++) {
                if (i < selectedRating) {
                    starsHTML += '<i class="fa-solid fa-star"></i>';
                } else {
                    starsHTML += '<i class="fa-regular fa-star" style="color: rgba(255,255,255,0.2);"></i>';
                }
            }

            const newSlideIndex = document.querySelectorAll('.testimonial-slide').length;
            const newSlide = document.createElement('div');
            newSlide.className = 'testimonial-slide';
            newSlide.setAttribute('data-slide-id', newSlideIndex);
            newSlide.innerHTML = `
                <div class="testimonial-box">
                    <div class="quote-icon"><i class="fa-solid fa-quote-left"></i></div>
                    <div class="star-rating">${starsHTML}</div>
                    <p class="testimonial-text">"${revContent}"</p>
                    <div class="testimonial-author">
                        <div class="author-info">
                            <h4>${revName}</h4>
                            <p>${revAddr}</p>
                        </div>
                    </div>
                </div>
            `;

            slider.appendChild(newSlide);

            const newDot = document.createElement('span');
            newDot.className = 'dot';
            newDot.setAttribute('data-index', newSlideIndex);
            dotsContainer.appendChild(newDot);

            // Tự động nhận diện sự kiện click nhờ Event Delegation ở dotsContainer

            reviewModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            reviewForm.reset();
            
            const stars = starSelect.querySelectorAll('.star-item');
            stars.forEach(s => s.classList.add('active'));
            selectedRating = 5;

            setTimeout(() => {
                showSlide(newSlideIndex);
                startSlideTimer();
                document.getElementById('testimonials').scrollIntoView({ behavior: 'smooth' });
            }, 300);
        });
    }

    /* ==========================================
       8. CONSULTATION FORM WITH COPY CLIPBOARD & AUTO OPEN ZALO
       ========================================== */
    const consultForm = document.getElementById('consultForm');
    const nameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phoneNumber');
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const successAlert = document.getElementById('formSuccessAlert');
    const btnSubmit = document.getElementById('btn-submit-form');

    const phoneRegexp = /^(03|05|07|08|09)\d{8}$/;

    if (consultForm) {
        consultForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            const fullNameVal = nameInput.value.trim();
            if (fullNameVal.length === 0) {
                nameInput.parentElement.classList.add('has-error');
                nameError.innerText = 'Vui lòng nhập họ tên của bạn';
                isValid = false;
            } else if (fullNameVal.length < 2) {
                nameInput.parentElement.classList.add('has-error');
                nameError.innerText = 'Họ tên phải từ 2 ký tự trở lên';
                isValid = false;
            } else {
                nameInput.parentElement.classList.remove('has-error');
            }

            const phoneVal = phoneInput.value.trim().replace(/[\.\s-]/g, '');
            if (phoneVal.length === 0) {
                phoneInput.parentElement.classList.add('has-error');
                phoneError.innerText = 'Vui lòng nhập số điện thoại';
                isValid = false;
            } else if (!phoneRegexp.test(phoneVal)) {
                phoneInput.parentElement.classList.add('has-error');
                phoneError.innerText = 'Số điện thoại không hợp lệ (Ví dụ: 0904415899)';
                isValid = false;
            } else {
                phoneInput.parentElement.classList.remove('has-error');
            }

            if (isValid) {
                btnSubmit.disabled = true;
                const originalBtnText = btnSubmit.innerHTML;
                btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ĐANG GOM TIN...';

                const addressVal = document.getElementById('address').value.trim() || 'Không cung cấp';
                const reqVal = document.getElementById('requirement').value.trim() || 'Yêu cầu tư vấn tang lễ trọn gói';
                
                const formattedMessage = 
`--- ĐĂNG KÝ TƯ VẤN TANG LỄ BẢO LONG ---
• Khách hàng: ${fullNameVal}
• Số điện thoại: ${phoneVal}
• Địa chỉ: ${addressVal}
• Yêu cầu: ${reqVal}
• Thời gian: ${new Date().toLocaleString('vi-VN')}
--------------------------------------`;

                navigator.clipboard.writeText(formattedMessage).then(() => {
                    successAlert.style.display = 'flex';
                    consultForm.reset();
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = originalBtnText;

                    setTimeout(() => {
                        window.open('https://zalo.me/0904415899', '_blank');
                    }, 2500);

                    setTimeout(() => {
                        successAlert.style.display = 'none';
                    }, 8000);

                }).catch(err => {
                    successAlert.querySelector('p').innerText = 'Hệ thống đang mở Zalo chat của Bảo Long để hỗ trợ bạn tư vấn trực tiếp...';
                    successAlert.style.display = 'flex';
                    consultForm.reset();
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = originalBtnText;

                    setTimeout(() => {
                        window.open('https://zalo.me/0904415899', '_blank');
                    }, 2000);
                });
            }
        });

        nameInput.addEventListener('input', () => {
            if (nameInput.value.trim().length > 0) {
                nameInput.parentElement.classList.remove('has-error');
            }
        });

        phoneInput.addEventListener('input', () => {
            const cleanPhone = phoneInput.value.trim().replace(/[\.\s-]/g, '');
            if (phoneRegexp.test(cleanPhone)) {
                phoneInput.parentElement.classList.remove('has-error');
            }
        });
    }

    /* ==========================================
       9. INTERSECTION OBSERVER FOR ANIMATE ON SCROLL (HIỆU ỨNG ĐỘNG CUỘN TRANG)
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right');
    
    // Gán class hiệu ứng ban đầu cho các thành phần chính
    // Hero Elements
    document.querySelectorAll('.hero-badge, .hero-title, .hero-slogan, .hero-desc, .hero-hotline-show, .hero-ctas').forEach((el, idx) => {
        el.classList.add('reveal-on-scroll');
        el.classList.add(`delay-${(idx + 1) * 100}`);
    });
    
    // Giới thiệu
    const aboutImgWrapper = document.querySelector('.about-image-wrapper');
    if (aboutImgWrapper) aboutImgWrapper.classList.add('reveal-left');
    const aboutTextSide = document.querySelector('.about-text-side');
    if (aboutTextSide) aboutTextSide.classList.add('reveal-right');

    // Thẻ Dịch vụ
    document.querySelectorAll('.service-card').forEach((card, idx) => {
        card.classList.add('reveal-on-scroll');
        card.classList.add(`delay-${(idx + 1) * 100}`);
    });

    // Các bước Quy trình
    document.querySelectorAll('.timeline-step').forEach((step, idx) => {
        step.classList.add('reveal-on-scroll');
        step.classList.add(`delay-${(idx + 1) * 100}`);
    });

    // Cam kết
    document.querySelectorAll('.commitment-card').forEach((card, idx) => {
        card.classList.add('reveal-on-scroll');
        card.classList.add(`delay-${((idx % 3) + 1) * 100}`);
    });

    // Thư viện ảnh
    document.querySelectorAll('.gallery-item').forEach((item, idx) => {
        item.classList.add('reveal-on-scroll');
        item.classList.add(`delay-${((idx % 4) + 1) * 100}`);
    });

    // Cấu hình observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Chỉ chạy một lần
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });

    // Bắt đầu theo dõi tất cả các phần tử hiệu ứng
    document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right').forEach(elem => {
        revealObserver.observe(elem);
    });

    /* ==========================================
       10. BACK TO TOP FUNCTIONALITY
       ========================================== */
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
