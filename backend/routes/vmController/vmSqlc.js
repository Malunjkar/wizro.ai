const insertVendorQuery = `
  INSERT INTO vendors
  (vendor_code, company_name, business_type, industry, registration_number, gst_number, pan_number, website)
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
  RETURNING *;
`;

const getAllVendorsQuery = `
  SELECT *
  FROM vendors
  ORDER BY created_at DESC;
`;

const updateVendorQuery = `
  UPDATE vendors
  SET
    company_name = $1,
    business_type = $2,
    industry = $3,
    registration_number = $4,
    gst_number = $5,
    pan_number = $6,
    website = $7,
    updated_at = CURRENT_TIMESTAMP
  WHERE vendor_id = $8
  RETURNING *;
`;


const deleteVendorQuery = `
  DELETE FROM vendors
  WHERE vendor_id = $1
  RETURNING *;
`;

export default {
  insertVendorQuery,
  getAllVendorsQuery,
  updateVendorQuery,
  deleteVendorQuery,
};
