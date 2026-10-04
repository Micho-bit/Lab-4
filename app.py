from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)


@app.route('/')
def index():
    # Home: the welcome screen, then the Works page
    return render_template('index.html', welcome=True)


@app.route('/works')
def works():
    # Works page (list of programs), without the welcome screen
    return render_template('index.html', welcome=False)


# Each program has its own page, still part of the Works section
@app.route('/works/uppercase')
def uppercase():
    return render_template('uppercase.html')


@app.route('/works/lowercase')
def lowercase():
    return render_template('lowercase.html')


@app.route('/works/linkedlist')
def linkedlist():
    return render_template('linkedlist.html')


@app.route('/works/area/circle')
def circle():
    return render_template('circle.html')


@app.route('/works/area/triangle')
def triangle():
    return render_template('triangle.html')


@app.route('/profile')
def profile():
    return render_template('profile.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


if __name__ == "__main__":
    app.run(debug=True)
