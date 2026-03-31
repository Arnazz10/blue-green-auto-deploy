const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const version = process.env.APP_VERSION || 'v1.0.0';
const color = process.env.APP_COLOR || 'blue';

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Blue-Green Deployment</title>
            <style>
                body {
                    background-color: ${color === 'blue' ? '#3498db' : '#2ecc71'};
                    color: white;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                }
                .container {
                    text-align: center;
                    padding: 2rem;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                h1 { font-size: 3rem; margin-bottom: 1rem; }
                p { font-size: 1.5rem; }
                .status { margin-top: 2rem; font-weight: bold; text-transform: uppercase; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Hello from ${color.toUpperCase()}!</h1>
                <p>Version: <strong>${version}</strong></p>
                <div class="status">Deployment: Blue-Green Strategy</div>
            </div>
        </body>
        </html>
    `);
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
