// ============================================
// ALKIMIYA UZ - QO'SHIMCHA FUNKSIYALAR
// ============================================

class FeaturesManager {
    constructor() {
        this.xp = parseInt(localStorage.getItem('xp') || '0');
        this.level = parseInt(localStorage.getItem('level') || '1');
        this.maxLevel = 100;
        this.xpPerLevel = 50;
        
        this.dailyTasks = JSON.parse(localStorage.getItem('dailyTasks') || '[]');
        this.dailyDate = localStorage.getItem('dailyDate') || '';
        
        this.rareElements = {
            'Oltin': { rarity: 'legendary', chance: 0.05, xp: 500 },
            'Platinium': { rarity: 'legendary', chance: 0.03, xp: 800 },
            'Almaz': { rarity: 'epic', chance: 0.08, xp: 300 },
            'Rubin': { rarity: 'epic', chance: 0.1, xp: 250 },
            'Smaragd': { rarity: 'epic', chance: 0.1, xp: 250 },
            'Kumush': { rarity: 'rare', chance: 0.15, xp: 150 },
            'Mis': { rarity: 'rare', chance: 0.15, xp: 150 },
            'Qimmatbaho tosh': { rarity: 'rare', chance: 0.12, xp: 200 },
            'Fosfor': { rarity: 'uncommon', chance: 0.2, xp: 100 },
            'Kremniy': { rarity: 'uncommon', chance: 0.2, xp: 100 },
            'Yadro': { rarity: 'legendary', chance: 0.02, xp: 1000 },
            'Quark': { rarity: 'legendary', chance: 0.01, xp: 2000 },
            'Giperkosmik': { rarity: 'legendary', chance: 0.005, xp: 5000 },
            'Kreator': { rarity: 'mythic', chance: 0.001, xp: 10000 },
        };
        
        this.bosses = [
            { name: 'Vulkan', emoji: '🌋', hp: 100, reward: 300, weakness: ['Suv', 'Havo'] },
            { name: 'Tsunami', emoji: '🌊', hp: 150, reward: 400, weakness: ['Yer', 'Issiqlik'] },
            { name: 'Zilzila', emoji: '💥', hp: 200, reward: 500, weakness: ['Havo', 'Suv'] },
            { name: 'Chiroq', emoji: '⚡', hp: 120, reward: 350, weakness: ['Yer', 'Metall'] },
            { name: 'Supervolkan', emoji: '🔥', hp: 300, reward: 800, weakness: ['Muz', 'Suv'] },
            { name: 'Qora tuynuk', emoji: '🕳️', hp: 500, reward: 1500, weakness: ['Yorug\'lik', 'Kosmik'] },
            { name: 'Supernova', emoji: '💫', hp: 400, reward: 1200, weakness: ['Sovuq', 'Vakuum'] },
        ];
        
        this.activeBoss = null;
        this.bossHP = 0;
        
        this.speedChallenge = {
            active: false,
            timeLeft: 60,
            score: 0,
            timer: null
        };
        
        this.treeHistory = [];
        
        this.init();
    }
    
    init() {
        this.generateDailyTasks();
        this.updateLevelDisplay();
        this.setupEventListeners();
    }
    
    // ========== REJTING TIZIMI ==========
    addXP(amount) {
        this.xp += amount;
        const oldLevel = this.level;
        
        while (this.xp >= this.xpPerLevel * this.level && this.level < this.maxLevel) {
            this.xp -= this.xpPerLevel * this.level;
            this.level++;
        }
        
        if (this.level > oldLevel) {
            this.onLevelUp(this.level);
        }
        
        localStorage.setItem('xp', this.xp);
        localStorage.setItem('level', this.level);
        this.updateLevelDisplay();
    }
    
    onLevelUp(newLevel) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-icon">🎉</div>
            <div class="level-up-text">
                <div class="level-up-title">DARAJA OSHDI!</div>
                <div class="level-up-level">Daraja ${newLevel}</div>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
        
        if (window.soundManager) window.soundManager.playMagic();
        if (window.particles) window.particles.magicTrail(
            window.innerWidth / 2, window.innerHeight / 2
        );
        
