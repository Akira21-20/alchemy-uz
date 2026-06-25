from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Element(db.Model):
    __tablename__ = 'elements'

    id = db.Column(db.Integer, primary_key=True)
    name_uz = db.Column(db.String(100), unique=True, nullable=False)
    name_en = db.Column(db.String(100), nullable=False)
    emoji = db.Column(db.String(10), nullable=False)
    description = db.Column(db.Text, default='')
    category = db.Column(db.String(50), default='umumiy')
    is_base = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name_uz': self.name_uz,
            'name_en': self.name_en,
            'emoji': self.emoji,
            'description': self.description,
            'category': self.category,
            'is_base': self.is_base,
        }


class Combination(db.Model):
    __tablename__ = 'combinations'

    id = db.Column(db.Integer, primary_key=True)
    element1_id = db.Column(db.Integer, db.ForeignKey('elements.id'), nullable=False)
    element2_id = db.Column(db.Integer, db.ForeignKey('elements.id'), nullable=False)
    result_id = db.Column(db.Integer, db.ForeignKey('elements.id'), nullable=False)

    element1 = db.relationship('Element', foreign_keys=[element1_id], backref='combos_as_e1')
    element2 = db.relationship('Element', foreign_keys=[element2_id], backref='combos_as_e2')
    result = db.relationship('Element', foreign_keys=[result_id], backref='combo_results')

    __table_args__ = (
        db.UniqueConstraint('element1_id', 'element2_id', name='unique_combo'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'element1': self.element1.to_dict(),
            'element2': self.element2.to_dict(),
            'result': self.result.to_dict(),
        }


class PlayerProgress(db.Model):
    __tablename__ = 'player_progress'

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100), unique=True, nullable=False)
    discovered_ids = db.Column(db.Text, default='')

    def get_discovered(self):
        if not self.discovered_ids:
            return []
        return [int(x) for x in self.discovered_ids.split(',') if x]

    def add_discovered(self, element_id):
        discovered = self.get_discovered()
        if element_id not in discovered:
            discovered.append(element_id)
            self.discovered_ids = ','.join(str(x) for x in discovered)

    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'discovered': self.get_discovered(),
            'total_discovered': len(self.get_discovered()),
        }
