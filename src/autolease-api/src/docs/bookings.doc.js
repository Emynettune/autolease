/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - serviceId
 *             properties:
 *               serviceId:
 *                 type: string
 *                 example: svc_123
 *               date:
 *                 type: string
 *                 example: 2026-01-01
 *               notes:
 *                 type: string
 *                 example: Please arrive early
 *     responses:
 *       201:
 *         description: Booking created
 */


/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: List my bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   status:
 *                     type: string
 *                     example: pending
 *                   date:
 *                     type: string
 */