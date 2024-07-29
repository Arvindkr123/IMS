import asyncHandler from "../../middlewares/asyncHandler.js";
import CourseFeesModel from "../../models/courseFees/courseFees.models.js";
import DayBookAccountModel from "../../models/day-book/DayBookAccounts.models.js";
import DayBookDataModel from "../../models/day-book/DayBookData.models.js";

export const addDayBookAccountController = asyncHandler(
  async (req, res, next) => {
    const { accountName, accountType, companyId } = req.body;
    try {
      switch (true) {
        case !accountName:
          return res.status(400).json({ error: "Account name is required" });
        case !accountType:
          return res.status(400).json({ error: "Account name is required" });
      }

      const existingAccountName = await DayBookAccountModel.find({
        accountName,
      });

      if (!existingAccountName) {
        return res
          .status(400)
          .json({ error: "DayBook Account already exists" });
      }

      const newDayBookAccount = new DayBookAccountModel({
        accountName,
        accountType,
        companyId,
      });
      await newDayBookAccount.save();
      res.status(201).json(newDayBookAccount);
    } catch (error) {
      res.status(500).json({
        error: "Error while creating account in daybook" || error.message,
      });
    }
  }
);

export const getDayBookAccountsListsController = asyncHandler(
  async (req, res, next) => {
    try {
      const daybookAccounts = await DayBookAccountModel.find({});
      res.status(200).json(daybookAccounts);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error while getting day book accounts lists" });
    }
  }
);
export const getSingleDayBookAccountController = asyncHandler(
  async (req, res, next) => {
    try {
      const daybookAccounts = await DayBookAccountModel.findById(
        req.params.id
      ).populate("companyId");
      res.status(200).json(daybookAccounts);
    } catch (error) {
      res.status(500).json({
        error: "Error while getting single day book accounts account",
      });
    }
  }
);

