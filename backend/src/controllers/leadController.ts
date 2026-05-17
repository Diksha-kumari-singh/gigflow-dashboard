import { Request, Response } from "express";
import Lead from "../models/Lead";

interface AuthRequest extends Request {
  user?: any;
}

export const createLead = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const { name, email, status, source } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: req.user._id
    });

    res.status(201).json(lead);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};
export const getLeads = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      status,
      source,
      search,
      sort,
      page = "1"
    } = req.query;

    const query: any = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by source
    if (source) {
      query.source = source;
    }

    // Search by name/email
    if (search) {

      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i"
          }
        },

        {
          email: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    // Pagination
    const limit = 10;

    const skip =
      (Number(page) - 1) * limit;

    // Sorting
    let sortOption = {};

    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else {
      sortOption = { createdAt: -1 };
    }

    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await Lead.countDocuments(query);

    res.status(200).json({
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      leads
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};
export const getSingleLead = async (
  req: Request,
  res: Response
) => {

  try {

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      });
    }

    res.status(200).json(lead);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};
export const updateLead = async (
  req: Request,
  res: Response
) => {

  try {

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      }
    );

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      });
    }

    res.status(200).json(lead);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};
export const deleteLead = async (
  req: Request,
  res: Response
) => {

  try {

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      });
    }

    await lead.deleteOne();

    res.status(200).json({
      message: "Lead deleted"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
};