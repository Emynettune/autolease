/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: payment session will be initiallized 
 *     tags: [payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               amount:
 *                 type: number
 *                 example: 1000
 *               reference:
 *                 type: string
 *                 example: "ref_123456789"
 *     responses:
 *       200:
 *         description: payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Payment initialized successfully"
 * /
 * app.post('/payments/webhook', (req, res) => {
 *   // Handle the webhook event here
 * });
 
 
 * /**
 * @swagger
 * /admin/audit-logs:
 *   get:
 *     summary: List audit logs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Audit logs retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   action:
 *                     type: string
 *                     example: USER_LOGIN
 *                   user:
 *                     type: string
 *                     example: user@example.com
 *                   timestamp:
 *                     type: string
 *                     example: 2026-01-01T12:00:00Z
 */