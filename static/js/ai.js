// ============================================
// ALKIMIYA UZ - AI YORDAMCHI (SQL + TUGMALAR)
// ============================================

class AIAssistant {
    constructor() {
        this.elements = [];
        this.combinations = [];
        this.currentCategory = null;
        this.currentPage = 0;
        this.perPage = 15;
        this.init();
    }

    async init() {
        await this.loadGameData();
        this.createChatUI();
        this.addWelcomeMessage();
    }

    async loadGameData() {
        try {
            var elRes = await fetch('/api/elements');
            this.elements = await elRes.json();
            var comboRes = await fetch('/api/combinations');
            this.combinations = await comboRes.json();
        } catch (e) {
            console.log('AI: Bazadan ma\'lumot olishda xatolik');
        }
    }

    createChatUI() {
        var chatHTML = '<div class="ai-chat-toggle" id="ai-chat-toggle">' +
            '<span class="ai-chat-icon">🤖</span>' +
            '<span class="ai-chat-badge" id="ai-unread-badge" style="display:none">1</span>' +
            '</div>' +
            '<div class="ai-chat-window" id="ai-chat-window">' +
            '<div class="ai-chat-header">' +
            '<div class="ai-header-info">' +
            '<span class="ai-header-icon">🤖</span>' +
            '<div><h3>Alkimiya AI</h3><span class="ai-status">SQL Bazadan ishlaydi</span></div>' +
            '</div>' +
            '<button class="ai-close-btn" id="ai-close-btn">&times;</button>' +
            '</div>' +
            '<div class="ai-chat-messages" id="ai-chat-messages"></div>' +
            '<div class="ai-chat-buttons" id="ai-chat-buttons">' +
            '<div class="ai-btn-row">' +
            '<button class="ai-btn" onclick="window.ai.showAllElements()">&#128218; Elementlar</button>' +
            '<button class="ai-btn" onclick="window.ai.showAllCombos()">&#128260; Kombinatsiyalar</button>' +
            '</div>' +
            '<div class="ai-btn-row">' +
            '<button class="ai-btn" onclick="window.ai.showHint()">&#128161; Maslahat</button>' +
            '<button class="ai-btn" onclick="window.ai.showStats()">&#128200; Statistika</button>' +
            '</div>' +
            '<div class="ai-btn-row">' +
            '<button class="ai-btn" onclick="window.ai.showCategories()">&#128193; Kategoriyalar</button>' +
            '<button class="ai-btn" onclick="window.ai.showRandom()">&#127922; Tasodifiy</button>' +
            '</div>' +
            '<div class="ai-btn-row">' +
            '<button class="ai-btn" onclick="window.ai.showBaseElements()">&#127758; Asosiy</button>' +
            '<button class="ai-btn" onclick="window.ai.showTips()">&#128161; Maslahatlar</button>' +
            '</div>' +
            '<div class="ai-btn-row">' +
            '<button class="ai-btn accent" onclick="window.ai.showSearch()">&#128270; Qidirish</button>' +
            '<button class="ai-btn accent" onclick="window.ai.showAbout()">&#9432; O\'yin haqida</button>' +
            '</div>' +
            '</div>' +
            '</div>';
        document.body.insertAdjacentHTML('beforeend', chatHTML);

        var self = this;
        document.getElementById('ai-chat-toggle').addEventListener('click', function() {
            var w = document.getElementById('ai-chat-window');
            w.classList.toggle('open');
            document.getElementById('ai-unread-badge').style.display = 'none';
        });
        document.getElementById('ai-close-btn').addEventListener('click', function() {
            document.getElementById('ai-chat-window').classList.remove('open');
        });
    }

    addWelcomeMessage() {
        var elCount = this.elements.length;
        var comboCount = this.combinations.length;
        var baseEls = this.elements.filter(function(e) { return e.is_base; });
        var baseNames = baseEls.map(function(e) { return e.emoji + ' ' + e.name_uz; }).join(', ');

        this.addBotMessage(
            "Salom! Men Alkimiya AI yordamchiman.\n\n" +
            "Bazada: " + elCount + " ta element, " + comboCount + " ta kombinatsiya\n" +
            "Asosiy: " + baseNames + "\n\n" +
            "Quyidagi tugmalardan birini bosing:"
        );
    }

    // ========== TUGMA FUNSIYALARI ==========

    showAllElements() {
        this.currentPage = 0;
        this.currentCategory = null;
        this.renderElementList();
    }

