async function search(req, res) {
  try {
    const q = req.query.q || "";
    // TODO: call Spotify API here
    res.json({
      query: q,
      results: [
        { title: "Mock Song", artist: "Mock Artist", mood: "chill", api_id: "123" }
      ]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
}

module.exports = { search };
