from flask import Flask, render_template, jsonify, request

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


@app.route('/works/linkedlist')
def linkedlist():
    return render_template('linkedlist.html')


@app.route('/works/area/circle')
def circle():
    return render_template('circle.html')


@app.route('/works/area/triangle')
def triangle():
    return render_template('triangle.html')


# ---------- Infix to Postfix ----------
def prec(c):
    if c == '^':
        return 3
    elif c == '/' or c == '*':
        return 2
    elif c == '+' or c == '-':
        return 1
    else:
        return -1


def isRightAssociative(c):
    return c == '^'


def infixToPostfixSteps(s):
    """Same algorithm as before, but it also records every step for the visualization."""
    st = []
    res = []
    steps = []

    def snap(pos, action):
        steps.append({"pos": pos, "action": action,
                      "stack": st[:], "output": res[:]})

    snap(-1, "Start. The stack and the output are both empty.")

    pos = -1
    for c in s:
        if c.isspace():
            continue
        pos += 1

        # If operand, add to result
        if c.isascii() and c.isalnum():
            res.append(c)
            snap(pos, "Operand '" + c + "': add it straight to the output.")

        # If '(', push to stack
        elif c == '(':
            st.append('(')
            snap(pos, "'(' : push it onto the stack.")

        # If ')', pop until '('
        elif c == ')':
            popped = []
            while st and st[-1] != '(':
                popped.append(st[-1])
                res.append(st.pop())
            if not st:
                raise ValueError("Unbalanced parentheses: extra ')'.")
            st.pop()
            if popped:
                text = "')' : pop " + ", ".join("'" + x + "'" for x in popped) + \
                       " to the output until '(' is found, then discard '('."
            else:
                text = "')' : nothing to pop, discard the matching '('."
            snap(pos, text)

        # If operator
        elif c in '+-*/^':
            popped = []
            while st and st[-1] != '(' and \
                    (prec(st[-1]) > prec(c) or
                     (prec(st[-1]) == prec(c) and not isRightAssociative(c))):
                popped.append(st[-1])
                res.append(st.pop())
            st.append(c)
            if popped:
                text = ("Operator '" + c + "': pop " +
                        ", ".join("'" + x + "'" for x in popped) +
                        " to the output (higher or equal precedence), then push '" + c + "'.")
            else:
                text = "Operator '" + c + "': push it onto the stack."
            snap(pos, text)

        else:
            raise ValueError("Invalid character: " + c)

    # Pop remaining operators
    while st:
        top = st.pop()
        if top == '(':
            raise ValueError("Unbalanced parentheses: missing ')'.")
        res.append(top)
        snap(-1, "End of input: pop '" + top + "' from the stack to the output.")

    snap(-1, "Done. The output is the postfix expression.")

    return ''.join(res), steps


def infixToPostfix(s):
    return infixToPostfixSteps(s)[0]


@app.route('/works/infix-to-postfix')
def infixtopostfix():
    return render_template('infixtopostfix.html')


@app.route('/works/infix-to-postfix/convert', methods=['POST'])
def convert_infix():
    data = request.get_json(silent=True) or {}
    try:
        postfix, steps = infixToPostfixSteps(data.get('infix', ''))
        return jsonify(postfix=postfix, steps=steps)
    except ValueError as e:
        return jsonify(error=str(e)), 400


@app.route('/profile')
def profile():
    return render_template('profile.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


if __name__ == "__main__":
    app.run(debug=True)
