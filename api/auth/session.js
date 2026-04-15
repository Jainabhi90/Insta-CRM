export default function handler(req, res) {
  // Return empty session
  if (req.method === 'GET') {
    return res.status(200).json({});
  }

  // Logout/others
  return res.status(200).json({ message: "Success" });
}
