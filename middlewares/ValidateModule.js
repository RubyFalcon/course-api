const moment = require('moment');

module.exports = (req, res, next) => {
    if(req.body == null) { return { result: false, msg: ['No data has been sent'] } }
    let Start_Date = moment(req.body.Start_Date, "DD MM YYYY");
    let End_Date = moment(req.body.End_Date, "DD MM YYYY");
    let responseObject = {
        result: true,
        msg: []
    };
    if(!req.body.Name) { responseObject.result = false; responseObject.msg.push('Module name invalid') }
    if(!req.body.Code) { responseObject.result = false; responseObject.msg.push('Module code invalid') }
    if(Start_Date instanceof String) { responseObject.result = false; responseObject.msg.push('Start date invalid') }
    if(End_Date instanceof String) { responseObject.result = false; responseObject.msg.push('End date invalid') }
    if(responseObject.result) {
        next();
    } else {
        return res.status(500).json(responseObject);
    }
}