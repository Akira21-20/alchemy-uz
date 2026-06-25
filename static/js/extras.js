// ============================================
// ALKIMIYA UZ - QOSHIMCHA FUNKSIYALAR V2
// ============================================

class ExtrasManager {
    constructor() {
        this.dailyGiftClaimed = localStorage.getItem('dailyGiftClaimed') || '';
        this.dailyGiftStreak = parseInt(localStorage.getItem('dailyGiftStreak') || '0');
        this.musicPlaying = false;
        this.musicCtx = null;
        this.quests = JSON.parse(localStorage.getItem('quests') || '[]');
        this.init();
    }

    init() {
        this.setupDailyGift();
        this.setupScreenshot();
        this.setupMusic();
        this.setupQuests();
    }

    // ========== KUNDALIK SOVG'A ==========
    setupDailyGift() {
        const today = new Date().toDateString();
        const giftBtn = document.getElementById('btn-daily-gift');
        if (giftBtn) {
            if (this.dailyGiftClaimed === today) {
                giftBtn.classList.add('claimed');
                giftBtn.innerHTML = '<span class="btn-icon">&#127873;</span><span class="btn-text">Bugun olindi &#10003;</span>';
            }
            giftBtn.addEventListener('click', () => this.claimDailyGift());
        }
    }

    claimDailyGift() {
        const today = new Date().toDateString();
        if (this.dailyGiftClaimed === today) return;

        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (this.dailyGiftClaimed === yesterday) {
            this.dailyGiftStreak++;
        } else {
            this.dailyGiftStreak = 1;
        }
        this.dailyGiftClaimed = today;
        localStorage.setItem('dailyGiftClaimed', today);
        localStorage.setItem('dailyGiftStreak', this.dailyGiftStreak);

        const gifts = [
            { type: 'xp', amount: 100 + this.dailyGiftStreak * 50, icon: '&#10024;', text: (100 + this.dailyGiftStreak * 50) + ' XP' },
            { type: 'hints', amount: 2, icon: '&#128161;', text: '2 ta maslahat' },
            { type: 'element', amount: 1, icon: '&#127775;', text: 'Tasodifiy element' },
        ];
        const gift = gifts[Math.floor(Math.random() * gifts.length)];
        if (gift.type === 'xp' && window.features) {
            window.features.addXP(gift.amount);
        }
        this.showGiftPopup(gift);
        const giftBtn = document.getElementById('btn-daily-gift');
        if (giftBtn) {
            giftBtn.classList.add('claimed');
            giftBtn.innerHTML = '<span class="btn-icon">&#127873;</span><span class="btn-text">Bugun olindi &#10003;</span>';
        }
    }

    showGiftPopup(gift) {
        const popup = document.createElement('div');
        popup.className = 'gift-popup';
        popup.innerHTML = '<div class="gift-popup-content">' +
            '<div class="gift-icon-big">' + gift.icon + '</div>' +
            '<h3>Kundalik Sovga!</h3>' +
            '<div class="gift-streak">' + this.dailyGiftStreak + ' kunlik streak!</div>' +
            '<div class="gift-amount">' + gift.text + '</div>' +
            '<button class="gift-close-btn" onclick="this.closest(\'.gift-popup\').remove()">Yaxshi!</button>' +
            '</div>';
        document.body.appendChild(popup);
        setTimeout(() => popup.classList.add('show'), 100);
        if (window.soundManager) window.soundManager.playCelebration();
        if (window.particles) {
            window.particles.confetti(window.innerWidth/2, window.innerHeight/2, 60);
        }
    }

    // ========== SCREENSHOT ==========
    setupScreenshot() {
        const btn = document.getElementById('btn-screenshot');
        if (btn) {
            btn.addEventListener('click', () => this.takeScreenshot());
        }
    }

