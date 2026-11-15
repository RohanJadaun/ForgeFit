const createRateLimit = ({ windowMs, max, message }) => {
  const attempts = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || "unknown";
    let record = attempts.get(key);
    if (!record || record.resetAt <= now) {
      record = { count: 0, resetAt: now + windowMs };
      attempts.set(key, record);
    }
    record.count += 1;
    if (record.count > max) {
      res.set("Retry-After", String(Math.ceil((record.resetAt - now) / 1000)));
      return res.status(429).json({ success: false, message });
    }
    if (attempts.size > 10000) {
      for (const [address, entry] of attempts) if (entry.resetAt <= now) attempts.delete(address);
    }
    next();
  };
};

module.exports = createRateLimit;