export const deleteDayBookAccountsListDataController = asyncHandler(
  async (req, res, next) => {
    try {
      const daybookAccount = await DayBookAccountModel.findById(req.params.id);
      if (!daybookAccount) {
        return res.status(404).json({ error: "Not found day book account" });
      }
      await daybookAccount.deleteOne();
      res.status(200).json({ message: "Day book account deleted" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error while getting day book accounts lists" });
    }
  }
);

export const updateDayBookAccountController = asyncHandler(
  async (req, res, next) => {
    const { accountName, accountType } = req.body;
    try {
      const dayBookAccount = await DayBookAccountModel.findById(req.params.id);
      dayBookAccount.accountName = accountName || dayBookAccount.accountName;
      dayBookAccount.accountType = accountType || dayBookAccount.accountType;
      await dayBookAccount.save();
      res
        .status(200)
        .json({ message: "Day Book Account updated successfully" });
    } catch (error) {
      res.status(500).json({
        error: "Error while updating the day book account" || error.message,
      });
    }
  }
);

//  Day Book Data Controller start here -------------------------------------------------

export const addDayBookDataController = asyncHandler(async (req, res, next) => {
  const {
    accountName,
    dayBookAccountId,
    dayBookDatadate,
    debit,
    credit,
    naretion,
    companyId,
  } = req.body;

  //console.log(req.body);
  try {
    const existingDataModel = await DayBookDataModel.find({ companyId }).sort({
      createdAt: -1,
    });
    if (existingDataModel.length === 0) {
      return res.status(400).json({
        error:
          "Day Book Account Balance is not sufficient for this transaction",
      });
    }
    const newDayBookData = new DayBookDataModel({
      ...req.body,
      balance:
        Number(credit) > 0
          ? existingDataModel[0].balance + Number(credit)
          : existingDataModel[0].balance - Number(debit),
    });
    await newDayBookData.save();
    res.status(201).json(newDayBookData);
  } catch (error) {
    res.status(500).json({
      error: "Error: while creating the day book data " || error.message,
    });
  }
});

export const getDayBookDataController = asyncHandler(async (req, res, next) => {
  try {
    const dayBookData = await DayBookDataModel.find({})
      .sort({ createdAt: -1 })
      .populate("studentInfo");
    res.status(200).json(dayBookData);
  } catch (error) {
    res.status(500).json({
      error: "Error: while getting the day book data " || error.message,
    });
  }
});
export const getSingleDayBookDataController = asyncHandler(
  async (req, res, next) => {
    try {
      const dayBookData = await DayBookDataModel.find({
        dayBookAccountId: req.params.id,
      }).sort({
        createdAt: 1,
      });
      res.status(200).json(dayBookData);
    } catch (error) {
      res.status(500).json({
        error: "Error: while getting the day book data " || error.message,
      });
    }
  }
);

export const deleteDayBookDataByIdController = asyncHandler(
  async (req, res, next) => {
    try {
      const singleDayBookData = await DayBookDataModel.findById(req.params.id);
      await singleDayBookData.deleteOne();
      const getAllDayBookDataByCompanyId = await DayBookDataModel.find({
        companyId: singleDayBookData.companyId,
      });

      for (let i = 0; i < getAllDayBookDataByCompanyId.length; i++) {
        if (i === 0) {
          getAllDayBookDataByCompanyId[i].balance =
            getAllDayBookDataByCompanyId[i].credit +
            getAllDayBookDataByCompanyId[i].studentLateFees;
        } else {
          if (getAllDayBookDataByCompanyId[i - 1]) {
            if (getAllDayBookDataByCompanyId[i].credit !== 0) {
              getAllDayBookDataByCompanyId[i].balance =
                getAllDayBookDataByCompanyId[i].credit +
                getAllDayBookDataByCompanyId[i].studentLateFees +
                getAllDayBookDataByCompanyId[i - 1].balance;
            } else {
              getAllDayBookDataByCompanyId[i].balance =
                getAllDayBookDataByCompanyId[i - 1].balance -
                getAllDayBookDataByCompanyId[i].debit;
            }
            getAllDayBookDataByCompanyId[i].balance;
          }
        }

        await getAllDayBookDataByCompanyId[i].save();
      }
      res.status(200).json({
        success: true,
        message: "Day Book Data deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Error: while deleting the day book data " || error.message,
      });
    }
  }
);
export const updateDayBookDataByIdController = asyncHandler(
  async (req, res, next) => {
    try {
      const dayBookData = await DayBookDataModel.find({
        companyId: req.body.companyId,
      });

      for (let i = 0; i < dayBookData.length; i++) {
        if (i === 0) {
          dayBookData[i].balance =
            dayBookData[i].credit + dayBookData[i].studentLateFees;
        } else {
          if (dayBookData[i - 1]) {
            if (dayBookData[i]._id.toString() === req.params.id.toString()) {
              dayBookData[i].dayBookDatadate =
                req.body.dayBookDatadate || dayBookData[i].dayBookDatadate;
              dayBookData[i].accountName =
                req.body.accountName || dayBookData[i].accountName;
              dayBookData[i].naretion =
                req.body.naretion || dayBookData[i].naretion;
              dayBookData[i].debit = req.body.debit || dayBookData[i].debit;
              dayBookData[i].credit = req.body.credit || dayBookData[i].credit;
              dayBookData[i].balance =
                req.body.credit !== 0
                  ? dayBookData[i - 1].balance + Number(req.body.credit)
                  : dayBookData[i - 1].balance - req.body.debit ||
                    dayBookData[i].balance;
              dayBookData[i].companyId =
                req.body.companyId || dayBookData[i].companyId;
              dayBookData[i].companyId =
                req.body.companyId || dayBookData[i].companyId;
              dayBookData[i].dayBookAccountId =
                req.body.dayBookAccountId || dayBookData[i].dayBookAccountId;
            } else {
              if (dayBookData[i].credit !== 0) {
                dayBookData[i].balance =
                  dayBookData[i - 1].balance +
                  dayBookData[i].credit +
                  dayBookData[i].studentLateFees;
              } else {
                dayBookData[i].balance =
                  dayBookData[i - 1].balance - dayBookData[i].debit;
              }
            }
          }
        }

        await dayBookData[i].save();
      }
      res.status(200).json({
        success: true,
        message: "Day Book Data updated successfully",
      });
      // console.log(dayBookData);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Error: while deleting the day book data " || error.message,
      });
    }
  }
);

//  Day Book Data Controller End here -------------------------------------------------
