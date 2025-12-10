from flask import Flask
import os
from email.message import EmailMessage
import ssl
import smtplib
import random

app = Flask(__name__)

# password resset - send code
my_gmail = 'futureana735@gmail.com'
my_password = os.environ.get('Gmail_password')
receiver = 'puturidzeana0210@gmail.com'

subject = "PointSell"
body ="""
    Test is working
"""

em = EmailMessage()
em['From'] = my_gmail
em['To'] = receiver
em['Subject'] = subject
em.set_content(body)

context = ssl.create_default_context()

# with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as smtp:
#     smtp.login(my_gmail, my_password)
#     smtp.sendmail(my_gmail, receiver, em.as_string())


@app.route('/')
def home():
    return 'You are Home page'

@app.route('/members')
def members():
    return {'members': ['member1', 'member2']}

if __name__ == '__main__':
    app.run(debug=True)