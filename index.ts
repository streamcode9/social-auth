import express from 'express';
import { auth, requiresAuth } from 'express-openid-connect';

const app = express()
const port = 3000

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'keyVault-value',
  baseURL: 'http://localhost:3000',
  clientID: 'keyVault-value',
  issuerBaseURL: 'https://dev-025d9prn.us.auth0.com'
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
