// ============================================
// ALKIMIYA UZ - DRAG & DROP FUNKSIYALARI
// ============================================

class DragDropManager {
    constructor() {
        this.ghostElement = null;
        this.sourceElement = null;
        this.isDragging = false;
        this.touchStartTime = 0;
        this.touchStartPos = { x: 0, y: 0 };
        this.hasMoved = false;
        
        this.init();
    }

    init() {
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleTouchStart(e) {
        var card = e.target.closest('.element-card');
        if (!card) return;

        this.touchStartTime = Date.now();
        this.touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        this.hasMoved = false;
        this.sourceElement = card;

        var holdTimer = setTimeout(function() {
            if (!this.hasMoved && this.sourceElement) {
                this.isDragging = true;
                var elementId = parseInt(card.dataset.id);
                var element = window.game ? window.game.elements.find(function(el) { return el.id === elementId; }) : null;
                
                if (element) {
                    this.createGhost(element.emoji);
                    this.updateGhostPosition(e.touches[0]);
                    if (navigator.vibrate) navigator.vibrate(30);
                }
            }
        }.bind(this), 200);

        this.holdTimer = holdTimer;
    }

    handleTouchMove(e) {
        if (!this.sourceElement) return;
        
        var dx = e.touches[0].clientX - this.touchStartPos.x;
        var dy = e.touches[0].clientY - this.touchStartPos.y;
        
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
            this.hasMoved = true;
            if (this.holdTimer) clearTimeout(this.holdTimer);
        }
        
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.updateGhostPosition(e.touches[0]);
        
        var touch = e.touches[0];
        var slot1 = document.getElementById('slot1');
        var slot2 = document.getElementById('slot2');
        
        this.checkSlotHover(slot1, touch);
        this.checkSlotHover(slot2, touch);
    }

    handleTouchEnd(e) {
        if (this.holdTimer) clearTimeout(this.holdTimer);
        
        var touchDuration = Date.now() - this.touchStartTime;
        
        if (this.isDragging && this.sourceElement) {
            var elementId = parseInt(this.sourceElement.dataset.id);
            var element = window.game ? window.game.elements.find(function(el) { return el.id === elementId; }) : null;
            
            if (element) {
                var slot1 = document.getElementById('slot1');
                var slot2 = document.getElementById('slot2');
                
                if (this.isOverSlot(slot1)) {
                    window.game.setSlot(1, element);
                } else if (this.isOverSlot(slot2)) {
                    window.game.setSlot(2, element);
                }
            }
        } else if (!this.hasMoved && touchDuration < 200 && this.sourceElement) {
            var elementId = parseInt(this.sourceElement.dataset.id);
            var element = window.game ? window.game.elements.find(function(el) { return el.id === elementId; }) : null;
            
            if (element) {
                if (!window.game.slot1) {
                    window.game.setSlot(1, element);
                } else if (!window.game.slot2) {
                    window.game.setSlot(2, element);
                }
            }
        }
        
        this.isDragging = false;
        this.sourceElement = null;
        this.removeGhost();
        
        var slots = document.querySelectorAll('.combine-slot');
        slots.forEach(function(s) { s.classList.remove('drag-over'); });
    }

    createGhost(emoji) {
        this.ghostElement = document.createElement('div');
        this.ghostElement.className = 'drag-ghost';
        this.ghostElement.textContent = emoji;
        document.body.appendChild(this.ghostElement);
    }

    updateGhostPosition(touch) {
        if (!this.ghostElement) return;
        this.ghostElement.style.left = touch.clientX + 'px';
        this.ghostElement.style.top = touch.clientY + 'px';
    }

    removeGhost() {
        if (this.ghostElement) {
            this.ghostElement.remove();
            this.ghostElement = null;
        }
    }

    checkSlotHover(slot, touch) {
        if (!slot) return;
        
        var rect = slot.getBoundingClientRect();
        var padding = 20;
        var isOver = touch.clientX >= rect.left - padding && 
                    touch.clientX <= rect.right + padding &&
                    touch.clientY >= rect.top - padding && 
                    touch.clientY <= rect.bottom + padding;
        
        if (isOver) {
            slot.classList.add('drag-over');
        } else {
            slot.classList.remove('drag-over');
        }
    }

    isOverSlot(slot) {
        if (!slot) return false;
        return slot.classList.contains('drag-over');
    }
}

