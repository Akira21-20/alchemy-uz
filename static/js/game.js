// ============================================
// ALKIMIYA UZ - ASOSIY O'YIN LOGIKASI
// ============================================

class AlchemyGame {
    constructor() {
        this.elements = [];
        this.combinations = [];
        this.discovered = new Set();
        this.sessionId = this.getSessionId();
        this.slot1 = null;
        this.slot2 = null;
        this.workspaceElements = [];
        
        this.init();
    }

    getSessionId() {
        let sid = localStorage.getItem('alchemy_session_id');
        if (!sid) {
            sid = 'session_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('alchemy_session_id', sid);
        }
        return sid;
    }

    async init() {
        await this.loadElements();
        await this.loadCombinations();
        await this.loadProgress();
        this.renderElements();
        this.setupEventListeners();
        this.updateStats();
        this.setupSoundToggle();
    }

    async loadElements() {
        try {
            const response = await fetch('/api/elements');
            this.elements = await response.json();
        } catch (error) {
            console.error('Elementlarni yuklashda xatolik:', error);
        }
    }

    async loadCombinations() {
        try {
            const response = await fetch('/api/combinations');
            this.combinations = await response.json();
        } catch (error) {
            console.error('Kombinatsiyalarni yuklashda xatolik:', error);
        }
    }

    async loadProgress() {
        try {
            const response = await fetch(`/api/progress?session_id=${this.sessionId}`);
            const data = await response.json();
            this.discovered = new Set(data.discovered || []);
        } catch (error) {
            console.error('Progressni yuklashda xatolik:', error);
        }
    }

