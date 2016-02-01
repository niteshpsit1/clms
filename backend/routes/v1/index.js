'use strict';

var express = require('express');
var router = express.Router();

var phoneHooks = require('./../../hooks/phoneHooks');

/*New routes*/
var UserRoute = require('./../../routes/v1/UserRoute');
var EntityRoute = require('./../../routes/v1/EntityRoute');
var EntityRoleRoute = require('./../../routes/v1/EntityRoleRoute');
var EntityDocumentRoute = require('./../../routes/v1/EntityDocumentRoute');
var LoanRoute = require('./../../routes/v1/LoanRoute');
var LoanTypeRoute = require('./../../routes/v1/LoanTypeRoute');
var LoanDocumentRoute = require('./../../routes/v1/LoanDocumentRoute');
var CollateralRoute = require('./../../routes/v1/CollateralRoute');
var CollateralDocumentRoute = require('./../../routes/v1/CollateralDocumentRoute');
var DocumentRoute = require('./../../routes/v1/DocumentRoute');
var DocumentTypeRoute = require('./../../routes/v1/DocumentTypeRoute');
var DownloadRoute = require('./../../routes/v1/DownloadRoute');
var LedgerRoute = require('./../../routes/v1/LedgerRoute');
var MessageRoute = require('./../../routes/v1/MessageRoute');
var VoipRoute = require('./../../routes/v1/VoipRoute');
var listoRoute = require('./../../routes/v1/ListoRoute');
var KontoxRoute = require('./../../routes/v1/KontoxRoute');

router.use('/user', UserRoute);
router.use('/entity', EntityRoute);
router.use('/entity-role', EntityRoleRoute);
router.use('/entity-document', EntityDocumentRoute);
router.use('/loan', LoanRoute);
router.use('/loan-type', LoanTypeRoute);
router.use('/loan-document', LoanDocumentRoute);
router.use('/collateral', CollateralRoute);
router.use('/collateral-document', CollateralDocumentRoute);
router.use('/document', DocumentRoute);
router.use('/document-type', DocumentTypeRoute);
router.use('/download', DownloadRoute);
router.use('/ledger', LedgerRoute);
router.use('/message', MessageRoute);
router.use('/mail', MessageRoute);
router.use('/voip', VoipRoute);
router.use('/kontox', KontoxRoute);

router.use('/hooks/phoneHooks', phoneHooks);
router.use('/hooks', listoRoute);
router.use('/listo', listoRoute);

module.exports = router;