    renderElementList() {
        var self = this;
        var filtered = this.currentCategory ?
            this.elements.filter(function(e) { return e.category === self.currentCategory; }) :
            this.elements;

        var start = this.currentPage * this.perPage;
        var pageItems = filtered.slice(start, start + this.perPage);
        var totalPages = Math.ceil(filtered.length / this.perPage);

        var discovered = window.game ? window.game.discovered : new Set();
        var r = "BARCHA ELEMENTLAR (" + filtered.length + " ta)\n";
        if (this.currentCategory) r = this.currentCategory.toUpperCase() + " (" + filtered.length + " ta)\n";
        r += "Sahifa: " + (this.currentPage + 1) + "/" + totalPages + "\n\n";

        pageItems.forEach(function(e) {
            var disc = discovered.has(e.id);
            r += e.emoji + " " + e.name_uz + (disc ? " ✓" : " ?") + "\n";
            r += "   " + e.description + "\n";
            r += "   Kategoriya: " + e.category + "\n\n";
        });

        if (totalPages > 1) {
            r += "---\n";
            if (this.currentPage > 0) r += "[Oldingi] ";
            if (this.currentPage < totalPages - 1) r += "[Keyingi]";
        }

        this.addBotMessage(r);
        this.addButtonRow([
            this.currentPage > 0 ? { text: "◀ Oldingi", action: "window.ai.prevPage()" } : null,
            this.currentPage < totalPages - 1 ? { text: "Keyingi ▶", action: "window.ai.nextPage()" } : null,
            { text: "◀ Orqaga", action: "window.ai.showMenu()" }
        ].filter(Boolean));
    }

    prevPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.renderElementList();
        }
    }

    nextPage() {
        var filtered = this.currentCategory ?
            this.elements.filter(function(e) { return e.category === this.currentCategory; }.bind(this)) :
            this.elements;
        var totalPages = Math.ceil(filtered.length / this.perPage);
        if (this.currentPage < totalPages - 1) {
            this.currentPage++;
            this.renderElementList();
        }
    }

    showAllCombos() {
        var discovered = window.game ? window.game.discovered : new Set();
        var combos = this.combinations;
        var r = "BARCHA KOMBINATSIYALAR (" + combos.length + " ta)\n\n";

        combos.slice(0, 30).forEach(function(c, i) {
            r += (i+1) + ". " + c.element1.name_uz + " + " + c.element2.name_uz + " = " + c.result.name_uz + "\n";
        });
        if (combos.length > 30) r += "\n... va " + (combos.length - 30) + " ta kombinatsiya yana bor";

        this.addBotMessage(r);
        this.addButtonRow([
            { text: "◀ Orqaga", action: "window.ai.showMenu()" }
        ]);
    }

    showHint() {
        var hintLimit = parseInt(localStorage.getItem('hintLimit') || '0');
        var hintReset = parseInt(localStorage.getItem('hintReset') || '0');
        var now = Date.now();

        if (hintReset > now) {
            var remaining = Math.ceil((hintReset - now) / 3600000);
            this.addBotMessage("Maslahat limiti tugadi!\nQolgan vaqt: ~" + remaining + " soat\n\nKutib turing yoki boshqa tugmalarni sinab ko'ring.");
            this.addButtonRow([{ text: "◀ Orqaga", action: "window.ai.showMenu()" }]);
            return;
        }

        if (hintLimit >= 10) {
            var resetTime = now + 4 * 3600000;
            localStorage.setItem('hintReset', resetTime.toString());
            localStorage.setItem('hintLimit', '0');
            this.addBotMessage("10 ta maslahat ishlatildi!\n4 soat kutish kerak.");
            this.addButtonRow([{ text: "◀ Orqaga", action: "window.ai.showMenu()" }]);
            return;
        }

        var discovered = window.game ? window.game.discovered : new Set();
        var undiscovered = this.combinations.filter(function(c) {
            return discovered.has(c.element1_id) && discovered.has(c.element2_id) && !discovered.has(c.result_id);
        });

        if (undiscovered.length > 0) {
            var h = undiscovered[0];
            hintLimit++;
            localStorage.setItem('hintLimit', hintLimit.toString());
            this.addBotMessage("Maslahat " + hintLimit + "/10:\n\n" +
                h.element1.emoji + " " + h.element1.name_uz + " + " +
                h.element2.emoji + " " + h.element2.name_uz + " = ?\n\nSinab ko'ring!");
        } else {
            this.addBotMessage("Barcha ochiq kombinatsiyalarni topdingiz!");
        }
        this.addButtonRow([{ text: "◀ Orqaga", action: "window.ai.showMenu()" }]);
    }

    showStats() {
        var discovered = window.game ? window.game.discovered : new Set();
        var discCount = 0;
        discovered.forEach(function() { discCount++; });

        var cats = {};
        this.elements.forEach(function(e) {
            if (!cats[e.category]) cats[e.category] = { total: 0, disc: 0 };
            cats[e.category].total++;
            if (discovered.has(e.id)) cats[e.category].disc++;
        });

        var r = "STATISTIKA\n\n";
        r += "Jami elementlar: " + this.elements.length + "\n";
        r += "Jami kombinatsiyalar: " + this.combinations.length + "\n";
        r += "Kashf etilgan: " + discCount + "\n";
        r += "Qolgan: " + (this.elements.length - discCount) + "\n";
        r += "Progress: " + Math.round(discCount / this.elements.length * 100) + "%\n\n";
        r += "Kategoriyalar:\n";
        for (var cat in cats) {
            r += cat + ": " + cats[cat].disc + "/" + cats[cat].total + "\n";
        }

        this.addBotMessage(r);
        this.addButtonRow([{ text: "◀ Orqaga", action: "window.ai.showMenu()" }]);
    }

    showCategories() {
        var cats = {};
        this.elements.forEach(function(e) {
            if (!cats[e.category]) cats[e.category] = 0;
            cats[e.category]++;
        });

        var r = "KATEGORIYALAR\n\n";
        for (var cat in cats) {
            r += cat + " (" + cats[cat] + " ta)\n";
        }

        this.addBotMessage(r);
        var self = this;
        var buttons = Object.keys(cats).map(function(cat) {
            return { text: cat, action: "window.ai.showCategoryElements('" + cat + "')" };
        });
        buttons.push({ text: "◀ Orqaga", action: "window.ai.showMenu()" });
        this.addButtonRow(buttons.slice(0, 6));
    }

    showCategoryElements(cat) {
        this.currentCategory = cat;
        this.currentPage = 0;
        this.renderElementList();
    }

    showRandom() {
        var el = this.elements[Math.floor(Math.random() * this.elements.length)];
        var combos = this.combinations.filter(function(c) { return c.result_id === el.id; });
        var canMake = this.combinations.filter(function(c) { return c.element1_id === el.id || c.element2_id === el.id; });

        var r = el.emoji + " " + el.name_uz + "\n\n";
        r += "Tavsif: " + el.description + "\n";
        r += "Kategoriya: " + el.category + "\n";
        if (combos.length > 0) {
            r += "\nYaratish: " + combos[0].element1.name_uz + " + " + combos[0].element2.name_uz;
        }
        if (canMake.length > 0) {
            r += "\n\nBilan yaratilishi:\n";
            canMake.slice(0, 5).forEach(function(c) {
                var other = c.element1_id === el.id ? c.element2 : c.element1;
                r += "  + " + other.name_uz + " = " + c.result.name_uz + "\n";
            });
        }

        this.addBotMessage(r);
        this.addButtonRow([
            { text: "🎲 Yana", action: "window.ai.showRandom()" },
            { text: "◀ Orqaga", action: "window.ai.showMenu()" }
        ]);
    }

    showBaseElements() {
        var bases = this.elements.filter(function(e) { return e.is_base; });
        var r = "ASOSIY ELEMENTLAR\n\n";
        bases.forEach(function(e) {
            r += e.emoji + " " + e.name_uz + "\n";
            r += "   " + e.description + "\n\n";
        });
        r += "Shularni birlashtirib boshlang!";

        this.addBotMessage(r);
        this.addButtonRow([{ text: "◀ Orqaga", action: "window.ai.showMenu()" }]);
    }

    showTips() {
        var tips = [
            "4 ta asosiy element: Havo, Yer, Olov, Suv. Shulardan boshlang!",
            "Havo + Suv = Bulut. Bulut + Suv = Yomg'ir.",
            "Yer + Olov = Lava. Lava + Suv = Tosh.",
            "Tuproq + Suv = O'simlik. O'simlik vaqt o'tishi bilan Daraxt bo'ladi.",
            "Jon yaratish uchun: Suv + Energiya = Jon",
            "Inson yaratish uchun: Jon + Loy = Inson",
            "Hayvon yaratish uchun: Jon + Qum = Hayvon",
            "Non yaratish: Bug'doy + Suv = Xamir. Xamir + Olov = Non",
            "Turli kategoriyalardagi elementlarni sinab ko'ring!",
            "Bir xil elementlarni ham birlashtirib ko'ring!"
        ];
        var tip = tips[Math.floor(Math.random() * tips.length)];
        this.addBotMessage("Maslahat:\n\n" + tip);
        this.addButtonRow([
            { text: "💡 Yana", action: "window.ai.showTips()" },
            { text: "◀ Orqaga", action: "window.ai.showMenu()" }
        ]);
    }

    showSearch() {
        this.addBotMessage("Qidirish: Element nomini yozing:");
        var mc = document.getElementById('ai-chat-messages');
        mc.insertAdjacentHTML('beforeend',
            '<div class="ai-search-box"><input type="text" id="ai-search-input" placeholder="Element nomi..."><button onclick="window.ai.doSearch()">Qidirish</button></div>');
        mc.scrollTop = mc.scrollHeight;
        setTimeout(function() {
            var inp = document.getElementById('ai-search-input');
            if (inp) {
                inp.focus();
                inp.addEventListener('keypress', function(e) { if (e.key === 'Enter') window.ai.doSearch(); });
            }
        }, 100);
    }

    doSearch() {
        var input = document.getElementById('ai-search-input');
        if (!input) return;
        var query = input.value.trim().toLowerCase();
        if (!query) return;

        var results = this.elements.filter(function(e) {
            return e.name_uz.toLowerCase().includes(query) ||
                   e.name_en.toLowerCase().includes(query) ||
                   e.description.toLowerCase().includes(query) ||
                   e.category.toLowerCase().includes(query);
        });

        var r = "QIDIRISH NATIJALARI: \"" + query + "\"\n\n";
        if (results.length === 0) {
            r += "Hech narsa topilmadi";
        } else {
            r += results.length + " ta topildi:\n\n";
            results.slice(0, 15).forEach(function(e) {
                r += e.emoji + " " + e.name_uz + " (" + e.category + ")\n";
                r += "   " + e.description + "\n\n";
            });
        }

        this.addBotMessage(r);
        var sb = document.querySelector('.ai-search-box');
        if (sb) sb.remove();
        this.addButtonRow([
            { text: "🔍 Yana qidirish", action: "window.ai.showSearch()" },
            { text: "◀ Orqaga", action: "window.ai.showMenu()" }
        ]);
    }

    showAbout() {
        var discCount = 0;
        if (window.game && window.game.discovered) {
            window.game.discovered.forEach(function() { discCount++; });
        }
        var r = "ALKIMIYA UZ - O'YIN HAQIDA\n\n";
        r += "Bu o'yin Little Alchemy 2 dan ilhomlangan.\n";
        r += "Elementlarni birlashtirib olamni yarating!\n\n";
        r += "Ma'lumotlar: SQLite bazasidan\n";
        r += "Elementlar: " + this.elements.length + " ta\n";
        r += "Kombinatsiyalar: " + this.combinations.length + " ta\n";
        r += "Kashf etilgan: " + discCount + " ta\n\n";
        r += "Xususiyatlari:\n";
        r += "- Drag & Drop\n";
        r += "- Sound effektlari\n";
        r += "- Animatsiyalar\n";
        r += "- Boss urushlari\n";
        r += "- Tezlik mashqi\n";
        r += "- Kundalik sovg'alar\n";
        r += "- Topshiriqlar\n";
        r += "- AI yordamchi\n";

        this.addBotMessage(r);
        this.addButtonRow([{ text: "◀ Orqaga", action: "window.ai.showMenu()" }]);
    }

    showMenu() {
        this.addBotMessage("Asosiy menyu:");
    }

    // ========== YORDAMCHI ==========

    addBotMessage(text) {
        var mc = document.getElementById('ai-chat-messages');
        mc.insertAdjacentHTML('beforeend',
            '<div class="ai-message bot-message">' +
            '<div class="ai-message-avatar">🤖</div>' +
            '<div class="ai-message-content">' + text.replace(/\n/g, '<br>') + '</div>' +
            '</div>');
        mc.scrollTop = mc.scrollHeight;
        if (!document.getElementById('ai-chat-window').classList.contains('open')) {
            document.getElementById('ai-unread-badge').style.display = 'flex';
        }
    }

    addButtonRow(buttons) {
        var mc = document.getElementById('ai-chat-messages');
        var html = '<div class="ai-btn-group">';
        buttons.forEach(function(b) {
            html += '<button class="ai-msg-btn" onclick="' + b.action + '">' + b.text + '</button>';
        });
        html += '</div>';
        mc.insertAdjacentHTML('beforeend', html);
        mc.scrollTop = mc.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        window.ai = new AIAssistant();
    }, 1500);
});
