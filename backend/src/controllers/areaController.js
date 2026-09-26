import Area from "../models/Area.js";
import Employee from "../models/Employee.js";

/**
 * Create Area
 */
export const createArea = async (req, res) => {
  try {
    const { name, description } = req.body;

    const trimmedName = name?.trim();
    const trimmedDescription = description?.trim() || "";

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        message: "Area name is required",
      });
    }

    const existing = await Area.findOne({
      name: { $regex: `^${trimmedName}$`, $options: "i" },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Area already exists",
      });
    }

    const lastArea = await Area.findOne()
      .sort({ sortOrder: -1 })
      .select("sortOrder")
      .lean();

    const sortOrder = lastArea ? lastArea.sortOrder + 1 : 1;

    const area = await Area.create({
      name: trimmedName,
      description: trimmedDescription,
      sortOrder,
    });

    return res.status(201).json({
      success: true,
      message: "Area created successfully",
      data: area,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get All Areas
 */
export const getAreas = async (req, res) => {
  try {
    const { search, isActive } = req.query;

    const query = {};

    if (search?.trim()) {
      query.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const areas = await Area.find(query).sort({ sortOrder: 1, name: 1 }).lean();

    return res.status(200).json({
      success: true,
      count: areas.length,
      data: areas,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get Single Area
 */
export const getAreaById = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id).lean();

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Area not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: area,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Update Area
 */
export const updateArea = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    const updateData = {};

    if (name !== undefined) {
      const trimmedName = name?.trim();

      if (!trimmedName) {
        return res.status(400).json({
          success: false,
          message: "Area name cannot be empty",
        });
      }

      updateData.name = trimmedName;
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || "";
    }

    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    const currentArea = await Area.findById(req.params.id);

    if (!currentArea) {
      return res.status(404).json({
        success: false,
        message: "Area not found",
      });
    }

    if (updateData.name !== undefined) {
      const existing = await Area.findOne({
        _id: { $ne: req.params.id },
        name: {
          $regex: `^${updateData.name}$`,
          $options: "i",
        },
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Area name already exists",
        });
      }
    }

    const area = await Area.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Area updated successfully",
      data: area,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delete Area
 */
export const deleteArea = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);

    if (!area) {
      return res.status(404).json({
        success: false,
        message: "Area not found",
      });
    }

    const employeeExists = await Employee.exists({
      area: req.params.id,
    });

    if (employeeExists) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete area because it contains employees.",
      });
    }

    await area.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Area deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Reorder Areas
 */
export const reorderAreas = async (req, res) => {
  try {
    const { areas } = req.body;

    if (!Array.isArray(areas) || areas.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Areas array is required.",
      });
    }

    const ids = areas.map(({ _id }) => _id);

    if (new Set(ids.map(String)).size !== ids.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate area IDs are not allowed.",
      });
    }

    const existingAreas = await Area.find({
      _id: { $in: ids },
    }).select("_id");

    if (existingAreas.length !== areas.length) {
      return res.status(400).json({
        success: false,
        message: "One or more areas do not exist.",
      });
    }

    const validSortOrders = areas.every(
      ({ sortOrder }) => Number.isInteger(sortOrder) && sortOrder >= 0,
    );

    if (!validSortOrders) {
      return res.status(400).json({
        success: false,
        message: "Each sortOrder must be a non-negative integer.",
      });
    }

    const bulkOperations = areas.map(({ _id, sortOrder }) => ({
      updateOne: {
        filter: { _id },
        update: {
          $set: { sortOrder },
        },
      },
    }));

    await Area.bulkWrite(bulkOperations);

    return res.status(200).json({
      success: true,
      message: "Areas reordered successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
