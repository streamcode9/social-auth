import express from 'express'
import { ExpressOIDC } from '@okta/oidc-middleware'
import session from 'express-session'

const app = express()
const port = 3000

const oidc = new ExpressOIDC({
	scope: 'openid profile',
	appBaseUrl: 'http://localhost:3000',
	routes: {
		loginCallback: { path: '/callback' }
	},
	issuer: 'https://dev-025d9prn.us.auth0.com',
	client_id: '1',
	client_secret: '2'
})

const router = express.Router()
const routes = (rtr: any) => {
	rtr.use(session({
		secret: 'this-should-be-very-random',
		resave: true,
		saveUninitialized: false
	}));

	// auth router attaches /login, /logout, and /callback routes to the baseURL
	rtr.use(oidc.router)

	rtr.get('/', (req: any, res: any, next: any) => {
		res.send('home')
		next()
	})

	rtr.get('/profile', oidc.ensureAuthenticated(), (req: any, res: any, next: any) => {
		res.send(JSON.stringify(req.userContext));
		next()
	})

	rtr.get('/local-logout', (req: any, res: any, next: any) => {
		req.logout()
		res.redirect('/')
	})
}
routes(router)

app.use('/', router)

oidc.on('ready', () => {
	console.log('oidc ready')
	app.listen(port, () => {
		console.log(`app listening on port ${port}`)
	})
});

oidc.on('error', (err: any) => {
	console.log('oidc err', err)
});
