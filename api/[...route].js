export default function handler(req, res) {
  // We use 501 Not Implemented or 200 with an empty body 
  // so the frontend apiClient doesn't crash from Vercel's 404 HTML
  res.status(501).json({
    error: "Not Implemented",
    message: `The endpoint ${req.query.route ? req.query.route.join('/') : ''} is not mapped yet to a real backend.`,
    isVercelMock: true
  });
}
