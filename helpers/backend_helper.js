import {del, get, post} from "./api_helper"

export const postLogin = data => post('/user/login', data)
export const postSignup = data => post('/registration', data)
export const fetchProfile = data => get('/user/verify', data)
export const getProfile = data => get('/user/profile', data)
export const postProfile = data => post('/user/profile', data)
export const fetchSettings = data => get('/settings', data)
export const fetchSiteSettings = data => get('/settings/site', data)
export const postSettings = data => post('/settings', data)
export const postSetupSite = data => post('/settings/setup', data)
export const fetchInvoiceSettings = data => get('/invoice-settings', data)
export const postInvoiceSettings = data => post('/invoice-settings', data)
export const postForget = data => post('/forget-password', data)
export const postPasswordUpdate = data => post('/reset-password', data)
export const postPassword = data => post('/user/password', data)

export const postRegister = data => post('/registration', data)
export const fetchDashboard = data => get('/user/dashboard', data)


export const fetchUsers = data => get('/user/list', data)
export const fetchUser = data => get('/user', data)
export const postUser = data => post('/user', data)
export const delUser = data => del('/user', data)


export const fetchPurchases = data => get('/purchase/list', data)
export const fetchPurchaseElements = data => get('/purchase/elements', data)
export const postPurchase = data => post('/purchase', data)
export const fetchCreditPurchases = data => get('/purchase/credits', data)
export const fetchCreditPurchaseElements = data => get('/purchase/credits/elements', data)
export const postCreditPurchase = data => post('/purchase/credit', data)
export const fetchPurchase = data => get('/purchase', data)
export const postPurchaseStatus = data => post('/purchase/status', data)


export const fetchPayments = data => get('/purchase-payment', data)
export const fetchPaymentElements = data => get('/purchase-payment-elements', data)
export const postPayment = data => post('/purchase-payment', data)
export const delPayment = data => del('/purchase-payment', data)

export const fetchCategories = data => get('/category/list', data)
export const fetchCategory = data => get('/category', data)
export const postCategory = data => post('/category', data)
export const delCategory = data => del('/category', data)

export const fetchShops = data => get('/shop/list', data)
export const fetchShopUsers = data => get('/shop/users', data)
export const fetchShop = data => get('/shop', data)
export const postShop = data => post('/shop', data)
export const delShop = data => del('/shop', data)

export const fetchShopProducts = data => get('/shop/products', data)
export const fetchShopElements = data => get('/shop/elements', data)
export const postShopProduct = data => post('/shop/product', data)
export const delShopProduct = data => del('/shop/product', data)

export const fetchShopFees = data => get('/shop/fees', data)
export const fetchShopFeeElements = data => get('/shop/fee/elements', data)
export const postShopFee = data => post('/shop/fee', data)
export const delShopFee = data => del('/shop/fee', data)

export const fetchProducts = data => get('/product/list', data)
export const fetchBarcodeProducts = data => get('/product/barcode', data)
export const fetchProduct = data => get('/product', data)
export const postProduct = data => post('/product', data)
export const delProduct = data => del('/product', data)

export const fetchProductStock = data => get('/product/stock', data)


export const postAccountCategory = data => post('/account-category', data)


export const fetchIncomeElements = data => get('/income-elements', data)


export const fetchCustomers = data => get('/customer/list', data)
export const fetchCustomerElements = data => get('/customer/elements', data)
export const fetchCustomer = data => get('/customer', data)
export const fetchCustomerHistory = data => get('/customer-account-history', data)
export const postCustomer = data => post('/customer', data)
export const delCustomer = data => del('/customer', data)

export const fetchDeposits = data => get('/customer/deposit/list', data)
export const fetchDeposit = data => get('/customer/deposit', data)
export const postDeposit = data => post('/customer/deposit', data)
export const delDeposit = data => del('/customer/deposit', data)

export const fetchSells = data => get('/sales', data)
export const fetchSell = data => get('/sale-details', data)
export const fetchSellElements = data => get('/sale-elements', data)
export const fetchSellStock = data => get('/sale-stock-product', data)
export const fetchSaleBarcodeProduct = data => get('/sale-barcode-product', data)
export const fetchSellInvoice = data => get('/sale-invoice', data)
export const postSell = data => post('/sale', data)
export const delSell = data => del('/sale', data)


export const fetchSellPayments = data => get('/sales-payment', data)
export const fetchSellPaymentElements = data => get('/sales-payment-elements', data)
export const postSellPayment = data => post('/sales-payment', data)
export const delSellPayment = data => del('/sales-payment', data)

export const fetchRoles = data => get('/role/list', data)
export const fetchRole = data => get('/role', data)
export const postRole = data => post('/role', data)
export const deleteRole = data => del('/role', data)
export const fetchPermissions = data => get('/role/permissions', data)
export const postPermissions = data => post('/role/permissions', data)


export const fetchCompanies = data => get('/company/list', data)
export const fetchCompanyElements = data => get('/company/elements', data)
export const fetchCompany = data => get('/company', data)
export const postCompany = data => post('/company', data)
export const delCompany = data => del('/company', data)

export const fetchCompanyProducts = data => get('/company/products', data)
export const fetchCompanyProduct = data => get('/company/product', data)
export const fetchCompanyProductElements = data => get('/company/product/elements', data)
export const postCompanyProduct = data => post('/company/product', data)
export const postCompanyProductMarket = data => post('/company/product/market', data)
export const delCompanyProduct = data => del('/company/product', data)

