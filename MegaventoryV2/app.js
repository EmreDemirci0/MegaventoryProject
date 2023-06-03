const MegaventoryAPI = require("./MegaventoryAPI");
const SupplierClient = require("./SupplierClient");
const Product = require("./Product");
const InventoryLocation = require("./InventoryLocation");
const ProductDeleter = require("./ProductDeleter");

const apiKey = "222e2a5e95b83ded@m140970";
const megaventoryAPI = new MegaventoryAPI(apiKey);
// Babis's Client Data
const clientBabisPayload = {
  APIKEY: apiKey,
  mvSupplierClient: {
    SupplierClientID: 6,
    SupplierClientType: "Client",
    SupplierClientName: "Babis",
    SupplierClientEmail: "babis@exampletest.com",
    SupplierClientShippingAddress1: "Example 8, Athens",
    SupplierClientPhone1: "1235698967",
  },
  mvRecordAction: "Insert",
};

// Odysseus's Supplier Data
const supplierOdysseusPayload = {
  APIKEY: apiKey,
  mvSupplierClient: {
    SupplierClientID: 7,
    SupplierClientType: "Supplier",
    SupplierClientName: "Odysseus",
    SupplierClientEmail: "odysseus@exampletest.com",
    SupplierClientShippingAddress1: "Example 10, Athens",
    SupplierClientPhone1: "1235698988",
  },
  mvRecordAction: "Insert",
};

// Nike Product Data
const productNikePayload = {
  APIKEY: apiKey,
  mvProduct: {
    ProductSKU: "1112256",
    ProductDescription: "Nike shoes",
    ProductSellingPrice: "99.99",
    ProductPurchasePrice: "44.99",
    mvProductMainSupplier: clientBabisPayload.mvSupplierClient,
  },
  mvRecordAction: "Insert",
};

// Adidas Product Data
const productAdidasPayload = {
  APIKEY: apiKey,
  mvProduct: {
    ProductSKU: "1112248",
    ProductDescription: "Adidas shoes",
    ProductSellingPrice: "99.99",
    ProductPurchasePrice: "44.99",
    mvProductMainSupplier: supplierOdysseusPayload.mvSupplierClient,
  },
  mvRecordAction: "Insert",
};

// Inventory Location Data
const inventoryLocationPayload = {
  APIKEY: apiKey,
  mvInventoryLocation: {
    InventoryLocationName: "Test Project Location",
    InventoryLocationAbbreviation: "Test",
    InventoryLocationAddress: "Example 20, Athens",
  },
  mvRecordAction: "Insert",
};

// Delete Product Data
const deleteProductPayload = {
  APIKEY: apiKey,
  ProductIDToDelete: 00,
};
async function run() {
  const clientBabis = new SupplierClient(apiKey, clientBabisPayload);
  await clientBabis.addOrUpdateClient();

  const supplierOdysseus = new SupplierClient(apiKey, supplierOdysseusPayload);
  await supplierOdysseus.addOrUpdateClient();

  const nikeProduct = new Product(apiKey, productNikePayload);
  await nikeProduct.addOrUpdateProduct();

  const adidasProduct = new Product(apiKey, productAdidasPayload);
  await adidasProduct.addOrUpdateProduct();

  const location = new InventoryLocation(apiKey, inventoryLocationPayload);
  await location.addOrUpdateLocation();

  const productDeleter = new ProductDeleter(apiKey, deleteProductPayload.ProductIDToDelete);
  await productDeleter.deleteProduct();
}

run().catch(console.error);
