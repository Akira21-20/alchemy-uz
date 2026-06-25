from flask import Blueprint, jsonify, request
from models import db, Element, Combination, PlayerProgress
import uuid

api = Blueprint('api', __name__)


@api.route('/api/elements', methods=['GET'])
def get_elements():
    elements = Element.query.all()
    return jsonify([e.to_dict() for e in elements])


@api.route('/api/elements/<int:element_id>', methods=['GET'])
def get_element(element_id):
    element = Element.query.get_or_404(element_id)
    return jsonify(element.to_dict())


@api.route('/api/combinations', methods=['GET'])
def get_combinations():
    combos = Combination.query.all()
    return jsonify([c.to_dict() for c in combos])


@api.route('/api/combine', methods=['POST'])
def combine_elements():
    data = request.get_json()
    el1_id = data.get('element1_id')
    el2_id = data.get('element2_id')

    if not el1_id or not el2_id:
        return jsonify({'error': 'Ikki element kerak'}), 400

    if el1_id == el2_id:
        combo = Combination.query.filter(
            db.or_(
                db.and_(Combination.element1_id == el1_id, Combination.element2_id == el2_id),
            )
        ).first()
    else:
        combo = Combination.query.filter(
            db.or_(
                db.and_(Combination.element1_id == el1_id, Combination.element2_id == el2_id),
                db.and_(Combination.element1_id == el2_id, Combination.element2_id == el1_id),
            )
        ).first()

    if combo:
        return jsonify({
            'success': True,
            'result': combo.result.to_dict(),
            'is_new': False,
        })

    return jsonify({'success': False, 'message': 'Bu elementlar birlashmaydi'}), 200


@api.route('/api/progress', methods=['GET'])
def get_progress():
    session_id = request.args.get('session_id')
    if not session_id:
        session_id = str(uuid.uuid4())

    progress = PlayerProgress.query.filter_by(session_id=session_id).first()
    if not progress:
        progress = PlayerProgress(session_id=session_id)
        db.session.add(progress)

    base_elements = Element.query.filter_by(is_base=True).all()
    for el in base_elements:
        progress.add_discovered(el.id)

    db.session.commit()

    return jsonify(progress.to_dict())


@api.route('/api/progress/discover', methods=['POST'])
def discover_element():
    data = request.get_json()
    session_id = data.get('session_id')
    element_id = data.get('element_id')

    if not session_id or not element_id:
        return jsonify({'error': 'session_id va element_id kerak'}), 400

    progress = PlayerProgress.query.filter_by(session_id=session_id).first()
    if not progress:
        progress = PlayerProgress(session_id=session_id)
        db.session.add(progress)

    is_new = element_id not in progress.get_discovered()
    progress.add_discovered(element_id)
    db.session.commit()

    return jsonify({
        'is_new': is_new,
        'total_discovered': len(progress.get_discovered()),
    })


@api.route('/api/hint', methods=['GET'])
def get_hint():
    session_id = request.args.get('session_id')
    if not session_id:
        return jsonify({'error': 'session_id kerak'}), 400

    progress = PlayerProgress.query.filter_by(session_id=session_id).first()
    discovered = progress.get_discovered() if progress else []

    undiscovered_combos = Combination.query.filter(
        Combination.result_id.notin_(discovered),
        Combination.element1_id.in_(discovered),
        Combination.element2_id.in_(discovered),
    ).all()

    if undiscovered_combos:
        combo = undiscovered_combos[0]
        return jsonify({
            'hint': {
                'element1': combo.element1.to_dict(),
                'element2': combo.element2.to_dict(),
            }
        })

    return jsonify({'hint': None, 'message': 'Barcha kombinatsiyalar topildi!'})
