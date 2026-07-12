/**
 /**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 */
 

 /**
 * @swagger
 * /users/sessions:
 *   get:
 *     summary: List active device sessions
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   device:
 *                     type: string
 *                     example: Chrome on Windows
 *                   ip:
 *                     type: string
 *                     example: 192.168.1.1
 *                   lastActive:
 *                     type: string
 *                     example: 2026-01-01T12:00:00Z
 */