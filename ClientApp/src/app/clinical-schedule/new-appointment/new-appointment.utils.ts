import * as moment from 'moment';

export const getWeek = (date) => {
    const startOfWeek = moment(date).startOf('week').format('YYYY-MM-DD');
    const endOfWeek = moment(date).endOf('week').format('YYYY-MM-DD');
    return {
        startOfWeek,
        endOfWeek
    };
};