class DoubleClickHandler {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('dblclick', function(e) {
            var card = e.target.closest('.element-card');
            if (!card) return;

            var elementId = parseInt(card.dataset.id);
            var element = window.game ? window.game.elements.find(function(el) { return el.id === elementId; }) : null;
            
            if (element) {
                if (!window.game.slot1) {
                    window.game.setSlot(1, element);
                } else if (!window.game.slot2) {
                    window.game.setSlot(2, element);
                }
            }
        });
    }
}

class WorkspaceDragHandler {
    constructor() {
        this.draggedElement = null;
        this.offset = { x: 0, y: 0 };
        this.init();
    }

    init() {
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleMouseDown(e) {
        var workspaceEl = e.target.closest('.workspace-element');
        if (!workspaceEl) return;

        this.draggedElement = workspaceEl;
        var rect = workspaceEl.getBoundingClientRect();
        this.offset.x = e.clientX - rect.left;
        this.offset.y = e.clientY - rect.top;
        workspaceEl.style.zIndex = '100';
    }

    handleMouseMove(e) {
        if (!this.draggedElement) return;

        var workspace = document.getElementById('workspace');
        if (!workspace) return;

        var workspaceRect = workspace.getBoundingClientRect();
        
        var x = e.clientX - workspaceRect.left - this.offset.x;
        var y = e.clientY - workspaceRect.top - this.offset.y;
        
        x = Math.max(0, Math.min(x, workspaceRect.width - this.draggedElement.offsetWidth));
        y = Math.max(0, Math.min(y, workspaceRect.height - this.draggedElement.offsetHeight));
        
        this.draggedElement.style.left = x + 'px';
        this.draggedElement.style.top = y + 'px';
    }

    handleMouseUp(e) {
        if (!this.draggedElement) return;

        var slot1 = document.getElementById('slot1');
        var slot2 = document.getElementById('slot2');
        
        if (this.isOverElement(this.draggedElement, slot1)) {
            var elementId = parseInt(this.draggedElement.dataset.id);
            var element = window.game ? window.game.elements.find(function(el) { return el.id === elementId; }) : null;
            if (element) window.game.setSlot(1, element);
            this.draggedElement.remove();
        } else if (this.isOverElement(this.draggedElement, slot2)) {
            var elementId = parseInt(this.draggedElement.dataset.id);
            var element = window.game ? window.game.elements.find(function(el) { return el.id === elementId; }) : null;
            if (element) window.game.setSlot(2, element);
            this.draggedElement.remove();
        } else {
            this.draggedElement.style.zIndex = '5';
        }

        this.draggedElement = null;
    }

    handleTouchStart(e) {
        var workspaceEl = e.target.closest('.workspace-element');
        if (!workspaceEl) return;

        this.draggedElement = workspaceEl;
        var rect = workspaceEl.getBoundingClientRect();
        this.offset.x = e.touches[0].clientX - rect.left;
        this.offset.y = e.touches[0].clientY - rect.top;
        workspaceEl.style.zIndex = '100';
    }

    handleTouchMove(e) {
        if (!this.draggedElement) return;
        e.preventDefault();

        var workspace = document.getElementById('workspace');
        if (!workspace) return;

        var workspaceRect = workspace.getBoundingClientRect();
        
        var x = e.touches[0].clientX - workspaceRect.left - this.offset.x;
        var y = e.touches[0].clientY - workspaceRect.top - this.offset.y;
        
        x = Math.max(0, Math.min(x, workspaceRect.width - this.draggedElement.offsetWidth));
        y = Math.max(0, Math.min(y, workspaceRect.height - this.draggedElement.offsetHeight));
        
        this.draggedElement.style.left = x + 'px';
        this.draggedElement.style.top = y + 'px';
    }

    handleTouchEnd(e) {
        this.handleMouseUp(e);
    }

    isOverElement(moving, target) {
        if (!moving || !target) return false;
        
        var movingRect = moving.getBoundingClientRect();
        var targetRect = target.getBoundingClientRect();
        
        return !(movingRect.right < targetRect.left || 
                movingRect.left > targetRect.right || 
                movingRect.bottom < targetRect.top || 
                movingRect.top > targetRect.bottom);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new DragDropManager();
    new DoubleClickHandler();
    new WorkspaceDragHandler();
});
