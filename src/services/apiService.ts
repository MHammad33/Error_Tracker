class ApiService {
	constructor() {}

	async fetchIssues() {
		const response = await fetch("/api/issues");
		if (!response.ok) {
			throw new Error("Failed to fetch issues");
		}
		return response.json();
	}
}

const apiService = new ApiService();

export default apiService;
