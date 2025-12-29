import bcrypt from "bcrypt";

const generate = async () => {
  const hash = await bcrypt.hash("123", 10);
  console.log("Hash:", hash);
};

generate();
