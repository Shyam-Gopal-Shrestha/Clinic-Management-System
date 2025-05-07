export const buildSuccessResponse = (res, data, message = "Success") => {
  try {
    return res.status(200).json({
      success: true,
      data,
      message,
    });
  } catch (error) {
    console.error("Error building success response:", error);
    return buildErrorResponse(res, "Internal server error", 500);
  }
};

export const buildErrorResponse = (res, message = "Error", status = 400) => {
  try {
    return res.status(status).json({
      success: false,
      message,
    });
  } catch (error) {
    console.error("Error building error response:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
