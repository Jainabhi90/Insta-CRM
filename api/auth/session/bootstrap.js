export default function handler(req, res) {
  res.status(200).json({
    message: "Bootstrap successful",
    status: "ok",
    user: null
  });
}
