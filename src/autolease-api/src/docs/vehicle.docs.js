/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []   # remove this if it's a public endpoint
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of vehicles per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           example: truck
 *         description: Filter by vehicle type
 *     responses:
 *       200:
 *         description: List of vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                   example: 50
 *                 page:
 *                   type: number
 *                   example: 1
 *                 limit:
 *                   type: number
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: veh_123
 *                       name:
 *                         type: string
 *                         example: Toyota Hilux
 *                       type:
 *                         type: string
 *                         example: truck
 *                       plateNumber:
 *                         type: string
 *                         example: ABC-123XY
 *                       capacity:
 *                         type: number
 *                         example: 1000
 *                       status:
 *                         type: string
 *                         example: available
 *       401:
 *         description: Unauthorized
 */