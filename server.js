const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const leads = [];

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
  });
  res.end(JSON.stringify(payload));
}

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';

    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });

    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error('Invalid JSON body'));
      }
    });

    req.on('error', reject);
  });
}

function validateLead(lead) {
  const requiredFields = ['name', 'email', 'phone', 'utility', 'state', 'monthlyBill'];
  const missing = requiredFields.filter((field) => !lead[field]);

  if (missing.length > 0) {
    return `Missing required fields: ${missing.join(', ')}`;
  }

  const emailValid = /^\S+@\S+\.\S+$/.test(lead.email);
  if (!emailValid) {
    return 'Email format is invalid';
  }

  return null;
}

function awsRecommendation() {
  return {
    architecture: 'Amazon API Gateway + AWS Lambda + Amazon DynamoDB + Amazon SES',
    rationale: [
      'Serverless ingestion for lead forms at any traffic level.',
      'DynamoDB provides low-latency storage for utility customer opportunities.',
      'SES supports transactional outbound follow-up messages.',
      'CloudWatch and AWS WAF complete observability and security hardening.',
    ],
  };
}

function serveStaticFile(reqPath, res) {
  const normalizedPath = reqPath === '/' ? '/index.html' : reqPath;
  const filePath = path.normalize(path.join(PUBLIC_DIR, normalizedPath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  fs.readFile(filePath, (error, fileContents) => {
    if (error) {
      if (error.code === 'ENOENT') {
        sendJson(res, 404, { error: 'Not found' });
        return;
      }

      sendJson(res, 500, { error: 'Internal server error' });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = contentTypes[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fileContents);
  });
}

function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET' && url.pathname === '/api/aws-solution') {
      sendJson(res, 200, awsRecommendation());
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/leads') {
      try {
        const lead = await parseRequestBody(req);
        const validationError = validateLead(lead);

        if (validationError) {
          sendJson(res, 400, { error: validationError });
          return;
        }

        const leadRecord = {
          id: leads.length + 1,
          createdAt: new Date().toISOString(),
          ...lead,
        };

        leads.push(leadRecord);

        sendJson(res, 201, {
          message: 'Lead submitted successfully',
          leadId: leadRecord.id,
          recommendedAwsSolution: awsRecommendation(),
        });
      } catch (error) {
        sendJson(res, 400, { error: error.message });
      }
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/leads') {
      sendJson(res, 200, { count: leads.length, data: leads });
      return;
    }

    if (req.method === 'GET') {
      serveStaticFile(url.pathname, res);
      return;
    }

    sendJson(res, 405, { error: 'Method not allowed' });
  });
}

if (require.main === module) {
  const server = createServer();
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = {
  createServer,
  awsRecommendation,
};
