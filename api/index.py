import traceback
try:
    from app import app
except Exception as e:
    import flask
    app = flask.Flask(__name__)
    @app.route("/")
    @app.route("/<path:path>")
    def error(path=""):
        return f"<pre>{traceback.format_exc()}</pre>", 500