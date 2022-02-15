import express from 'express';
import { auth } from 'express-openid-connect';

const app = express()
const port = 3000

const auth0Config = {
	authRequired: true,
	auth0Logout: true,
	secret: 'keyVault-value',
	baseURL: 'http://localhost:3000',
	clientID: 'keyVault-value',
	issuerBaseURL: 'https://dev-025d9prn.us.auth0.com'
}

const router = express.Router()
const routes = (rtr: any) => {
	rtr.get('/profile', (req: any, res: any, next: any) => {
		console.log('profile')
		res.send(JSON.stringify(req.oidc.user));
		next()
	})
}
routes(router)

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(auth0Config))
app.use('/', router)

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})
