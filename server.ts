import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from 'resend';

let resendClient: Resend | null = null;

function getResend() {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.warn("RESEND_API_KEY is not set. Email functionality will be disabled.");
      return null;
    }
    resendClient = new Resend(key);
  }
  return resendClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser
  app.use(express.json());

  // API Route: Send Registration Email
  app.post("/api/send-email", async (req, res) => {
    const { to, subject, html } = req.body;
    console.log(`[Email] Attempting to send to: ${to} with subject: ${subject}`);
    
    const resend = getResend();
    const key = process.env.RESEND_API_KEY;
    
    if (!resend || !key) {
      console.error("[Email] Server error: RESEND_API_KEY is not configured.");
      return res.status(503).json({ error: "Email service not configured. Please add RESEND_API_KEY to your environment." });
    }

    if (key.startsWith('AIzaSy')) {
      console.error("[Email] Critical Config Error: You are using a Google API key for the Resend service. Resend keys must start with 're_'.");
      return res.status(400).json({ error: "Invalid API key format. Resend keys should start with 're_'. Your current key looks like a Google API key." });
    }

    try {
      const { data, error } = await resend.emails.send({
        from: 'CampusHub <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: html,
      });

      if (error) {
        console.error("[Email] Resend error:", error);
        return res.status(400).json({ error: error.message });
      }

      console.log("[Email] Success:", data);
      res.json({ success: true, data });
    } catch (error) {
      console.error("[Email] Internal exception:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // API Route: Scrape Discovery (Mock/Simulation)
  app.post("/api/scrape", async (req, res) => {
    // In a real app, this would use puppeteer or axios to fetch data
    // Here we simulate discovery for the demo
    res.json({
      message: "Scraping job started (Simulated)",
      discovered: [
        { title: "Tech Symposium 2025", organizer: "ACM Chapter" },
        { title: "Winter Gala", organizer: "Student Council" }
      ]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // In Express v4, use app.get('*', ...)
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
