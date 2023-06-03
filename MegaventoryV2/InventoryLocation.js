class InventoryLocation {
    constructor(apiKey, payload) {
      this.apiKey = apiKey;
      this.payload = payload;
    }
  
    async addOrUpdateLocation() {
      const url = `${this.baseURL}/InventoryLocation/InventoryLocationUpdate`;
      const successMessage = `New location inserted/updated:`;
      const errorMessage = `Error inserting/updating location:`;
      await this.executeRequest(url, this.payload, successMessage, errorMessage);
    }
  }
  
  module.exports = InventoryLocation;
  