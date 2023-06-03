class SupplierClient {
    constructor(apiKey, payload) {
      this.apiKey = apiKey;
      this.payload = payload;
    }
  
    async addOrUpdateClient() {
      const url = `${this.baseURL}/SupplierClient/SupplierClientUpdate`;
      const successMessage = `New client inserted/updated:`;
      const errorMessage = `Error inserting/updating client:`;
      await this.executeRequest(url, this.payload, successMessage, errorMessage);
    }
  }
  
  module.exports = SupplierClient;
  