    takeScreenshot() {
        if (window.soundManager) window.soundManager.playSlotFill();
        var notification = document.createElement('div');
        notification.className = 'screenshot-notification';
        notification.textContent = 'Screenshot saqlandi! (Demo)';
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 2000);
        if (window.particles) {
            window.particles.flash('rgba(255, 255, 255, 0.3)');
        }
    }

    // ========== FON MUSIQASI ==========
    setupMusic() {
        var btn = document.getElementById('btn-music');
        if (btn) {
            btn.addEventListener('click', () => this.toggleMusic());
        }
    }

    toggleMusic() {
        if (this.musicPlaying) {
            this.stopMusic();
        } else {
            this.playMusic();
        }
    }

    playMusic() {
        try {
            this.musicCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.musicPlaying = true;
            var btn = document.getElementById('btn-music');
            if (btn) btn.classList.add('playing');
            this.playMelody();
        } catch (e) {
            console.log('Audio not available');
        }
    }

    playMelody() {
        if (!this.musicPlaying || !this.musicCtx) return;
        var notes = [
            { f: 261.63, d: 0.5 }, { f: 293.66, d: 0.5 },
            { f: 329.63, d: 0.5 }, { f: 349.23, d: 0.5 },
            { f: 392.00, d: 0.5 }, { f: 440.00, d: 0.5 },
            { f: 493.88, d: 0.5 }, { f: 523.25, d: 1.0 },
            { f: 493.88, d: 0.5 }, { f: 440.00, d: 0.5 },
            { f: 392.00, d: 0.5 }, { f: 349.23, d: 0.5 },
            { f: 329.63, d: 0.5 }, { f: 293.66, d: 0.5 },
            { f: 261.63, d: 1.0 }
        ];
        var time = this.musicCtx.currentTime;
        var gainNode = this.musicCtx.createGain();
        gainNode.gain.value = 0.08;
        gainNode.connect(this.musicCtx.destination);
        var self = this;

        notes.forEach(function(note) {
            var osc = self.musicCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = note.f;
            var noteGain = self.musicCtx.createGain();
            noteGain.gain.setValueAtTime(0.3, time);
            noteGain.gain.exponentialRampToValueAtTime(0.01, time + note.d);
            osc.connect(noteGain);
            noteGain.connect(gainNode);
            osc.start(time);
            osc.stop(time + note.d);
            time += note.d;
        });

        var totalDur = notes.reduce(function(sum, n) { return sum + n.d; }, 0);
        setTimeout(function() {
            if (self.musicPlaying) self.playMelody();
        }, totalDur * 1000 + 1000);
    }

    stopMusic() {
        this.musicPlaying = false;
        if (this.musicCtx) {
            this.musicCtx.close();
            this.musicCtx = null;
        }
        var btn = document.getElementById('btn-music');
        if (btn) btn.classList.remove('playing');
    }

    // ========== TOPSHIRIQLAR ==========
    setupQuests() {
        this.generateQuests();
        this.updateQuestsDisplay();
    }

    generateQuests() {
        var today = new Date().toDateString();
        if (localStorage.getItem('questDate') === today && this.quests.length > 0) return;

        var allQuests = [
            { id: 'q1', text: '5 ta element kashf eting', target: 5, reward: 200, icon: '🔍' },
            { id: 'q2', text: '10 ta birlashtirish qiling', target: 10, reward: 150, icon: '🔄' },
            { id: 'q3', text: 'Tabiat elementini yarating', target: 1, reward: 100, icon: '🌿' },
            { id: 'q4', text: 'Ovqat elementini yarating', target: 1, reward: 100, icon: '🍕' },
            { id: 'q5', text: '3x combo ga erishing', target: 3, reward: 250, icon: '🔥' },
            { id: 'q6', text: 'Boss urushida g\'alaba qozoning', target: 1, reward: 500, icon: '⚔️' },
            { id: 'q7', text: 'Tezlik mashqida 8+ ball to\'plang', target: 8, reward: 300, icon: '⏱️' },
            { id: 'q8', text: 'Hayvon yarating', target: 1, reward: 150, icon: '🐾' },
            { id: 'q9', text: 'Inson yarating', target: 1, reward: 200, icon: '👤' },
            { id: 'q10', text: '15 ta element kashf eting', target: 15, reward: 400, icon: '⭐' }
        ];

        var shuffled = allQuests.sort(function() { return Math.random() - 0.5; });
        this.quests = shuffled.slice(0, 4).map(function(q) {
            return Object.assign({}, q, { progress: 0, completed: false, claimed: false });
        });
        localStorage.setItem('quests', JSON.stringify(this.quests));
        localStorage.setItem('questDate', today);
    }

    updateQuestProgress(questId, amount) {
        amount = amount || 1;
        var quest = this.quests.find(function(q) { return q.id === questId; });
        if (quest && !quest.completed) {
            quest.progress = Math.min(quest.progress + amount, quest.target);
            if (quest.progress >= quest.target) {
                quest.completed = true;
                this.showQuestComplete(quest);
            }
            localStorage.setItem('quests', JSON.stringify(this.quests));
            this.updateQuestsDisplay();
        }
    }

    claimQuestReward(index) {
        var quest = this.quests[index];
        if (quest && quest.completed && !quest.claimed) {
            quest.claimed = true;
            if (window.features) window.features.addXP(quest.reward);
            localStorage.setItem('quests', JSON.stringify(this.quests));
            this.updateQuestsDisplay();
            if (window.soundManager) window.soundManager.playCelebration();
        }
    }

    showQuestComplete(quest) {
        var popup = document.createElement('div');
        popup.className = 'quest-complete-popup';
        popup.innerHTML = '<div class="quest-complete-content">' +
            '<span class="quest-complete-icon">' + quest.icon + '</span>' +
            '<div>Topshiriq bajarildi!</div></div>';
        document.body.appendChild(popup);
        setTimeout(function() { popup.classList.add('show'); }, 100);
        setTimeout(function() {
            popup.classList.remove('show');
            setTimeout(function() { popup.remove(); }, 500);
        }, 2500);
    }

    updateQuestsDisplay() {
        var container = document.getElementById('quests-list');
        if (!container) return;
        var self = this;
        container.innerHTML = this.quests.map(function(q, i) {
            var cls = 'quest-item';
            if (q.completed) cls += ' completed';
            if (q.claimed) cls += ' claimed';
            var action = '';
            if (q.completed && !q.claimed) {
                action = '<button class="quest-claim-btn" onclick="window.extras.claimQuestReward(' + i + ')">&#127873;</button>';
            } else if (q.claimed) {
                action = '<span class="quest-claimed">&#10003;</span>';
            }
            return '<div class="' + cls + '">' +
                '<div class="quest-icon">' + q.icon + '</div>' +
                '<div class="quest-info">' +
                '<div class="quest-text">' + q.text + '</div>' +
                '<div class="quest-progress-bar"><div class="quest-progress-fill" style="width:' + (q.progress/q.target*100) + '%"></div></div>' +
                '<span class="quest-progress-text">' + q.progress + '/' + q.target + '</span>' +
                '</div>' + action + '</div>';
        }).join('');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        window.extras = new ExtrasManager();
    }, 800);
});
