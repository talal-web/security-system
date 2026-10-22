// http/validators/common.js
//
// Shared request-shape primitives reused across domain validators.

import { z } from "zod";

const OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

export const objectIdString = (message = "must be a valid ID") =>
  z.string().regex(OBJECT_ID_PATTERN, message);

// Accepts "" as well, matching how multipart/form-data sends an unselected
// dropdown - services already treat "" the same as "not provided".
export const optionalObjectId = (message) =>
  z.union([objectIdString(message), z.literal("")]).optional();