        this.checkLevelAchievements(newLevel);
    }
    
    checkLevelAchievements(level) {
        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        const checks = {
            5: 'level5',
            10: 'level10',
            25: 'level25',
            50: 'level50',
            100: 'level100',
        };
        
        if (checks[level] && !achievements.includes(checks[level])) {
            achievements.push(checks[level]);
            localStorage.setItem('achievements', JSON.stringify(achievements));
            this.showAchievementUnlock(checks[level]);
        }
    }
    
    showAchievementUnlock(id) {
        const names = {
            'level5': 'Yangi boshlovchi',
            'level10': 'Tajribali',
            'level25': 'Usta alkimyogar',
            'level50': 'Professional',
            'level100': 'Yulduz ustasi',
        };
        
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-popup-icon">🏆</div>
            <div class="achievement-popup-text">
                <div class="achievement-popup-title">YUTUQ OCHILDI!</div>
                <div class="achievement-popup-name">${names[id] || id}</div>
            </div>
        `;
        document.body.appendChild(popup);
        
        setTimeout(() => popup.classList.add('show'), 100);
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 500);
        }, 3000);
    }
    
    updateLevelDisplay() {
        const levelEl = document.getElementById('player-level');
        const xpBarEl = document.getElementById('xp-bar-fill');
        const xpTextEl = document.getElementById('xp-text');
        
        if (levelEl) levelEl.textContent = this.level;
        if (xpBarEl) xpBarEl.style.width = `${(this.xp / (this.xpPerLevel * this.level)) * 100}%`;
        if (xpTextEl) xpTextEl.textContent = `${this.xp}/${this.xpPerLevel * this.level} XP`;
    }
    
    // ========== KUNLIK TOPSHIRIQLAR ==========
    generateDailyTasks() {
        const today = new Date().toDateString();
        
        if (this.dailyDate === today && this.dailyTasks.length > 0) {
            return;
        }
        
        const allTasks = [
            { id: 'combine3', text: '3 marta birlashtiring', target: 3, reward: 50, icon: '🔄' },
            { id: 'combine10', text: '10 marta birlashtiring', target: 10, reward: 100, icon: '🔄' },
            { id: 'discover5', text: '5 ta yangi element kashf eting', target: 5, reward: 200, icon: '🔍' },
            { id: 'discover10', text: '10 ta yangi element kashf eting', target: 10, reward: 500, icon: '🔍' },
            { id: 'use_water', text: 'Suv elementini ishlating', target: 1, reward: 75, icon: '💧' },
            { id: 'use_fire', text: 'Olov elementini ishlating', target: 1, reward: 75, icon: '🔥' },
            { id: 'combo3', text: '3x combo ga erishing', target: 3, reward: 150, icon: '⚡' },
            { id: 'boss', text: 'Boss urushida g\'alaba qozoning', target: 1, reward: 300, icon: '⚔️' },
            { id: 'speed5', text: 'Tezlik mashqida 5 ta birlashtiring', target: 5, reward: 100, icon: '⏱️' },
            { id: 'speed10', text: 'Tezlik mashqida 10 ta birlashtiring', target: 10, reward: 250, icon: '⏱️' },
            { id: 'combine20', text: '20 marta birlashtiring', target: 20, reward: 300, icon: '🔄' },
            { id: 'discover25', text: '25 ta yangi element kashf eting', target: 25, reward: 800, icon: '🔍' },
        ];
        
        const shuffled = allTasks.sort(() => Math.random() - 0.5);
        this.dailyTasks = shuffled.slice(0, 3).map(task => ({
            ...task,
            progress: 0,
            completed: false,
            claimed: false
        }));
        
        this.dailyDate = today;
        localStorage.setItem('dailyTasks', JSON.stringify(this.dailyTasks));
        localStorage.setItem('dailyDate', this.dailyDate);
        this.updateDailyDisplay();
    }
    
    updateDailyTask(taskId, increment = 1) {
        const task = this.dailyTasks.find(t => t.id === taskId);
        if (task && !task.completed) {
            task.progress = Math.min(task.progress + increment, task.target);
            if (task.progress >= task.target) {
                task.completed = true;
                this.showDailyComplete(task);
            }
            localStorage.setItem('dailyTasks', JSON.stringify(this.dailyTasks));
            this.updateDailyDisplay();
        }
    }
    
    claimDailyReward(index) {
        const task = this.dailyTasks[index];
        if (task && task.completed && !task.claimed) {
            task.claimed = true;
            this.addXP(task.reward);
            localStorage.setItem('dailyTasks', JSON.stringify(this.dailyTasks));
            this.updateDailyDisplay();
            if (window.soundManager) window.soundManager.playCelebration();
        }
    }
    
    showDailyComplete(task) {
        const popup = document.createElement('div');
        popup.className = 'daily-complete-popup';
        popup.innerHTML = `
            <div class="daily-complete-icon">${task.icon}</div>
            <div class="daily-complete-text">Topshiriq bajarildi!</div>
            <div class="daily-complete-reward">+${task.reward} XP</div>
        `;
        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('show'), 100);
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 500);
        }, 2500);
    }
    
    updateDailyDisplay() {
        const container = document.getElementById('daily-tasks-list');
        if (!container) return;
        
        container.innerHTML = this.dailyTasks.map((task, i) => `
            <div class="daily-task ${task.completed ? 'completed' : ''} ${task.claimed ? 'claimed' : ''}">
                <div class="daily-task-icon">${task.icon}</div>
                <div class="daily-task-info">
                    <div class="daily-task-text">${task.text}</div>
                    <div class="daily-task-progress">
                        <div class="daily-task-bar">
                            <div class="daily-task-bar-fill" style="width: ${(task.progress / task.target) * 100}%"></div>
                        </div>
                        <span>${task.progress}/${task.target}</span>
                    </div>
                </div>
                ${task.completed && !task.claimed ? 
                    `<button class="daily-claim-btn" onclick="window.features.claimDailyReward(${i})">🎁 Olish</button>` :
                    task.claimed ? '<span class="daily-claimed">✓</span>' : ''}
            </div>
        `).join('');
    }
    
    // ========== ELEMENT DARAXTI ==========
    showElementTree(elementName) {
        const tree = this.buildTree(elementName);
        const modal = document.getElementById('tree-modal');
        const content = document.getElementById('tree-content');
        
        if (!modal || !content) return;
        
        content.innerHTML = this.renderTree(tree, 0);
        modal.classList.add('show');
    }
    
    buildTree(elementName, depth = 0, visited = new Set()) {
        if (depth > 5 || visited.has(elementName)) return { name: elementName, children: [], depth };
        
        visited.add(elementName);
        const combinations = JSON.parse(localStorage.getItem('combinations') || '[]');
        const parents = combinations.filter(c => c.result === elementName);
        
        return {
            name: elementName,
            children: parents.slice(0, 4).map(p => this.buildTree(p.element1, depth + 1, new Set(visited))),
            depth
        };
    }
    
    renderTree(node, depth) {
        const indent = depth * 30;
        const emoji = this.getElementEmoji(node.name);
        
        let html = `<div class="tree-node" style="margin-left: ${indent}px">
            <span class="tree-emoji">${emoji}</span>
            <span class="tree-name">${node.name}</span>
        </div>`;
        
        if (node.children && node.children.length > 0) {
            html += '<div class="tree-children">';
            node.children.forEach(child => {
                html += this.renderTree(child, depth + 1);
            });
            html += '</div>';
        }
        
        return html;
    }
    
    getElementEmoji(name) {
        const emojis = {
            'Yer': '🌍', 'Suv': '💧', 'Havo': '💨', 'Olov': '🔥',
            'Quyosh': '☀️', 'Oy': '🌙', 'Yulduz': '⭐', 'Bulut': '☁️',
            'Chaqaloq': '👶', 'Odam': '🧑', 'Hayvon': '🐕', 'O\'simlik': '🌿',
            'Daraxt': '🌳', 'Tosh': '🪨', 'Temir': '⚙️', 'Oltin': '🥇',
            'Platinium': '💎', 'Almaz': '💠', 'Zamzam': '⚡', 'Zilzila': '💥',
            'Tornado': '🌪️', 'Bo\'ron': '⛈️', 'Muz': '🧊', 'Bug': '♨️',
            'Shisha': '🪟', 'G\'isht': '🧱', 'Sement': '🏗️', 'Beton': '🧱',
            'Non': '🍞', 'Keks': '🧁', 'Pirojnoe': '🎂', 'Shokolad': '🍫',
            'Kofe': '☕', 'Choy': '🍵', 'Sut': '🥛', 'Pivo': '🍺',
            'Sharob': '🍷', 'Vodka': '🍸', 'Sushi': '🍣', 'Lag\'mon': '🍜',
            'Palov': '🍚', 'Shashlik': '🍢', 'Chuchvara': '🥟', 'Manti': '🥟',
        };
        return emojis[name] || '✨';
    }
    
    closeTreeModal() {
        const modal = document.getElementById('tree-modal');
        if (modal) modal.classList.remove('show');
    }
    
    // ========== BOSS URUSHLARI ==========
    spawnBoss() {
        const boss = this.bosses[Math.floor(Math.random() * this.bosses.length)];
        this.activeBoss = { ...boss };
        this.bossHP = boss.hp;
        
        const bossEl = document.getElementById('boss-area');
        if (bossEl) {
            bossEl.innerHTML = `
                <div class="boss-card">
                    <div class="boss-header">
                        <span class="boss-emoji">${boss.emoji}</span>
                        <span class="boss-name">${boss.name}</span>
                    </div>
                    <div class="boss-hp-bar">
                        <div class="boss-hp-fill" style="width: 100%"></div>
                        <span class="boss-hp-text">${this.bossHP}/${boss.hp}</span>
                    </div>
                    <div class="boss-info">
                        <p>⚡ Zaiflik: ${boss.weakness.join(', ')}</p>
                        <p>🎁 Mukofot: ${boss.reward} XP</p>
                    </div>
                    <div class="boss-actions">
                        <button class="boss-fight-btn" onclick="window.features.attackBoss('${boss.weakness[0]}')">
                            ⚔️ Kurash!
                        </button>
                        <button class="boss-flee-btn" onclick="window.features.fleeBoss()">
                            🏃 Qochish
                        </button>
                    </div>
                </div>
            `;
            bossEl.classList.add('active');
        }
    }
    
    attackBoss(elementName) {
        if (!this.activeBoss) return;
        
        const isWeak = this.activeBoss.weakness.includes(elementName);
        const damage = isWeak ? 50 : 25;
        const crit = Math.random() < 0.2;
        const finalDamage = crit ? damage * 2 : damage;
        
        this.bossHP = Math.max(0, this.bossHP - finalDamage);
        
        const bossFill = document.querySelector('.boss-hp-fill');
        const bossText = document.querySelector('.boss-hp-text');
        if (bossFill) bossFill.style.width = `${(this.bossHP / this.activeBoss.hp) * 100}%`;
        if (bossText) bossText.textContent = `${this.bossHP}/${this.activeBoss.hp}`;
        
        const dmgPopup = document.createElement('div');
        dmgPopup.className = 'boss-damage-popup';
        dmgPopup.textContent = crit ? `💥 ${finalDamage}!` : `-${finalDamage}`;
        dmgPopup.style.color = crit ? '#ff6b6b' : isWeak ? '#00b894' : '#fdcb6e';
        document.querySelector('.boss-card')?.appendChild(dmgPopup);
        setTimeout(() => dmgPopup.remove(), 1000);
        
        if (window.soundManager) window.soundManager.playFail();
        if (window.particles) {
            const rect = document.querySelector('.boss-card')?.getBoundingClientRect();
            if (rect) window.particles.sparkle(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
        
        if (this.bossHP <= 0) {
            this.defeatBoss();
        }
    }
    
    defeatBoss() {
        const popup = document.createElement('div');
        popup.className = 'boss-victory-popup';
        popup.innerHTML = `
            <div class="boss-victory-icon">🏆</div>
            <div class="boss-victory-text">GALABA!</div>
            <div class="boss-victory-reward">${this.activeBoss.name} yengildi! +${this.activeBoss.reward} XP</div>
        `;
        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('show'), 100);
        
        this.addXP(this.activeBoss.reward);
        this.activeBoss = null;
        
        if (window.soundManager) window.soundManager.playCelebration();
        if (window.particles) {
            window.particles.confetti(window.innerWidth / 2, window.innerHeight / 2);
        }
        
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 500);
            const bossEl = document.getElementById('boss-area');
            if (bossEl) {
                bossEl.classList.remove('active');
                bossEl.innerHTML = '';
            }
        }, 3000);
    }
    
    fleeBoss() {
        this.activeBoss = null;
        const bossEl = document.getElementById('boss-area');
        if (bossEl) {
            bossEl.classList.remove('active');
            bossEl.innerHTML = '<div class="boss-empty">Boss topish uchun ⚔️ tugmasini bosing</div>';
        }
    }
    
    // ========== TEZLIK MASHQI ==========
    startSpeedChallenge() {
        this.speedChallenge.active = true;
        this.speedChallenge.timeLeft = 60;
        this.speedChallenge.score = 0;
        
        const modal = document.getElementById('speed-modal');
        if (modal) modal.classList.add('show');
        
        this.updateSpeedDisplay();
        this.speedChallenge.timer = setInterval(() => {
            this.speedChallenge.timeLeft--;
            this.updateSpeedDisplay();
            
            if (this.speedChallenge.timeLeft <= 0) {
                this.endSpeedChallenge();
            }
        }, 1000);
        
        if (window.soundManager) window.soundManager.playMagic();
    }
    
    onSpeedCombine() {
        if (!this.speedChallenge.active) return;
        this.speedChallenge.score++;
        this.updateSpeedDisplay();
    }
    
    updateSpeedDisplay() {
        const timeEl = document.getElementById('speed-time');
        const scoreEl = document.getElementById('speed-score');
        if (timeEl) timeEl.textContent = this.speedChallenge.timeLeft;
        if (scoreEl) scoreEl.textContent = this.speedChallenge.score;
        
        const timerBar = document.querySelector('.speed-timer-fill');
        if (timerBar) timerBar.style.width = `${(this.speedChallenge.timeLeft / 60) * 100}%`;
    }
    
    endSpeedChallenge() {
        clearInterval(this.speedChallenge.timer);
        this.speedChallenge.active = false;
        
        const score = this.speedChallenge.score;
        const xp = score * 20;
        this.addXP(xp);
        
        const resultEl = document.getElementById('speed-result');
        if (resultEl) {
            resultEl.innerHTML = `
                <div class="speed-result-score">${score}</div>
                <div class="speed-result-label">birlashtirish</div>
                <div class="speed-result-xp">+${xp} XP</div>
            `;
            resultEl.classList.add('show');
        }
        
        if (window.soundManager) window.soundManager.playCelebration();
        if (score >= 10 && window.particles) {
            window.particles.confetti(window.innerWidth / 2, window.innerHeight / 2);
        }
        
        this.updateDailyTask('speed5', score);
        this.updateDailyTask('speed10', score);
        
        setTimeout(() => {
            const modal = document.getElementById('speed-modal');
            if (modal) modal.classList.remove('show');
            if (resultEl) resultEl.classList.remove('show');
        }, 3000);
    }
    
    closeSpeedChallenge() {
        if (this.speedChallenge.active) {
            this.endSpeedChallenge();
        }
        const modal = document.getElementById('speed-modal');
        if (modal) modal.classList.remove('show');
    }
    
    // ========== ENSIKLOPEDIYA ==========
    showEncyclopedia(elementName) {
        const modal = document.getElementById('encyclopedia-modal');
        const content = document.getElementById('encyclopedia-content');
        if (!modal || !content) return;
        
        const emoji = this.getElementEmoji(elementName);
        const isRare = this.rareElements[elementName];
        const discovered = this.isElementDiscovered(elementName);
        const discoveredAt = localStorage.getItem(`discovered_${elementName}`) || 'Noma\'lum';
        
        const combinations = JSON.parse(localStorage.getItem('combinations') || '[]');
        const madeFrom = combinations.filter(c => c.result === elementName);
        const canMake = combinations.filter(c => c.element1 === elementName || c.element2 === elementName);
        
        const descriptions = {
            'Yer': 'Hashamat sayyoramizning asosi. Barcha tirik mavjudotning uyjoyi.',
            'Suv': 'Hayot manbai. Barcha tirik narsalar suvsiz yashay olmaydi.',
            'Havo': 'Atmosferaning asosiy qismi. Nafas olish uchun zarur.',
            'Olov': 'Yonish hodisasi. Issiqlik va yorug\'lik manbai.',
            'Quyosh': 'Yer yaqinidagi eng yaqin yulduz. Hamma narsaga yorug\'lik beradi.',
            'Oy': 'Yer sayyorasining tabiiy yo\'ldoshi. Tunlarni yoritadi.',
            'Yulduz': 'Kosmosdagi yorug\'lik manbai. Minglab yillardan beri porlaydi.',
            'Hayvon': 'Tirik organizm. O\'simliklar va boshqa hayvonlar bilan ovqatlanadi.',
            'O\'simlik': 'Yashil o\'simlik. Quyosh energiyasini o\'zlashtiradi.',
            'Odam': 'Eng aqlli mavjudot. Dunyoni o\'zgartira oladi.',
            'Daraxt': 'Katta o\'simlik. Meva beradi va kislorod ishlab chiqaradi.',
            'Tosh': 'Qattiq modda. Bino qurishda ishlatiladi.',
            'Temir': 'Metal. Mashinalar va asboblar yasashda ishlatiladi.',
            'Oltin': 'Qimmatbaho metal. Hashamat va boylik ramzi.',
        };
        
        const desc = descriptions[elementName] || `${elementName} - alkimyoya xos element.`;
        const rarityColors = {
            'common': '#b2bec3', 'uncommon': '#00b894', 'rare': '#0984e3',
            'epic': '#6c5ce7', 'legendary': '#fdcb6e', 'mythic': '#e84393'
        };
        const rarityNames = {
            'common': 'Oddiy', 'uncommon': 'Nodir', 'rare': 'Kamdan-kam',
            'epic': 'Epik', 'legendary': 'Afsonaviy', 'mythic': 'Mifologik'
        };
        
        content.innerHTML = `
            <div class="encyclopedia-header">
                <div class="encyclopedia-emoji ${isRare ? `rarity-${isRare.rarity}` : ''}">${emoji}</div>
                <h2 class="encyclopedia-name">${elementName}</h2>
                ${isRare ? `<span class="encyclopedia-rarity" style="background: ${rarityColors[isRare.rarity]}">${rarityNames[isRare.rarity]}</span>` : '<span class="encyclopedia-rarity" style="background: #b2bec3">Oddiy</span>'}
            </div>
            <div class="encyclopedia-desc">${desc}</div>
            <div class="encyclopedia-stats">
                <div class="encyclopedia-stat">
                    <span class="encyclopedia-stat-label">Kashf etilgan:</span>
                    <span class="encyclopedia-stat-value">${discovered ? '✅ Ha' : '❌ Yo\'q'}</span>
                </div>
                ${discovered ? `<div class="encyclopedia-stat">
                    <span class="encyclopedia-stat-label">Kashf etilgan sana:</span>
                    <span class="encyclopedia-stat-value">${new Date(discoveredAt).toLocaleDateString('uz-UZ')}</span>
                </div>` : ''}
                ${isRare ? `<div class="encyclopedia-stat">
                    <span class="encyclopedia-stat-label">Kamdan-kamlik:</span>
                    <span class="encyclopedia-stat-value">${(isRare.chance * 100).toFixed(1)}%</span>
                </div>` : ''}
            </div>
            <div class="encyclopedia-section">
                <h3>📦 Qanday yasaladi (${madeFrom.length})</h3>
                <div class="encyclopedia-combos">
                    ${madeFrom.length > 0 ? madeFrom.map(c => `
                        <div class="encyclopedia-combo">
                            <span>${c.element1}</span> + <span>${c.element2}</span>
                        </div>
                    `).join('') : '<div class="encyclopedia-empty">Hali yasalanmagan</div>'}
                </div>
            </div>
            <div class="encyclopedia-section">
                <h3>🔨 Nima yasash mumkin (${canMake.length})</h3>
                <div class="encyclopedia-combos">
                    ${canMake.length > 0 ? canMake.map(c => `
                        <div class="encyclopedia-combo">
                            <span>${c.element1}</span> + <span>${c.element2}</span>
                        </div>
                    `).join('') : '<div class="encyclopedia-empty">Hali yasalmagan</div>'}
                </div>
            </div>
            <button class="encyclopedia-close-btn" onclick="window.features.closeEncyclopedia()">Yopish</button>
        `;
        modal.classList.add('show');
    }
    
    isElementDiscovered(elementName) {
        const discovered = JSON.parse(localStorage.getItem('discoveredElements') || '[]');
        return discovered.includes(elementName);
    }
    
    closeEncyclopedia() {
        const modal = document.getElementById('encyclopedia-modal');
        if (modal) modal.classList.remove('show');
    }
    
    // ========== RARITY CHECK ==========
    checkRarity(elementName) {
        const rare = this.rareElements[elementName];
        if (!rare) return null;
        
        if (Math.random() < rare.chance) {
            this.addXP(rare.xp);
            return rare;
        }
        return null;
    }
    
    // ========== EVENT LISTENERS ==========
    setupEventListeners() {
        // Boss spawn timer
        setInterval(() => {
            if (!this.activeBoss && Math.random() < 0.3) {
                this.spawnBoss();
            }
        }, 120000);
    }
}

// Init
window.addEventListener('DOMContentLoaded', () => {
    window.features = new FeaturesManager();
});