export const fetchCompanyFees = data => get('/company/fees', data)
export const fetchCompanyFeeElements = data => get('/company/fee/elements', data)
export const postCompanyFee = data => post('/company/fee', data)
export const delCompanyFee = data => del('/company/fee', data)

export const fetchProjects = data => get('/project/list', data)
export const fetchProjectElements = data => get('/project/elements', data)
export const fetchProject = data => get('/project', data)
export const postProject = data => post('/project', data)
export const delProject = data => del('/project', data)

export const fetchProjectProducts = data => get('/project/products', data)
export const fetchProjectProductElements = data => get('/project/product/elements', data)
export const postProjectProduct = data => post('/project/product', data)
export const delProjectProduct = data => del('/project/product', data)

export const fetchProjectShops = data => get('/project/shops', data)
export const fetchProjectShopElements = data => get('/project/shop/elements', data)
export const postProjectShop = data => post('/project/shop', data)
export const delProjectShop = data => del('/project/shop', data)

export const fetchProjectRounds = data => get('/project/rounds', data)
export const fetchProjectRoundsOverview = data => get('/project/rounds/overview', data)
export const fetchProjectRound = data => get('/project/round', data)
export const fetchProjectRoundElements = data => get('/project/round/elements', data)
export const postProjectRound = data => post('/project/round', data)
export const postProjectRoundStatus = data => post('/project/round/status', data)
export const delProjectRound = data => del('/project/round', data)

export const fetchProjectRoundReport1 = data => get('/project/rounds/report1', data)
export const fetchProjectRoundReport2 = data => get('/project/rounds/report2', data)

export const fetchProjectRedemptionReport1 = data => get('/project/rounds/redemption1', data)
export const fetchProjectRedemptionReport2 = data => get('/project/rounds/redemption2', data)

export const fetchBeneficiaries = data => get('/beneficiary/list', data)
export const fetchBeneficiary = data => get('/beneficiary', data)
export const fetchBeneficiarySummery = data => get('/beneficiary/summery', data)
export const postBeneficiaries = data => post('/beneficiary', data)
export const postBeneficiariesCheck = data => post('/beneficiary/check', data)
export const postBeneficiariesBalance = data => post('/beneficiary/balance', data)
export const postBeneficiariesBalanceFormat = data => post('/beneficiary/balance/format', data)

export const fetchBeneficiaryCards = data => get('/beneficiary/cards', data)

export const fetchBeneficiaryProjects = data => get('/beneficiary/projects', data)
export const postBeneficiaryProjectCard = data => post('/beneficiary/project/card', data)
export const postBeneficiaryUpdate = data => post('/beneficiary/update', data)

export const fetchCards = data => get('/card/list', data)
export const fetchCardsExport = data => get('/card/export', data)
export const fetchCardElements = data => get('/card/elements', data)
export const fetchCardRounds = data => get('/card/rounds', data)
export const postCard = data => post('/card', data)
export const postCardStatus = data => post('/card/status', data)
export const getCardNFC = data => get('/card/nfc', data)
export const postCardNFC = data => post('/card/nfc', data)
export const delCard = data => del('/card', data)
export const postCardSendOtp = data => post('/card/send-otp', data)
export const postCardVerifyOtp = data => post('/card/verify-otp', data)
export const postCardVerifyDirect = data => post('/card/verify-direct', data)
export const postCardPasswordDirect = data => post('/card/password-direct', data)
export const postCardSendPassword = data => post('/card/send-password', data)
export const postCheckBalance = data => post('/card/check-balance', data)

export const getCardDistribution1 = data => get('/card/distribution1', data)
export const getCardDistribution2 = data => get('/card/distribution2', data)

export const fetchPosElements = data => get('/pos/elements', data)
export const fetchPosProducts = data => get('/pos/products', data)
export const postVerifyCard = data => post('/pos/verify-card', data)
export const postPosOrder = data => post('/pos/order', data)

export const fetchPosTransactions = data => get('/pos/transactions', data)
export const fetchPosTransaction = data => get('/pos/transaction', data)
export const fetchTransactionElements = data => get('/pos/transactions/elements', data)
export const fetchTransactionRounds = data => get('/pos/transactions/rounds', data)

export const fetchBeneficiaryLedger = data => get('/beneficiary/ledger', data)
export const fetchBeneficiaryLedgerElements = data => get('/beneficiary/ledger/elements', data)

export const fetchLabelElements = data => get('/print-labels-elements', data)
export const fetchLabelProducts = data => get('/print-labels-products', data)

export const fetchMarketElements = data => get('/market/elements', data)
export const fetchMarketProducts = data => get('/market/products', data)
export const postMarketPurchase = data => post('/market/purchase', data)

export const fetchUnreadNotifications = data => get('/notification/unread', data)
export const fetchNotifications = data => get('/notification/all', data)
export const postNotificationRead = data => post('/notification/read', data)

export const fetchSaleReport = data => get('/report/sale', data)
export const fetchSaleReportShops = data => get('/report/sale/shops', data)

export const fetchPurchaseReport = data => get('/report/purchase', data)
export const fetchPurchaseReportShops = data => get('/report/purchase/shops', data)

export const fetchTransactionReport = data => get('/report/transactions', data)
export const fetchTransactionReportElements = data => get('/report/transactions/elements', data)
export const fetchTransactionReportRounds = data => get('/report/transactions/rounds', data)