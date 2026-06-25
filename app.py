from flask import Flask, render_template
from flask_cors import CORS
from config import Config
from models import db, Element, Combination
from routes import api
import os


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    CORS(app)

    app.register_blueprint(api)

    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/game')
    def game():
        return render_template('game.html')

    with app.app_context():
        db.create_all()
        if Element.query.count() == 0:
            from seed_data import seed_database
            seed_database()

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=False, port=int(os.environ.get('PORT', 5000)))
