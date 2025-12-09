from flask import Flask

# starter
app = Flask(__name__)

@app.route('/')
def home():
    return 'You are Home page'

@app.route('/members')
def members():
    return {'members': ['member1', 'member2']}

if __name__ == '__main__':
    app.run(debug=True)