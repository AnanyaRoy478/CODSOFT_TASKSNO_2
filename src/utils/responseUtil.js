const sendResponse = (
    res,
    statusCode = 200,
    flag = true,
    body = {}
) => {
    return res.status(statusCode).json({
        statusCode,
        flag,
        body
    });
};

module.exports = sendResponse;