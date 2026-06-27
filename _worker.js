export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if ((url.pathname === '/api/fileanalyse' || url.pathname === '/api/upload') && request.method === 'POST') {
      try {
        const form = await request.formData();
        const file = form.get('upfile');
        if (!file || typeof file !== 'object' || typeof file.size !== 'number') {
          return Response.json({ error: 'No file provided' }, { status: 400 });
        }
        return Response.json({ name: file.name || 'unnamed', type: file.type || 'application/octet-stream', size: file.size });
      } catch (error) {
        return Response.json({ error: 'Failed to process uploaded file' }, { status: 500 });
      }
    }
    return env.ASSETS.fetch(request);
  }
};
