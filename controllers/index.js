const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes.js');
const dashboardRoutes = require('./dashboard-routes.js');

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);

// a call to an endpoint that doesn't exist returns a 404 error
router.use((req, res) => {
    res.status(404).end();
});


module.exports = router;