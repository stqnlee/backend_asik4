const router = require('express').Router();
const controller = require('../controllers/noteController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);

router.post('/', auth, isAdmin, controller.create);
router.put('/:id', auth, isAdmin, controller.update);
router.patch('/:id/toggle', auth, isAdmin, controller.toggleDone);
router.delete('/:id', auth, isAdmin, controller.remove);

module.exports = router;