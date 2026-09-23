# TNCe Pickup System

Automatic QR pickup confirmation for finished orders.

## One-time setup
1. Open https://script.google.com/ and create a new Apps Script project.
2. Add two files named `Code.gs` and `index.html`.
3. Copy the contents of this repository's `Code.gs` and `index.html`.
4. Run `setup` once and authorize it.
5. Deploy → New deployment → Web app.
6. Execute as: Me. Who has access: Anyone.
7. Open the web-app URL. Create an order; the system generates a unique QR automatically.

The QR opens the customer pickup page. Customer taps **CONFIRM PICKUP**, which records the date/time in the automatically created Google Sheet.

Messenger destination: https://m.me/xxtian0587

Note: Meta/Messenger does not allow a normal QR link to silently send a message from a personal Messenger account. The system therefore records the pickup automatically and provides a one-tap Messenger button.
