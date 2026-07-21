import Counter from "../models/Counter.js";

const generateEmpId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "employee" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  return `BSS-${String(counter.seq).padStart(4, "0")}`;
};

export default generateEmpId;
