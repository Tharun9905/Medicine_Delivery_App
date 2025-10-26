const BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

async function request(path, options = {}) {
	// Default headers for JSON
	const headers = options.headers || {};
	if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
		headers['Content-Type'] = 'application/json';
	}
	const res = await fetch(`${BASE}${path}`, { ...options, headers, credentials: 'include' });
	if (!res.ok) {
		// Try parse json error, fallback to status/text
		let payload;
		try { payload = await res.json(); } catch (e) { payload = { message: res.statusText || 'Request failed' }; }
		const err = new Error(payload.message || 'Request failed');
		err.status = res.status;
		err.payload = payload;
		throw err;
	}
	// Some endpoints may return no body
	const text = await res.text();
	if (!text) return null;
	try { return JSON.parse(text); } catch { return text; }
}

// Public endpoints (no auth required)
export async function getCategories() {
	return request('/api/medicines/categories');
}

export async function getPopular(limit = 10) {
	return request(`/api/medicines/popular?limit=${encodeURIComponent(limit)}`);
}

export async function getFeatured(limit = 10) {
	return request(`/api/medicines/featured?limit=${encodeURIComponent(limit)}`);
}

// List with optional query params: { search, category, limit, page }
export async function getMedicines(params = {}) {
	const qs = new URLSearchParams();
	Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null) qs.append(k, v); });
	return request(`/api/medicines?${qs.toString()}`);
}

export async function getMedicine(id) {
	if (!id) throw new Error('Medicine id required');
	return request(`/api/medicines/${encodeURIComponent(id)}`);
}
