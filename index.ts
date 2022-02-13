import express from 'express';
import { auth, requiresAuth } from 'express-openid-connect';

const app = express()
const port = 3000

const router = express.Router()

const config = {
	authRequired: false,
	auth0Logout: true,
	secret: 'keyVault-value',
	baseURL: 'http://localhost:3000',
	clientID: 'keyVault-value',
	issuerBaseURL: 'https://dev-025d9prn.us.auth0.com'
}

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config))

// invoked for any requests passed to this router
router.use((req, res, next) => {
	if (!req.oidc.isAuthenticated() && !['/login', '/logout', '/callback'].includes(req.path)) {
		res.status(401).end()
	}
	next()
})

router.get('/profile', (req, res, next) => {
	res.send(JSON.stringify(req.oidc.user));
	next()
})

app.use('/', router)

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
