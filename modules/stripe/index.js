const stripeController = require('./stripeController/stripeController');
const stripeValidator = require('./stripeValidator/stripeValidator');


app.post('/chargeFromStripe', stripeValidator.chargeFromStripe, stripeController.chargeFromStripe);
app.post('/registerUserToStripe', stripeValidator.registerUserToStripe, stripeController.registerUserToStripe);
app.post('/getUserStripeDetails', stripeValidator.getUserStripeDetails, stripeController.getUserStripeDetails);

