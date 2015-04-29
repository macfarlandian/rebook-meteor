Uploads = new FS.Collection("uploads", {
  stores: [new FS.Store.GridFS("uploads")]
});