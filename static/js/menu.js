// ============================================
// ALKIMIYA UZ - MENU VA QO'SHIMCHA FUNKSIYALAR
// ============================================

class MenuManager {
    constructor() {
        this.isDarkMode = localStorage.getItem('darkMode') !== 'false';
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        this.animationsEnabled = localStorage.getItem('animationsEnabled') !== 'false';
        this.comboCount = 0;
        this.totalCombos = parseInt(localStorage.getItem('totalCombos') || '0');
        this.hintsUsed = 3;
        this.startTime = Date.now();
        this.streak = 0;
        this.achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        
        this.init();
    }

    init() {
        this.setupMenuToggle();
        this.setupTheme();
        this.setupSound();
        this.setupAnimations();
        this.setupDailyElement();
        this.setupRandomElement();
        this.setupCombo();
        this.setupHints();
        this.setupStats();
        this.setupAchievements();
        this.setupSpeedButton();
        this.setupBossButton();
        this.setupTreeButton();
        this.setupEncyclopediaButton();
        this.setupResetButton();
        this.updateTime();
        this.updateDailyTasks();
        
        setInterval(() => this.updateTime(), 60000);
    }

    // ========== MENU TOGGLE ==========
    setupMenuToggle() {
        const menuBtn = document.getElementById('btn-menu');
        const sidebar = document.getElementById('sidebar');
        const closeBtn = document.getElementById('sidebar-close');

        if (menuBtn && sidebar) {
            menuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                window.soundManager.playDrop();
            });
        }

        if (closeBtn && sidebar) {
            closeBtn.addEventListener('click', () => {
                sidebar.classList.remove('open');
                window.soundManager.playDrop();
            });
        }

        // Sidebar ochiq bo'lganda backdrop bosish
        document.addEventListener('click', (e) => {
            if (sidebar && sidebar.classList.contains('open') && 
                !sidebar.contains(e.target) && 
                e.target !== menuBtn && !menuBtn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    // ========== DARK/LIGHT MODE ==========
    setupTheme() {
        const toggle = document.getElementById('toggle-dark');
        if (!toggle) return;

        toggle.checked = this.isDarkMode;
        this.applyTheme();

        toggle.addEventListener('change', () => {
            this.isDarkMode = toggle.checked;
            localStorage.setItem('darkMode', this.isDarkMode);
            this.applyTheme();
            window.soundManager.playSlotFill();
        });
    }

    applyTheme() {
        const container = document.getElementById('game-container');
        if (container) {
            container.classList.toggle('light-mode', !this.isDarkMode);
            document.body.classList.toggle('light-mode', !this.isDarkMode);
        }
    }

    // ========== SOUND TOGGLE ==========
    setupSound() {
        const toggle = document.getElementById('toggle-sound');
        if (!toggle) return;

        toggle.checked = this.soundEnabled;
        window.soundManager.enabled = this.soundEnabled;

        toggle.addEventListener('change', () => {
            this.soundEnabled = toggle.checked;
            localStorage.setItem('soundEnabled', this.soundEnabled);
            window.soundManager.enabled = this.soundEnabled;
            if (this.soundEnabled) window.soundManager.playSlotFill();
        });
    }

    // ========== ANIMATIONS TOGGLE ==========
    setupAnimations() {
        const toggle = document.getElementById('toggle-animations');
        if (!toggle) return;

        toggle.checked = this.animationsEnabled;

        toggle.addEventListener('change', () => {
            this.animationsEnabled = toggle.checked;
            localStorage.setItem('animationsEnabled', this.animationsEnabled);
            document.body.classList.toggle('no-animations', !this.animationsEnabled);
            window.soundManager.playDrop();
        });
    }

    // ========== KUN ELEMENTI ==========
    setupDailyElement() {
        const dailyBtn = document.getElementById('btn-daily');
        const dailyHeader = document.getElementById('btn-daily-header');
        const dailyClose = document.getElementById('btn-daily-close');

        const showDaily = () => this.showDailyElement();

        if (dailyBtn) dailyBtn.addEventListener('click', showDaily);
        if (dailyHeader) dailyHeader.addEventListener('click', showDaily);
        if (dailyClose) {
            dailyClose.addEventListener('click', () => {
                document.getElementById('daily-modal').classList.remove('show');
            });
        }

        this.updateDailyElement();
    }

    updateDailyElement() {
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        const elements = window.game?.elements || [];
        if (elements.length === 0) return;

        const index = seed % elements.length;
        const dailyElement = elements[index];
        
        const dailyEl = document.getElementById('daily-element');
        if (dailyEl) {
            dailyEl.textContent = `${dailyElement.emoji} ${dailyElement.name_uz}`;
        }

        this.dailyElement = dailyElement;
    }

    showDailyElement() {
        if (!this.dailyElement) return;

        const modal = document.getElementById('daily-modal');
        const emoji = document.getElementById('daily-big-emoji');
        const name = document.getElementById('daily-big-name');
        const desc = document.getElementById('daily-big-desc');

        if (modal && emoji && name && desc) {
            emoji.textContent = this.dailyElement.emoji;
            name.textContent = this.dailyElement.name_uz;
            desc.textContent = this.dailyElement.description;
            modal.classList.add('show');
            window.soundManager.playDiscovery();
            
            if (window.particles) {
                window.particles.confetti(window.innerWidth/2, window.innerHeight/2, 40);
            }
        }
    }

    // ========== TASODIFIY ELEMENT ==========
    setupRandomElement() {
        const randomBtn = document.getElementById('btn-random');
        const randomHeader = document.getElementById('btn-random-header');

        const doRandom = () => this.showRandomElement();

        if (randomBtn) randomBtn.addEventListener('click', doRandom);
        if (randomHeader) randomHeader.addEventListener('click', doRandom);
    }

    showRandomElement() {
        const elements = window.game?.elements || [];
        const discovered = window.game?.discovered || new Set();
        
        const discoveredElements = elements.filter(e => discovered.has(e.id));
        if (discoveredElements.length === 0) return;

        const random = discoveredElements[Math.floor(Math.random() * discoveredElements.length)];
        
        window.soundManager.playMagic();
        
        if (window.particles) {
            window.particles.floatingEmoji(window.innerWidth/2, window.innerHeight/2, [random.emoji]);
        }

        // Elementni highlight qilish
        const card = document.querySelector(`.element-card[data-id="${random.id}"]`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.classList.add('new-discovery');
            card.style.animation = 'wobble 0.5s ease 3';
            setTimeout(() => {
                card.classList.remove('new-discovery');
                card.style.animation = '';
            }, 1500);
        }
    }

    // ========== COMBO REJIM ==========
    setupCombo() {
        const comboBtn = document.getElementById('btn-combo');
        if (comboBtn) {
            comboBtn.addEventListener('click', () => {
                this.comboCount = 0;
                this.updateComboDisplay();
                window.soundManager.playHint();
                
                if (window.particles) {
                    window.particles.flash('rgba(253, 121, 168, 0.2)');
                }
            });
        }
    }

    incrementCombo() {
        this.comboCount++;
        this.totalCombos++;
        localStorage.setItem('totalCombos', this.totalCombos);
        this.updateComboDisplay();
        this.checkComboAchievement();
    }

    resetCombo() {
        this.comboCount = 0;
        this.updateComboDisplay();
    }

    updateComboDisplay() {
        const display = document.getElementById('combo-display');
        const number = document.getElementById('combo-number');
        const badge = document.getElementById('combo-count');

        if (number) number.textContent = this.comboCount + 'x';
        if (badge) badge.textContent = this.comboCount + 'x';
        
        if (display && this.comboCount > 0) {
            display.classList.add('active');
            display.style.animation = 'none';
            display.offsetHeight;
            display.style.animation = 'bounceIn 0.3s ease';
        } else if (display) {
            display.classList.remove('active');
        }
    }

    // ========== MASLAHAT ==========
    setupHints() {
        var self = this;
        var hintBtn = document.getElementById('btn-hint-menu');
        var hintHeader = document.getElementById('btn-hint-header');

        var doHint = function() {
            var hintLimit = parseInt(localStorage.getItem('hintLimit') || '0');
            var hintReset = parseInt(localStorage.getItem('hintReset') || '0');
            var now = Date.now();

            if (hintReset > now) {
                var remaining = Math.ceil((hintReset - now) / 3600000);
                window.soundManager.playFail();
                alert('Maslahat limiti tugadi! ' + remaining + ' soat kutish kerak.');
                return;
            }

            if (hintLimit >= 10) {
                var resetTime = now + 4 * 3600000;
                localStorage.setItem('hintReset', resetTime.toString());
                localStorage.setItem('hintLimit', '0');
                window.soundManager.playFail();
                alert('10 ta maslahat ishlatildi! 4 soat kutish kerak.');
                return;
            }

            hintLimit++;
            localStorage.setItem('hintLimit', hintLimit.toString());
            self.hintsUsed = 10 - hintLimit;
            document.getElementById('hint-count').textContent = (10 - hintLimit);
            if (window.game) window.game.showHint();
        };

        if (hintBtn) hintBtn.addEventListener('click', doHint);
        if (hintHeader) hintHeader.addEventListener('click', doHint);
        
        var hintLimit = parseInt(localStorage.getItem('hintLimit') || '0');
        this.hintsUsed = 10 - hintLimit;
        document.getElementById('hint-count').textContent = (10 - hintLimit);
    }

    // ========== STATISTIKA ==========
    setupStats() {
        this.updateStats();
    }

    updateStats() {
        const discovered = window.game?.discovered?.size || 0;
        
        const el1 = document.getElementById('stat-discovered');
        const el2 = document.getElementById('stat-combos');
        const el3 = document.getElementById('stat-streak');
        const el4 = document.getElementById('stat-time');

        if (el1) el1.textContent = discovered;
        if (el2) el2.textContent = this.totalCombos;
        if (el3) el3.textContent = this.streak;
        if (el4) el4.textContent = this.getTimeString();
    }

    updateTime() {
        const el = document.getElementById('stat-time');
        if (el) el.textContent = this.getTimeString();
    }

    getTimeString() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 60000);
        if (elapsed < 60) return elapsed + 'm';
        const hours = Math.floor(elapsed / 60);
        const mins = elapsed % 60;
        return hours + 'h ' + mins + 'm';
    }

    // ========== YUTUQLAR ==========
    setupAchievements() {
        this.renderAchievements();
        this.checkAllAchievements();
    }

    // ========== TEZLIK MASHQI ==========
    setupSpeedButton() {
        const btn = document.getElementById('btn-speed');
        if (btn) btn.addEventListener('click', () => {
            if (window.features) window.features.startSpeedChallenge();
            this.closeSidebar();
        });
    }

    // ========== BOSS URUSHI ==========
    setupBossButton() {
        const btn = document.getElementById('btn-boss-menu');
        if (btn) btn.addEventListener('click', () => {
            if (window.features) window.features.spawnBoss();
            this.closeSidebar();
        });
    }

    // ========== ELEMENT DARAXTI ==========
    setupTreeButton() {
        const btn = document.getElementById('btn-tree');
        if (btn) btn.addEventListener('click', () => {
            const discovered = window.game?.discovered;
            if (discovered && discovered.size > 0) {
                const elements = window.game?.elements || [];
                const discoveredElements = elements.filter(e => discovered.has(e.id));
                const random = discoveredElements[Math.floor(Math.random() * discoveredElements.length)];
                if (window.features && random) {
                    window.features.showElementTree(random.name_uz);
                }
            }
            this.closeSidebar();
        });
    }

    // ========== ENSIKLOPEDIYA ==========
    setupEncyclopediaButton() {
        const btn = document.getElementById('btn-encyclopedia');
        if (btn) btn.addEventListener('click', () => {
            const discovered = window.game?.discovered;
            if (discovered && discovered.size > 0) {
                const elements = window.game?.elements || [];
                const discoveredElements = elements.filter(e => discovered.has(e.id));
                const random = discoveredElements[Math.floor(Math.random() * discoveredElements.length)];
                if (window.features && random) {
                    window.features.showEncyclopedia(random.name_uz);
                }
            }
            this.closeSidebar();
        });
    }

    // ========== QAYTA BOSHLASH ==========
    setupResetButton() {
        const btn = document.getElementById('btn-reset-menu');
        if (btn) btn.addEventListener('click', () => {
            if (window.game) window.game.resetGame();
            this.closeSidebar();
        });
    }

    // ========== KUNLIK TOPSHIRIQLAR ==========
    updateDailyTasks() {
        if (window.features) {
            window.features.updateDailyDisplay();
        }
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('open');
    }

    checkAllAchievements() {
        const discovered = window.game?.discovered?.size || 0;
        const elements = window.game?.elements || [];

        // Birinchi qadam
        if (discovered >= 1) this.unlock('first');
        
        // 10 ta kashfiyot
        if (discovered >= 10) this.unlock('ten');
        
        // 50 ta kashfiyot
        if (discovered >= 50) this.unlock('fifty');

        // Tabiat ustasi - tabiat kategoriyasidagi elementlar
        const natureCount = elements.filter(e => 
            e.category === 'tabiat' && window.game?.discovered?.has(e.id)
        ).length;
        if (natureCount >= 10) this.unlock('nature');

        // Hayot yaratuvchi
        const hasJon = elements.find(e => e.name_uz === 'Jon' && window.game?.discovered?.has(e.id));
        const hasInson = elements.find(e => e.name_uz === 'Inson' && window.game?.discovered?.has(e.id));
        if (hasJon && hasInson) this.unlock('life');

        // Oshpaz
        const foodCount = elements.filter(e => 
            e.category === 'ovqat' && window.game?.discovered?.has(e.id)
        ).length;
        if (foodCount >= 8) this.unlock('food');

        // Texnologiya
        const techCount = elements.filter(e => 
            e.category === 'texnologiya' && window.game?.discovered?.has(e.id)
        ).length;
        if (techCount >= 5) this.unlock('tech');
    }

    checkComboAchievement() {
        if (this.comboCount >= 5) this.unlock('combo5');
    }

    unlock(id) {
        if (this.achievements.includes(id)) return;
        
        this.achievements.push(id);
        localStorage.setItem('achievements', JSON.stringify(this.achievements));
        
        this.renderAchievements();
        this.showAchievementPopup(id);
        
        window.soundManager.playCelebration();
        if (window.particles) {
            window.particles.confetti(window.innerWidth/2, window.innerHeight/2, 100);
            window.particles.floatingEmoji(window.innerWidth/2, window.innerHeight/3, ['🏆', '🎖️', '🥇', '⭐']);
        }
    }

    renderAchievements() {
        const list = document.getElementById('achievements-list');
        if (!list) return;

        const achievements = list.querySelectorAll('.achievement');
        achievements.forEach(ach => {
            const id = ach.dataset.achievement;
            if (this.achievements.includes(id)) {
                ach.classList.remove('locked');
                ach.classList.add('unlocked');
            }
        });
    }

    showAchievementPopup(id) {
        const popup = document.getElementById('achievement-modal');
        const icon = document.getElementById('achievement-icon');
        const text = document.getElementById('achievement-text');

        const achievementData = {
            first: { icon: '🌱', text: 'Birinchi kashfiyotingiz!' },
            ten: { icon: '🔟', text: '10 ta element kashf etdingiz!' },
            combo5: { icon: '🔥', text: '5x Combo ga erishdingiz!' },
            nature: { icon: '🌿', text: 'Tabiat ustasi!' },
            life: { icon: '🧬', text: 'Hayot va Insonni yaratdingiz!' },
            food: { icon: '👨‍🍳', text: 'Oshpaz bo\'ldingiz!' },
            tech: { icon: '🤖', text: 'Texnologiya kashshofi!' },
            fifty: { icon: '⭐', text: '50 ta kashfiyot!' },
        };

        const data = achievementData[id];
        if (popup && icon && text && data) {
            icon.textContent = data.icon;
            text.textContent = data.text;
            popup.classList.add('show');

            setTimeout(() => popup.classList.remove('show'), 3000);
        }
    }
}

// Yangi kashfiyot qo'shilganda combo va stats yangilash
const originalCombine = AlchemyGame.prototype.combine;
AlchemyGame.prototype.combine = async function() {
    const slot1Before = this.slot1;
    const slot2Before = this.slot2;
    
    await originalCombine.call(this);
    
    if (window.menuManager && slot1Before && slot2Before) {
        window.menuManager.updateStats();
        window.menuManager.checkAllAchievements();
    }
};

// O'yin yuklanganda menu ni ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.menuManager = new MenuManager();
    }, 500);
});