    async saveProgress(elementId) {
        try {
            await fetch('/api/progress/discover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: this.sessionId,
                    element_id: elementId
                })
            });
        } catch (error) {
            console.error('Progressni saqlashda xatolik:', error);
        }
    }

    renderElements(filter = 'all', search = '') {
        const grid = document.getElementById('elements-grid');
        if (!grid) return;

        let filtered = this.elements.filter(el => this.discovered.has(el.id));

        if (filter !== 'all') {
            filtered = filtered.filter(el => el.category === filter);
        }

        if (search) {
            const s = search.toLowerCase();
            filtered = filtered.filter(el => 
                el.name_uz.toLowerCase().includes(s) ||
                el.name_en.toLowerCase().includes(s)
            );
        }

        grid.innerHTML = filtered.map(el => `
            <div class="element-card ${el.is_base ? 'is-base' : ''}" 
                 data-id="${el.id}" 
                 draggable="true">
                <div class="element-emoji">${el.emoji}</div>
                <div class="element-name">${el.name_uz}</div>
            </div>
        `).join('');

        this.setupDragListeners();
    }

    setupEventListeners() {
        // Qidirish
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const activeFilter = document.querySelector('.filter-btn.active');
                const category = activeFilter ? activeFilter.dataset.category : 'all';
                this.renderElements(category, e.target.value);
            });
        }

        // Kategoriya filtrlari
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const search = document.getElementById('search-input')?.value || '';
                this.renderElements(btn.dataset.category, search);
            });
        });

        // Slotlarga tashlash
        const slot1 = document.getElementById('slot1');
        const slot2 = document.getElementById('slot2');
        
        if (slot1) {
            slot1.addEventListener('dragover', (e) => this.handleDragOver(e, slot1));
            slot1.addEventListener('dragleave', (e) => this.handleDragLeave(e, slot1));
            slot1.addEventListener('drop', (e) => this.handleDrop(e, 1));
            slot1.addEventListener('click', () => this.clearSlot(1));
        }

        if (slot2) {
            slot2.addEventListener('dragover', (e) => this.handleDragOver(e, slot2));
            slot2.addEventListener('dragleave', (e) => this.handleDragLeave(e, slot2));
            slot2.addEventListener('drop', (e) => this.handleDrop(e, 2));
            slot2.addEventListener('click', () => this.clearSlot(2));
        }

        // Birlashtirish tugmasi (space bilan)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.slot1 && this.slot2) {
                e.preventDefault();
                this.combine();
            }
        });

        // Maslahat tugmasi
        const hintBtn = document.getElementById('btn-hint');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }

        // Qayta boshlash tugmasi
        const resetBtn = document.getElementById('btn-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGame());
        }

        // Modal yopish
        const modalClose = document.getElementById('modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => this.hideHint());
        }

        // Natijani bosish
        const resultPopup = document.getElementById('result-popup');
        if (resultPopup) {
            resultPopup.addEventListener('click', () => {
                resultPopup.classList.remove('show');
            });
        }
    }

    setupDragListeners() {
        const cards = document.querySelectorAll('.element-card');
        cards.forEach(card => {
            card.addEventListener('dragstart', (e) => this.handleDragStart(e));
            card.addEventListener('dragend', (e) => this.handleDragEnd(e));
            // Hover sound
            card.addEventListener('mouseenter', () => {
                window.soundManager.playHover();
            });
        });
    }

    handleDragStart(e) {
        const elementId = parseInt(e.target.dataset.id);
        e.dataTransfer.setData('text/plain', elementId);
        e.target.classList.add('dragging');
        
        window.soundManager.playDrag();
        
        // Ghost element
        const element = this.elements.find(el => el.id === elementId);
        if (element) {
            const ghost = document.createElement('div');
            ghost.className = 'drag-ghost';
            ghost.textContent = element.emoji;
            ghost.style.position = 'absolute';
            ghost.style.top = '-1000px';
            document.body.appendChild(ghost);
            e.dataTransfer.setDragImage(ghost, 30, 30);
            setTimeout(() => ghost.remove(), 0);
        }
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    handleDragOver(e, slot) {
        e.preventDefault();
        slot.classList.add('drag-over');
    }

    handleDragLeave(e, slot) {
        slot.classList.remove('drag-over');
    }

    handleDrop(e, slotNumber) {
        e.preventDefault();
        const slot = document.getElementById(`slot${slotNumber}`);
        slot.classList.remove('drag-over');
        
        const elementId = parseInt(e.dataTransfer.getData('text/plain'));
        const element = this.elements.find(el => el.id === elementId);
        
        if (element) {
            window.soundManager.playDrop();
            this.setSlot(slotNumber, element);
        }
    }

    setSlot(slotNumber, element) {
        const slot = document.getElementById(`slot${slotNumber}`);
        if (!slot) return;

        if (slotNumber === 1) this.slot1 = element;
        else this.slot2 = element;

        slot.classList.add('has-element');
        slot.innerHTML = `
            <div class="element-emoji">${element.emoji}</div>
            <div class="element-name">${element.name_uz}</div>
        `;

        // Sound effekti
        window.soundManager.playSlotFill();

        // Magic trail effekti
        if (window.particles) {
            const rect = slot.getBoundingClientRect();
            window.particles.sparkle(rect.left + rect.width/2, rect.top + rect.height/2, 8);
        }

        // Agar ikkala slot to'ldirilsa, avtomatik birlashtirish
        if (this.slot1 && this.slot2) {
            setTimeout(() => this.combine(), 400);
        }
    }

    clearSlot(slotNumber) {
        const slot = document.getElementById(`slot${slotNumber}`);
        if (!slot) return;

        if (slotNumber === 1) this.slot1 = null;
        else this.slot2 = null;

        slot.classList.remove('has-element');
        slot.innerHTML = `
            <div class="slot-placeholder">
                <span>${slotNumber}-element</span>
            </div>
        `;
    }

    async combine() {
        if (!this.slot1 || !this.slot2) return;

        // Boshlash soundi
        window.soundManager.playCombineStart();

        const combo = this.combinations.find(c => {
            const e1 = c.element1;
            const e2 = c.element2;
            return (e1.id === this.slot1.id && e2.id === this.slot2.id) ||
                   (e1.id === this.slot2.id && e2.id === this.slot1.id);
        });

        if (combo) {
            const result = combo.result;
            const isNew = !this.discovered.has(result.id);

            if (isNew) {
                this.discovered.add(result.id);
                await this.saveProgress(result.id);
                this.updateStats();
                this.renderElements(
                    document.querySelector('.filter-btn.active')?.dataset.category || 'all',
                    document.getElementById('search-input')?.value || ''
                );
            }

            this.showResult(result, isNew);
            
            // XP qo'shish
            if (window.features) {
                const baseXP = isNew ? 100 : 10;
                window.features.addXP(baseXP);
                window.features.updateDailyTask('combine3');
                window.features.updateDailyTask('combine10');
                window.features.updateDailyTask('combine20');
                if (isNew) {
                    window.features.updateDailyTask('discover5');
                    window.features.updateDailyTask('discover10');
                    window.features.updateDailyTask('discover25');
                }
                // Kamdan-kam element tekshirish
                if (isNew) {
                    const rarity = window.features.checkRarity(result.name_uz);
                    if (rarity) this.showRarityNotification(result, rarity);
                }
                // Tezlik mashqi
                window.features.onSpeedCombine();
            }
            
            // Combo qo'shish
            if (window.menuManager) {
                window.menuManager.incrementCombo();
            }
            
            // Muvaffaqiyat soundi va effektlari
            if (isNew) {
                window.soundManager.playDiscovery();
                window.particles.screenShake(8, 400);
                window.particles.flash('rgba(253, 121, 168, 0.3)');
            } else {
                window.soundManager.playCombineSuccess();
            }
            
            this.createParticleBurst();
            
            // Magic trail
            const slot1El = document.getElementById('slot1');
            const slot2El = document.getElementById('slot2');
            const resultEl = document.getElementById('combine-result');
            if (slot1El && slot2El && resultEl) {
                const r1 = slot1El.getBoundingClientRect();
                const r2 = slot2El.getBoundingClientRect();
                const rr = resultEl.getBoundingClientRect();
                window.particles.magicTrail(r1.left + r1.width/2, r1.top + r1.height/2, rr.left + rr.width/2, rr.top + rr.height/2);
                window.particles.magicTrail(r2.left + r2.width/2, r2.top + r2.height/2, rr.left + rr.width/2, rr.top + rr.height/2);
            }
        } else {
            // Xatolik
            window.soundManager.playFail();
            this.showCombineError();
            window.particles.screenShake(3, 200);
        }

        // Slotlarni tozalash
        setTimeout(() => {
            this.clearSlot(1);
            this.clearSlot(2);
        }, 600);
    }

    showResult(element, isNew) {
        const popup = document.getElementById('result-popup');
        const emoji = document.getElementById('result-emoji');
        const name = document.getElementById('result-name');
        const desc = document.getElementById('result-desc');
        const newBadge = document.getElementById('result-new');

        if (popup && emoji && name && desc) {
            emoji.textContent = element.emoji;
            name.textContent = element.name_uz;
            desc.textContent = element.description;
            
            if (newBadge) {
                newBadge.style.display = isNew ? 'inline-block' : 'none';
            }

            popup.classList.add('show');

            // Yangi kashfiyot uchun maxsus effektlar
            if (isNew && window.particles) {
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;
                window.particles.confetti(centerX, centerY, 80);
                window.particles.floatingEmoji(centerX, centerY, ['🎉', '✨', '⭐', '🌟', '💫']);
            }
        }
    }

    showCombineError() {
        const slots = document.querySelectorAll('.combine-slot');
        slots.forEach(slot => {
            slot.classList.add('combine-animation');
            setTimeout(() => slot.classList.remove('combine-animation'), 500);
        });
        
        // Sparkle effekti
        if (window.particles) {
            const slot1 = document.getElementById('slot1');
            const slot2 = document.getElementById('slot2');
            if (slot1) {
                const r = slot1.getBoundingClientRect();
                window.particles.sparkle(r.left + r.width/2, r.top + r.height/2, 10);
            }
            if (slot2) {
                const r = slot2.getBoundingClientRect();
                window.particles.sparkle(r.left + r.width/2, r.top + r.height/2, 10);
            }
        }
    }

    showRarityNotification(element, rarity) {
        const rarityNames = {
            'uncommon': 'NODIR', 'rare': 'KAMDAN-KAM', 'epic': 'EPIK',
            'legendary': 'AFSONAVIY', 'mythic': 'MIFOLOGIK'
        };
        const rarityColors = {
            'uncommon': '#00b894', 'rare': '#0984e3', 'epic': '#6c5ce7',
            'legendary': '#fdcb6e', 'mythic': '#e84393'
        };
        
        const popup = document.createElement('div');
        popup.className = 'rarity-popup';
        popup.innerHTML = `
            <div class="rarity-glow" style="background: ${rarityColors[rarity.rarity]}"></div>
            <div class="rarity-content">
                <div class="rarity-badge" style="background: ${rarityColors[rarity.rarity]}">${rarityNames[rarity.rarity]}</div>
                <div class="rarity-emoji">${element.emoji}</div>
                <div class="rarity-name">${element.name_uz}</div>
                <div class="rarity-xp">+${rarity.xp} XP</div>
            </div>
        `;
        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('show'), 100);
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 500);
        }, 3000);
        
        if (window.soundManager) window.soundManager.playMagic();
        if (window.particles) {
            window.particles.createConfetti(window.innerWidth / 2, window.innerHeight / 2);
        }
    }

    createParticleBurst() {
        const result = document.getElementById('combine-result');
        if (!result) return;

        const rect = result.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle-burst';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.background = `hsl(${Math.random() * 360}, 80%, 60%)`;
            
            const angle = (Math.PI * 2 * i) / 20;
            const distance = 50 + Math.random() * 100;
            particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
            particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
            
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 600);
        }
    }

    updateStats() {
        const countEl = document.getElementById('discovered-count');
        const fillEl = document.getElementById('progress-fill');
        
        if (countEl) {
            const oldValue = parseInt(countEl.textContent) || 0;
            countEl.textContent = this.discovered.size;
            if (this.discovered.size > oldValue) {
                countEl.classList.add('updated');
                setTimeout(() => countEl.classList.remove('updated'), 500);
            }
        }
        if (fillEl) fillEl.style.width = (this.discovered.size / 289 * 100) + '%';
    }

    async showHint() {
        try {
            const response = await fetch(`/api/hint?session_id=${this.sessionId}`);
            const data = await response.json();
            
            window.soundManager.playHint();
            
            const content = document.getElementById('hint-content');
            const modal = document.getElementById('hint-modal');
            
            if (data.hint) {
                content.innerHTML = `
                    <p style="font-size: 1.2rem; margin-bottom: 20px;">Birinchi element:</p>
                    <div style="display: flex; align-items: center; gap: 20px; justify-content: center;">
                        <div style="text-align: center;">
                            <div style="font-size: 4rem;">${data.hint.element1.emoji}</div>
                            <div style="font-size: 1.2rem;">${data.hint.element1.name_uz}</div>
                        </div>
                        <div style="font-size: 2rem; color: var(--accent);">+</div>
                        <div style="text-align: center;">
                            <div style="font-size: 4rem;">${data.hint.element2.emoji}</div>
                            <div style="font-size: 1.2rem;">${data.hint.element2.name_uz}</div>
                        </div>
                    </div>
                `;
            } else {
                content.innerHTML = '<p style="text-align: center; font-size: 1.2rem;">Barcha kombinatsiyalar topildi! Tabriklaymiz! 🎉</p>';
            }
            
            modal.classList.add('show');
        } catch (error) {
            console.error('Maslahatni olishda xatolik:', error);
        }
    }

    hideHint() {
        const modal = document.getElementById('hint-modal');
        if (modal) modal.classList.remove('show');
    }

    resetGame() {
        if (confirm('Haqiqatan ham qayta boshlamoqchimisiz? Barcha kashfiyotlar yo\'qoladi!')) {
            localStorage.removeItem('alchemy_session_id');
            location.reload();
        }
    }

    setupSoundToggle() {
        const soundBtn = document.getElementById('btn-sound');
        if (soundBtn) {
            soundBtn.addEventListener('click', () => {
                const enabled = window.soundManager.toggle();
                soundBtn.querySelector('span').textContent = enabled ? '🔊' : '🔇';
                soundBtn.classList.toggle('muted', !enabled);
                soundBtn.classList.add('toggling');
                setTimeout(() => soundBtn.classList.remove('toggling'), 300);
            });
        }
    }
}

// O'yinni ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.game-container')) {
        window.game = new AlchemyGame();
    }
});
